import { prisma } from '../../common/prisma/prisma.service.js';
import {
  MarkBulkAttendanceDto,
  CreateLeaveApplicationDto,
  ReviewLeaveApplicationDto
} from '@school-erp/shared';

export class AttendanceService {
  // High-performance atomic bulk attendance marking
  public static async markBulkAttendance(dto: MarkBulkAttendanceDto, takenByUserId: string) {
    const attendanceDate = new Date(dto.date);

    return prisma.$transaction(async (tx) => {
      // 1. Create or find existing Attendance Session
      const session = await tx.attendanceSession.upsert({
        where: {
          schoolId_sectionId_subjectId_date: {
            schoolId: dto.schoolId,
            sectionId: dto.sectionId,
            subjectId: dto.subjectId || '',
            date: attendanceDate
          }
        },
        update: {
          takenByUserId
        },
        create: {
          organizationId: dto.organizationId,
          schoolId: dto.schoolId,
          academicYearId: dto.academicYearId,
          classId: dto.classId,
          sectionId: dto.sectionId,
          subjectId: dto.subjectId,
          date: attendanceDate,
          takenByUserId,
          type: dto.type
        }
      });

      // 2. Batch update/insert attendance records
      const recordPromises = dto.records.map((rec) =>
        tx.attendanceRecord.upsert({
          where: {
            sessionId_studentId: {
              sessionId: session.id,
              studentId: rec.studentId
            }
          },
          update: {
            status: rec.status,
            remarks: rec.remarks
          },
          create: {
            organizationId: dto.organizationId,
            schoolId: dto.schoolId,
            sessionId: session.id,
            studentId: rec.studentId,
            date: attendanceDate,
            status: rec.status,
            remarks: rec.remarks
          }
        })
      );

      await Promise.all(recordPromises);

      return {
        sessionId: session.id,
        date: attendanceDate,
        totalMarked: dto.records.length
      };
    });
  }

  public static async getAttendanceSession(params: {
    schoolId: string;
    sectionId: string;
    date: string;
    subjectId?: string;
  }) {
    const targetDate = new Date(params.date);

    return prisma.attendanceSession.findFirst({
      where: {
        schoolId: params.schoolId,
        sectionId: params.sectionId,
        date: targetDate,
        ...(params.subjectId ? { subjectId: params.subjectId } : {})
      },
      include: {
        takenByUser: { select: { firstName: true, lastName: true } },
        attendanceRecords: {
          include: {
            student: {
              include: {
                user: { select: { firstName: true, lastName: true } }
              }
            }
          }
        }
      }
    });
  }

  public static async getStudentAttendanceSummary(studentId: string, schoolId: string) {
    const records = await prisma.attendanceRecord.findMany({
      where: { studentId, schoolId }
    });

    const totalDays = records.length;
    const present = records.filter((r) => r.status === 'PRESENT').length;
    const absent = records.filter((r) => r.status === 'ABSENT').length;
    const late = records.filter((r) => r.status === 'LATE').length;
    const halfDay = records.filter((r) => r.status === 'HALF_DAY').length;

    const percentage = totalDays > 0 ? ((present + late + halfDay * 0.5) / totalDays) * 100 : 100;

    return {
      studentId,
      totalDays,
      breakdown: {
        present,
        absent,
        late,
        halfDay
      },
      attendancePercentage: Math.round(percentage * 100) / 100
    };
  }

  // --- Leave Management ---
  public static async createLeaveApplication(dto: CreateLeaveApplicationDto, applicantUserId: string) {
    return prisma.leaveApplication.create({
      data: {
        organizationId: dto.organizationId,
        schoolId: dto.schoolId,
        applicantUserId,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        reason: dto.reason,
        status: 'PENDING'
      }
    });
  }

  public static async getLeaveApplications(schoolId: string, status?: string) {
    return prisma.leaveApplication.findMany({
      where: {
        schoolId,
        ...(status ? { status: status as any } : {})
      },
      include: {
        applicant: { select: { firstName: true, lastName: true, email: true } },
        reviewer: { select: { firstName: true, lastName: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  public static async reviewLeaveApplication(id: string, reviewerUserId: string, dto: ReviewLeaveApplicationDto) {
    return prisma.leaveApplication.update({
      where: { id },
      data: {
        status: dto.status,
        reviewedByUserId: reviewerUserId,
        reviewedAt: new Date()
      }
    });
  }
}
