import { Request, Response } from 'express';
import { DocumentService } from './document.service.js';
import {
  CreateCertificateTemplateSchema,
  GenerateCertificateSchema,
  CertificateType,
} from '@school-erp/shared';

const documentService = new DocumentService();

export class DocumentController {
  static createTemplate = async (req: Request, res: Response): Promise<void> => {
    try {
      const parsed = CreateCertificateTemplateSchema.parse(req.body);
      const template = await documentService.createTemplate(parsed);

      res.status(201).json({
        success: true,
        message: 'Certificate template created successfully',
        data: template,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to create certificate template',
      });
    }
  };

  static getTemplates = async (req: Request, res: Response): Promise<void> => {
    try {
      const schoolId = (req.query.schoolId as string) || (req.headers['x-school-id'] as string) || req.user?.schoolId;
      const type = req.query.type as CertificateType | undefined;

      if (!schoolId) {
        res.status(400).json({ success: false, error: 'School ID is required' });
        return;
      }

      const templates = await documentService.getTemplates(schoolId, type);
      res.json({
        success: true,
        data: templates,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch certificate templates',
      });
    }
  };

  static generateCertificate = async (req: Request, res: Response): Promise<void> => {
    try {
      const parsed = GenerateCertificateSchema.parse(req.body);
      const issuedByUserId = req.user?.userId || 'system';

      const certificate = await documentService.generateCertificate(parsed, issuedByUserId);

      res.status(201).json({
        success: true,
        message: 'Certificate generated successfully',
        data: certificate,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to generate certificate',
      });
    }
  };

  static getIssuedCertificates = async (req: Request, res: Response): Promise<void> => {
    try {
      const schoolId = (req.query.schoolId as string) || (req.headers['x-school-id'] as string) || req.user?.schoolId;
      const studentId = req.query.studentId as string | undefined;

      if (!schoolId) {
        res.status(400).json({ success: false, error: 'School ID is required' });
        return;
      }

      const certificates = await documentService.getIssuedCertificates(schoolId, studentId);
      res.json({
        success: true,
        data: certificates,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch issued certificates',
      });
    }
  };

  static getIssuedCertificateById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const certificate = await documentService.getIssuedCertificateById(id);

      if (!certificate) {
        res.status(404).json({ success: false, error: 'Issued certificate not found' });
        return;
      }

      res.json({
        success: true,
        data: certificate,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch certificate detail',
      });
    }
  };
}
