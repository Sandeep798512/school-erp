import { Router } from 'express';
import { StudentController } from './student.controller.js';
import { authenticateJwt, requirePermissions } from '../../common/middleware/auth.middleware.js';
import { ensureTenantAccess } from '../../common/middleware/tenant-guard.middleware.js';
import { SystemPermissions } from '@school-erp/shared';

export const studentRouter = Router();

// Apply global JWT Authentication guard
studentRouter.use(authenticateJwt);

// Student Directory & Search
studentRouter.get('/', requirePermissions(SystemPermissions.STUDENTS_VIEW), StudentController.getStudents);
studentRouter.get('/:id', requirePermissions(SystemPermissions.STUDENTS_VIEW), ensureTenantAccess('id'), StudentController.getStudentById);

// Student Admission Registration Workflow
studentRouter.post('/', requirePermissions(SystemPermissions.STUDENTS_CREATE), StudentController.createStudent);

// Student Profile Updates
studentRouter.put('/:id', requirePermissions(SystemPermissions.STUDENTS_UPDATE), ensureTenantAccess('id'), StudentController.updateStudent);

// Enrollment & Transfer Certificates
studentRouter.post('/:id/enroll', requirePermissions(SystemPermissions.STUDENTS_CREATE), ensureTenantAccess('id'), StudentController.enrollStudent);
studentRouter.post('/:id/transfer', requirePermissions(SystemPermissions.STUDENTS_DELETE), ensureTenantAccess('id'), StudentController.transferStudent);
