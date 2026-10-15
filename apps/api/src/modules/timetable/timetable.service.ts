import { prisma } from '../../common/prisma/prisma.service.js';
import { PeriodSlot, TimetableAllocation } from '@prisma/client';
import {
  CreatePeriodSlotDto,
  CreateTimetableDto,
  CreateTimetableAllocationDto,
  BulkCreateAllocationsDto,
  CheckConflictDto,
  DayOfWeek
} from '@school-erp/shared';

export class TimetableService {
  // 1. Period Slots
  static async createPeriodSlot(dto: CreatePeriodSlotDto) {
    const existing = await prisma.periodSlot.findFirst({
      where: {
        schoolId: dto.schoolId,
        orderIndex: dto.orderIndex
      }
    });

    if (existing) {
      throw new Error(`Period slot with order index ${dto.orderIndex} already exists.`);
    }

    return prisma.periodSlot.create({
      data: {
        organizationId: dto.organizationId,
        schoolId: dto.schoolId,
        name: dto.name,
        startTime: dto.startTime,
        endTime: dto.endTime,
        slotType: dto.slotType,
        orderIndex: dto.orderIndex
      }
    });
  }

  static async getPeriodSlots(schoolId: string) {
    return prisma.periodSlot.findMany({
      where: { schoolId },
      orderBy: { orderIndex: 'asc' }
    });
  }

  // 2. Timetables
  static async createTimetable(dto: CreateTimetableDto) {
    return prisma.timetable.create({
      data: {
        organizationId: dto.organizationId,
        schoolId: dto.schoolId,
        academicYearId: dto.academicYearId,
        classId: dto.classId,
        sectionId: dto.sectionId,
        name: dto.name,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        isDefault: dto.isDefault
      },
      include: {
        class: true,
        section: true,
        academicYear: true
      }
    });
  }

