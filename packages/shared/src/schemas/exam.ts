import { z } from 'zod';

export const CreateGradingScaleSchema = z.object({
  schoolId: z.string().uuid({ message: 'Valid School ID is required' }),
  name: z.string().min(2, { message: 'Scale name is required' }),
  minMark: z.number().min(0),
  maxMark: z.number().max(100),
  gradePoint: z.number().min(0),
  gradeName: z.string().min(1, { message: 'Grade name (e.g. A1, B) is required' }),
  remarks: z.string().optional()
});

export type CreateGradingScaleDto = z.infer<typeof CreateGradingScaleSchema>;

export const CreateExamSchema = z.object({
  organizationId: z.string().uuid({ message: 'Valid Organization ID is required' }),
  schoolId: z.string().uuid({ message: 'Valid School ID is required' }),
  academicYearId: z.string().uuid({ message: 'Valid Academic Year ID is required' }),
  name: z.string().min(2, { message: 'Exam name is required' }),
  code: z.string().min(2, { message: 'Exam code is required' }),
  startDate: z.string().datetime({ message: 'Valid start date ISO string is required' }),
  endDate: z.string().datetime({ message: 'Valid end date ISO string is required' })
});

export type CreateExamDto = z.infer<typeof CreateExamSchema>;

export const CreateExamScheduleSchema = z.object({
  examId: z.string().uuid({ message: 'Valid Exam ID is required' }),
  classId: z.string().uuid({ message: 'Valid Class ID is required' }),
  sectionId: z.string().uuid({ message: 'Valid Section ID is required' }),
  subjectId: z.string().uuid({ message: 'Valid Subject ID is required' }),
  date: z.string().datetime({ message: 'Valid date ISO string is required' }),
  startTime: z.string().min(1, { message: 'Start time is required' }),
  endTime: z.string().min(1, { message: 'End time is required' }),
  maxMarks: z.number().positive(),
  passMarks: z.number().positive()
});

export type CreateExamScheduleDto = z.infer<typeof CreateExamScheduleSchema>;

export const StudentMarkItemSchema = z.object({
  studentId: z.string().uuid({ message: 'Valid Student ID is required' }),
  marksObtained: z.number().min(0),
  isAbsent: z.boolean().default(false),
  remarks: z.string().optional()
});

export type StudentMarkItem = z.infer<typeof StudentMarkItemSchema>;

export const EnterBulkMarksSchema = z.object({
  organizationId: z.string().uuid({ message: 'Valid Organization ID is required' }),
  schoolId: z.string().uuid({ message: 'Valid School ID is required' }),
  examScheduleId: z.string().uuid({ message: 'Valid Exam Schedule ID is required' }),
  marks: z.array(StudentMarkItemSchema).min(1, { message: 'At least one student mark item is required' })
});

export type EnterBulkMarksDto = z.infer<typeof EnterBulkMarksSchema>;
