import {
  CreateCertificateTemplateDto,
  GenerateCertificateDto,
  CertificateType,
} from '@school-erp/shared';
import { prisma } from '../../common/prisma/prisma.service.js';

export class DocumentService {
  async createTemplate(dto: CreateCertificateTemplateDto) {
    return prisma.certificateTemplate.create({
      data: {
        organizationId: dto.organizationId,
        schoolId: dto.schoolId,
        name: dto.name,
        type: dto.type,
        headerText: dto.headerText,
        bodyTemplate: dto.bodyTemplate,
        footerText: dto.footerText,
      },
    });
  }

  async getTemplates(schoolId: string, type?: CertificateType) {
    const where: any = { schoolId, isActive: true };
    if (type) where.type = type;

    return prisma.certificateTemplate.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async generateCertificate(dto: GenerateCertificateDto, issuedByUserId: string) {
    const template = await prisma.certificateTemplate.findUnique({
      where: { id: dto.templateId },
    });

    if (!template) {
      throw new Error('Certificate template not found');
    }

    const student = await prisma.student.findUnique({
      where: { id: dto.studentId },
      include: {
        user: true,
        enrollments: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: {
            class: true,
            section: true,
          },
        },
      },
    });

    if (!student) {
      throw new Error('Student not found');
    }

    const activeEnrollment = student.enrollments[0];
    const studentName = `${student.user.firstName} ${student.user.lastName}`;
    const className = activeEnrollment?.class?.name || 'N/A';
    const sectionName = activeEnrollment?.section?.name || 'N/A';

    let interpolatedContent = template.bodyTemplate
      .replace(/\{\{studentName\}\}/g, studentName)
      .replace(/\{\{admissionNumber\}\}/g, student.admissionNumber)
      .replace(/\{\{rollNumber\}\}/g, student.rollNumber || 'N/A')
      .replace(/\{\{dob\}\}/g, new Date(student.dob).toISOString().split('T')[0])
      .replace(/\{\{gender\}\}/g, student.gender)
      .replace(/\{\{class\}\}/g, className)
      .replace(/\{\{section\}\}/g, sectionName);

    if (dto.customFields) {
      for (const [key, value] of Object.entries(dto.customFields)) {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        interpolatedContent = interpolatedContent.replace(regex, value);
      }
    }

    const existingNo = await prisma.issuedCertificate.findUnique({
      where: { certificateNo: dto.certificateNo },
    });

    if (existingNo) {
      throw new Error(`Certificate number '${dto.certificateNo}' already exists`);
    }

    return prisma.issuedCertificate.create({
      data: {
        organizationId: dto.organizationId,
        schoolId: dto.schoolId,
        templateId: dto.templateId,
        studentId: dto.studentId,
        certificateNo: dto.certificateNo,
        content: interpolatedContent,
        issuedByUserId,
      },
      include: {
        student: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        template: true,
      },
    });
  }

  async getIssuedCertificates(schoolId: string, studentId?: string) {
    const where: any = { schoolId };
    if (studentId) where.studentId = studentId;

    return prisma.issuedCertificate.findMany({
      where,
      include: {
        student: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        template: true,
      },
      orderBy: { issuedDate: 'desc' },
    });
  }

  async getIssuedCertificateById(id: string) {
    return prisma.issuedCertificate.findUnique({
      where: { id },
      include: {
        student: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        template: true,
      },
    });
  }
}
