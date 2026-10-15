import { Request, Response } from 'express';
import { TransportService } from './transport.service.js';
import {
  CreateRouteSchema,
  CreateVehicleSchema,
  AssignStudentTransportSchema
} from '@school-erp/shared';

export class TransportController {
  static createRoute = async (req: Request, res: Response): Promise<void> => {
    try {
      const parsed = CreateRouteSchema.parse(req.body);
      const route = await TransportService.createRoute(parsed);

      res.status(201).json({
        success: true,
        message: 'Transport route created successfully',
        data: route
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to create transport route'
      });
    }
  };

  static getRoutes = async (req: Request, res: Response): Promise<void> => {
    try {
      const schoolId = (req.query.schoolId as string) || (req.headers['x-school-id'] as string) || req.user?.schoolId;

      if (!schoolId) {
        res.status(400).json({ success: false, error: 'School ID is required' });
        return;
      }

      const routes = await TransportService.getRoutes(schoolId);
      res.json({
        success: true,
        data: routes
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch transport routes'
      });
    }
  };

  static createVehicle = async (req: Request, res: Response): Promise<void> => {
    try {
      const parsed = CreateVehicleSchema.parse(req.body);
      const vehicle = await TransportService.createVehicle(parsed);

      res.status(201).json({
        success: true,
        message: 'Vehicle registered successfully',
        data: vehicle
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to register vehicle'
      });
    }
  };

  static getVehicles = async (req: Request, res: Response): Promise<void> => {
    try {
      const schoolId = (req.query.schoolId as string) || (req.headers['x-school-id'] as string) || req.user?.schoolId;

      if (!schoolId) {
        res.status(400).json({ success: false, error: 'School ID is required' });
        return;
      }

      const vehicles = await TransportService.getVehicles(schoolId);
      res.json({
        success: true,
        data: vehicles
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch fleet vehicles'
      });
    }
  };

  static assignStudentTransport = async (req: Request, res: Response): Promise<void> => {
    try {
      const parsed = AssignStudentTransportSchema.parse(req.body);
      const allocation = await TransportService.assignStudentTransport(parsed);

      res.status(201).json({
        success: true,
        message: 'Student transport assigned successfully',
        data: allocation
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to assign student transport'
      });
    }
  };

  static getStudentTransports = async (req: Request, res: Response): Promise<void> => {
    try {
      const schoolId = (req.query.schoolId as string) || (req.headers['x-school-id'] as string) || req.user?.schoolId;
      const routeId = req.query.routeId as string | undefined;
      const vehicleId = req.query.vehicleId as string | undefined;

      if (!schoolId) {
        res.status(400).json({ success: false, error: 'School ID is required' });
        return;
      }

      const allocations = await TransportService.getStudentTransports(schoolId, routeId, vehicleId);
      res.json({
        success: true,
        data: allocations
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch student transport allocations'
      });
    }
  };
}
