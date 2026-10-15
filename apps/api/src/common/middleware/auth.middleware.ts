import { Request, Response, NextFunction } from 'express';
import { TokenUtil, JwtAccessTokenPayload } from '../utils/token.util.js';
import { prisma } from '../prisma/prisma.service.js';
import { sendError } from '../utils/response.util.js';
import { UserRole } from '@school-erp/shared';

declare global {
  namespace Express {
    interface Request {
      user?: JwtAccessTokenPayload;
    }
  }
}

export async function authenticateJwt(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : req.cookies?.accessToken;

  if (!token) {
    sendError(res, 401, 'Unauthorized', 'Authentication token missing', 'https://errors.schoolerp.com/UNAUTHORIZED');
    return;
  }

  try {
    const payload = TokenUtil.verifyAccessToken(token);

    // Verify Session is active in UserSession table
    const session = await prisma.userSession.findUnique({
      where: { id: payload.sessionId }
    });

    if (!session || session.revokedAt || session.expiresAt < new Date()) {
      sendError(res, 401, 'Unauthorized', 'Session has been revoked or expired', 'https://errors.schoolerp.com/SESSION_EXPIRED');
      return;
    }

    req.user = payload;
    req.tenant = {
      organizationId: payload.organizationId,
      schoolId: payload.schoolId,
      campusId: payload.campusId
    };

    next();
  } catch (err) {
    sendError(res, 401, 'Unauthorized', 'Invalid or expired access token', 'https://errors.schoolerp.com/INVALID_TOKEN');
  }
}

export function requirePermissions(...requiredPermissions: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 401, 'Unauthorized', 'Authentication required', 'https://errors.schoolerp.com/UNAUTHORIZED');
      return;
    }

    // SUPER_ADMIN has global override
    if (req.user.roles.includes(UserRole.SUPER_ADMIN)) {
      next();
      return;
    }

    const hasPermission = requiredPermissions.every((perm) =>
      req.user?.permissions.includes(perm)
    );

    if (!hasPermission) {
      sendError(
        res,
        403,
        'Forbidden',
        `Insufficient permissions. Required: [${requiredPermissions.join(', ')}]`,
        'https://errors.schoolerp.com/FORBIDDEN'
      );
      return;
    }

    next();
  };
}

export function requireRoles(...requiredRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 401, 'Unauthorized', 'Authentication required', 'https://errors.schoolerp.com/UNAUTHORIZED');
      return;
    }

    const hasRole = requiredRoles.some((role) => req.user?.roles.includes(role));

    if (!hasRole) {
      sendError(
        res,
        403,
        'Forbidden',
        `Access denied. Requires one of roles: [${requiredRoles.join(', ')}]`,
        'https://errors.schoolerp.com/FORBIDDEN'
      );
      return;
    }

    next();
  };
}
