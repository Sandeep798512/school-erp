import { CreateSalaryStructureDto, GeneratePayrollDto, ProcessPayslipDto } from '@school-erp/shared';
import { prisma } from '../../common/prisma/prisma.service.js';

export class HrService {
  async createSalaryStructure(dto: CreateSalaryStructureDto) {
    const netSalary = dto.basicPay + (dto.hra || 0) + (dto.allowances || 0) - (dto.deductions || 0);

    const existing = await prisma.salaryStructure.findUnique({
      where: {
        schoolId_userId: {
          schoolId: dto.schoolId,
          userId: dto.userId,
        },
      },
    });

    if (existing) {
      return prisma.salaryStructure.update({
        where: { id: existing.id },
        data: {
          basicPay: dto.basicPay,
          hra: dto.hra || 0,
          allowances: dto.allowances || 0,
          deductions: dto.deductions || 0,
          netSalary,
          effectiveDate: dto.effectiveDate ? new Date(dto.effectiveDate) : new Date(),
        },
      });
    }

    return prisma.salaryStructure.create({
      data: {
        organizationId: dto.organizationId,
        schoolId: dto.schoolId,
        userId: dto.userId,
        basicPay: dto.basicPay,
        hra: dto.hra || 0,
        allowances: dto.allowances || 0,
        deductions: dto.deductions || 0,
        netSalary,
        effectiveDate: dto.effectiveDate ? new Date(dto.effectiveDate) : new Date(),
      },
    });
  }

  async getSalaryStructures(schoolId: string) {
    return prisma.salaryStructure.findMany({
      where: { schoolId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            userRoles: {
              include: {
                role: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async generateMonthlyPayroll(dto: GeneratePayrollDto) {
    const structures = await prisma.salaryStructure.findMany({
      where: {
        schoolId: dto.schoolId,
        organizationId: dto.organizationId,
      },
    });

    const generatedPayslips = [];

    for (const structure of structures) {
      const basicPay = Number(structure.basicPay);
      const hra = Number(structure.hra);
      const allowances = Number(structure.allowances);
      const deductions = Number(structure.deductions);
      const grossSalary = basicPay + hra + allowances;
      const netSalary = grossSalary - deductions;

      const existingPayslip = await prisma.payslip.findFirst({
        where: {
          schoolId: dto.schoolId,
          userId: structure.userId,
          month: dto.month,
          year: dto.year,
        },
      });

      if (existingPayslip) {
        const updated = await prisma.payslip.update({
          where: { id: existingPayslip.id },
          data: {
            basicPay,
            hra,
            allowances,
            deductions,
            grossSalary,
            netSalary,
            status: 'PROCESSED',
          },
        });
        generatedPayslips.push(updated);
      } else {
        const created = await prisma.payslip.create({
          data: {
            organizationId: dto.organizationId,
            schoolId: dto.schoolId,
            userId: structure.userId,
            month: dto.month,
            year: dto.year,
            basicPay,
            hra,
            allowances,
            deductions,
            grossSalary,
            netSalary,
            status: 'PROCESSED',
          },
        });
        generatedPayslips.push(created);
      }
    }

    return {
      message: `Generated ${generatedPayslips.length} payslips for ${dto.month}/${dto.year}`,
      payslips: generatedPayslips,
    };
  }

  async getPayslips(schoolId: string, month?: number, year?: number, userId?: string) {
    const where: any = { schoolId };
    if (month) where.month = month;
    if (year) where.year = year;
    if (userId) where.userId = userId;

    return prisma.payslip.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            userRoles: {
              include: {
                role: true,
              },
            },
          },
        },
      },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });
  }

  async processPayslip(dto: ProcessPayslipDto) {
    return prisma.payslip.update({
      where: { id: dto.payslipId },
      data: {
        status: dto.status,
        paymentMethod: dto.paymentMethod,
        paymentDate: dto.paymentDate ? new Date(dto.paymentDate) : new Date(),
        remarks: dto.remarks,
      },
    });
  }
}
