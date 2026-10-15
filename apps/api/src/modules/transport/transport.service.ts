import { prisma } from '../../common/prisma/prisma.service.js';
import { Prisma } from '@prisma/client';
import {
  CreateRouteDto,
  CreateVehicleDto,
  AssignStudentTransportDto
} from '@school-erp/shared';

export class TransportService {
  // 1. Create Route & Fare
  static async createRoute(dto: CreateRouteDto) {
    return prisma.transportRoute.create({
      data: {
        schoolId: dto.schoolId,
        routeName: dto.routeName,
        startPoint: dto.startPoint,
        endPoint: dto.endPoint,
        fare: new Prisma.Decimal(dto.fare)
      }
    });
  }

  // 2. Query Routes
  static async getRoutes(schoolId: string) {
    return prisma.transportRoute.findMany({
      where: { schoolId },
      include: {
        _count: { select: { studentTransports: true } }
      },
      orderBy: { routeName: 'asc' }
    });
  }

  // 3. Register Vehicle & Driver
  static async createVehicle(dto: CreateVehicleDto) {
    const existing = await prisma.vehicle.findUnique({
      where: { registrationNumber: dto.registrationNumber }
    });

    if (existing) {
      throw new Error(`Vehicle with registration number ${dto.registrationNumber} already exists.`);
    }

    return prisma.vehicle.create({
      data: {
        schoolId: dto.schoolId,
        registrationNumber: dto.registrationNumber,
        capacity: dto.capacity,
        driverName: dto.driverName,
        driverPhone: dto.driverPhone
      }
    });
  }

  // 4. Query Vehicles
  static async getVehicles(schoolId: string) {
    return prisma.vehicle.findMany({
      where: { schoolId },
      include: {
        _count: { select: { studentTransports: true } }
      },
      orderBy: { registrationNumber: 'asc' }
    });
  }

  // 5. Assign Student Transport & Capacity Check
  static async assignStudentTransport(dto: AssignStudentTransportDto) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: dto.vehicleId }
    });

    if (!vehicle) {
      throw new Error(`Vehicle not found in fleet.`);
    }

    const route = await prisma.transportRoute.findUnique({
      where: { id: dto.routeId }
    });

    if (!route) {
      throw new Error(`Transport route not found.`);
    }

    // Capacity Check
    const currentAssignedCount = await prisma.studentTransport.count({
      where: { vehicleId: dto.vehicleId, studentId: { not: dto.studentId } }
    });

    if (currentAssignedCount >= vehicle.capacity) {
      throw new Error(
        `Vehicle ${vehicle.registrationNumber} has reached its maximum seating capacity of ${vehicle.capacity}.`
      );
    }

    return prisma.studentTransport.upsert({
      where: { studentId: dto.studentId },
      create: {
        schoolId: dto.schoolId,
        studentId: dto.studentId,
        routeId: dto.routeId,
        vehicleId: dto.vehicleId,
        pickupPoint: dto.pickupPoint ?? null
      },
      update: {
        routeId: dto.routeId,
        vehicleId: dto.vehicleId,
        pickupPoint: dto.pickupPoint ?? null
      },
      include: {
        student: { include: { user: true } },
        route: true,
        vehicle: true
      }
    });
  }

  // 6. Query Student Allocations
  static async getStudentTransports(schoolId: string, routeId?: string, vehicleId?: string) {
    const where: any = { schoolId };
    if (routeId) where.routeId = routeId;
    if (vehicleId) where.vehicleId = vehicleId;

    return prisma.studentTransport.findMany({
      where,
      include: {
        student: { include: { user: true } },
        route: true,
        vehicle: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}
