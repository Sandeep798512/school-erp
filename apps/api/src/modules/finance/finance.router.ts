import { Router } from 'express';
import { FinanceController } from './finance.controller.js';
import { authenticateJwt, requirePermissions } from '../../common/middleware/auth.middleware.js';
import { SystemPermissions } from '@school-erp/shared';

export const financeRouter = Router();

// Public / Gateway Webhook Endpoint (No JWT requirement; verified via idempotency key + sig)
financeRouter.post('/webhooks/payment', FinanceController.webhookPayment);

// Authenticated Finance Endpoints
financeRouter.use(authenticateJwt);

// Fee Categories & Structures
financeRouter.get('/categories', requirePermissions(SystemPermissions.FEES_VIEW), FinanceController.getFeeCategories);
financeRouter.post('/categories', requirePermissions(SystemPermissions.FEES_CONFIGURE), FinanceController.createFeeCategory);

financeRouter.get('/structures', requirePermissions(SystemPermissions.FEES_VIEW), FinanceController.getFeeStructures);
financeRouter.post('/structures', requirePermissions(SystemPermissions.FEES_CONFIGURE), FinanceController.createFeeStructure);

// Invoices & Generation
financeRouter.get('/invoices', requirePermissions(SystemPermissions.FEES_VIEW), FinanceController.getInvoices);
financeRouter.post('/invoices/generate-bulk', requirePermissions(SystemPermissions.FEES_CONFIGURE), FinanceController.generateBulkInvoices);

// Idempotent Payment Collection & Refunds
financeRouter.post('/payments', requirePermissions(SystemPermissions.FEES_COLLECT), FinanceController.collectPayment);
financeRouter.post('/refunds', requirePermissions(SystemPermissions.FEES_REFUND), FinanceController.processRefund);
