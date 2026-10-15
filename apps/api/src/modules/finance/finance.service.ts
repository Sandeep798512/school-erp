import { prisma } from '../../common/prisma/prisma.service.js';
import { Prisma } from '@prisma/client';
import {
  CreateFeeCategoryDto,
  CreateFeeStructureDto,
  GenerateBulkInvoicesDto,
  CollectPaymentDto,
  RefundPaymentDto,
  WebhookPaymentDto
} from '@school-erp/shared';

export class FinanceService {
  // --- Fee Categories ---
  public static async createFeeCategory(dto: CreateFeeCategoryDto) {
    return prisma.feeCategory.create({
      data: {
        schoolId: dto.schoolId,
        name: dto.name,
        description: dto.description
      }
    });
  }

  public static async getFeeCategories(schoolId: string) {
    return prisma.feeCategory.findMany({
      where: { schoolId },
      orderBy: { name: 'asc' }
    });
  }

  // --- Fee Structures ---
  public static async createFeeStructure(dto: CreateFeeStructureDto) {
    return prisma.$transaction(async (tx) => {
      const structure = await tx.feeStructure.create({
        data: {
          schoolId: dto.schoolId,
          academicYearId: dto.academicYearId,
          classId: dto.classId,
          name: dto.name,
          dueDate: new Date(dto.dueDate)
        }
      });

      await tx.feeComponent.createMany({
        data: dto.components.map((c) => ({
          feeStructureId: structure.id,
          feeCategoryId: c.feeCategoryId,
          name: c.name,
          amount: new Prisma.Decimal(c.amount),
          isOptional: c.isOptional
        }))
      });

      return tx.feeStructure.findUnique({
        where: { id: structure.id },
        include: { feeComponents: true }
      });
    });
  }

