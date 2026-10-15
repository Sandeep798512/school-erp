import { Request, Response } from 'express';
import { OrganizationService } from './organization.service.js';
import { sendSuccess, sendError } from '../../common/utils/response.util.js';
import {
  CreateOrganizationSchema,
  CreateSchoolSchema,
  CreateCampusSchema,
  CreateAcademicYearSchema
} from '@school-erp/shared';

export class OrganizationController {
  // Organizations
  public static async createOrganization(req: Request, res: Response): Promise<Response> {
    const parse = CreateOrganizationSchema.safeParse(req.body);
    if (!parse.success) {
      return sendError(res, 400, 'Bad Request', 'Invalid organization payload', 'https://errors.schoolerp.com/VALIDATION_ERROR', parse.error.flatten().fieldErrors);
    }
    const result = await OrganizationService.createOrganization(parse.data);
    return sendSuccess(res, result, 201);
  }

  public static async getOrganizations(_req: Request, res: Response): Promise<Response> {
    const list = await OrganizationService.getOrganizations();
    return sendSuccess(res, list);
  }

  public static async getOrganizationById(req: Request, res: Response): Promise<Response> {
    const item = await OrganizationService.getOrganizationById(req.params.id);
    if (!item) return sendError(res, 404, 'Not Found', 'Organization not found');
    return sendSuccess(res, item);
  }

  // Schools
  public static async createSchool(req: Request, res: Response): Promise<Response> {
    const parse = CreateSchoolSchema.safeParse(req.body);
    if (!parse.success) {
      return sendError(res, 400, 'Bad Request', 'Invalid school payload', 'https://errors.schoolerp.com/VALIDATION_ERROR', parse.error.flatten().fieldErrors);
    }
    const result = await OrganizationService.createSchool(parse.data);
    return sendSuccess(res, result, 201);
  }

  public static async getSchools(req: Request, res: Response): Promise<Response> {
    const orgId = (req.query.organizationId as string) || req.user?.organizationId;
    if (!orgId) return sendError(res, 400, 'Bad Request', 'Organization ID is required');
    const list = await OrganizationService.getSchools(orgId);
    return sendSuccess(res, list);
  }

  public static async getSchoolById(req: Request, res: Response): Promise<Response> {
    const item = await OrganizationService.getSchoolById(req.params.id);
    if (!item) return sendError(res, 404, 'Not Found', 'School not found');
    return sendSuccess(res, item);
  }

  // Campuses
  public static async createCampus(req: Request, res: Response): Promise<Response> {
    const parse = CreateCampusSchema.safeParse(req.body);
    if (!parse.success) {
      return sendError(res, 400, 'Bad Request', 'Invalid campus payload', 'https://errors.schoolerp.com/VALIDATION_ERROR', parse.error.flatten().fieldErrors);
    }
    const result = await OrganizationService.createCampus(parse.data);
    return sendSuccess(res, result, 201);
  }

  public static async getCampuses(req: Request, res: Response): Promise<Response> {
    const schoolId = (req.query.schoolId as string) || req.user?.schoolId;
    if (!schoolId) return sendError(res, 400, 'Bad Request', 'School ID is required');
    const list = await OrganizationService.getCampuses(schoolId);
    return sendSuccess(res, list);
  }

  // Academic Years
  public static async createAcademicYear(req: Request, res: Response): Promise<Response> {
    const parse = CreateAcademicYearSchema.safeParse(req.body);
    if (!parse.success) {
      return sendError(res, 400, 'Bad Request', 'Invalid academic year payload', 'https://errors.schoolerp.com/VALIDATION_ERROR', parse.error.flatten().fieldErrors);
    }
    const result = await OrganizationService.createAcademicYear(parse.data);
    return sendSuccess(res, result, 201);
  }

  public static async getAcademicYears(req: Request, res: Response): Promise<Response> {
    const schoolId = (req.query.schoolId as string) || req.user?.schoolId;
    if (!schoolId) return sendError(res, 400, 'Bad Request', 'School ID is required');
    const list = await OrganizationService.getAcademicYears(schoolId);
    return sendSuccess(res, list);
  }

  // Settings
  public static async getSettings(req: Request, res: Response): Promise<Response> {
    const schoolId = req.user?.schoolId;
    if (!schoolId) return sendError(res, 400, 'Bad Request', 'School ID context required');
    const settings = await OrganizationService.getSystemSettings(schoolId);
    return sendSuccess(res, settings);
  }

  public static async updateSetting(req: Request, res: Response): Promise<Response> {
    const schoolId = req.user?.schoolId;
    const { key, value, description } = req.body;
    if (!schoolId || !key || value === undefined) {
      return sendError(res, 400, 'Bad Request', 'Key and Value are required');
    }
    const result = await OrganizationService.updateSystemSetting(schoolId, key, value, description);
    return sendSuccess(res, result);
  }
}
