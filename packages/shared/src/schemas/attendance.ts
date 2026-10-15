import { z } from 'zod';
import { AttendanceType, AttendanceStatus, LeaveStatus } from '@prisma/client';

export const AttendanceStudentItemSchema = z.object({
  studentId: z.string().uuid({ message: 'Valid Student ID is required' }),
  status: z.nativeEnum(AttendanceStatus),
  remarks: z.string().optional()
});

export type AttendanceStudentItem = z.infer<typeof AttendanceStudentItemSchema>;

export const MarkBulkAttendanceSchema = z.object({
  organizationId: z.string().uuid({ message: 'Valid Organization ID is required' }),
  schoolId: z.string().uuid({ message: 'Valid School ID is required' }),
  academicYearId: z.string().uuid({ message: 'Valid Academic Year ID is required' }),
  classId: z.string().uuid({ message: 'Valid Class ID is required' }),
  sectionId: z.string().uuid({ message: 'Valid Section ID is required' }),
  subjectId: z.string().uuid().optional(),
  date: z.string().datetime({ message: 'Valid date ISO string is required' }),
  type: z.nativeEnum(AttendanceType).default(AttendanceType.DAILY),
  records: z.array(AttendanceStudentItemSchema).min(1, { message: 'At least one student attendance record is required' })
});

export type MarkBulkAttendanceDto = z.infer<typeof MarkBulkAttendanceSchema>;

export const CreateLeaveApplicationSchema = z.object({
  organizationId: z.string().uuid({ message: 'Valid Organization ID is required' }),
  schoolId: z.string().uuid({ message: 'Valid School ID is required' }),
  startDate: z.string().datetime({ message: 'Valid start date ISO string is required' }),
  endDate: z.string().datetime({ message: 'Valid end date ISO string is required' }),
  reason: z.string().min(5, { message: 'Leave reason must be at least 5 characters' })
});

export type CreateLeaveApplicationDto = z.infer<typeof CreateLeaveApplicationSchema>;

export const ReviewLeaveApplicationSchema = z.object({
  status: z.nativeEnum(LeaveStatus)
});

export type ReviewLeaveApplicationDto = z.infer<typeof ReviewLeaveApplicationSchema>;
