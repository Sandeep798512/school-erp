import { Router } from 'express';
import { ExamController } from './exam.controller.js';
import { authenticateJwt, requirePermissions } from '../../common/middleware/auth.middleware.js';
import { ensureTenantAccess } from '../../common/middleware/tenant-guard.middleware.js';
import { SystemPermissions } from '@school-erp/shared';

export const examRouter = Router();

// Apply global JWT Authentication guard
examRouter.use(authenticateJwt);

// Grading Scales
examRouter.get('/grading-scales', requirePermissions(SystemPermissions.EXAMS_MANAGE), ExamController.getGradingScales);
examRouter.post('/grading-scales', requirePermissions(SystemPermissions.EXAMS_MANAGE), ExamController.createGradingScale);

// Exams & Schedules
examRouter.get('/schedules', requirePermissions(SystemPermissions.EXAMS_MANAGE), ExamController.getExamSchedules);
examRouter.post('/schedules', requirePermissions(SystemPermissions.EXAMS_MANAGE), ExamController.createExamSchedule);

examRouter.get('/', requirePermissions(SystemPermissions.EXAMS_MANAGE), ExamController.getExams);
examRouter.post('/', requirePermissions(SystemPermissions.EXAMS_MANAGE), ExamController.createExam);

// Marks Entry & Result Publishing
examRouter.post('/marks/enter-bulk', requirePermissions(SystemPermissions.RESULTS_ENTER), ExamController.enterBulkMarks);
examRouter.post('/:id/publish', requirePermissions(SystemPermissions.RESULTS_PUBLISH), ExamController.publishExamResults);
examRouter.get('/report-card/:studentId', ensureTenantAccess('studentId'), ExamController.getStudentReportCard);
