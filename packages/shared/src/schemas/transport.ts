import { z } from 'zod';

export const CreateRouteSchema = z.object({
  schoolId: z.string().uuid({ message: 'Valid School ID is required' }),
  routeName: z.string().min(2, { message: 'Route name is required' }),
  startPoint: z.string().min(2, { message: 'Start point is required' }),
  endPoint: z.string().min(2, { message: 'End point is required' }),
  fare: z.number().positive({ message: 'Route fare must be positive' })
});

export type CreateRouteDto = z.infer<typeof CreateRouteSchema>;

export const CreateVehicleSchema = z.object({
  schoolId: z.string().uuid({ message: 'Valid School ID is required' }),
  registrationNumber: z.string().min(2, { message: 'Registration number is required' }),
  capacity: z.number().int().positive({ message: 'Seating capacity must be at least 1' }),
  driverName: z.string().min(2, { message: 'Driver name is required' }),
  driverPhone: z.string().min(5, { message: 'Driver phone number is required' })
});

export type CreateVehicleDto = z.infer<typeof CreateVehicleSchema>;

export const AssignStudentTransportSchema = z.object({
  schoolId: z.string().uuid({ message: 'Valid School ID is required' }),
  studentId: z.string().uuid({ message: 'Valid Student ID is required' }),
  routeId: z.string().uuid({ message: 'Valid Route ID is required' }),
  vehicleId: z.string().uuid({ message: 'Valid Vehicle ID is required' }),
  pickupPoint: z.string().optional()
});

export type AssignStudentTransportDto = z.infer<typeof AssignStudentTransportSchema>;
