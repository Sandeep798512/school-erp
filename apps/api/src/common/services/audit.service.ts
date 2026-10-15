import { prisma } from '../prisma/prisma.service.js';

export interface AuditLogDto {
  organizationId: string;
  schoolId: string;
  actorUserId: string;
  action: string;
  entityName: string;
  entityId: string;
  oldValues?: any;
  newValues?: any;
  ipAddress?: string;
  userAgent?: string;
}

export class AuditService {
  static async log(dto: AuditLogDto) {
    try {
      return await prisma.auditLog.create({
        data: {
          organizationId: dto.organizationId,
          schoolId: dto.schoolId,
          actorUserId: dto.actorUserId,
          action: dto.action,
          entityName: dto.entityName,
          entityId: dto.entityId,
          oldValues: dto.oldValues ? JSON.stringify(dto.oldValues) : null,
          newValues: dto.newValues ? JSON.stringify(dto.newValues) : null,
          ipAddress: dto.ipAddress,
          userAgent: dto.userAgent,
        },
      });
    } catch (error) {
      console.error('Failed to write audit log:', error);
      return null;
    }
  }

  static async getLogs(schoolId: string, actorUserId?: string, limit = 50) {
    const where: any = { schoolId };
    if (actorUserId) where.actorUserId = actorUserId;

    return prisma.auditLog.findMany({
      where,
      include: {
        actor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
