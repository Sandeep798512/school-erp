import { Router } from 'express';
import { DocumentController } from './document.controller.js';
import { authenticateJwt } from '../../common/middleware/auth.middleware.js';

export const documentRouter = Router();

// Apply JWT Authentication Guard
documentRouter.use(authenticateJwt);

// Certificate Templates
documentRouter.get('/templates', DocumentController.getTemplates);
documentRouter.post('/templates', DocumentController.createTemplate);

// Certificate Generation & Retrieval
documentRouter.post('/generate', DocumentController.generateCertificate);
documentRouter.get('/issued', DocumentController.getIssuedCertificates);
documentRouter.get('/issued/:id', DocumentController.getIssuedCertificateById);
