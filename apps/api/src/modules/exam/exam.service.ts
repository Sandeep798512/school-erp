import { prisma } from '../../common/prisma/prisma.service.js';
import { Prisma } from '@prisma/client';
import {
  CreateGradingScaleDto,
  CreateExamDto,
  CreateExamScheduleDto,
  EnterBulkMarksDto
} from '@school-erp/shared';

export class ExamService {
  // --- Grading Scales ---
  public static async createGradingScale(dto: CreateGradingScaleDto) {
    return prisma.gradingScale.create({
      data: {
        schoolId: dto.schoolId,
        name: dto.name,
        minMark: new Prisma.Decimal(dto.minMark),
        maxMark: new Prisma.Decimal(dto.maxMark),
        gradePoint: new Prisma.Decimal(dto.gradePoint),
        gradeName: dto.gradeName,
        remarks: dto.remarks
      }
    });
  }

  public static async getGradingScales(schoolId: string) {
    return prisma.gradingScale.findMany({
      where: { schoolId },
      orderBy: { minMark: 'desc' }
    });
  }

  // --- Exams ---
  public static async createExam(dto: CreateExamDto) {
    return prisma.exam.create({
      data: {
        organizationId: dto.organizationId,
        schoolId: dto.schoolId,
        academicYearId: dto.academicYearId,
        name: dto.name,
        code: dto.code,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        isPublished: false
      }
    });
  }

  public static async getExams(schoolId: string, academicYearId?: string) {
    return prisma.exam.findMany({
      where: {
        schoolId,
        ...(academicYearId ? { academicYearId } : {})
      },
      include: {
        examSchedules: {
          include: {
            class: { select: { name: true, code: true } },
            subject: { select: { name: true, code: true } }
          }
        }
      },
      orderBy: { startDate: 'desc' }
    });
  }

  // --- Exam Schedules ---
  public static async createExamSchedule(dto: CreateExamScheduleDto) {
    return prisma.examSchedule.create({
      data: {
        examId: dto.examId,
        classId: dto.classId,
        sectionId: dto.sectionId,
        subjectId: dto.subjectId,
        date: new Date(dto.date),
        startTime: dto.startTime,
        endTime: dto.endTime,
        maxMarks: new Prisma.Decimal(dto.maxMarks),
        passMarks: new Prisma.Decimal(dto.passMarks)
      }
    });
  }

  public static async getExamSchedules(examId: string, classId?: string) {
    return prisma.examSchedule.findMany({
      where: {
        examId,
        ...(classId ? { classId } : {})
      },
      include: {
        class: true,
        section: true,
        subject: true
      },
      orderBy: { date: 'asc' }
    });
  }

  // --- Bulk Marks Entry & Auto-Grading ---
  public static async enterBulkMarks(dto: EnterBulkMarksDto, enteredByUserId: string) {
    const schedule = await prisma.examSchedule.findUnique({
      where: { id: dto.examScheduleId }
    });

    if (!schedule) throw new Error('EXAM_SCHEDULE_NOT_FOUND');

    const gradingScales = await prisma.gradingScale.findMany({
      where: { schoolId: dto.schoolId },
      orderBy: { minMark: 'desc' }
    });

    return prisma.$transaction(async (tx) => {
      const records = dto.marks.map((m) => {
        const marksObtainedDecimal = new Prisma.Decimal(m.marksObtained);
        let calculatedGrade = 'F';

        if (!m.isAbsent) {
          const matchedScale = gradingScales.find(
            (s) => marksObtainedDecimal.gte(s.minMark) && marksObtainedDecimal.lte(s.maxMark)
          );
          if (matchedScale) calculatedGrade = matchedScale.gradeName;
        }

        return tx.studentMark.upsert({
          where: {
            examScheduleId_studentId: {
              examScheduleId: dto.examScheduleId,
              studentId: m.studentId
            }
          },
          update: {
            marksObtained: marksObtainedDecimal,
            grade: calculatedGrade,
            isAbsent: m.isAbsent,
            remarks: m.remarks,
            enteredByUserId
          },
          create: {
            organizationId: dto.organizationId,
            schoolId: dto.schoolId,
            examScheduleId: dto.examScheduleId,
            studentId: m.studentId,
            marksObtained: marksObtainedDecimal,
            grade: calculatedGrade,
            isAbsent: m.isAbsent,
            remarks: m.remarks,
            enteredByUserId
          }
        });
      });

      await Promise.all(records);

      return {
        examScheduleId: dto.examScheduleId,
        totalMarksEntered: dto.marks.length
      };
    });
  }

  // --- Publish Results & Compile Report Cards ---
  public static async publishExamResults(examId: string) {
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: {
        examSchedules: {
          include: {
            studentMarks: true
          }
        }
      }
    });

    if (!exam) throw new Error('EXAM_NOT_FOUND');

    return prisma.$transaction(async (tx) => {
      // 1. Mark exam published
      await tx.exam.update({
        where: { id: examId },
        data: { isPublished: true }
      });

      // 2. Aggregate student marks by student ID
      const studentTotals: Record<string, { totalMarks: Prisma.Decimal; obtainedMarks: Prisma.Decimal; classId: string }> = {};

      for (const schedule of exam.examSchedules) {
        for (const mark of schedule.studentMarks) {
          if (!studentTotals[mark.studentId]) {
            studentTotals[mark.studentId] = {
              totalMarks: new Prisma.Decimal(0),
              obtainedMarks: new Prisma.Decimal(0),
              classId: schedule.classId
            };
          }

          studentTotals[mark.studentId].totalMarks = studentTotals[mark.studentId].totalMarks.add(schedule.maxMarks);
          if (!mark.isAbsent) {
            studentTotals[mark.studentId].obtainedMarks = studentTotals[mark.studentId].obtainedMarks.add(mark.marksObtained);
          }
        }
      }

      // 3. Upsert compiled Report Card records
      for (const [studentId, summary] of Object.entries(studentTotals)) {
        const percentage = summary.totalMarks.gt(0)
          ? summary.obtainedMarks.div(summary.totalMarks).mul(100)
          : new Prisma.Decimal(0);

        await tx.reportCard.upsert({
          where: {
            academicYearId_studentId: {
              academicYearId: exam.academicYearId,
              studentId
            }
          },
          update: {
            totalMarks: summary.totalMarks,
            obtainedMarks: summary.obtainedMarks,
            percentage,
            grade: percentage.gte(90) ? 'A1' : percentage.gte(80) ? 'A2' : percentage.gte(70) ? 'B1' : 'B2'
          },
          create: {
            organizationId: exam.organizationId,
            schoolId: exam.schoolId,
            academicYearId: exam.academicYearId,
            studentId,
            classId: summary.classId,
            totalMarks: summary.totalMarks,
            obtainedMarks: summary.obtainedMarks,
            percentage,
            grade: percentage.gte(90) ? 'A1' : percentage.gte(80) ? 'A2' : percentage.gte(70) ? 'B1' : 'B2'
          }
        });
      }

      return {
        examId,
        isPublished: true,
        reportCardsCompiled: Object.keys(studentTotals).length
      };
    });
  }

  public static async getStudentReportCard(studentId: string, academicYearId?: string) {
    return prisma.reportCard.findMany({
      where: {
        studentId,
        ...(academicYearId ? { academicYearId } : {})
      },
      include: {
        academicYear: true,
        class: true,
        student: {
          include: {
            user: { select: { firstName: true, lastName: true } },
            studentMarks: {
              include: {
                examSchedule: {
                  include: { subject: true, exam: true }
                }
              }
            }
          }
        }
      }
    });
  }
}
