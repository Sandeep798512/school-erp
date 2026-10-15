import { z } from 'zod';

export const TargetAudienceEnum = z.enum(['ALL', 'TEACHERS', 'STUDENTS', 'PARENTS']);
export type TargetAudience = z.infer<typeof TargetAudienceEnum>;

export const NotificationChannelEnum = z.enum(['IN_APP', 'EMAIL', 'SMS', 'PUSH']);
export type NotificationChannel = z.infer<typeof NotificationChannelEnum>;

export const CreateNoticeSchema = z.object({
  organizationId: z.string().uuid({ message: 'Valid Organization ID is required' }),
  schoolId: z.string().uuid({ message: 'Valid School ID is required' }),
  title: z.string().min(2, { message: 'Notice title is required' }),
  content: z.string().min(5, { message: 'Notice content is required' }),
  targetAudience: TargetAudienceEnum.default('ALL')
});

export type CreateNoticeDto = z.infer<typeof CreateNoticeSchema>;

export const SendNotificationSchema = z.object({
  organizationId: z.string().uuid({ message: 'Valid Organization ID is required' }),
  schoolId: z.string().uuid({ message: 'Valid School ID is required' }),
  recipientUserId: z.string().uuid({ message: 'Valid Recipient User ID is required' }),
  title: z.string().min(2, { message: 'Notification title is required' }),
  message: z.string().min(2, { message: 'Notification message is required' }),
  channel: NotificationChannelEnum.default('IN_APP')
});

export type SendNotificationDto = z.infer<typeof SendNotificationSchema>;

export const SendBulkNotificationSchema = z.object({
  organizationId: z.string().uuid({ message: 'Valid Organization ID is required' }),
  schoolId: z.string().uuid({ message: 'Valid School ID is required' }),
  recipientUserIds: z.array(z.string().uuid()).min(1, { message: 'At least one recipient User ID is required' }),
  title: z.string().min(2, { message: 'Notification title is required' }),
  message: z.string().min(2, { message: 'Notification message is required' }),
  channel: NotificationChannelEnum.default('IN_APP')
});

export type SendBulkNotificationDto = z.infer<typeof SendBulkNotificationSchema>;
