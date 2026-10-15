import { Router } from 'express';
import { CommunicationController } from './communication.controller.js';
import { authenticateJwt } from '../../common/middleware/auth.middleware.js';

export const communicationRouter = Router();

// Apply JWT Authentication Guard
communicationRouter.use(authenticateJwt);

// Notice Board
communicationRouter.get('/notices', CommunicationController.getNotices);
communicationRouter.post('/notices', CommunicationController.createNotice);

// Notifications Dispatch
communicationRouter.post('/notifications', CommunicationController.sendNotification);
communicationRouter.post('/notifications/bulk', CommunicationController.sendBulkNotification);

// Recipient Inbox
communicationRouter.get('/notifications/my', CommunicationController.getMyNotifications);
communicationRouter.put('/notifications/read-all', CommunicationController.markAllNotificationsRead);
communicationRouter.put('/notifications/:id/read', CommunicationController.markNotificationRead);
