import { Request, Response } from 'express';
import { TimetableService } from './timetable.service.js';
import {
  CreatePeriodSlotSchema,
  CreateTimetableSchema,
  CreateTimetableAllocationSchema,
  BulkCreateAllocationsSchema,
  CheckConflictSchema
} from '@school-erp/shared';

export class TimetableController {
  static createPeriodSlot = async (req: Request, res: Response): Promise<void> => {
    try {
      const parsed = CreatePeriodSlotSchema.parse(req.body);
      const slot = await TimetableService.createPeriodSlot(parsed);

      res.status(201).json({
        success: true,
        message: 'Period slot created successfully',
        data: slot
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to create period slot'
      });
    }
  };

  static getPeriodSlots = async (req: Request, res: Response): Promise<void> => {
    try {
      const schoolId = (req.query.schoolId as string) || (req.headers['x-school-id'] as string);
      if (!schoolId) {
        res.status(400).json({ success: false, error: 'School ID is required' });
        return;
      }

      const slots = await TimetableService.getPeriodSlots(schoolId);
      res.json({
        success: true,
        data: slots
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch period slots'
      });
    }
  };

  static createTimetable = async (req: Request, res: Response): Promise<void> => {
    try {
      const parsed = CreateTimetableSchema.parse(req.body);
      const timetable = await TimetableService.createTimetable(parsed);

      res.status(201).json({
        success: true,
        message: 'Timetable created successfully',
        data: timetable
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to create timetable'
      });
    }
  };

  static getTimetables = async (req: Request, res: Response): Promise<void> => {
    try {
      const schoolId = (req.query.schoolId as string) || (req.headers['x-school-id'] as string);
      const classId = req.query.classId as string | undefined;
      const sectionId = req.query.sectionId as string | undefined;

      if (!schoolId) {
        res.status(400).json({ success: false, error: 'School ID is required' });
        return;
      }

      const timetables = await TimetableService.getTimetables(schoolId, classId, sectionId);
      res.json({
        success: true,
        data: timetables
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch timetables'
      });
    }
  };

  static checkConflict = async (req: Request, res: Response): Promise<void> => {
    try {
      const parsed = CheckConflictSchema.parse(req.body);
      const result = await TimetableService.checkConflict(parsed);

      res.json({
        success: true,
        data: result
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to check timetable conflicts'
      });
    }
  };

  static createAllocation = async (req: Request, res: Response): Promise<void> => {
    try {
      const parsed = CreateTimetableAllocationSchema.parse(req.body);
      const allocation = await TimetableService.createAllocation(parsed);

      res.status(201).json({
        success: true,
        message: 'Timetable slot allocated successfully',
        data: allocation
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to allocate timetable slot'
      });
    }
  };

  static bulkCreateAllocations = async (req: Request, res: Response): Promise<void> => {
    try {
      const parsed = BulkCreateAllocationsSchema.parse(req.body);
      const allocations = await TimetableService.bulkCreateAllocations(parsed);

      res.status(201).json({
        success: true,
        message: 'Bulk timetable allocations saved successfully',
        data: allocations
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed bulk timetable allocation'
      });
    }
  };

  static getWeeklyClassTimetable = async (req: Request, res: Response): Promise<void> => {
    try {
      const { classId, sectionId } = req.params;
      const schoolId = (req.query.schoolId as string) || (req.headers['x-school-id'] as string);

      if (!schoolId) {
        res.status(400).json({ success: false, error: 'School ID is required' });
        return;
      }

      const grid = await TimetableService.getWeeklyClassTimetable(schoolId, classId, sectionId);
      res.json({
        success: true,
        data: grid
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to fetch weekly class timetable'
      });
    }
  };

  static getTeacherSchedule = async (req: Request, res: Response): Promise<void> => {
    try {
      const { teacherId } = req.params;
      const schoolId = (req.query.schoolId as string) || (req.headers['x-school-id'] as string);

      if (!schoolId) {
        res.status(400).json({ success: false, error: 'School ID is required' });
        return;
      }

      const schedule = await TimetableService.getTeacherSchedule(schoolId, teacherId);
      res.json({
        success: true,
        data: schedule
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to fetch teacher schedule'
      });
    }
  };
}
