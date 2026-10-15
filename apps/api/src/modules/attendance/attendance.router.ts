import { Router } from 'express';
import { AttendanceController } from './attendance.controller.js';
import { authenticateJwt, requirePermissions } from '../../common/middleware/auth.middleware.js';
import { ensureTenantAccess } from '../../common/middleware/tenant-guard.middleware.js';
import { SystemPermissions } from '@school-erp/shared';

export const attendanceRouter = Router();

// Apply global JWT Authentication guard
attendanceRouter.use(authenticateJwt);

// Bulk Attendance Marking & Sessions
attendanceRouter.post('/mark-bulk', requirePermissions(SystemPermissions.ATTENDANCE_MARK), AttendanceController.markBulkAttendance);
attendanceRouter.get('/session', requirePermissions(SystemPermissions.ATTENDANCE_VIEW), AttendanceController.getAttendanceSession);
attendanceRouter.get('/student-summary/:studentId', requirePermissions(SystemPermissions.ATTENDANCE_VIEW), ensureTenantAccess('studentId'), AttendanceController.getStudentSummary);

// Leave Applications
attendanceRouter.post('/leave', AttendanceController.createLeaveApplication);
attendanceRouter.get('/leave', requirePermissions(SystemPermissions.ATTENDANCE_VIEW), AttendanceController.getLeaveApplications);
attendanceRouter.put('/leave/:id/review', requirePermissions(SystemPermissions.ATTENDANCE_MODIFY), AttendanceController.reviewLeaveApplication);
