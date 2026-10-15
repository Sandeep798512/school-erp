import { Router } from 'express';
import { TimetableController } from './timetable.controller.js';
import { authenticateJwt } from '../../common/middleware/auth.middleware.js';

export const timetableRouter = Router();

// Global JWT Authentication Guard
timetableRouter.use(authenticateJwt);

// Period Slots
timetableRouter.get('/period-slots', TimetableController.getPeriodSlots);
timetableRouter.post('/period-slots', TimetableController.createPeriodSlot);

// Timetables
timetableRouter.get('/', TimetableController.getTimetables);
timetableRouter.post('/', TimetableController.createTimetable);

// Conflict Pre-Check
timetableRouter.post('/check-conflict', TimetableController.checkConflict);

// Allocations
timetableRouter.post('/allocations', TimetableController.createAllocation);
timetableRouter.post('/allocations/bulk', TimetableController.bulkCreateAllocations);

// Grids
timetableRouter.get('/class/:classId/section/:sectionId', TimetableController.getWeeklyClassTimetable);
timetableRouter.get('/teacher/:teacherId', TimetableController.getTeacherSchedule);
