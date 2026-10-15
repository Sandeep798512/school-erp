import { z } from 'zod';
import { PaymentMode, PaymentStatus } from '@prisma/client';

export const CreateFeeCategorySchema = z.object({
  schoolId: z.string().uuid({ message: 'Valid School ID is required' }),
  name: z.string().min(2, { message: 'Fee Category name is required' }),
  description: z.string().optional()
});

export type CreateFeeCategoryDto = z.infer<typeof CreateFeeCategorySchema>;

export const FeeComponentItemSchema = z.object({
  feeCategoryId: z.string().uuid({ message: 'Valid Fee Category ID is required' }),
  name: z.string().min(2, { message: 'Component name is required' }),
  amount: z.number().positive({ message: 'Amount must be positive' }),
  isOptional: z.boolean().default(false)
});

export type FeeComponentItem = z.infer<typeof FeeComponentItemSchema>;

export const CreateFeeStructureSchema = z.object({
  schoolId: z.string().uuid({ message: 'Valid School ID is required' }),
  academicYearId: z.string().uuid({ message: 'Valid Academic Year ID is required' }),
  classId: z.string().uuid({ message: 'Valid Class ID is required' }),
  name: z.string().min(2, { message: 'Fee Structure name is required' }),
  dueDate: z.string().datetime({ message: 'Valid due date ISO string is required' }),
  components: z.array(FeeComponentItemSchema).min(1, { message: 'At least one fee component is required' })
});

export type CreateFeeStructureDto = z.infer<typeof CreateFeeStructureSchema>;

export const GenerateBulkInvoicesSchema = z.object({
  organizationId: z.string().uuid({ message: 'Valid Organization ID is required' }),
  schoolId: z.string().uuid({ message: 'Valid School ID is required' }),
  academicYearId: z.string().uuid({ message: 'Valid Academic Year ID is required' }),
  classId: z.string().uuid({ message: 'Valid Class ID is required' }),
  sectionId: z.string().uuid().optional(),
  feeStructureId: z.string().uuid({ message: 'Valid Fee Structure ID is required' })
});

export type GenerateBulkInvoicesDto = z.infer<typeof GenerateBulkInvoicesSchema>;

export const CollectPaymentSchema = z.object({
  organizationId: z.string().uuid({ message: 'Valid Organization ID is required' }),
  schoolId: z.string().uuid({ message: 'Valid School ID is required' }),
  invoiceId: z.string().uuid({ message: 'Valid Invoice ID is required' }),
  studentId: z.string().uuid({ message: 'Valid Student ID is required' }),
  amount: z.number().positive({ message: 'Payment amount must be greater than zero' }),
  paymentMode: z.nativeEnum(PaymentMode).default(PaymentMode.CASH),
  transactionId: z.string().optional()
});

export type CollectPaymentDto = z.infer<typeof CollectPaymentSchema>;

export const RefundPaymentSchema = z.object({
  organizationId: z.string().uuid({ message: 'Valid Organization ID is required' }),
  schoolId: z.string().uuid({ message: 'Valid School ID is required' }),
  paymentId: z.string().uuid({ message: 'Valid Payment ID is required' }),
  amount: z.number().positive({ message: 'Refund amount must be positive' }),
  reason: z.string().min(5, { message: 'Refund reason is required' })
});

export type RefundPaymentDto = z.infer<typeof RefundPaymentSchema>;

export const WebhookPaymentSchema = z.object({
  event: z.string(),
  transactionId: z.string(),
  invoiceId: z.string().uuid(),
  amount: z.number().positive(),
  status: z.nativeEnum(PaymentStatus),
  idempotencyKey: z.string()
});

export type WebhookPaymentDto = z.infer<typeof WebhookPaymentSchema>;
