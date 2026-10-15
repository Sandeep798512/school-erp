import { Request, Response } from 'express';
import { WebsiteService } from './website.service.js';
import { sendSuccess, sendError } from '../../common/utils/response.util.js';

export class WebsiteController {
  public static async getSchoolInfo(_req: Request, res: Response): Promise<Response> {
    const data = await WebsiteService.getSchoolPublicInfo();
    return sendSuccess(res, data);
  }

  public static async getPublicNotices(_req: Request, res: Response): Promise<Response> {
    const list = await WebsiteService.getPublicNotices();
    return sendSuccess(res, list);
  }

  public static async getPublicEvents(_req: Request, res: Response): Promise<Response> {
    const events = await WebsiteService.getPublicEvents();
    return sendSuccess(res, events);
  }

  public static async submitEnquiry(req: Request, res: Response): Promise<Response> {
    const { name, email, phone, studentGrade, message } = req.body;
    if (!name || !email || !phone) {
      return sendError(res, 400, 'Bad Request', 'Name, Email, and Phone are required for enquiry submission.');
    }

    return sendSuccess(res, {
      enquiryId: `enq_${Math.random().toString(36).substring(2, 9)}`,
      applicantName: name,
      applicantEmail: email,
      seekingGrade: studentGrade || 'Grade 1',
      remarks: message || 'Standard admission inquiry',
      status: 'RECEIVED',
      message: 'Thank you for your enquiry. Our Admissions Office will contact you within 24 hours.'
    }, 201);
  }
}
