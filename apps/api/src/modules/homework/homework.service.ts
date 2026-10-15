import { prisma } from '../../common/prisma/prisma.service.js';
import { Prisma, SubmissionStatus } from '@prisma/client';
import {
  CreateHomeworkDto,
  SubmitHomeworkDto,
  EvaluateSubmissionDto
} from '@school-erp/shared';

export class HomeworkService {
  // 1. Assign Homework
  static async createHomework(dto: CreateHomeworkDto) {
    return prisma.homework.create({
      data: {
        organizationId: dto.organizationId,
        schoolId: dto.schoolId,
        classId: dto.classId,
        sectionId: dto.sectionId,
        subjectId: dto.subjectId,
        teacherId: dto.teacherId,
        title: dto.title,
        description: dto.description,
        assignedDate: dto.assignedDate ? new Date(dto.assignedDate) : new Date(),
        dueDate: new Date(dto.dueDate),
        maxMarks: dto.maxMarks ? new Prisma.Decimal(dto.maxMarks) : null,
        attachmentUrl: dto.attachmentUrl ?? null
      },
      include: {
        class: true,
        section: true,
        subject: true,
        teacher: { include: { user: true } }
      }
    });
  }

  // 2. Query Homework Directory
  static async getHomeworks(
    schoolId: string,
    classId?: string,
    sectionId?: string,
    subjectId?: string,
    teacherId?: string
  ) {
    const where: any = { schoolId };
    if (classId) where.classId = classId;
    if (sectionId) where.sectionId = sectionId;
    if (subjectId) where.subjectId = subjectId;
    if (teacherId) where.teacherId = teacherId;

    return prisma.homework.findMany({
      where,
      include: {
        class: true,
        section: true,
        subject: true,
        teacher: { include: { user: true } },
        _count: { select: { submissions: true } }
      },
      orderBy: { dueDate: 'desc' }
    });
  }

  // 3. Homework Details
  static async getHomeworkById(homeworkId: string) {
    const homework = await prisma.homework.findUnique({
      where: { id: homeworkId },
      include: {
        class: true,
        section: true,
        subject: true,
        teacher: { include: { user: true } },
        submissions: {
          include: {
            student: { include: { user: true } }
          }
        }
      }
    });

    if (!homework) {
      throw new Error(`Homework assignment not found.`);
    }

    return homework;
  }

  // 4. Student Submission
  static async submitHomework(dto: SubmitHomeworkDto) {
    const homework = await prisma.homework.findUnique({
      where: { id: dto.homeworkId }
    });

    if (!homework) {
      throw new Error(`Homework assignment not found.`);
    }

    const isLate = new Date() > new Date(homework.dueDate);
    const status: SubmissionStatus = isLate ? 'LATE' : 'SUBMITTED';

    return prisma.homeworkSubmission.upsert({
      where: {
        homeworkId_studentId: {
          homeworkId: dto.homeworkId,
          studentId: dto.studentId
        }
      },
      create: {
        organizationId: dto.organizationId,
        schoolId: dto.schoolId,
        homeworkId: dto.homeworkId,
        studentId: dto.studentId,
        submissionDate: new Date(),
        content: dto.content ?? null,
        attachmentUrl: dto.attachmentUrl ?? null,
        status
      },
      update: {
        submissionDate: new Date(),
        content: dto.content ?? null,
        attachmentUrl: dto.attachmentUrl ?? null,
        status
      },
      include: {
        homework: { include: { subject: true } },
        student: { include: { user: true } }
      }
    });
  }

  // 5. Teacher Evaluation
  static async evaluateSubmission(dto: EvaluateSubmissionDto) {
    const submission = await prisma.homeworkSubmission.findUnique({
      where: { id: dto.submissionId }
    });

    if (!submission) {
      throw new Error(`Homework submission not found.`);
    }

    return prisma.homeworkSubmission.update({
      where: { id: dto.submissionId },
      data: {
        marksObtained: dto.marksObtained !== undefined ? new Prisma.Decimal(dto.marksObtained) : undefined,
        remarks: dto.remarks ?? undefined,
        status: (dto.status as SubmissionStatus) || 'EVALUATED',
        evaluatedAt: new Date()
      },
      include: {
        homework: true,
        student: { include: { user: true } }
      }
    });
  }

  // 6. Student Homework Assignment Feed
  static async getStudentHomeworks(schoolId: string, studentId: string, classId: string, sectionId: string) {
    const assignments = await prisma.homework.findMany({
      where: { schoolId, classId, sectionId },
      include: {
        subject: true,
        teacher: { include: { user: true } },
        submissions: {
          where: { studentId }
        }
      },
      orderBy: { dueDate: 'desc' }
    });

    return assignments.map((hw) => {
      const submission = hw.submissions.length > 0 ? hw.submissions[0] : null;
      return {
        homework: {
          id: hw.id,
          title: hw.title,
          description: hw.description,
          assignedDate: hw.assignedDate,
          dueDate: hw.dueDate,
          maxMarks: hw.maxMarks,
          attachmentUrl: hw.attachmentUrl,
          subject: hw.subject,
          teacher: hw.teacher
        },
        submissionState: submission
          ? {
              submissionId: submission.id,
              status: submission.status,
              submissionDate: submission.submissionDate,
              content: submission.content,
              attachmentUrl: submission.attachmentUrl,
              marksObtained: submission.marksObtained,
              remarks: submission.remarks
            }
          : {
              submissionId: null,
              status: new Date() > new Date(hw.dueDate) ? 'LATE' : 'PENDING',
              submissionDate: null,
              content: null,
              attachmentUrl: null,
              marksObtained: null,
              remarks: null
            }
      };
    });
  }

  // 7. Submissions for Assignment
  static async getHomeworkSubmissions(homeworkId: string) {
    return prisma.homeworkSubmission.findMany({
      where: { homeworkId },
      include: {
        student: { include: { user: true } }
      },
      orderBy: { submissionDate: 'asc' }
    });
  }
}
