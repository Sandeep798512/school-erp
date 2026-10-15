import { z } from 'zod';

export const CreateTeacherSchema = z.object({
  organizationId: z.string().uuid({ message: 'Valid Organization ID is required' }),
  schoolId: z.string().uuid({ message: 'Valid School ID is required' }),
  firstName: z.string().min(2, { message: 'First name is required' }),
  lastName: z.string().min(2, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Valid teacher email address is required' }),
  employeeCode: z.string().min(2, { message: 'Employee code is required' }),
  phone: z.string().optional(),
  qualification: z.string().optional(),
  specialization: z.string().optional(),
  joiningDate: z.string().datetime({ message: 'Valid joining date ISO string is required' })
});

export type CreateTeacherDto = z.infer<typeof CreateTeacherSchema>;

export const UpdateTeacherSchema = CreateTeacherSchema.partial().omit({
  organizationId: true,
  schoolId: true,
  employeeCode: true
});

export type UpdateTeacherDto = z.infer<typeof UpdateTeacherSchema>;

export const CreateStaffSchema = z.object({
  organizationId: z.string().uuid({ message: 'Valid Organization ID is required' }),
  schoolId: z.string().uuid({ message: 'Valid School ID is required' }),
  firstName: z.string().min(2, { message: 'First name is required' }),
  lastName: z.string().min(2, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Valid staff email address is required' }),
  employeeCode: z.string().min(2, { message: 'Employee code is required' }),
  phone: z.string().optional(),
  department: z.string().min(2, { message: 'Department (e.g. HR, FINANCE) is required' }),
  designation: z.string().min(2, { message: 'Designation is required' }),
  joiningDate: z.string().datetime({ message: 'Valid joining date ISO string is required' })
});

export type CreateStaffDto = z.infer<typeof CreateStaffSchema>;

export const UpdateStaffSchema = CreateStaffSchema.partial().omit({
  organizationId: true,
  schoolId: true,
  employeeCode: true
});

export type UpdateStaffDto = z.infer<typeof UpdateStaffSchema>;
