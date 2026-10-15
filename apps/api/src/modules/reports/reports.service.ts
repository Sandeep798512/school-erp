import { prisma } from '../../common/prisma/prisma.service.js';

export class ReportsService {
  async getFinanceSummary(schoolId: string, startDate?: string, endDate?: string) {
    const dateFilter: any = {};
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) dateFilter.lte = new Date(endDate);

    const invoiceWhere: any = { schoolId };
    const paymentWhere: any = { schoolId, status: 'SUCCESS' };
    const refundWhere: any = { schoolId, status: 'PROCESSED' };

    if (startDate || endDate) {
      invoiceWhere.createdAt = dateFilter;
      paymentWhere.createdAt = dateFilter;
      refundWhere.createdAt = dateFilter;
    }

    const invoicesAggregate = await prisma.invoice.aggregate({
      where: invoiceWhere,
      _sum: { totalAmount: true, paidAmount: true, balanceAmount: true },
      _count: { _all: true },
    });

    const paymentsAggregate = await prisma.payment.aggregate({
      where: paymentWhere,
      _sum: { amount: true },
      _count: { _all: true },
    });

    const refundsAggregate = await prisma.refund.aggregate({
      where: refundWhere,
      _sum: { amount: true },
      _count: { _all: true },
    });

    const paymentModes = await prisma.payment.groupBy({
      by: ['paymentMode'],
      where: paymentWhere,
      _sum: { amount: true },
      _count: { _all: true },
    });

    const totalBilled = Number(invoicesAggregate._sum?.totalAmount || 0);
    const totalCollected = Number(paymentsAggregate._sum?.amount || 0);
    const totalRefunded = Number(refundsAggregate._sum?.amount || 0);
    const netRevenue = totalCollected - totalRefunded;
    const totalOutstanding = Number(invoicesAggregate._sum?.balanceAmount || 0);
    const collectionEfficiency = totalBilled > 0 ? Number(((totalCollected / totalBilled) * 100).toFixed(2)) : 0;

    return {
      overview: {
        totalBilled,
        totalCollected,
        totalRefunded,
        netRevenue,
        totalOutstanding,
        collectionEfficiencyPercentage: collectionEfficiency,
        totalInvoicesCount: invoicesAggregate._count?._all || 0,
        totalPaymentsCount: paymentsAggregate._count?._all || 0,
        totalRefundsCount: refundsAggregate._count?._all || 0,
      },
      paymentModeBreakdown: paymentModes.map((item) => ({
        mode: item.paymentMode,
        amount: Number(item._sum?.amount || 0),
        count: item._count?._all || 0,
      })),
    };
  }

  async getAttendanceAnalytics(schoolId: string, classId?: string, startDate?: string, endDate?: string) {
    const where: any = { schoolId };
    if (classId) {
      where.session = { classId };
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const totalRecords = await prisma.attendanceRecord.count({ where });

    const statusCounts = await prisma.attendanceRecord.groupBy({
      by: ['status'],
      where,
      _count: { _all: true },
    });

    const breakdown: Record<string, number> = {
      PRESENT: 0,
      ABSENT: 0,
      LATE: 0,
      HALF_DAY: 0,
    };

    statusCounts.forEach((item) => {
      breakdown[item.status] = item._count?._all || 0;
    });

    const presentCount = breakdown.PRESENT + breakdown.LATE;
    const overallRate = totalRecords > 0 ? Number(((presentCount / totalRecords) * 100).toFixed(2)) : 0;

    const sessionAttendance = await prisma.attendanceRecord.findMany({
      where: { schoolId },
      include: {
        session: {
          select: {
            classId: true,
          },
        },
      },
    });

    const classSummaryMap: Record<string, { total: number; present: number }> = {};
    sessionAttendance.forEach((item) => {
      const cid = item.session.classId;
      if (!classSummaryMap[cid]) {
        classSummaryMap[cid] = { total: 0, present: 0 };
      }
      classSummaryMap[cid].total += 1;
      if (item.status === 'PRESENT' || item.status === 'LATE') {
        classSummaryMap[cid].present += 1;
      }
    });

    const classBreakdown = Object.entries(classSummaryMap).map(([cid, data]) => ({
      classId: cid,
      totalRecords: data.total,
      presentCount: data.present,
      attendancePercentage: data.total > 0 ? Number(((data.present / data.total) * 100).toFixed(2)) : 0,
    }));

    return {
      summary: {
        totalRecords,
        overallAttendancePercentage: overallRate,
        breakdown,
      },
      classBreakdown,
    };
  }

  async getAcademicPerformance(schoolId: string, examId?: string, classId?: string) {
    const where: any = { schoolId };
    if (examId) where.examSchedule = { examId };
    if (classId) {
      where.examSchedule = { ...where.examSchedule, classId };
    }

    const totalMarks = await prisma.studentMark.count({ where });

    const gradeDistribution = await prisma.studentMark.groupBy({
      by: ['grade'],
      where,
      _count: { _all: true },
    });

    const marksList = await prisma.studentMark.findMany({
      where,
      select: {
        marksObtained: true,
        isAbsent: true,
        examSchedule: {
          select: {
            maxMarks: true,
            passMarks: true,
          },
        },
      },
    });

    let passedCount = 0;
    let failedCount = 0;
    let absentCount = 0;
    let totalPercentageSum = 0;

    marksList.forEach((mark) => {
      if (mark.isAbsent) {
        absentCount++;
      } else {
        const obtained = Number(mark.marksObtained || 0);
        const max = Number(mark.examSchedule.maxMarks);
        const pass = Number(mark.examSchedule.passMarks);

        if (obtained >= pass) {
          passedCount++;
        } else {
          failedCount++;
        }

        if (max > 0) {
          totalPercentageSum += (obtained / max) * 100;
        }
      }
    });

    const evaluatedCount = marksList.length - absentCount;
    const averagePercentage = evaluatedCount > 0 ? Number((totalPercentageSum / evaluatedCount).toFixed(2)) : 0;
    const passPercentage = evaluatedCount > 0 ? Number(((passedCount / evaluatedCount) * 100).toFixed(2)) : 0;

    return {
      summary: {
        totalMarksEntered: totalMarks,
        evaluatedCount,
        absentCount,
        passedCount,
        failedCount,
        passPercentage,
        averagePercentage,
      },
      gradeDistribution: gradeDistribution.map((g) => ({
        grade: g.grade || 'N/A',
        count: g._count?._all || 0,
      })),
    };
  }
}
