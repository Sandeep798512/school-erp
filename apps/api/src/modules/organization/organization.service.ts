import { prisma } from '../../common/prisma/prisma.service.js';
import {
  CreateOrganizationDto,
  CreateSchoolDto,
  CreateCampusDto,
  CreateAcademicYearDto
} from '@school-erp/shared';

export class OrganizationService {
  // --- Organizations ---
  public static async createOrganization(dto: CreateOrganizationDto) {
    return prisma.organization.create({
      data: {
        name: dto.name,
        code: dto.code,
        logoUrl: dto.logoUrl,
        address: dto.address
      }
    });
  }

  public static async getOrganizations() {
    return prisma.organization.findMany({
      include: {
        _count: {
          select: { schools: true, users: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  public static async getOrganizationById(id: string) {
    return prisma.organization.findUnique({
      where: { id },
      include: {
        schools: true
      }
    });
  }

  // --- Schools ---
  public static async createSchool(dto: CreateSchoolDto) {
    return prisma.school.create({
      data: {
        organizationId: dto.organizationId,
        name: dto.name,
        code: dto.code,
        logoUrl: dto.logoUrl,
        address: dto.address,
        phone: dto.phone,
        email: dto.email,
        website: dto.website
      }
    });
  }

  public static async getSchools(organizationId: string) {
    return prisma.school.findMany({
      where: { organizationId },
      include: {
        campuses: true,
        academicYears: {
          where: { isCurrent: true }
        },
        _count: {
          select: { students: true, teachers: true, staff: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  public static async getSchoolById(id: string) {
    return prisma.school.findUnique({
      where: { id },
      include: {
        campuses: true,
        academicYears: true,
        systemSettings: true
      }
    });
  }

  // --- Campuses ---
  public static async createCampus(dto: CreateCampusDto) {
    return prisma.campus.create({
      data: {
        schoolId: dto.schoolId,
        name: dto.name,
        code: dto.code,
        address: dto.address,
        isMain: dto.isMain
      }
    });
  }

  public static async getCampuses(schoolId: string) {
    return prisma.campus.findMany({
      where: { schoolId },
      orderBy: { isMain: 'desc' }
    });
  }

  // --- Academic Years ---
  public static async createAcademicYear(dto: CreateAcademicYearDto) {
    if (dto.isCurrent) {
      // Unset previous current year
      await prisma.academicYear.updateMany({
        where: { schoolId: dto.schoolId, isCurrent: true },
        data: { isCurrent: false }
      });
    }

    return prisma.academicYear.create({
      data: {
        schoolId: dto.schoolId,
        name: dto.name,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        isCurrent: dto.isCurrent
      }
    });
  }

  public static async getAcademicYears(schoolId: string) {
    return prisma.academicYear.findMany({
      where: { schoolId },
      orderBy: { startDate: 'desc' }
    });
  }

  // --- Settings ---
  public static async getSystemSettings(schoolId: string) {
    return prisma.systemSetting.findMany({
      where: { schoolId }
    });
  }

  public static async updateSystemSetting(schoolId: string, key: string, value: string, description?: string) {
    return prisma.systemSetting.upsert({
      where: { schoolId_key: { schoolId, key } },
      update: { value, description },
      create: { schoolId, key, value, description }
    });
  }
}
