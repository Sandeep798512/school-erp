import { Router } from 'express';
import { WebsiteController } from './website.controller.js';

export const publicWebsiteRouter = Router();

// Non-authenticated Public APIs
publicWebsiteRouter.get('/info', WebsiteController.getSchoolInfo);
publicWebsiteRouter.get('/notices', WebsiteController.getPublicNotices);
publicWebsiteRouter.get('/events', WebsiteController.getPublicEvents);
publicWebsiteRouter.post('/enquiry', WebsiteController.submitEnquiry);
