import { Router } from 'express';
import { InventoryController } from './inventory.controller.js';
import { authenticateJwt } from '../../common/middleware/auth.middleware.js';

export const inventoryRouter = Router();

// Apply JWT Authentication Guard
inventoryRouter.use(authenticateJwt);

// Categories
inventoryRouter.get('/categories', InventoryController.getCategories);
inventoryRouter.post('/categories', InventoryController.createCategory);

// Items Master
inventoryRouter.get('/items', InventoryController.getItems);
inventoryRouter.post('/items', InventoryController.createItem);

// Stock Transactions (IN, OUT, ADJUSTMENT)
inventoryRouter.post('/stock-transactions', InventoryController.recordStockTransaction);

// Suppliers
inventoryRouter.get('/suppliers', InventoryController.getSuppliers);
inventoryRouter.post('/suppliers', InventoryController.createSupplier);

// Purchase Orders
inventoryRouter.get('/purchase-orders', InventoryController.getPurchaseOrders);
inventoryRouter.post('/purchase-orders', InventoryController.createPurchaseOrder);
