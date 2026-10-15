import { z } from 'zod';

export const CreateOrganizationSchema = z.object({
  name: z.string().min(2, { message: 'Organization name must be at least 2 characters' }),
  code: z.string().min(2, { message: 'Organization code must be at least 2 characters' }),
  logoUrl: z.string().url().optional().or(z.literal('')),
  address: z.string().optional()
});

export type CreateOrganizationDto = z.infer<typeof CreateOrganizationSchema>;

export const CreateSchoolSchema = z.object({
  organizationId: z.string().uuid({ message: 'Valid Organization ID is required' }),
  name: z.string().min(2, { message: 'School name must be at least 2 characters' }),
  code: z.string().min(2, { message: 'School code must be at least 2 characters' }),
  logoUrl: z.string().url().optional().or(z.literal('')),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal(''))
});

export type CreateSchoolDto = z.infer<typeof CreateSchoolSchema>;

export const CreateCampusSchema = z.object({
  schoolId: z.string().uuid({ message: 'Valid School ID is required' }),
  name: z.string().min(2, { message: 'Campus name must be at least 2 characters' }),
  code: z.string().min(2, { message: 'Campus code must be at least 2 characters' }),
  address: z.string().optional(),
  isMain: z.boolean().default(false)
});

export type CreateCampusDto = z.infer<typeof CreateCampusSchema>;

export const CreateAcademicYearSchema = z.object({
  schoolId: z.string().uuid({ message: 'Valid School ID is required' }),
  name: z.string().min(4, { message: 'Academic Year name (e.g. 2026-2027) is required' }),
  startDate: z.string().datetime({ message: 'Valid start date ISO string is required' }),
  endDate: z.string().datetime({ message: 'Valid end date ISO string is required' }),
  isCurrent: z.boolean().default(false)
});

export type CreateAcademicYearDto = z.infer<typeof CreateAcademicYearSchema>;
