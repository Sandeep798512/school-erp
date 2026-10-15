import { Router } from 'express';
import { StudentPortalController } from './student-portal.controller.js';
import { authenticateJwt } from '../../common/middleware/auth.middleware.js';

export const studentPortalRouter = Router();

// Apply JWT Authentication Guard
studentPortalRouter.use(authenticateJwt);

// Student Self Profile & Active Enrollment
studentPortalRouter.get('/me', StudentPortalController.getMe);

// Student Self Modules
studentPortalRouter.get('/attendance', StudentPortalController.getAttendance);
studentPortalRouter.get('/timetable', StudentPortalController.getTimetable);
studentPortalRouter.get('/homework', StudentPortalController.getHomework);
studentPortalRouter.post('/homework/submit', StudentPortalController.submitHomework);
studentPortalRouter.get('/exams', StudentPortalController.getExams);
studentPortalRouter.get('/fees', StudentPortalController.getFees);
