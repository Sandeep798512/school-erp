import { prisma } from '../../common/prisma/prisma.service.js';
import { TimetableService } from '../timetable/timetable.service.js';
import { HomeworkService } from '../homework/homework.service.js';
import { AttendanceService } from '../attendance/attendance.service.js';
import { ExamService } from '../exam/exam.service.js';
import {
  CreateHomeworkDto,
  EvaluateSubmissionDto,
  MarkBulkAttendanceDto,
  EnterBulkMarksDto
} from '@school-erp/shared';

export class TeacherPortalService {
  // Helper: Find teacher profile by authenticated User ID
  private static async getTeacherProfile(teacherUserId: string) {
    const teacher = await prisma.teacher.findUnique({
      where: { userId: teacherUserId },
      include: {
        user: true,
        classSubjects: {
          include: {
            class: true,
            subject: true
          }
        }
      }
    });

    if (!teacher) {
      throw new Error(`Teacher profile not found for authenticated user.`);
    }

    return teacher;
  }

  // 1. Get Authenticated Teacher Profile & Assigned Subjects
  static async getMe(teacherUserId: string) {
    const teacher = await TeacherPortalService.getTeacherProfile(teacherUserId);
    return teacher;
  }

  // 2. Get Assigned Classes & Sections
  static async getAssignedClasses(teacherUserId: string) {
    const teacher = await TeacherPortalService.getTeacherProfile(teacherUserId);

    const classSubjects = await prisma.classSubject.findMany({
      where: { teacherId: teacher.id },
      include: {
        class: {
          include: {
            sections: true
          }
        },
        subject: true
      }
    });

    return classSubjects;
  }

  // 3. Teacher Weekly Schedule Grid
  static async getSchedule(teacherUserId: string) {
    const teacher = await TeacherPortalService.getTeacherProfile(teacherUserId);
    return TimetableService.getTeacherSchedule(teacher.schoolId, teacher.id);
  }

  // 4. Students Directory in Assigned Classes
  static async getStudentsInClass(teacherUserId: string, classId: string, sectionId?: string) {
    const teacher = await TeacherPortalService.getTeacherProfile(teacherUserId);

    const where: any = {
      schoolId: teacher.schoolId,
      classId
    };
    if (sectionId) where.sectionId = sectionId;

    const enrollments = await prisma.studentEnrollment.findMany({
      where,
      include: {
        student: {
          include: {
            user: true
          }
        },
        class: true,
        section: true
      },
      orderBy: { student: { rollNumber: 'asc' } }
    });

    return enrollments.map((e) => ({
      enrollmentId: e.id,
      student: e.student,
      class: e.class,
      section: e.section
    }));
  }

  // 5. Mark Attendance for Assigned Class Section
  static async markAttendance(teacherUserId: string, dto: MarkBulkAttendanceDto) {
    await TeacherPortalService.getTeacherProfile(teacherUserId);
    return AttendanceService.markBulkAttendance(dto, teacherUserId);
  }

  // 6. Assign Homework
  static async assignHomework(teacherUserId: string, dto: CreateHomeworkDto) {
    const teacher = await TeacherPortalService.getTeacherProfile(teacherUserId);
    const payload = {
      ...dto,
      teacherId: teacher.id
    };
    return HomeworkService.createHomework(payload);
  }

  // 7. Evaluate Student Submission
  static async evaluateHomework(teacherUserId: string, dto: EvaluateSubmissionDto) {
    await TeacherPortalService.getTeacherProfile(teacherUserId);
    return HomeworkService.evaluateSubmission(dto);
  }

  // 8. Grid Marks Entry
  static async enterMarks(teacherUserId: string, dto: EnterBulkMarksDto) {
    await TeacherPortalService.getTeacherProfile(teacherUserId);
    return ExamService.enterBulkMarks(dto, teacherUserId);
  }
}
