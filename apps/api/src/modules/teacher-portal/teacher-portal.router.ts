import { Router } from 'express';
import { TeacherPortalController } from './teacher-portal.controller.js';
import { authenticateJwt } from '../../common/middleware/auth.middleware.js';

export const teacherPortalRouter = Router();

// Apply JWT Authentication Guard
teacherPortalRouter.use(authenticateJwt);

// Profile & Classes
teacherPortalRouter.get('/me', TeacherPortalController.getMe);
teacherPortalRouter.get('/classes', TeacherPortalController.getAssignedClasses);
teacherPortalRouter.get('/schedule', TeacherPortalController.getSchedule);
teacherPortalRouter.get('/students', TeacherPortalController.getStudentsInClass);

// Operational Handlers
teacherPortalRouter.post('/attendance/mark', TeacherPortalController.markAttendance);
teacherPortalRouter.post('/homework/assign', TeacherPortalController.assignHomework);
teacherPortalRouter.post('/homework/evaluate', TeacherPortalController.evaluateHomework);
teacherPortalRouter.post('/marks/enter', TeacherPortalController.enterMarks);
