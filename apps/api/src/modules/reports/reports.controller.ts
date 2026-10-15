import { Request, Response } from 'express';
import { ReportsService } from './reports.service.js';

const reportsService = new ReportsService();

export class ReportsController {
  static getFinanceSummary = async (req: Request, res: Response): Promise<void> => {
    try {
      const schoolId = (req.query.schoolId as string) || (req.headers['x-school-id'] as string) || req.user?.schoolId;
      const startDate = req.query.startDate as string | undefined;
      const endDate = req.query.endDate as string | undefined;

      if (!schoolId) {
        res.status(400).json({ success: false, error: 'School ID is required' });
        return;
      }

      const summary = await reportsService.getFinanceSummary(schoolId, startDate, endDate);
      res.json({
        success: true,
        data: summary,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to generate financial summary report',
      });
    }
  };

  static getAttendanceAnalytics = async (req: Request, res: Response): Promise<void> => {
    try {
      const schoolId = (req.query.schoolId as string) || (req.headers['x-school-id'] as string) || req.user?.schoolId;
      const classId = req.query.classId as string | undefined;
      const startDate = req.query.startDate as string | undefined;
      const endDate = req.query.endDate as string | undefined;

      if (!schoolId) {
        res.status(400).json({ success: false, error: 'School ID is required' });
        return;
      }

      const analytics = await reportsService.getAttendanceAnalytics(schoolId, classId, startDate, endDate);
      res.json({
        success: true,
        data: analytics,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to generate attendance analytics report',
      });
    }
  };

  static getAcademicPerformance = async (req: Request, res: Response): Promise<void> => {
    try {
      const schoolId = (req.query.schoolId as string) || (req.headers['x-school-id'] as string) || req.user?.schoolId;
      const examId = req.query.examId as string | undefined;
      const classId = req.query.classId as string | undefined;

      if (!schoolId) {
        res.status(400).json({ success: false, error: 'School ID is required' });
        return;
      }

      const performance = await reportsService.getAcademicPerformance(schoolId, examId, classId);
      res.json({
        success: true,
        data: performance,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to generate academic performance report',
      });
    }
  };
}
