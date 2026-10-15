import { prisma } from '../../common/prisma/prisma.service.js';
import { TargetAudience, NotificationChannel } from '@prisma/client';
import {
  CreateNoticeDto,
  SendNotificationDto,
  SendBulkNotificationDto
} from '@school-erp/shared';

export class CommunicationService {
  // 1. Create Notice Board Announcement
  static async createNotice(dto: CreateNoticeDto, createdByUserId: string) {
    return prisma.notice.create({
      data: {
        organizationId: dto.organizationId,
        schoolId: dto.schoolId,
        title: dto.title,
        content: dto.content,
        targetAudience: dto.targetAudience as TargetAudience,
        createdByUserId
      },
      include: {
        createdBy: true
      }
    });
  }

  // 2. Query Notice Board Announcements
  static async getNotices(schoolId: string, audience?: string) {
    const where: any = { schoolId };
    if (audience && audience !== 'ALL') {
      where.targetAudience = { in: ['ALL', audience] };
    }

    return prisma.notice.findMany({
      where,
      include: {
        createdBy: {
          select: { id: true, email: true, firstName: true, lastName: true }
        }
      },
      orderBy: { publishedAt: 'desc' }
    });
  }

  // 3. Dispatch Single Targeted Notification
  static async sendNotification(dto: SendNotificationDto) {
    return prisma.notification.create({
      data: {
        organizationId: dto.organizationId,
        schoolId: dto.schoolId,
        recipientUserId: dto.recipientUserId,
        title: dto.title,
        message: dto.message,
        channel: dto.channel as NotificationChannel
      }
    });
  }

  // 4. Dispatch Bulk Notifications
  static async sendBulkNotification(dto: SendBulkNotificationDto) {
    const records = dto.recipientUserIds.map((recipientUserId) => ({
      organizationId: dto.organizationId,
      schoolId: dto.schoolId,
      recipientUserId,
      title: dto.title,
      message: dto.message,
      channel: dto.channel as NotificationChannel
    }));

    await prisma.notification.createMany({
      data: records
    });

    return {
      success: true,
      dispatchedCount: records.length
    };
  }

  // 5. Query Recipient Inbox
  static async getMyNotifications(schoolId: string, recipientUserId: string, unreadOnly?: boolean) {
    const where: any = {
      schoolId,
      recipientUserId
    };
    if (unreadOnly) {
      where.isRead = false;
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    const unreadCount = await prisma.notification.count({
      where: { schoolId, recipientUserId, isRead: false }
    });

    return {
      unreadCount,
      notifications
    };
  }

  // 6. Mark Notification as Read
  static async markNotificationRead(notificationId: string, recipientUserId: string) {
    const existing = await prisma.notification.findFirst({
      where: { id: notificationId, recipientUserId }
    });

    if (!existing) {
      throw new Error(`Notification not found or access denied.`);
    }

    return prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true }
    });
  }

  // 7. Mark All Notifications as Read
  static async markAllNotificationsRead(schoolId: string, recipientUserId: string) {
    return prisma.notification.updateMany({
      where: { schoolId, recipientUserId, isRead: false },
      data: { isRead: true }
    });
  }
}
