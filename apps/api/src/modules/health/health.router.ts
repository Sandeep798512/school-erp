import { Router } from 'express';
import { HealthController } from './health.controller.js';

export const healthRouter = Router();

healthRouter.get('/liveness', HealthController.getLiveness);
healthRouter.get('/readiness', HealthController.getReadiness);
