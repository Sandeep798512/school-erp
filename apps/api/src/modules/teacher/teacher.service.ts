import { prisma } from '../../common/prisma/prisma.service.js';
import { PasswordUtil } from '../../common/utils/password.util.js';
import {
  CreateTeacherDto,
  UpdateTeacherDto,
  CreateStaffDto,
  UserRole
} from '@school-erp/shared';

export class TeacherService {
  // --- Teachers ---
  public static async createTeacher(dto: CreateTeacherDto) {
    const defaultPasswordHash = await PasswordUtil.hashPassword('Teacher@12345');

    return prisma.$transaction(async (tx) => {
      // 1. Find TEACHER role
      const teacherRole = await tx.role.findFirst({
        where: { name: UserRole.TEACHER }
      });

      // 2. Create User account
      const user = await tx.user.create({
        data: {
          organizationId: dto.organizationId,
          schoolId: dto.schoolId,
          email: dto.email,
          passwordHash: defaultPasswordHash,
          firstName: dto.firstName,
          lastName: dto.lastName,
          phone: dto.phone,
          mustChangePassword: true,
          status: 'ACTIVE'
        }
      });

      if (teacherRole) {
        await tx.userRole.create({
          data: {
            userId: user.id,
            roleId: teacherRole.id
          }
        });
      }

      // 3. Create Teacher profile
      return tx.teacher.create({
        data: {
          organizationId: dto.organizationId,
          schoolId: dto.schoolId,
          userId: user.id,
          employeeCode: dto.employeeCode,
          qualification: dto.qualification,
          specialization: dto.specialization,
          joiningDate: new Date(dto.joiningDate)
        }
      });
    });
  }

  public static async getTeachers(params: { schoolId: string; search?: string; specialization?: string }) {
    const whereClause: any = {
      schoolId: params.schoolId
    };

    if (params.specialization) {
      whereClause.specialization = { contains: params.specialization, mode: 'insensitive' };
    }

    if (params.search) {
      whereClause.OR = [
        { employeeCode: { contains: params.search, mode: 'insensitive' } },
        { user: { firstName: { contains: params.search, mode: 'insensitive' } } },
        { user: { lastName: { contains: params.search, mode: 'insensitive' } } }
      ];
    }

    return prisma.teacher.findMany({
      where: whereClause,
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true, phone: true, avatarUrl: true }
        },
        classSubjects: {
          include: {
            class: { select: { name: true, code: true } },
            subject: { select: { name: true, code: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  public static async getTeacherById(id: string) {
    return prisma.teacher.findUnique({
      where: { id },
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true, phone: true, avatarUrl: true }
        },
        classSubjects: {
          include: {
            class: true,
            subject: true
          }
        }
      }
    });
  }

  public static async updateTeacher(id: string, dto: UpdateTeacherDto) {
    const teacher = await prisma.teacher.findUnique({ where: { id } });
    if (!teacher) throw new Error('TEACHER_NOT_FOUND');

    if (dto.firstName || dto.lastName || dto.email || dto.phone) {
      await prisma.user.update({
        where: { id: teacher.userId },
        data: {
          ...(dto.firstName ? { firstName: dto.firstName } : {}),
          ...(dto.lastName ? { lastName: dto.lastName } : {}),
          ...(dto.email ? { email: dto.email } : {}),
          ...(dto.phone ? { phone: dto.phone } : {})
        }
      });
    }

    return prisma.teacher.update({
      where: { id },
      data: {
        ...(dto.qualification ? { qualification: dto.qualification } : {}),
        ...(dto.specialization ? { specialization: dto.specialization } : {}),
        ...(dto.joiningDate ? { joiningDate: new Date(dto.joiningDate) } : {})
      }
    });
  }

  // --- Staff ---
  public static async createStaff(dto: CreateStaffDto) {
    const defaultPasswordHash = await PasswordUtil.hashPassword('Staff@12345');

    return prisma.$transaction(async (tx) => {
      const staffRole = await tx.role.findFirst({
        where: { name: UserRole.STAFF }
      });

      const user = await tx.user.create({
        data: {
          organizationId: dto.organizationId,
          schoolId: dto.schoolId,
          email: dto.email,
          passwordHash: defaultPasswordHash,
          firstName: dto.firstName,
          lastName: dto.lastName,
          phone: dto.phone,
          mustChangePassword: true,
          status: 'ACTIVE'
        }
      });

      if (staffRole) {
        await tx.userRole.create({
          data: {
            userId: user.id,
            roleId: staffRole.id
          }
        });
      }

      return tx.staff.create({
        data: {
          organizationId: dto.organizationId,
          schoolId: dto.schoolId,
          userId: user.id,
          employeeCode: dto.employeeCode,
          department: dto.department,
          designation: dto.designation,
          joiningDate: new Date(dto.joiningDate)
        }
      });
    });
  }

  public static async getStaff(params: { schoolId: string; department?: string; search?: string }) {
    const whereClause: any = {
      schoolId: params.schoolId
    };

    if (params.department) {
      whereClause.department = params.department;
    }

    if (params.search) {
      whereClause.OR = [
        { employeeCode: { contains: params.search, mode: 'insensitive' } },
        { user: { firstName: { contains: params.search, mode: 'insensitive' } } },
        { user: { lastName: { contains: params.search, mode: 'insensitive' } } }
      ];
    }

    return prisma.staff.findMany({
      where: whereClause,
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true, phone: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}
