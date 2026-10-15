import { prisma } from '../../common/prisma/prisma.service.js';
import { TimetableService } from '../timetable/timetable.service.js';
import { HomeworkService } from '../homework/homework.service.js';

export class StudentPortalService {
  // Helper: Find student by authenticated User ID
  private static async getStudentProfile(studentUserId: string) {
    const student = await prisma.student.findUnique({
      where: { userId: studentUserId },
      include: {
        user: true,
        enrollments: {
          include: { class: true, section: true, academicYear: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!student) {
      throw new Error(`Student profile not found for authenticated user.`);
    }

    return student;
  }

  // 1. Get Authenticated Student Profile & Active Enrollment
  static async getMe(studentUserId: string) {
    const student = await StudentPortalService.getStudentProfile(studentUserId);
    const activeEnrollment = student.enrollments.length > 0 ? student.enrollments[0] : null;

    return {
      student,
      activeEnrollment
    };
  }

  // 2. Own Attendance Summary & Records
  static async getAttendance(studentUserId: string) {
    const student = await StudentPortalService.getStudentProfile(studentUserId);

    const records = await prisma.attendanceRecord.findMany({
      where: { schoolId: student.schoolId, studentId: student.id },
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

  // 3. Own Weekly Timetable Grid
  static async getTimetable(studentUserId: string) {
    const student = await StudentPortalService.getStudentProfile(studentUserId);
    if (student.enrollments.length === 0) {
      throw new Error(`Student is not currently enrolled in any class section.`);
    }

    const enrollment = student.enrollments[0];
    return TimetableService.getWeeklyClassTimetable(
      student.schoolId,
      enrollment.classId,
      enrollment.sectionId
    );
  }

  // 4. Own Homework Feed
  static async getHomework(studentUserId: string) {
    const student = await StudentPortalService.getStudentProfile(studentUserId);
    if (student.enrollments.length === 0) {
      throw new Error(`Student is not currently enrolled in any class section.`);
    }

    const enrollment = student.enrollments[0];
    return HomeworkService.getStudentHomeworks(
      student.schoolId,
      student.id,
      enrollment.classId,
      enrollment.sectionId
    );
  }

  // 5. Submit Homework Assignment
  static async submitHomework(studentUserId: string, homeworkId: string, content?: string, attachmentUrl?: string) {
    const student = await StudentPortalService.getStudentProfile(studentUserId);

    return HomeworkService.submitHomework({
      organizationId: student.organizationId,
      schoolId: student.schoolId,
      homeworkId,
      studentId: student.id,
      content,
      attachmentUrl
    });
  }

  // 6. Own Exam Results & Report Cards
  static async getExams(studentUserId: string) {
    const student = await StudentPortalService.getStudentProfile(studentUserId);

    const reportCards = await prisma.reportCard.findMany({
      where: { schoolId: student.schoolId, studentId: student.id },
      include: {
        class: true,
        academicYear: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const marks = await prisma.studentMark.findMany({
      where: { schoolId: student.schoolId, studentId: student.id },
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

  // 7. Own Fee Invoices & Payment History
  static async getFees(studentUserId: string) {
    const student = await StudentPortalService.getStudentProfile(studentUserId);

    const invoices = await prisma.invoice.findMany({
      where: { schoolId: student.schoolId, studentId: student.id },
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
}
