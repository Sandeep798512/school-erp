import { z } from 'zod';

export const SlotTypeEnum = z.enum(['ACADEMIC', 'BREAK', 'LUNCH', 'ASSEMBLY']);
export type SlotType = z.infer<typeof SlotTypeEnum>;

export const DayOfWeekEnum = z.enum([
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY'
]);
export type DayOfWeek = z.infer<typeof DayOfWeekEnum>;

export const CreatePeriodSlotSchema = z.object({
  organizationId: z.string().uuid({ message: 'Valid Organization ID is required' }),
  schoolId: z.string().uuid({ message: 'Valid School ID is required' }),
  name: z.string().min(2, { message: 'Slot name (e.g. Period 1) is required' }),
  startTime: z.string().min(4, { message: 'Start time (e.g. 08:00) is required' }),
  endTime: z.string().min(4, { message: 'End time (e.g. 08:45) is required' }),
  slotType: SlotTypeEnum.default('ACADEMIC'),
  orderIndex: z.number().int().min(1, { message: 'Order index must be at least 1' })
});

export type CreatePeriodSlotDto = z.infer<typeof CreatePeriodSlotSchema>;

export const CreateTimetableSchema = z.object({
  organizationId: z.string().uuid({ message: 'Valid Organization ID is required' }),
  schoolId: z.string().uuid({ message: 'Valid School ID is required' }),
  academicYearId: z.string().uuid({ message: 'Valid Academic Year ID is required' }),
  classId: z.string().uuid({ message: 'Valid Class ID is required' }),
  sectionId: z.string().uuid({ message: 'Valid Section ID is required' }),
  name: z.string().min(2, { message: 'Timetable name is required' }),
  startDate: z.string().datetime({ message: 'Valid start date ISO string is required' }),
  endDate: z.string().datetime({ message: 'Valid end date ISO string is required' }),
  isDefault: z.boolean().default(true)
});

export type CreateTimetableDto = z.infer<typeof CreateTimetableSchema>;

export const CreateTimetableAllocationSchema = z.object({
  organizationId: z.string().uuid({ message: 'Valid Organization ID is required' }),
  schoolId: z.string().uuid({ message: 'Valid School ID is required' }),
  timetableId: z.string().uuid({ message: 'Valid Timetable ID is required' }),
  dayOfWeek: DayOfWeekEnum,
  periodSlotId: z.string().uuid({ message: 'Valid Period Slot ID is required' }),
  subjectId: z.string().uuid({ message: 'Valid Subject ID is required' }),
  teacherId: z.string().uuid().optional(),
  roomNumber: z.string().optional()
});

export type CreateTimetableAllocationDto = z.infer<typeof CreateTimetableAllocationSchema>;

export const BulkAllocationItemSchema = z.object({
  dayOfWeek: DayOfWeekEnum,
  periodSlotId: z.string().uuid({ message: 'Valid Period Slot ID is required' }),
  subjectId: z.string().uuid({ message: 'Valid Subject ID is required' }),
  teacherId: z.string().uuid().optional(),
  roomNumber: z.string().optional()
});

export type BulkAllocationItem = z.infer<typeof BulkAllocationItemSchema>;

export const BulkCreateAllocationsSchema = z.object({
  organizationId: z.string().uuid({ message: 'Valid Organization ID is required' }),
  schoolId: z.string().uuid({ message: 'Valid School ID is required' }),
  timetableId: z.string().uuid({ message: 'Valid Timetable ID is required' }),
  allocations: z.array(BulkAllocationItemSchema).min(1, { message: 'At least one allocation item is required' })
});

export type BulkCreateAllocationsDto = z.infer<typeof BulkCreateAllocationsSchema>;

export const CheckConflictSchema = z.object({
  schoolId: z.string().uuid({ message: 'Valid School ID is required' }),
  dayOfWeek: DayOfWeekEnum,
  periodSlotId: z.string().uuid({ message: 'Valid Period Slot ID is required' }),
  teacherId: z.string().uuid().optional(),
  roomNumber: z.string().optional(),
  sectionId: z.string().uuid().optional(),
  excludeTimetableId: z.string().uuid().optional()
});

export type CheckConflictDto = z.infer<typeof CheckConflictSchema>;
