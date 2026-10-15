import { Router } from 'express';
import { HrController } from './hr.controller.js';
import { authenticateJwt } from '../../common/middleware/auth.middleware.js';

export const hrRouter = Router();

// Apply JWT Authentication Guard
hrRouter.use(authenticateJwt);

// Salary Structures
hrRouter.get('/salary-structures', HrController.getSalaryStructures);
hrRouter.post('/salary-structures', HrController.createSalaryStructure);

// Payroll & Payslips
hrRouter.post('/generate-payroll', HrController.generateMonthlyPayroll);
hrRouter.get('/payslips', HrController.getPayslips);
hrRouter.post('/process-payslip', HrController.processPayslip);
