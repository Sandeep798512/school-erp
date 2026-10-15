import { Request, Response } from 'express';
import { ExamService } from './exam.service.js';
import { sendSuccess, sendError } from '../../common/utils/response.util.js';
import {
  CreateGradingScaleSchema,
  CreateExamSchema,
  CreateExamScheduleSchema,
  EnterBulkMarksSchema
} from '@school-erp/shared';

export class ExamController {
  // Grading Scales
  public static async createGradingScale(req: Request, res: Response): Promise<Response> {
    const parse = CreateGradingScaleSchema.safeParse(req.body);
    if (!parse.success) {
      return sendError(res, 400, 'Bad Request', 'Invalid grading scale payload', 'https://errors.schoolerp.com/VALIDATION_ERROR', parse.error.flatten().fieldErrors);
    }
    const result = await ExamService.createGradingScale(parse.data);
    return sendSuccess(res, result, 201);
  }

  public static async getGradingScales(req: Request, res: Response): Promise<Response> {
    const schoolId = (req.query.schoolId as string) || req.user?.schoolId;
    if (!schoolId) return sendError(res, 400, 'Bad Request', 'School ID is required');

    const list = await ExamService.getGradingScales(schoolId);
    return sendSuccess(res, list);
  }

  // Exams
  public static async createExam(req: Request, res: Response): Promise<Response> {
    const parse = CreateExamSchema.safeParse(req.body);
    if (!parse.success) {
      return sendError(res, 400, 'Bad Request', 'Invalid exam payload', 'https://errors.schoolerp.com/VALIDATION_ERROR', parse.error.flatten().fieldErrors);
    }
    const result = await ExamService.createExam(parse.data);
    return sendSuccess(res, result, 201);
  }

  public static async getExams(req: Request, res: Response): Promise<Response> {
    const schoolId = (req.query.schoolId as string) || req.user?.schoolId;
    if (!schoolId) return sendError(res, 400, 'Bad Request', 'School ID is required');

    const list = await ExamService.getExams(schoolId, req.query.academicYearId as string);
    return sendSuccess(res, list);
  }

  // Schedules
  public static async createExamSchedule(req: Request, res: Response): Promise<Response> {
    const parse = CreateExamScheduleSchema.safeParse(req.body);
    if (!parse.success) {
      return sendError(res, 400, 'Bad Request', 'Invalid schedule payload', 'https://errors.schoolerp.com/VALIDATION_ERROR', parse.error.flatten().fieldErrors);
    }
    const result = await ExamService.createExamSchedule(parse.data);
    return sendSuccess(res, result, 201);
  }

  public static async getExamSchedules(req: Request, res: Response): Promise<Response> {
    const examId = req.query.examId as string;
    if (!examId) return sendError(res, 400, 'Bad Request', 'Exam ID query parameter is required');

    const list = await ExamService.getExamSchedules(examId, req.query.classId as string);
    return sendSuccess(res, list);
  }

  // Bulk Marks Entry
  public static async enterBulkMarks(req: Request, res: Response): Promise<Response> {
    const parse = EnterBulkMarksSchema.safeParse(req.body);
    if (!parse.success) {
      return sendError(res, 400, 'Bad Request', 'Invalid bulk marks payload', 'https://errors.schoolerp.com/VALIDATION_ERROR', parse.error.flatten().fieldErrors);
    }
    const result = await ExamService.enterBulkMarks(parse.data, req.user!.userId);
    return sendSuccess(res, result, 201);
  }

  // Result Publishing & Report Cards
  public static async publishExamResults(req: Request, res: Response): Promise<Response> {
    const result = await ExamService.publishExamResults(req.params.id);
    return sendSuccess(res, result);
  }

  public static async getStudentReportCard(req: Request, res: Response): Promise<Response> {
    const studentId = req.params.studentId;
    const reportCard = await ExamService.getStudentReportCard(studentId, req.query.academicYearId as string);
    return sendSuccess(res, reportCard);
  }
}
