import { Router } from 'express';
import { HomeworkController } from './homework.controller.js';
import { authenticateJwt } from '../../common/middleware/auth.middleware.js';

export const homeworkRouter = Router();

// Global JWT Authentication Guard
homeworkRouter.use(authenticateJwt);

// Homework Management
homeworkRouter.get('/', HomeworkController.getHomeworks);
homeworkRouter.post('/', HomeworkController.createHomework);

// Student Submissions & Teacher Evaluations
homeworkRouter.post('/submit', HomeworkController.submitHomework);
homeworkRouter.post('/evaluate', HomeworkController.evaluateSubmission);

// Student Homework Feed & Submissions Overview
homeworkRouter.get('/student/:studentId', HomeworkController.getStudentHomeworks);
homeworkRouter.get('/:id/submissions', HomeworkController.getHomeworkSubmissions);
homeworkRouter.get('/:id', HomeworkController.getHomeworkById);
