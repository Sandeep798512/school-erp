import { prisma } from '../../common/prisma/prisma.service.js';
import { PasswordUtil } from '../../common/utils/password.util.js';
import { TokenUtil } from '../../common/utils/token.util.js';
import { LoginDto, UserRole } from '@school-erp/shared';

export class AuthService {
  public static async login(dto: LoginDto, clientIp?: string, userAgent?: string) {
    const user = await prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!user || user.status !== 'ACTIVE') {
      throw new Error('INVALID_CREDENTIALS');
    }

    const isPasswordValid = await PasswordUtil.comparePassword(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('INVALID_CREDENTIALS');
    }

    // Extract roles and permissions
    const roles = user.userRoles.map((ur) => ur.role.name as UserRole);
    const permissionSet = new Set<string>();

    for (const ur of user.userRoles) {
      for (const rp of ur.role.rolePermissions) {
        permissionSet.add(rp.permission.key);
      }
    }

    const permissions = Array.from(permissionSet);

    // Create Session Record
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const session = await prisma.userSession.create({
      data: {
        userId: user.id,
        sessionToken: `sess_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`,
        ipAddress: clientIp,
        userAgent: userAgent,
        expiresAt
      }
    });

    // Update last login timestamp
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    // Generate Tokens
    const accessToken = TokenUtil.generateAccessToken({
      userId: user.id,
      email: user.email,
      organizationId: user.organizationId,
      schoolId: user.schoolId,
      roles,
      permissions,
      sessionId: session.id
    });

    const refreshToken = TokenUtil.generateRefreshToken({
      userId: user.id,
      sessionId: session.id
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        organizationId: user.organizationId,
        schoolId: user.schoolId,
        roles,
        permissions
      },
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: 900 // 15 minutes
      }
    };
  }

  public static async refreshToken(refreshToken: string) {
    const payload = TokenUtil.verifyRefreshToken(refreshToken);

    const session = await prisma.userSession.findUnique({
      where: { id: payload.sessionId }
    });

    if (!session || session.revokedAt || session.expiresAt < new Date()) {
      throw new Error('INVALID_SESSION');
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!user || user.status !== 'ACTIVE') {
      throw new Error('USER_INACTIVE');
    }

    const roles = user.userRoles.map((ur) => ur.role.name as UserRole);
    const permissionSet = new Set<string>();

    for (const ur of user.userRoles) {
      for (const rp of ur.role.rolePermissions) {
        permissionSet.add(rp.permission.key);
      }
    }

    const newAccessToken = TokenUtil.generateAccessToken({
      userId: user.id,
      email: user.email,
      organizationId: user.organizationId,
      schoolId: user.schoolId,
      roles,
      permissions: Array.from(permissionSet),
      sessionId: session.id
    });

    return {
      accessToken: newAccessToken,
      expiresIn: 900
    };
  }

  public static async logout(sessionId: string) {
    await prisma.userSession.update({
      where: { id: sessionId },
      data: { revokedAt: new Date() }
    });
  }

  public static async logoutAll(userId: string) {
    await prisma.userSession.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() }
    });
  }
}
