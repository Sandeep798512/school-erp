import { Request, Response } from 'express';
import { AdminService } from './admin.service.js';
import { sendSuccess, sendError } from '../../common/utils/response.util.js';
import {
  CreateClassSchema,
  CreateSectionSchema,
  CreateSubjectSchema,
  AssignTeacherSubjectSchema
} from '@school-erp/shared';

export class AdminController {
  public static async getDashboardStats(req: Request, res: Response): Promise<Response> {
    const schoolId = req.user?.schoolId;
    const stats = await AdminService.getDashboardStats(schoolId);
    return sendSuccess(res, stats);
  }

  // Classes
  public static async createClass(req: Request, res: Response): Promise<Response> {
    const parse = CreateClassSchema.safeParse(req.body);
    if (!parse.success) {
      return sendError(res, 400, 'Bad Request', 'Invalid class payload', 'https://errors.schoolerp.com/VALIDATION_ERROR', parse.error.flatten().fieldErrors);
    }
    const result = await AdminService.createClass(parse.data);
    return sendSuccess(res, result, 201);
  }

  public static async getClasses(req: Request, res: Response): Promise<Response> {
    const schoolId = (req.query.schoolId as string) || req.user?.schoolId;
    if (!schoolId) return sendError(res, 400, 'Bad Request', 'School ID is required');
    const list = await AdminService.getClasses(schoolId);
    return sendSuccess(res, list);
  }

  // Sections
  public static async createSection(req: Request, res: Response): Promise<Response> {
    const parse = CreateSectionSchema.safeParse(req.body);
    if (!parse.success) {
      return sendError(res, 400, 'Bad Request', 'Invalid section payload', 'https://errors.schoolerp.com/VALIDATION_ERROR', parse.error.flatten().fieldErrors);
    }
    const result = await AdminService.createSection(parse.data);
    return sendSuccess(res, result, 201);
  }

  public static async getSections(req: Request, res: Response): Promise<Response> {
    const classId = req.query.classId as string;
    if (!classId) return sendError(res, 400, 'Bad Request', 'Class ID query parameter is required');
    const list = await AdminService.getSections(classId);
    return sendSuccess(res, list);
  }

  // Subjects
  public static async createSubject(req: Request, res: Response): Promise<Response> {
    const parse = CreateSubjectSchema.safeParse(req.body);
    if (!parse.success) {
      return sendError(res, 400, 'Bad Request', 'Invalid subject payload', 'https://errors.schoolerp.com/VALIDATION_ERROR', parse.error.flatten().fieldErrors);
    }
    const result = await AdminService.createSubject(parse.data);
    return sendSuccess(res, result, 201);
  }

  public static async getSubjects(req: Request, res: Response): Promise<Response> {
    const schoolId = (req.query.schoolId as string) || req.user?.schoolId;
    if (!schoolId) return sendError(res, 400, 'Bad Request', 'School ID is required');
    const list = await AdminService.getSubjects(schoolId);
    return sendSuccess(res, list);
  }

  // Teacher Subject Assignment
  public static async assignTeacherSubject(req: Request, res: Response): Promise<Response> {
    const parse = AssignTeacherSubjectSchema.safeParse(req.body);
    if (!parse.success) {
      return sendError(res, 400, 'Bad Request', 'Invalid assignment payload', 'https://errors.schoolerp.com/VALIDATION_ERROR', parse.error.flatten().fieldErrors);
    }
    const result = await AdminService.assignTeacherSubject(parse.data);
    return sendSuccess(res, result);
  }
}
