import { Request, Response } from 'express';
import { StudentService } from './student.service.js';
import { sendSuccess, sendError } from '../../common/utils/response.util.js';
import {
  CreateStudentSchema,
  UpdateStudentSchema,
  EnrollStudentSchema,
  TransferStudentSchema
} from '@school-erp/shared';

export class StudentController {
  public static async createStudent(req: Request, res: Response): Promise<Response> {
    const parse = CreateStudentSchema.safeParse(req.body);
    if (!parse.success) {
      return sendError(res, 400, 'Bad Request', 'Invalid student admission payload', 'https://errors.schoolerp.com/VALIDATION_ERROR', parse.error.flatten().fieldErrors);
    }
    const student = await StudentService.createStudent(parse.data);
    return sendSuccess(res, student, 201);
  }

  public static async getStudents(req: Request, res: Response): Promise<Response> {
    const schoolId = (req.query.schoolId as string) || req.user?.schoolId;
    if (!schoolId) return sendError(res, 400, 'Bad Request', 'School ID is required');

    const result = await StudentService.getStudents({
      schoolId,
      classId: req.query.classId as string,
      sectionId: req.query.sectionId as string,
      search: req.query.search as string,
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 20
    });

    return sendSuccess(res, result.students, 200, result.meta);
  }

  public static async getStudentById(req: Request, res: Response): Promise<Response> {
    const student = await StudentService.getStudentById(req.params.id);
    if (!student) return sendError(res, 404, 'Not Found', 'Student record not found');
    return sendSuccess(res, student);
  }

  public static async updateStudent(req: Request, res: Response): Promise<Response> {
    const parse = UpdateStudentSchema.safeParse(req.body);
    if (!parse.success) {
      return sendError(res, 400, 'Bad Request', 'Invalid update payload', 'https://errors.schoolerp.com/VALIDATION_ERROR', parse.error.flatten().fieldErrors);
    }
    const updated = await StudentService.updateStudent(req.params.id, parse.data);
    return sendSuccess(res, updated);
  }

  public static async enrollStudent(req: Request, res: Response): Promise<Response> {
    const parse = EnrollStudentSchema.safeParse(req.body);
    if (!parse.success) {
      return sendError(res, 400, 'Bad Request', 'Invalid enrollment payload', 'https://errors.schoolerp.com/VALIDATION_ERROR', parse.error.flatten().fieldErrors);
    }
    const enrollment = await StudentService.enrollStudent(req.params.id, parse.data);
    return sendSuccess(res, enrollment);
  }

  public static async transferStudent(req: Request, res: Response): Promise<Response> {
    const parse = TransferStudentSchema.safeParse(req.body);
    if (!parse.success) {
      return sendError(res, 400, 'Bad Request', 'Invalid transfer request payload', 'https://errors.schoolerp.com/VALIDATION_ERROR', parse.error.flatten().fieldErrors);
    }
    const transferred = await StudentService.transferStudent(req.params.id, parse.data);
    return sendSuccess(res, transferred);
  }
}
