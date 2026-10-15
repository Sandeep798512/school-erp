import { Router } from 'express';
import { ReportsController } from './reports.controller.js';
import { authenticateJwt } from '../../common/middleware/auth.middleware.js';

export const reportsRouter = Router();

// Apply JWT Authentication Guard
reportsRouter.use(authenticateJwt);

// Reports & Analytics Endpoints
reportsRouter.get('/finance-summary', ReportsController.getFinanceSummary);
reportsRouter.get('/attendance-analytics', ReportsController.getAttendanceAnalytics);
reportsRouter.get('/academic-performance', ReportsController.getAcademicPerformance);