  public static async getFeeStructures(schoolId: string, classId?: string) {
    return prisma.feeStructure.findMany({
      where: {
        schoolId,
        ...(classId ? { classId } : {})
      },
      include: {
        class: { select: { name: true, code: true } },
        feeComponents: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // --- Transactional Bulk Invoice Generator ---
  public static async generateBulkInvoices(dto: GenerateBulkInvoicesDto) {
    const feeStructure = await prisma.feeStructure.findUnique({
      where: { id: dto.feeStructureId },
      include: { feeComponents: true }
    });

    if (!feeStructure) throw new Error('FEE_STRUCTURE_NOT_FOUND');

    const totalAmount = feeStructure.feeComponents.reduce(
      (sum, c) => sum.add(c.amount),
      new Prisma.Decimal(0)
    );

    // Fetch enrolled active students
    const enrollments = await prisma.studentEnrollment.findMany({
      where: {
        schoolId: dto.schoolId,
        academicYearId: dto.academicYearId,
        classId: dto.classId,
        ...(dto.sectionId ? { sectionId: dto.sectionId } : {}),
        student: { status: 'ACTIVE' }
      }
    });

    return prisma.$transaction(async (tx) => {
      const createdInvoices = [];

      for (const enr of enrollments) {
        const invoiceNumber = `INV-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

        const invoice = await tx.invoice.create({
          data: {
            organizationId: dto.organizationId,
            schoolId: dto.schoolId,
            academicYearId: dto.academicYearId,
            studentId: enr.studentId,
            invoiceNumber,
            dueDate: feeStructure.dueDate,
            totalAmount,
            discountAmount: new Prisma.Decimal(0),
            paidAmount: new Prisma.Decimal(0),
            balanceAmount: totalAmount,
            status: 'UNPAID',
            invoiceItems: {
              create: feeStructure.feeComponents.map((c) => ({
                feeComponentId: c.id,
                description: c.name,
                amount: c.amount
              }))
            }
          }
        });

        createdInvoices.push(invoice);
      }

      return {
        totalGenerated: createdInvoices.length,
        totalBilled: totalAmount.mul(createdInvoices.length).toString()
      };
    });
  }

  // --- Invoices Directory ---
  public static async getInvoices(params: {
    schoolId: string;
    studentId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const page = params.page || 1;
    const limit = Math.min(params.limit || 20, 100);
    const skip = (page - 1) * limit;

    const whereClause: any = {
      schoolId: params.schoolId,
      ...(params.studentId ? { studentId: params.studentId } : {}),
      ...(params.status ? { status: params.status as any } : {})
    };

    const [totalItems, invoices] = await Promise.all([
      prisma.invoice.count({ where: whereClause }),
      prisma.invoice.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          student: {
            include: {
              user: { select: { firstName: true, lastName: true, email: true } }
            }
          },
          invoiceItems: true,
          payments: true
        },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    return {
      invoices,
      meta: { page, limit, totalItems, totalPages: Math.ceil(totalItems / limit) }
    };
  }

  // --- Idempotent Payment Collection ---
  public static async collectPayment(dto: CollectPaymentDto, collectedByUserId: string, idempotencyKey?: string) {
    const paymentAmount = new Prisma.Decimal(dto.amount);
    const ik = idempotencyKey || dto.transactionId || `ik_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // 1. Check idempotency record
    const existingPayment = await prisma.payment.findUnique({
      where: { idempotencyKey: ik }
    });

    if (existingPayment) {
      return existingPayment;
    }

    return prisma.$transaction(async (tx) => {
      // 2. Fetch invoice inside serializable transaction
      const invoice = await tx.invoice.findUnique({
        where: { id: dto.invoiceId }
      });

      if (!invoice) throw new Error('INVOICE_NOT_FOUND');

      const receiptNumber = `RCP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

      // 3. Record Payment Receipt
      const payment = await tx.payment.create({
        data: {
          organizationId: dto.organizationId,
          schoolId: dto.schoolId,
          invoiceId: dto.invoiceId,
          studentId: dto.studentId,
          receiptNumber,
          amount: paymentAmount,
          paymentMode: dto.paymentMode,
          transactionId: dto.transactionId,
          status: 'SUCCESS',
          idempotencyKey: ik,
          collectedByUserId
        }
      });

      // 4. Recalculate Invoice balance and status
      const newPaidAmount = invoice.paidAmount.add(paymentAmount);
      const newBalance = invoice.totalAmount.sub(invoice.discountAmount).sub(newPaidAmount);

      let newStatus: any = 'PARTIAL';
      if (newBalance.lte(0)) {
        newStatus = 'PAID';
      }

      await tx.invoice.update({
        where: { id: dto.invoiceId },
        data: {
          paidAmount: newPaidAmount,
          balanceAmount: newBalance.lt(0) ? new Prisma.Decimal(0) : newBalance,
          status: newStatus
        }
      });

      return payment;
    });
  }

  // --- Payment Gateway Webhook Handler ---
  public static async processWebhookPayment(dto: WebhookPaymentDto) {
    const existing = await prisma.payment.findUnique({
      where: { idempotencyKey: dto.idempotencyKey }
    });

    if (existing) {
      return { status: 'ALREADY_PROCESSED', paymentId: existing.id };
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id: dto.invoiceId }
    });

    if (!invoice) throw new Error('INVOICE_NOT_FOUND');

    return this.collectPayment(
      {
        organizationId: invoice.organizationId,
        schoolId: invoice.schoolId,
        invoiceId: invoice.id,
        studentId: invoice.studentId,
        amount: dto.amount,
        paymentMode: 'ONLINE',
        transactionId: dto.transactionId
      },
      invoice.studentId,
      dto.idempotencyKey
    );
  }

  // --- Audited Refunds ---
  public static async processRefund(dto: RefundPaymentDto, processedByUserId: string) {
    const refundAmount = new Prisma.Decimal(dto.amount);

    return prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({
        where: { id: dto.paymentId },
        include: { invoice: true }
      });

      if (!payment || payment.status === 'REFUNDED') {
        throw new Error('INVALID_PAYMENT_FOR_REFUND');
      }

      const refundNumber = `RFD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const refund = await tx.refund.create({
        data: {
          organizationId: dto.organizationId,
          schoolId: dto.schoolId,
          paymentId: dto.paymentId,
          refundNumber,
          amount: refundAmount,
          reason: dto.reason,
          processedByUserId
        }
      });

      await tx.payment.update({
        where: { id: dto.paymentId },
        data: { status: 'REFUNDED' }
      });

      // Adjust Invoice ledger balance
      const newPaid = payment.invoice.paidAmount.sub(refundAmount);
      const newBalance = payment.invoice.totalAmount.sub(payment.invoice.discountAmount).sub(newPaid);

      await tx.invoice.update({
        where: { id: payment.invoiceId },
        data: {
          paidAmount: newPaid.lt(0) ? new Prisma.Decimal(0) : newPaid,
          balanceAmount: newBalance,
          status: newBalance.gte(payment.invoice.totalAmount) ? 'UNPAID' : 'PARTIAL'
        }
      });

      return refund;
    });
  }
}
