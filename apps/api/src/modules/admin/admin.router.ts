import { Router } from 'express';
import { AdminController } from './admin.controller.js';
import { authenticateJwt, requirePermissions } from '../../common/middleware/auth.middleware.js';
import { SystemPermissions } from '@school-erp/shared';

export const adminRouter = Router();

// Apply global JWT Authentication guard
adminRouter.use(authenticateJwt);

// Dashboard Stats
adminRouter.get('/dashboard-stats', AdminController.getDashboardStats);

// Classes & Sections
adminRouter.get('/classes', AdminController.getClasses);
adminRouter.post('/classes', requirePermissions(SystemPermissions.SCHOOL_CONFIGURE), AdminController.createClass);

adminRouter.get('/sections', AdminController.getSections);
adminRouter.post('/sections', requirePermissions(SystemPermissions.SCHOOL_CONFIGURE), AdminController.createSection);

// Subjects & Assignments
adminRouter.get('/subjects', AdminController.getSubjects);
adminRouter.post('/subjects', requirePermissions(SystemPermissions.SCHOOL_CONFIGURE), AdminController.createSubject);
adminRouter.post('/class-subjects', requirePermissions(SystemPermissions.SCHOOL_CONFIGURE), AdminController.assignTeacherSubject);
