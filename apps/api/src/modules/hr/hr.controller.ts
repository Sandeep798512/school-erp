import { Request, Response } from 'express';
import { HrService } from './hr.service.js';
import {
  CreateSalaryStructureSchema,
  GeneratePayrollSchema,
  ProcessPayslipSchema,
} from '@school-erp/shared';

const hrService = new HrService();

export class HrController {
  static createSalaryStructure = async (req: Request, res: Response): Promise<void> => {
    try {
      const parsed = CreateSalaryStructureSchema.parse(req.body);
      const structure = await hrService.createSalaryStructure(parsed);

      res.status(201).json({
        success: true,
        message: 'Salary structure configured successfully',
        data: structure,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to configure salary structure',
      });
    }
  };

  static getSalaryStructures = async (req: Request, res: Response): Promise<void> => {
    try {
      const schoolId = (req.query.schoolId as string) || (req.headers['x-school-id'] as string) || req.user?.schoolId;

      if (!schoolId) {
        res.status(400).json({ success: false, error: 'School ID is required' });
        return;
      }

      const structures = await hrService.getSalaryStructures(schoolId);
      res.json({
        success: true,
        data: structures,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch salary structures',
      });
    }
  };

  static generateMonthlyPayroll = async (req: Request, res: Response): Promise<void> => {
    try {
      const parsed = GeneratePayrollSchema.parse(req.body);
      const result = await hrService.generateMonthlyPayroll(parsed);

      res.status(201).json({
        success: true,
        message: result.message,
        data: result.payslips,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to generate monthly payroll',
      });
    }
  };

  static getPayslips = async (req: Request, res: Response): Promise<void> => {
    try {
      const schoolId = (req.query.schoolId as string) || (req.headers['x-school-id'] as string) || req.user?.schoolId;
      const month = req.query.month ? Number(req.query.month) : undefined;
      const year = req.query.year ? Number(req.query.year) : undefined;
      const userId = req.query.userId as string | undefined;

      if (!schoolId) {
        res.status(400).json({ success: false, error: 'School ID is required' });
        return;
      }

      const payslips = await hrService.getPayslips(schoolId, month, year, userId);
      res.json({
        success: true,
        data: payslips,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch payslips',
      });
    }
  };

  static processPayslip = async (req: Request, res: Response): Promise<void> => {
    try {
      const parsed = ProcessPayslipSchema.parse(req.body);
      const updated = await hrService.processPayslip(parsed);

      res.json({
        success: true,
        message: 'Payslip processed successfully',
        data: updated,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to process payslip',
      });
    }
  };
}
