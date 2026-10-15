import { Request, Response } from 'express';
import { AttendanceService } from './attendance.service.js';
import { sendSuccess, sendError } from '../../common/utils/response.util.js';
import {
  MarkBulkAttendanceSchema,
  CreateLeaveApplicationSchema,
  ReviewLeaveApplicationSchema
} from '@school-erp/shared';

export class AttendanceController {
  public static async markBulkAttendance(req: Request, res: Response): Promise<Response> {
    const parse = MarkBulkAttendanceSchema.safeParse(req.body);
    if (!parse.success) {
      return sendError(res, 400, 'Bad Request', 'Invalid bulk attendance payload', 'https://errors.schoolerp.com/VALIDATION_ERROR', parse.error.flatten().fieldErrors);
    }
    const result = await AttendanceService.markBulkAttendance(parse.data, req.user!.userId);
    return sendSuccess(res, result, 201);
  }

  public static async getAttendanceSession(req: Request, res: Response): Promise<Response> {
    const schoolId = (req.query.schoolId as string) || req.user?.schoolId;
    const sectionId = req.query.sectionId as string;
    const date = req.query.date as string;

    if (!schoolId || !sectionId || !date) {
      return sendError(res, 400, 'Bad Request', 'School ID, Section ID, and Date query parameters are required.');
    }

    const session = await AttendanceService.getAttendanceSession({
      schoolId,
      sectionId,
      date,
      subjectId: req.query.subjectId as string
    });

    return sendSuccess(res, session);
  }

  public static async getStudentSummary(req: Request, res: Response): Promise<Response> {
    const studentId = req.params.studentId;
    const schoolId = (req.query.schoolId as string) || req.user?.schoolId;

    if (!schoolId) return sendError(res, 400, 'Bad Request', 'School ID is required');

    const summary = await AttendanceService.getStudentAttendanceSummary(studentId, schoolId);
    return sendSuccess(res, summary);
  }

  // Leave Management
  public static async createLeaveApplication(req: Request, res: Response): Promise<Response> {
    const parse = CreateLeaveApplicationSchema.safeParse(req.body);
    if (!parse.success) {
      return sendError(res, 400, 'Bad Request', 'Invalid leave application payload', 'https://errors.schoolerp.com/VALIDATION_ERROR', parse.error.flatten().fieldErrors);
    }
    const result = await AttendanceService.createLeaveApplication(parse.data, req.user!.userId);
    return sendSuccess(res, result, 201);
  }

  public static async getLeaveApplications(req: Request, res: Response): Promise<Response> {
    const schoolId = (req.query.schoolId as string) || req.user?.schoolId;
    if (!schoolId) return sendError(res, 400, 'Bad Request', 'School ID is required');

    const list = await AttendanceService.getLeaveApplications(schoolId, req.query.status as string);
    return sendSuccess(res, list);
  }

  public static async reviewLeaveApplication(req: Request, res: Response): Promise<Response> {
    const parse = ReviewLeaveApplicationSchema.safeParse(req.body);
    if (!parse.success) {
      return sendError(res, 400, 'Bad Request', 'Invalid review payload', 'https://errors.schoolerp.com/VALIDATION_ERROR', parse.error.flatten().fieldErrors);
    }
    const updated = await AttendanceService.reviewLeaveApplication(req.params.id, req.user!.userId, parse.data);
    return sendSuccess(res, updated);
  }
}
