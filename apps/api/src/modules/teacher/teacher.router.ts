import { Router } from 'express';
import { TeacherController } from './teacher.controller.js';
import { authenticateJwt } from '../../common/middleware/auth.middleware.js';
import { ensureTenantAccess } from '../../common/middleware/tenant-guard.middleware.js';

export const teacherRouter = Router();

// Apply global JWT Authentication guard
teacherRouter.use(authenticateJwt);

// Teachers
teacherRouter.get('/teachers', TeacherController.getTeachers);
teacherRouter.get('/teachers/:id', ensureTenantAccess('id'), TeacherController.getTeacherById);
teacherRouter.post('/teachers', TeacherController.createTeacher);
teacherRouter.put('/teachers/:id', ensureTenantAccess('id'), TeacherController.updateTeacher);

// Staff
teacherRouter.get('/staff', TeacherController.getStaff);
teacherRouter.post('/staff', TeacherController.createStaff);
