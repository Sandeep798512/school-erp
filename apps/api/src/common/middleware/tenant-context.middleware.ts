import { Request, Response, NextFunction } from 'express';

export interface TenantContext {
  organizationId?: string;
  schoolId?: string;
  campusId?: string;
}

declare global {
  namespace Express {
    interface Request {
      tenant?: TenantContext;
    }
  }
}

export function tenantContextMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const organizationId = req.headers['x-organization-id'] as string;
  const schoolId = req.headers['x-school-id'] as string;
  const campusId = req.headers['x-campus-id'] as string;

  req.tenant = {
    organizationId,
    schoolId,
    campusId
  };

  next();
}
