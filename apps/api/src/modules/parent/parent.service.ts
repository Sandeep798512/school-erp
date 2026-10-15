import { prisma } from '../../common/prisma/prisma.service.js';
import { TimetableService } from '../timetable/timetable.service.js';
import { HomeworkService } from '../homework/homework.service.js';

export class ParentService {
  // Helper: Verify parent-student linkage
  private static async assertParentLink(parentUserId: string, studentId: string) {
    const guardian = await prisma.guardian.findUnique({
      where: { userId: parentUserId }
    });

    if (!guardian) {
      throw new Error(`Parent profile not found for user.`);
    }

    const link = await prisma.studentGuardian.findUnique({
      where: {
        studentId_guardianId: {
          studentId,
          guardianId: guardian.id
        }
      }
    });

    if (!link) {
      throw new Error(`Access denied: Student is not linked to your parent account.`);
    }

    return guardian;
  }

  // 1. Get all linked children for parent
  static async getChildren(parentUserId: string, schoolId: string) {
    const guardian = await prisma.guardian.findUnique({
      where: { userId: parentUserId }
    });

    if (!guardian) {
      return [];
    }

    const links = await prisma.studentGuardian.findMany({
      where: {
        guardianId: guardian.id,
        student: { schoolId }
      },
      include: {
        student: {
          include: {
            user: true,
            enrollments: {
              include: { class: true, section: true, academicYear: true },
              orderBy: { createdAt: 'desc' }
            }
          }
        }
      }
    });

    return links.map((l) => ({
      relationship: l.isPrimary ? 'PRIMARY' : 'SECONDARY',
      student: l.student
    }));
  }

  // 2. Child Profile
  static async getChildProfile(parentUserId: string, studentId: string, _schoolId: string) {
    await ParentService.assertParentLink(parentUserId, studentId);

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        user: true,
        enrollments: {
          include: { class: true, section: true, academicYear: true }
        },
        studentGuardians: {
          include: { guardian: true }
        }
      }
    });

    if (!student) {
      throw new Error(`Student not found.`);
    }

    return student;
  }

  // 3. Child Attendance Summary & Records
  static async getChildAttendance(parentUserId: string, studentId: string, schoolId: string) {
    await ParentService.assertParentLink(parentUserId, studentId);

    const records = await prisma.attendanceRecord.findMany({
      where: { schoolId, studentId },
      include: {
        session: {
          include: { section: { include: { class: true } }, subject: true }
        }
      },
      orderBy: { date: 'desc' }
    });

    const totalSessions = records.length;
    const presentCount = records.filter((r) => r.status === 'PRESENT').length;
    const absentCount = records.filter((r) => r.status === 'ABSENT').length;
    const lateCount = records.filter((r) => r.status === 'LATE').length;
    const halfDayCount = records.filter((r) => r.status === 'HALF_DAY').length;

    const percentage = totalSessions > 0 ? ((presentCount + lateCount * 0.5) / totalSessions) * 100 : 0;

    return {
      summary: {
        totalSessions,
        presentCount,
        absentCount,
        lateCount,
        halfDayCount,
        attendancePercentage: Math.round(percentage * 100) / 100
      },
      records
    };
  }

  // 4. Child Fee Invoices & Payment History
  static async getChildFees(parentUserId: string, studentId: string, schoolId: string) {
    await ParentService.assertParentLink(parentUserId, studentId);

    const invoices = await prisma.invoice.findMany({
      where: { schoolId, studentId },
      include: {
        invoiceItems: true,
        payments: true
      },
      orderBy: { dueDate: 'desc' }
    });

    let totalBilled = 0;
    let totalPaid = 0;
    let totalDue = 0;

    for (const inv of invoices) {
      totalBilled += Number(inv.totalAmount);
      totalPaid += Number(inv.paidAmount);
      totalDue += Number(inv.balanceAmount);
    }

    return {
      summary: {
        totalBilled,
        totalPaid,
        totalDue
      },
      invoices
    };
  }

  // 5. Child Examination Results & Report Cards
  static async getChildExams(parentUserId: string, studentId: string, schoolId: string) {
    await ParentService.assertParentLink(parentUserId, studentId);

    const reportCards = await prisma.reportCard.findMany({
      where: { schoolId, studentId },
      include: {
        class: true,
        academicYear: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const marks = await prisma.studentMark.findMany({
      where: { schoolId, studentId },
      include: {
        examSchedule: {
          include: {
            exam: true,
            subject: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return {
      reportCards,
      marks
    };
  }

  // 6. Child Weekly Timetable
  static async getChildTimetable(parentUserId: string, studentId: string, schoolId: string) {
    await ParentService.assertParentLink(parentUserId, studentId);

    const latestEnrollment = await prisma.studentEnrollment.findFirst({
      where: { schoolId, studentId },
      orderBy: { createdAt: 'desc' }
    });

    if (!latestEnrollment) {
      throw new Error(`Student is not currently enrolled in any class.`);
    }

    return TimetableService.getWeeklyClassTimetable(
      schoolId,
      latestEnrollment.classId,
      latestEnrollment.sectionId
    );
  }

  // 7. Child Homework Feed
  static async getChildHomework(parentUserId: string, studentId: string, schoolId: string) {
    await ParentService.assertParentLink(parentUserId, studentId);

    const latestEnrollment = await prisma.studentEnrollment.findFirst({
      where: { schoolId, studentId },
      orderBy: { createdAt: 'desc' }
    });

    if (!latestEnrollment) {
      throw new Error(`Student is not currently enrolled in any class.`);
    }

    return HomeworkService.getStudentHomeworks(
      schoolId,
      studentId,
      latestEnrollment.classId,
      latestEnrollment.sectionId
    );
  }
}
