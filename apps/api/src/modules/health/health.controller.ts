import { Request, Response } from 'express';
import { sendSuccess } from '../../common/utils/response.util.js';

export class HealthController {
  public static getLiveness(_req: Request, res: Response): Response {
    return sendSuccess(res, {
      status: 'UP',
      component: 'school-erp-api',
      uptimeSeconds: process.uptime(),
      timestamp: new Date().toISOString()
    });
  }

  public static getReadiness(_req: Request, res: Response): Response {
    // Basic readiness check (PostgreSQL and Redis connectivity will be wired in Phase 2)
    return sendSuccess(res, {
      status: 'READY',
      checks: {
        database: 'PENDING_MIGRATION',
        redis: 'PENDING_CONNECTION'
      },
      timestamp: new Date().toISOString()
    });
  }
}
