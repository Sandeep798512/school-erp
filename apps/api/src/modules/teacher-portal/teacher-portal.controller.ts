import { Request, Response } from 'express';
import { TeacherPortalService } from './teacher-portal.service.js';
import {
  CreateHomeworkSchema,
  EvaluateSubmissionSchema,
  MarkBulkAttendanceSchema,
  EnterBulkMarksSchema
} from '@school-erp/shared';

export class TeacherPortalController {
  static getMe = async (req: Request, res: Response): Promise<void> => {
    try {
      const teacherUserId = req.user?.userId;
      if (!teacherUserId) {
        res.status(401).json({ success: false, error: 'Unauthorized teacher context' });
        return;
      }

      const teacher = await TeacherPortalService.getMe(teacherUserId);
      res.json({
        success: true,
        data: teacher
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to fetch teacher profile'
      });
    }
  };

  static getAssignedClasses = async (req: Request, res: Response): Promise<void> => {
    try {
      const teacherUserId = req.user?.userId;
      if (!teacherUserId) {
        res.status(401).json({ success: false, error: 'Unauthorized teacher context' });
        return;
      }

      const classSubjects = await TeacherPortalService.getAssignedClasses(teacherUserId);
      res.json({
        success: true,
        data: classSubjects
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to fetch assigned classes'
      });
    }
  };

  static getSchedule = async (req: Request, res: Response): Promise<void> => {
    try {
      const teacherUserId = req.user?.userId;
      if (!teacherUserId) {
        res.status(401).json({ success: false, error: 'Unauthorized teacher context' });
        return;
      }

      const schedule = await TeacherPortalService.getSchedule(teacherUserId);
      res.json({
        success: true,
        data: schedule
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to fetch teacher schedule'
      });
    }
  };

  static getStudentsInClass = async (req: Request, res: Response): Promise<void> => {
    try {
      const teacherUserId = req.user?.userId;
      const classId = req.query.classId as string;
      const sectionId = req.query.sectionId as string | undefined;

      if (!teacherUserId) {
        res.status(401).json({ success: false, error: 'Unauthorized teacher context' });
        return;
      }

      if (!classId) {
        res.status(400).json({ success: false, error: 'Class ID is required' });
        return;
      }

      const students = await TeacherPortalService.getStudentsInClass(teacherUserId, classId, sectionId);
      res.json({
        success: true,
        data: students
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to fetch students in class'
      });
    }
  };

  static markAttendance = async (req: Request, res: Response): Promise<void> => {
    try {
      const teacherUserId = req.user?.userId;
      if (!teacherUserId) {
        res.status(401).json({ success: false, error: 'Unauthorized teacher context' });
        return;
      }

      const parsed = MarkBulkAttendanceSchema.parse(req.body);
      const result = await TeacherPortalService.markAttendance(teacherUserId, parsed);

      res.status(201).json({
        success: true,
        message: 'Attendance submitted successfully',
        data: result
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to submit attendance'
      });
    }
  };

  static assignHomework = async (req: Request, res: Response): Promise<void> => {
    try {
      const teacherUserId = req.user?.userId;
      if (!teacherUserId) {
        res.status(401).json({ success: false, error: 'Unauthorized teacher context' });
        return;
      }

      const parsed = CreateHomeworkSchema.parse(req.body);
      const homework = await TeacherPortalService.assignHomework(teacherUserId, parsed);

      res.status(201).json({
        success: true,
        message: 'Homework assigned successfully',
        data: homework
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to assign homework'
      });
    }
  };

  static evaluateHomework = async (req: Request, res: Response): Promise<void> => {
    try {
      const teacherUserId = req.user?.userId;
      if (!teacherUserId) {
        res.status(401).json({ success: false, error: 'Unauthorized teacher context' });
        return;
      }

      const parsed = EvaluateSubmissionSchema.parse(req.body);
      const result = await TeacherPortalService.evaluateHomework(teacherUserId, parsed);

      res.json({
        success: true,
        message: 'Submission evaluated successfully',
        data: result
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to evaluate submission'
      });
    }
  };

  static enterMarks = async (req: Request, res: Response): Promise<void> => {
    try {
      const teacherUserId = req.user?.userId;
      if (!teacherUserId) {
        res.status(401).json({ success: false, error: 'Unauthorized teacher context' });
        return;
      }

      const parsed = EnterBulkMarksSchema.parse(req.body);
      const result = await TeacherPortalService.enterMarks(teacherUserId, parsed);

      res.status(201).json({
        success: true,
        message: 'Exam marks submitted successfully',
        data: result
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to submit exam marks'
      });
    }
  };
}
