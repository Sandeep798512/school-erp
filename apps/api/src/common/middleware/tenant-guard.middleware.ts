import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.util.js';
import { UserRole } from '@school-erp/shared';

export function ensureTenantAccess(
  paramSchoolIdKey = 'schoolId',
  paramOrgIdKey = 'organizationId'
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 401, 'Unauthorized', 'Authentication required', 'https://errors.schoolerp.com/UNAUTHORIZED');
      return;
    }

    // SUPER_ADMIN has cross-tenant operational override
    if (req.user.roles.includes(UserRole.SUPER_ADMIN)) {
      next();
      return;
    }

    const requestedSchoolId = req.params[paramSchoolIdKey] || req.query[paramSchoolIdKey] || req.body[paramSchoolIdKey];
    const requestedOrgId = req.params[paramOrgIdKey] || req.query[paramOrgIdKey] || req.body[paramOrgIdKey];

    if (requestedSchoolId && requestedSchoolId !== req.user.schoolId) {
      sendError(
        res,
        403,
        'Forbidden',
        'Cross-tenant data access violation: You are not authorized to access School data outside your assigned context.',
        'https://errors.schoolerp.com/TENANT_LEAK_PREVENTED'
      );
      return;
    }

    if (requestedOrgId && requestedOrgId !== req.user.organizationId) {
      sendError(
        res,
        403,
        'Forbidden',
        'Cross-tenant data access violation: You are not authorized to access Organization data outside your assigned context.',
        'https://errors.schoolerp.com/TENANT_LEAK_PREVENTED'
      );
      return;
    }

    next();
  };
}
