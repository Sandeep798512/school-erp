import { z } from 'zod';

export const SubmissionStatusEnum = z.enum(['PENDING', 'SUBMITTED', 'EVALUATED', 'LATE']);
export type SubmissionStatus = z.infer<typeof SubmissionStatusEnum>;

export const CreateHomeworkSchema = z.object({
  organizationId: z.string().uuid({ message: 'Valid Organization ID is required' }),
  schoolId: z.string().uuid({ message: 'Valid School ID is required' }),
  classId: z.string().uuid({ message: 'Valid Class ID is required' }),
  sectionId: z.string().uuid({ message: 'Valid Section ID is required' }),
  subjectId: z.string().uuid({ message: 'Valid Subject ID is required' }),
  teacherId: z.string().uuid({ message: 'Valid Teacher ID is required' }),
  title: z.string().min(2, { message: 'Homework title is required' }),
  description: z.string().min(5, { message: 'Homework instructions/description is required' }),
  assignedDate: z.string().datetime().optional(),
  dueDate: z.string().datetime({ message: 'Valid due date ISO string is required' }),
  maxMarks: z.number().positive().optional(),
  attachmentUrl: z.string().optional()
});

export type CreateHomeworkDto = z.infer<typeof CreateHomeworkSchema>;

export const SubmitHomeworkSchema = z.object({
  organizationId: z.string().uuid({ message: 'Valid Organization ID is required' }),
  schoolId: z.string().uuid({ message: 'Valid School ID is required' }),
  homeworkId: z.string().uuid({ message: 'Valid Homework ID is required' }),
  studentId: z.string().uuid({ message: 'Valid Student ID is required' }),
  content: z.string().optional(),
  attachmentUrl: z.string().optional()
});

export type SubmitHomeworkDto = z.infer<typeof SubmitHomeworkSchema>;

export const EvaluateSubmissionSchema = z.object({
  organizationId: z.string().uuid({ message: 'Valid Organization ID is required' }),
  schoolId: z.string().uuid({ message: 'Valid School ID is required' }),
  submissionId: z.string().uuid({ message: 'Valid Submission ID is required' }),
  marksObtained: z.number().min(0).optional(),
  remarks: z.string().optional(),
  status: SubmissionStatusEnum.default('EVALUATED')
});

export type EvaluateSubmissionDto = z.infer<typeof EvaluateSubmissionSchema>;
