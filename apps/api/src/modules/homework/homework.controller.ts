import { Request, Response } from 'express';
import { HomeworkService } from './homework.service.js';
import {
  CreateHomeworkSchema,
  SubmitHomeworkSchema,
  EvaluateSubmissionSchema
} from '@school-erp/shared';

export class HomeworkController {
  static createHomework = async (req: Request, res: Response): Promise<void> => {
    try {
      const parsed = CreateHomeworkSchema.parse(req.body);
      const homework = await HomeworkService.createHomework(parsed);

      res.status(201).json({
        success: true,
        message: 'Homework assigned successfully',
        data: homework
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to create homework'
      });
    }
  };

  static getHomeworks = async (req: Request, res: Response): Promise<void> => {
    try {
      const schoolId = (req.query.schoolId as string) || (req.headers['x-school-id'] as string);
      const classId = req.query.classId as string | undefined;
      const sectionId = req.query.sectionId as string | undefined;
      const subjectId = req.query.subjectId as string | undefined;
      const teacherId = req.query.teacherId as string | undefined;

      if (!schoolId) {
        res.status(400).json({ success: false, error: 'School ID is required' });
        return;
      }

      const list = await HomeworkService.getHomeworks(schoolId, classId, sectionId, subjectId, teacherId);
      res.json({
        success: true,
        data: list
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch homework assignments'
      });
    }
  };

  static getHomeworkById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const homework = await HomeworkService.getHomeworkById(id);

      res.json({
        success: true,
        data: homework
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message || 'Homework not found'
      });
    }
  };

  static submitHomework = async (req: Request, res: Response): Promise<void> => {
    try {
      const parsed = SubmitHomeworkSchema.parse(req.body);
      const submission = await HomeworkService.submitHomework(parsed);

      res.status(201).json({
        success: true,
        message: 'Homework submitted successfully',
        data: submission
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to submit homework'
      });
    }
  };

  static evaluateSubmission = async (req: Request, res: Response): Promise<void> => {
    try {
      const parsed = EvaluateSubmissionSchema.parse(req.body);
      const result = await HomeworkService.evaluateSubmission(parsed);

      res.json({
        success: true,
        message: 'Submission evaluated successfully',
        data: result
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to evaluate submission'
      });
    }
  };

  static getStudentHomeworks = async (req: Request, res: Response): Promise<void> => {
    try {
      const { studentId } = req.params;
      const schoolId = (req.query.schoolId as string) || (req.headers['x-school-id'] as string);
      const classId = req.query.classId as string;
      const sectionId = req.query.sectionId as string;

      if (!schoolId || !classId || !sectionId) {
        res.status(400).json({ success: false, error: 'School ID, Class ID, and Section ID are required' });
        return;
      }

      const feed = await HomeworkService.getStudentHomeworks(schoolId, studentId, classId, sectionId);
      res.json({
        success: true,
        data: feed
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to fetch student homework feed'
      });
    }
  };

  static getHomeworkSubmissions = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const submissions = await HomeworkService.getHomeworkSubmissions(id);

      res.json({
        success: true,
        data: submissions
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to fetch homework submissions'
      });
    }
  };
}
