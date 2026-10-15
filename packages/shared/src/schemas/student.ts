import { z } from 'zod';
import { StudentStatus } from '@prisma/client';

export const CreateGuardianSchema = z.object({
  firstName: z.string().min(2, { message: 'Guardian first name is required' }),
  lastName: z.string().min(2, { message: 'Guardian last name is required' }),
  relation: z.string().min(2, { message: 'Relation (e.g. FATHER, MOTHER) is required' }),
  phone: z.string().min(5, { message: 'Guardian phone number is required' }),
  email: z.string().email().optional().or(z.literal('')),
  occupation: z.string().optional()
});

export type CreateGuardianDto = z.infer<typeof CreateGuardianSchema>;

export const CreateStudentSchema = z.object({
  organizationId: z.string().uuid({ message: 'Valid Organization ID is required' }),
  schoolId: z.string().uuid({ message: 'Valid School ID is required' }),
  firstName: z.string().min(2, { message: 'First name is required' }),
  lastName: z.string().min(2, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Valid student email address is required' }),
  admissionNumber: z.string().min(2, { message: 'Admission Number is required' }),
  rollNumber: z.string().optional(),
  dob: z.string().datetime({ message: 'Valid date of birth ISO string is required' }),
  gender: z.string().min(1, { message: 'Gender is required' }),
  bloodGroup: z.string().optional(),
  category: z.string().optional(),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  primaryGuardian: CreateGuardianSchema.optional()
});

export type CreateStudentDto = z.infer<typeof CreateStudentSchema>;

export const UpdateStudentSchema = CreateStudentSchema.partial().omit({
  organizationId: true,
  schoolId: true,
  admissionNumber: true
});

export type UpdateStudentDto = z.infer<typeof UpdateStudentSchema>;

export const EnrollStudentSchema = z.object({
  organizationId: z.string().uuid({ message: 'Valid Organization ID is required' }),
  schoolId: z.string().uuid({ message: 'Valid School ID is required' }),
  academicYearId: z.string().uuid({ message: 'Valid Academic Year ID is required' }),
  classId: z.string().uuid({ message: 'Valid Class ID is required' }),
  sectionId: z.string().uuid({ message: 'Valid Section ID is required' }),
  rollNumber: z.string().optional()
});

export type EnrollStudentDto = z.infer<typeof EnrollStudentSchema>;

export const TransferStudentSchema = z.object({
  reason: z.string().min(5, { message: 'Transfer reason is required' }),
  targetStatus: z.nativeEnum(StudentStatus).default(StudentStatus.TRANSFERRED)
});

export type TransferStudentDto = z.infer<typeof TransferStudentSchema>;
