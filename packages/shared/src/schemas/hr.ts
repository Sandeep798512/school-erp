import { z } from 'zod';

export const PayrollStatusEnum = z.enum(['DRAFT', 'PROCESSED', 'PAID']);
export type PayrollStatus = z.infer<typeof PayrollStatusEnum>;

export const CreateSalaryStructureSchema = z.object({
  organizationId: z.string().uuid({ message: 'Valid Organization ID is required' }),
  schoolId: z.string().uuid({ message: 'Valid School ID is required' }),
  userId: z.string().uuid({ message: 'Valid Employee User ID is required' }),
  basicPay: z.number().positive({ message: 'Basic pay must be positive' }),
  hra: z.number().min(0).default(0),
  allowances: z.number().min(0).default(0),
  deductions: z.number().min(0).default(0),
  effectiveDate: z.string().datetime().optional()
});

export type CreateSalaryStructureDto = z.infer<typeof CreateSalaryStructureSchema>;

export const GeneratePayrollSchema = z.object({
  organizationId: z.string().uuid({ message: 'Valid Organization ID is required' }),
  schoolId: z.string().uuid({ message: 'Valid School ID is required' }),
  month: z.number().int().min(1).max(12, { message: 'Month must be between 1 and 12' }),
  year: z.number().int().min(2020, { message: 'Valid year is required' })
});

export type GeneratePayrollDto = z.infer<typeof GeneratePayrollSchema>;

export const ProcessPayslipSchema = z.object({
  payslipId: z.string().uuid({ message: 'Valid Payslip ID is required' }),
  status: PayrollStatusEnum.default('PAID'),
  paymentMethod: z.string().optional(),
  paymentDate: z.string().datetime().optional(),
  remarks: z.string().optional()
});

export type ProcessPayslipDto = z.infer<typeof ProcessPayslipSchema>;
