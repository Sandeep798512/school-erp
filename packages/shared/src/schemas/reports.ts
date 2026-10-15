import { z } from 'zod';

export const ReportQuerySchema = z.object({
  schoolId: z.string().uuid({ message: 'Valid School ID is required' }),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  classId: z.string().uuid().optional(),
  sectionId: z.string().uuid().optional(),
  examId: z.string().uuid().optional(),
});

export type ReportQueryDto = z.infer<typeof ReportQuerySchema>;
