import { Router } from 'express';
import { ParentController } from './parent.controller.js';
import { authenticateJwt } from '../../common/middleware/auth.middleware.js';

export const parentRouter = Router();

// Apply JWT Authentication Guard
parentRouter.use(authenticateJwt);

// Linked Children Directory
parentRouter.get('/children', ParentController.getChildren);

// Child Specific Modules
parentRouter.get('/children/:studentId/profile', ParentController.getChildProfile);
parentRouter.get('/children/:studentId/attendance', ParentController.getChildAttendance);
parentRouter.get('/children/:studentId/fees', ParentController.getChildFees);
parentRouter.get('/children/:studentId/exams', ParentController.getChildExams);
parentRouter.get('/children/:studentId/timetable', ParentController.getChildTimetable);
parentRouter.get('/children/:studentId/homework', ParentController.getChildHomework);
