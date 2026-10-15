import { Request, Response } from 'express';
import { CommunicationService } from './communication.service.js';
import {
  CreateNoticeSchema,
  SendNotificationSchema,
  SendBulkNotificationSchema
} from '@school-erp/shared';

export class CommunicationController {
  static createNotice = async (req: Request, res: Response): Promise<void> => {
    try {
      const createdByUserId = req.user?.userId;
      if (!createdByUserId) {
        res.status(401).json({ success: false, error: 'Unauthorized user context' });
        return;
      }

      const parsed = CreateNoticeSchema.parse(req.body);
      const notice = await CommunicationService.createNotice(parsed, createdByUserId);

      res.status(201).json({
        success: true,
        message: 'Notice announcement published successfully',
        data: notice
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to publish notice'
      });
    }
  };

  static getNotices = async (req: Request, res: Response): Promise<void> => {
    try {
      const schoolId = (req.query.schoolId as string) || (req.headers['x-school-id'] as string) || req.user?.schoolId;
      const audience = req.query.audience as string | undefined;

      if (!schoolId) {
        res.status(400).json({ success: false, error: 'School ID is required' });
        return;
      }

      const notices = await CommunicationService.getNotices(schoolId, audience);
      res.json({
        success: true,
        data: notices
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch notice announcements'
      });
    }
  };

  static sendNotification = async (req: Request, res: Response): Promise<void> => {
    try {
      const parsed = SendNotificationSchema.parse(req.body);
      const notification = await CommunicationService.sendNotification(parsed);

      res.status(201).json({
        success: true,
        message: 'Notification dispatched successfully',
        data: notification
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to send notification'
      });
    }
  };

  static sendBulkNotification = async (req: Request, res: Response): Promise<void> => {
    try {
      const parsed = SendBulkNotificationSchema.parse(req.body);
      const result = await CommunicationService.sendBulkNotification(parsed);

      res.status(201).json({
        success: true,
        message: 'Bulk notifications dispatched successfully',
        data: result
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to send bulk notifications'
      });
    }
  };

  static getMyNotifications = async (req: Request, res: Response): Promise<void> => {
    try {
      const recipientUserId = req.user?.userId;
      const schoolId = (req.query.schoolId as string) || (req.headers['x-school-id'] as string) || req.user?.schoolId;
      const unreadOnly = req.query.unreadOnly === 'true';

      if (!recipientUserId || !schoolId) {
        res.status(400).json({ success: false, error: 'Recipient context and School ID are required' });
        return;
      }

      const inbox = await CommunicationService.getMyNotifications(schoolId, recipientUserId, unreadOnly);
      res.json({
        success: true,
        data: inbox
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch notifications'
      });
    }
  };

  static markNotificationRead = async (req: Request, res: Response): Promise<void> => {
    try {
      const recipientUserId = req.user?.userId;
      const { id } = req.params;

      if (!recipientUserId) {
        res.status(401).json({ success: false, error: 'Unauthorized recipient context' });
        return;
      }

      const updated = await CommunicationService.markNotificationRead(id, recipientUserId);
      res.json({
        success: true,
        message: 'Notification marked as read',
        data: updated
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to mark notification as read'
      });
    }
  };

  static markAllNotificationsRead = async (req: Request, res: Response): Promise<void> => {
    try {
      const recipientUserId = req.user?.userId;
      const schoolId = (req.query.schoolId as string) || (req.headers['x-school-id'] as string) || req.user?.schoolId;

      if (!recipientUserId || !schoolId) {
        res.status(400).json({ success: false, error: 'Recipient context and School ID are required' });
        return;
      }

      const result = await CommunicationService.markAllNotificationsRead(schoolId, recipientUserId);
      res.json({
        success: true,
        message: 'All notifications marked as read',
        data: result
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to mark all notifications as read'
      });
    }
  };
}
