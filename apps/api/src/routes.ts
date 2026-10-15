import { Router } from 'express';
import { healthRouter } from './modules/health/health.router.js';
import { authRouter } from './modules/identity/auth.router.js';
import { organizationRouter } from './modules/organization/organization.router.js';
import { publicWebsiteRouter } from './modules/website/website.router.js';
import { adminRouter } from './modules/admin/admin.router.js';
import { studentRouter } from './modules/student/student.router.js';
import { teacherRouter } from './modules/teacher/teacher.router.js';
import { attendanceRouter } from './modules/attendance/attendance.router.js';
import { financeRouter } from './modules/finance/finance.router.js';
import { examRouter } from './modules/exam/exam.router.js';
import { timetableRouter } from './modules/timetable/timetable.router.js';
import { homeworkRouter } from './modules/homework/homework.router.js';
import { parentRouter } from './modules/parent/parent.router.js';
import { studentPortalRouter } from './modules/student-portal/student-portal.router.js';
import { teacherPortalRouter } from './modules/teacher-portal/teacher-portal.router.js';
import { communicationRouter } from './modules/communication/communication.router.js';
import { libraryRouter } from './modules/library/library.router.js';
import { transportRouter } from './modules/transport/transport.router.js';
import { hrRouter } from './modules/hr/hr.router.js';
import { inventoryRouter } from './modules/inventory/inventory.router.js';
import { documentRouter } from './modules/document/document.router.js';
import { reportsRouter } from './modules/reports/reports.router.js';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/public', publicWebsiteRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/org', organizationRouter);
apiRouter.use('/admin', adminRouter);
apiRouter.use('/students', studentRouter);
apiRouter.use('/attendance', attendanceRouter);
apiRouter.use('/finance', financeRouter);
apiRouter.use('/exams', examRouter);
apiRouter.use('/timetable', timetableRouter);
apiRouter.use('/homework', homeworkRouter);
apiRouter.use('/parent', parentRouter);
apiRouter.use('/student-portal', studentPortalRouter);
apiRouter.use('/teacher-portal', teacherPortalRouter);
apiRouter.use('/communication', communicationRouter);
apiRouter.use('/library', libraryRouter);
apiRouter.use('/transport', transportRouter);
apiRouter.use('/hr', hrRouter);
apiRouter.use('/inventory', inventoryRouter);
apiRouter.use('/documents', documentRouter);
apiRouter.use('/reports', reportsRouter);
apiRouter.use('/', teacherRouter);












