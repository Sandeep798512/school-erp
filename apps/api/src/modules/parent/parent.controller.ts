import { Request, Response } from 'express';
import { ParentService } from './parent.service.js';

export class ParentController {
  static getChildren = async (req: Request, res: Response): Promise<void> => {
    try {
      const parentUserId = req.user?.userId;
      const schoolId = (req.query.schoolId as string) || (req.headers['x-school-id'] as string) || req.user?.schoolId;

      if (!parentUserId) {
        res.status(401).json({ success: false, error: 'Unauthorized parent context' });
        return;
      }

      if (!schoolId) {
        res.status(400).json({ success: false, error: 'School ID is required' });
        return;
      }

      const children = await ParentService.getChildren(parentUserId, schoolId);
      res.json({
        success: true,
        data: children
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch linked children'
      });
    }
  };

  static getChildProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const parentUserId = req.user?.userId;
      const { studentId } = req.params;
      const schoolId = (req.query.schoolId as string) || (req.headers['x-school-id'] as string) || req.user?.schoolId;

      if (!parentUserId || !schoolId) {
        res.status(400).json({ success: false, error: 'Parent context and School ID are required' });
        return;
      }

      const profile = await ParentService.getChildProfile(parentUserId, studentId, schoolId);
      res.json({
        success: true,
        data: profile
      });
    } catch (error: any) {
      res.status(403).json({
        success: false,
        error: error.message || 'Failed to fetch child profile'
      });
    }
  };

  static getChildAttendance = async (req: Request, res: Response): Promise<void> => {
    try {
      const parentUserId = req.user?.userId;
      const { studentId } = req.params;
      const schoolId = (req.query.schoolId as string) || (req.headers['x-school-id'] as string) || req.user?.schoolId;

      if (!parentUserId || !schoolId) {
        res.status(400).json({ success: false, error: 'Parent context and School ID are required' });
        return;
      }

      const attendance = await ParentService.getChildAttendance(parentUserId, studentId, schoolId);
      res.json({
        success: true,
        data: attendance
      });
    } catch (error: any) {
      res.status(403).json({
        success: false,
        error: error.message || 'Failed to fetch child attendance'
      });
    }
  };

  static getChildFees = async (req: Request, res: Response): Promise<void> => {
    try {
      const parentUserId = req.user?.userId;
      const { studentId } = req.params;
      const schoolId = (req.query.schoolId as string) || (req.headers['x-school-id'] as string) || req.user?.schoolId;

      if (!parentUserId || !schoolId) {
        res.status(400).json({ success: false, error: 'Parent context and School ID are required' });
        return;
      }

      const fees = await ParentService.getChildFees(parentUserId, studentId, schoolId);
      res.json({
        success: true,
        data: fees
      });
    } catch (error: any) {
      res.status(403).json({
        success: false,
        error: error.message || 'Failed to fetch child fee records'
      });
    }
  };

  static getChildExams = async (req: Request, res: Response): Promise<void> => {
    try {
      const parentUserId = req.user?.userId;
      const { studentId } = req.params;
      const schoolId = (req.query.schoolId as string) || (req.headers['x-school-id'] as string) || req.user?.schoolId;

      if (!parentUserId || !schoolId) {
        res.status(400).json({ success: false, error: 'Parent context and School ID are required' });
        return;
      }

      const exams = await ParentService.getChildExams(parentUserId, studentId, schoolId);
      res.json({
        success: true,
        data: exams
      });
    } catch (error: any) {
      res.status(403).json({
        success: false,
        error: error.message || 'Failed to fetch child examination records'
      });
    }
  };

  static getChildTimetable = async (req: Request, res: Response): Promise<void> => {
    try {
      const parentUserId = req.user?.userId;
      const { studentId } = req.params;
      const schoolId = (req.query.schoolId as string) || (req.headers['x-school-id'] as string) || req.user?.schoolId;

      if (!parentUserId || !schoolId) {
        res.status(400).json({ success: false, error: 'Parent context and School ID are required' });
        return;
      }

      const timetable = await ParentService.getChildTimetable(parentUserId, studentId, schoolId);
      res.json({
        success: true,
        data: timetable
      });
    } catch (error: any) {
      res.status(403).json({
        success: false,
        error: error.message || 'Failed to fetch child timetable'
      });
    }
  };

  static getChildHomework = async (req: Request, res: Response): Promise<void> => {
    try {
      const parentUserId = req.user?.userId;
      const { studentId } = req.params;
      const schoolId = (req.query.schoolId as string) || (req.headers['x-school-id'] as string) || req.user?.schoolId;

      if (!parentUserId || !schoolId) {
        res.status(400).json({ success: false, error: 'Parent context and School ID are required' });
        return;
      }

      const homework = await ParentService.getChildHomework(parentUserId, studentId, schoolId);
      res.json({
        success: true,
        data: homework
      });
    } catch (error: any) {
      res.status(403).json({
        success: false,
        error: error.message || 'Failed to fetch child homework feed'
      });
    }
  };
}
