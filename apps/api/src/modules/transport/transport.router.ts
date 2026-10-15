import { Router } from 'express';
import { TransportController } from './transport.controller.js';
import { authenticateJwt } from '../../common/middleware/auth.middleware.js';

export const transportRouter = Router();

// Apply JWT Authentication Guard
transportRouter.use(authenticateJwt);

// Routes & Fares
transportRouter.get('/routes', TransportController.getRoutes);
transportRouter.post('/routes', TransportController.createRoute);

// Fleet Vehicles
transportRouter.get('/vehicles', TransportController.getVehicles);
transportRouter.post('/vehicles', TransportController.createVehicle);

// Student Allocations
transportRouter.get('/allocations', TransportController.getStudentTransports);
transportRouter.post('/allocations', TransportController.assignStudentTransport);