  static async getTimetables(schoolId: string, classId?: string, sectionId?: string) {
    const where: any = { schoolId };
    if (classId) where.classId = classId;
    if (sectionId) where.sectionId = sectionId;

    return prisma.timetable.findMany({
      where,
      include: {
        class: true,
        section: true,
        allocations: {
          include: {
            subject: true,
            teacher: { include: { user: true } },
            periodSlot: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // 3. Automated Conflict Checker Engine
  static async checkConflict(dto: CheckConflictDto): Promise<{ hasConflict: boolean; conflicts: string[] }> {
    const conflicts: string[] = [];

    // A. Teacher double-booking check
    if (dto.teacherId) {
      const teacherConflict = await prisma.timetableAllocation.findFirst({
        where: {
          schoolId: dto.schoolId,
          dayOfWeek: dto.dayOfWeek as DayOfWeek,
          periodSlotId: dto.periodSlotId,
          teacherId: dto.teacherId,
          timetableId: dto.excludeTimetableId ? { not: dto.excludeTimetableId } : undefined
        },
        include: {
          timetable: { include: { class: true, section: true } },
          periodSlot: true
        }
      });

      if (teacherConflict) {
        conflicts.push(
          `Teacher is already assigned to ${teacherConflict.timetable.class.name} - ${teacherConflict.timetable.section.name} during period '${teacherConflict.periodSlot.name}' on ${dto.dayOfWeek}.`
        );
      }
    }

    // B. Room double-booking check
    if (dto.roomNumber) {
      const roomConflict = await prisma.timetableAllocation.findFirst({
        where: {
          schoolId: dto.schoolId,
          dayOfWeek: dto.dayOfWeek as DayOfWeek,
          periodSlotId: dto.periodSlotId,
          roomNumber: dto.roomNumber,
          timetableId: dto.excludeTimetableId ? { not: dto.excludeTimetableId } : undefined
        },
        include: {
          timetable: { include: { class: true, section: true } },
          periodSlot: true
        }
      });

      if (roomConflict) {
        conflicts.push(
          `Room ${dto.roomNumber} is already occupied by ${roomConflict.timetable.class.name} - ${roomConflict.timetable.section.name} during period '${roomConflict.periodSlot.name}' on ${dto.dayOfWeek}.`
        );
      }
    }

    return {
      hasConflict: conflicts.length > 0,
      conflicts
    };
  }

  // 4. Single Allocation
  static async createAllocation(dto: CreateTimetableAllocationDto) {
    const conflictResult = await TimetableService.checkConflict({
      schoolId: dto.schoolId,
      dayOfWeek: dto.dayOfWeek,
      periodSlotId: dto.periodSlotId,
      teacherId: dto.teacherId,
      roomNumber: dto.roomNumber,
      excludeTimetableId: dto.timetableId
    });

    if (conflictResult.hasConflict) {
      throw new Error(`Conflict detected: ${conflictResult.conflicts.join(' | ')}`);
    }

    return prisma.timetableAllocation.upsert({
      where: {
        timetableId_dayOfWeek_periodSlotId: {
          timetableId: dto.timetableId,
          dayOfWeek: dto.dayOfWeek as DayOfWeek,
          periodSlotId: dto.periodSlotId
        }
      },
      create: {
        organizationId: dto.organizationId,
        schoolId: dto.schoolId,
        timetableId: dto.timetableId,
        dayOfWeek: dto.dayOfWeek as DayOfWeek,
        periodSlotId: dto.periodSlotId,
        subjectId: dto.subjectId,
        teacherId: dto.teacherId,
        roomNumber: dto.roomNumber
      },
      update: {
        subjectId: dto.subjectId,
        teacherId: dto.teacherId,
        roomNumber: dto.roomNumber
      },
      include: {
        subject: true,
        teacher: { include: { user: true } },
        periodSlot: true
      }
    });
  }

  // 5. Bulk Allocations
  static async bulkCreateAllocations(dto: BulkCreateAllocationsDto) {
    return prisma.$transaction(async (tx: any) => {
      // Pre-validate all allocations in bulk
      for (const item of dto.allocations) {
        const conflictResult = await TimetableService.checkConflict({
          schoolId: dto.schoolId,
          dayOfWeek: item.dayOfWeek,
          periodSlotId: item.periodSlotId,
          teacherId: item.teacherId,
          roomNumber: item.roomNumber,
          excludeTimetableId: dto.timetableId
        });

        if (conflictResult.hasConflict) {
          throw new Error(`Bulk allocation failed: ${conflictResult.conflicts.join(' | ')}`);
        }
      }

      // Delete existing allocations for timetable
      await tx.timetableAllocation.deleteMany({
        where: { timetableId: dto.timetableId }
      });

      // Insert new allocations
      const records = dto.allocations.map((alloc) => ({
        organizationId: dto.organizationId,
        schoolId: dto.schoolId,
        timetableId: dto.timetableId,
        dayOfWeek: alloc.dayOfWeek as DayOfWeek,
        periodSlotId: alloc.periodSlotId,
        subjectId: alloc.subjectId,
        teacherId: alloc.teacherId ?? null,
        roomNumber: alloc.roomNumber ?? null
      }));

      await tx.timetableAllocation.createMany({
        data: records
      });

      return tx.timetableAllocation.findMany({
        where: { timetableId: dto.timetableId },
        include: {
          subject: true,
          teacher: { include: { user: true } },
          periodSlot: true
        }
      });
    });
  }

  // 6. Weekly Class Timetable Grid
  static async getWeeklyClassTimetable(schoolId: string, classId: string, sectionId: string) {
    const timetable = await prisma.timetable.findFirst({
      where: { schoolId, classId, sectionId, isDefault: true },
      include: {
        class: true,
        section: true
      }
    });

    if (!timetable) {
      throw new Error(`No active timetable found for the requested Class and Section.`);
    }

    const periodSlots = await prisma.periodSlot.findMany({
      where: { schoolId },
      orderBy: { orderIndex: 'asc' }
    });

    const allocations = await prisma.timetableAllocation.findMany({
      where: { timetableId: timetable.id },
      include: {
        subject: true,
        teacher: { include: { user: true } },
        periodSlot: true
      }
    });

    const days: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const grid: Record<string, any[]> = {};

    for (const day of days) {
      grid[day] = periodSlots.map((slot: PeriodSlot) => {
        const alloc = allocations.find((a: TimetableAllocation) => a.dayOfWeek === day && a.periodSlotId === slot.id);
        return {
          slot,
          allocation: alloc ?? null
        };
      });
    }

    return {
      timetable,
      periodSlots,
      weeklyGrid: grid
    };
  }

  // 7. Teacher Weekly Schedule
  static async getTeacherSchedule(schoolId: string, teacherId: string) {
    const teacher = await prisma.teacher.findFirst({
      where: { schoolId, id: teacherId },
      include: { user: true }
    });

    if (!teacher) {
      throw new Error(`Teacher profile not found.`);
    }

    const allocations = await prisma.timetableAllocation.findMany({
      where: { schoolId, teacherId },
      include: {
        timetable: {
          include: { class: true, section: true }
        },
        periodSlot: true,
        subject: true
      },
      orderBy: [{ dayOfWeek: 'asc' }, { periodSlot: { orderIndex: 'asc' } }]
    });

    return {
      teacher,
      allocations
    };
  }
}
