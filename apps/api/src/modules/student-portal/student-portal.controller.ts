import { Request, Response } from 'express';
import { StudentPortalService } from './student-portal.service.js';

export class StudentPortalController {
  static getMe = async (req: Request, res: Response): Promise<void> => {
    try {
      const studentUserId = req.user?.userId;
      if (!studentUserId) {
        res.status(401).json({ success: false, error: 'Unauthorized student context' });
        return;
      }

      const data = await StudentPortalService.getMe(studentUserId);
      res.json({
        success: true,
        data
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to fetch student profile'
      });
    }
  };

  static getAttendance = async (req: Request, res: Response): Promise<void> => {
    try {
      const studentUserId = req.user?.userId;
      if (!studentUserId) {
        res.status(401).json({ success: false, error: 'Unauthorized student context' });
        return;
      }

      const attendance = await StudentPortalService.getAttendance(studentUserId);
      res.json({
        success: true,
        data: attendance
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to fetch student attendance'
      });
    }
  };

  static getTimetable = async (req: Request, res: Response): Promise<void> => {
    try {
      const studentUserId = req.user?.userId;
      if (!studentUserId) {
        res.status(401).json({ success: false, error: 'Unauthorized student context' });
        return;
      }

      const timetable = await StudentPortalService.getTimetable(studentUserId);
      res.json({
        success: true,
        data: timetable
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to fetch student timetable'
      });
    }
  };

  static getHomework = async (req: Request, res: Response): Promise<void> => {
    try {
      const studentUserId = req.user?.userId;
      if (!studentUserId) {
        res.status(401).json({ success: false, error: 'Unauthorized student context' });
        return;
      }

      const homework = await StudentPortalService.getHomework(studentUserId);
      res.json({
        success: true,
        data: homework
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to fetch student homework feed'
      });
    }
  };

  static submitHomework = async (req: Request, res: Response): Promise<void> => {
    try {
      const studentUserId = req.user?.userId;
      const { homeworkId, content, attachmentUrl } = req.body;

      if (!studentUserId) {
        res.status(401).json({ success: false, error: 'Unauthorized student context' });
        return;
      }

      if (!homeworkId) {
        res.status(400).json({ success: false, error: 'Homework ID is required' });
        return;
      }

      const submission = await StudentPortalService.submitHomework(
        studentUserId,
        homeworkId,
        content,
        attachmentUrl
      );

      res.status(201).json({
        success: true,
        message: 'Homework submitted successfully',
        data: submission
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to submit homework'
      });
    }
  };

  static getExams = async (req: Request, res: Response): Promise<void> => {
    try {
      const studentUserId = req.user?.userId;
      if (!studentUserId) {
        res.status(401).json({ success: false, error: 'Unauthorized student context' });
        return;
      }

      const exams = await StudentPortalService.getExams(studentUserId);
      res.json({
        success: true,
        data: exams
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to fetch exam results'
      });
    }
  };

  static getFees = async (req: Request, res: Response): Promise<void> => {
    try {
      const studentUserId = req.user?.userId;
      if (!studentUserId) {
        res.status(401).json({ success: false, error: 'Unauthorized student context' });
        return;
      }

      const fees = await StudentPortalService.getFees(studentUserId);
      res.json({
        success: true,
        data: fees
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to fetch fee records'
      });
    }
  };
}
