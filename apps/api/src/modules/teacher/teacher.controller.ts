import { Request, Response } from 'express';
import { TeacherService } from './teacher.service.js';
import { sendSuccess, sendError } from '../../common/utils/response.util.js';
import {
  CreateTeacherSchema,
  UpdateTeacherSchema,
  CreateStaffSchema
} from '@school-erp/shared';

export class TeacherController {
  // Teachers
  public static async createTeacher(req: Request, res: Response): Promise<Response> {
    const parse = CreateTeacherSchema.safeParse(req.body);
    if (!parse.success) {
      return sendError(res, 400, 'Bad Request', 'Invalid teacher onboarding payload', 'https://errors.schoolerp.com/VALIDATION_ERROR', parse.error.flatten().fieldErrors);
    }
    const result = await TeacherService.createTeacher(parse.data);
    return sendSuccess(res, result, 201);
  }

  public static async getTeachers(req: Request, res: Response): Promise<Response> {
    const schoolId = (req.query.schoolId as string) || req.user?.schoolId;
    if (!schoolId) return sendError(res, 400, 'Bad Request', 'School ID is required');

    const list = await TeacherService.getTeachers({
      schoolId,
      search: req.query.search as string,
      specialization: req.query.specialization as string
    });
    return sendSuccess(res, list);
  }

  public static async getTeacherById(req: Request, res: Response): Promise<Response> {
    const teacher = await TeacherService.getTeacherById(req.params.id);
    if (!teacher) return sendError(res, 404, 'Not Found', 'Teacher record not found');
    return sendSuccess(res, teacher);
  }

  public static async updateTeacher(req: Request, res: Response): Promise<Response> {
    const parse = UpdateTeacherSchema.safeParse(req.body);
    if (!parse.success) {
      return sendError(res, 400, 'Bad Request', 'Invalid update payload', 'https://errors.schoolerp.com/VALIDATION_ERROR', parse.error.flatten().fieldErrors);
    }
    const updated = await TeacherService.updateTeacher(req.params.id, parse.data);
    return sendSuccess(res, updated);
  }

  // Staff
  public static async createStaff(req: Request, res: Response): Promise<Response> {
    const parse = CreateStaffSchema.safeParse(req.body);
    if (!parse.success) {
      return sendError(res, 400, 'Bad Request', 'Invalid staff onboarding payload', 'https://errors.schoolerp.com/VALIDATION_ERROR', parse.error.flatten().fieldErrors);
    }
    const result = await TeacherService.createStaff(parse.data);
    return sendSuccess(res, result, 201);
  }

  public static async getStaff(req: Request, res: Response): Promise<Response> {
    const schoolId = (req.query.schoolId as string) || req.user?.schoolId;
    if (!schoolId) return sendError(res, 400, 'Bad Request', 'School ID is required');

    const list = await TeacherService.getStaff({
      schoolId,
      department: req.query.department as string,
      search: req.query.search as string
    });
    return sendSuccess(res, list);
  }
}
