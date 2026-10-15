import { z } from 'zod';
import { SubjectType } from '@prisma/client';

export const CreateClassSchema = z.object({
  schoolId: z.string().uuid({ message: 'Valid School ID is required' }),
  name: z.string().min(1, { message: 'Class name is required' }),
  code: z.string().min(1, { message: 'Class code is required' }),
  displayOrder: z.number().int().default(0)
});

export type CreateClassDto = z.infer<typeof CreateClassSchema>;

export const CreateSectionSchema = z.object({
  schoolId: z.string().uuid({ message: 'Valid School ID is required' }),
  classId: z.string().uuid({ message: 'Valid Class ID is required' }),
  name: z.string().min(1, { message: 'Section name (e.g. A, B) is required' }),
  capacity: z.number().int().min(1).default(40)
});

export type CreateSectionDto = z.infer<typeof CreateSectionSchema>;

export const CreateSubjectSchema = z.object({
  schoolId: z.string().uuid({ message: 'Valid School ID is required' }),
  name: z.string().min(2, { message: 'Subject name is required' }),
  code: z.string().min(1, { message: 'Subject code is required' }),
  type: z.nativeEnum(SubjectType).default(SubjectType.CORE)
});

export type CreateSubjectDto = z.infer<typeof CreateSubjectSchema>;

export const AssignTeacherSubjectSchema = z.object({
  schoolId: z.string().uuid({ message: 'Valid School ID is required' }),
  classId: z.string().uuid({ message: 'Valid Class ID is required' }),
  subjectId: z.string().uuid({ message: 'Valid Subject ID is required' }),
  teacherId: z.string().uuid({ message: 'Valid Teacher ID is required' })
});

export type AssignTeacherSubjectDto = z.infer<typeof AssignTeacherSubjectSchema>;
