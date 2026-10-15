import { Request, Response } from 'express';
import { FinanceService } from './finance.service.js';
import { sendSuccess, sendError } from '../../common/utils/response.util.js';
import {
  CreateFeeCategorySchema,
  CreateFeeStructureSchema,
  GenerateBulkInvoicesSchema,
  CollectPaymentSchema,
  RefundPaymentSchema,
  WebhookPaymentSchema
} from '@school-erp/shared';

export class FinanceController {
  // Fee Categories
  public static async createFeeCategory(req: Request, res: Response): Promise<Response> {
    const parse = CreateFeeCategorySchema.safeParse(req.body);
    if (!parse.success) {
      return sendError(res, 400, 'Bad Request', 'Invalid category payload', 'https://errors.schoolerp.com/VALIDATION_ERROR', parse.error.flatten().fieldErrors);
    }
    const result = await FinanceService.createFeeCategory(parse.data);
    return sendSuccess(res, result, 201);
  }

  public static async getFeeCategories(req: Request, res: Response): Promise<Response> {
    const schoolId = (req.query.schoolId as string) || req.user?.schoolId;
    if (!schoolId) return sendError(res, 400, 'Bad Request', 'School ID is required');

    const list = await FinanceService.getFeeCategories(schoolId);
    return sendSuccess(res, list);
  }

  // Fee Structures
  public static async createFeeStructure(req: Request, res: Response): Promise<Response> {
    const parse = CreateFeeStructureSchema.safeParse(req.body);
    if (!parse.success) {
      return sendError(res, 400, 'Bad Request', 'Invalid fee structure payload', 'https://errors.schoolerp.com/VALIDATION_ERROR', parse.error.flatten().fieldErrors);
    }
    const result = await FinanceService.createFeeStructure(parse.data);
    return sendSuccess(res, result, 201);
  }

  public static async getFeeStructures(req: Request, res: Response): Promise<Response> {
    const schoolId = (req.query.schoolId as string) || req.user?.schoolId;
    if (!schoolId) return sendError(res, 400, 'Bad Request', 'School ID is required');

    const list = await FinanceService.getFeeStructures(schoolId, req.query.classId as string);
    return sendSuccess(res, list);
  }

  // Invoices & Bulk Generation
  public static async generateBulkInvoices(req: Request, res: Response): Promise<Response> {
    const parse = GenerateBulkInvoicesSchema.safeParse(req.body);
    if (!parse.success) {
      return sendError(res, 400, 'Bad Request', 'Invalid bulk invoice payload', 'https://errors.schoolerp.com/VALIDATION_ERROR', parse.error.flatten().fieldErrors);
    }
    const result = await FinanceService.generateBulkInvoices(parse.data);
    return sendSuccess(res, result, 201);
  }

  public static async getInvoices(req: Request, res: Response): Promise<Response> {
    const schoolId = (req.query.schoolId as string) || req.user?.schoolId;
    if (!schoolId) return sendError(res, 400, 'Bad Request', 'School ID is required');

    const result = await FinanceService.getInvoices({
      schoolId,
      studentId: req.query.studentId as string,
      status: req.query.status as string,
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 20
    });

    return sendSuccess(res, result.invoices, 200, result.meta);
  }

  // Idempotent Payment Collection
  public static async collectPayment(req: Request, res: Response): Promise<Response> {
    const parse = CollectPaymentSchema.safeParse(req.body);
    if (!parse.success) {
      return sendError(res, 400, 'Bad Request', 'Invalid payment collection payload', 'https://errors.schoolerp.com/VALIDATION_ERROR', parse.error.flatten().fieldErrors);
    }

    const idempotencyKey = req.headers['idempotency-key'] as string;
    const payment = await FinanceService.collectPayment(parse.data, req.user!.userId, idempotencyKey);
    return sendSuccess(res, payment, 201);
  }

  // Payment Webhook
  public static async webhookPayment(req: Request, res: Response): Promise<Response> {
    const parse = WebhookPaymentSchema.safeParse(req.body);
    if (!parse.success) {
      return sendError(res, 400, 'Bad Request', 'Invalid webhook payload', 'https://errors.schoolerp.com/VALIDATION_ERROR', parse.error.flatten().fieldErrors);
    }
    const result = await FinanceService.processWebhookPayment(parse.data);
    return sendSuccess(res, result);
  }

  // Audited Refunds
  public static async processRefund(req: Request, res: Response): Promise<Response> {
    const parse = RefundPaymentSchema.safeParse(req.body);
    if (!parse.success) {
      return sendError(res, 400, 'Bad Request', 'Invalid refund request payload', 'https://errors.schoolerp.com/VALIDATION_ERROR', parse.error.flatten().fieldErrors);
    }
    const refund = await FinanceService.processRefund(parse.data, req.user!.userId);
    return sendSuccess(res, refund, 201);
  }
}
