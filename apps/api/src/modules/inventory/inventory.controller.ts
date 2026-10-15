import { Request, Response } from 'express';
import { InventoryService } from './inventory.service.js';
import {
  CreateInventoryCategorySchema,
  CreateInventoryItemSchema,
  StockTransactionSchema,
  CreateSupplierSchema,
  CreatePurchaseOrderSchema,
  PurchaseOrderStatus,
} from '@school-erp/shared';

const inventoryService = new InventoryService();

export class InventoryController {
  static createCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const parsed = CreateInventoryCategorySchema.parse(req.body);
      const category = await inventoryService.createCategory(parsed);

      res.status(201).json({
        success: true,
        message: 'Inventory category created successfully',
        data: category,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to create inventory category',
      });
    }
  };

  static getCategories = async (req: Request, res: Response): Promise<void> => {
    try {
      const schoolId = (req.query.schoolId as string) || (req.headers['x-school-id'] as string) || req.user?.schoolId;

      if (!schoolId) {
        res.status(400).json({ success: false, error: 'School ID is required' });
        return;
      }

      const categories = await inventoryService.getCategories(schoolId);
      res.json({
        success: true,
        data: categories,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch inventory categories',
      });
    }
  };

  static createItem = async (req: Request, res: Response): Promise<void> => {
    try {
      const parsed = CreateInventoryItemSchema.parse(req.body);
      const item = await inventoryService.createItem(parsed);

      res.status(201).json({
        success: true,
        message: 'Inventory item created successfully',
        data: item,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to create inventory item',
      });
    }
  };

  static getItems = async (req: Request, res: Response): Promise<void> => {
    try {
      const schoolId = (req.query.schoolId as string) || (req.headers['x-school-id'] as string) || req.user?.schoolId;
      const categoryId = req.query.categoryId as string | undefined;

      if (!schoolId) {
        res.status(400).json({ success: false, error: 'School ID is required' });
        return;
      }

      const items = await inventoryService.getItems(schoolId, categoryId);
      res.json({
        success: true,
        data: items,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch inventory items',
      });
    }
  };

  static recordStockTransaction = async (req: Request, res: Response): Promise<void> => {
    try {
      const parsed = StockTransactionSchema.parse(req.body);
      const result = await inventoryService.recordStockTransaction(parsed);

      res.status(201).json({
        success: true,
        message: 'Stock transaction recorded successfully',
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to record stock transaction',
      });
    }
  };

  static createSupplier = async (req: Request, res: Response): Promise<void> => {
    try {
      const parsed = CreateSupplierSchema.parse(req.body);
      const supplier = await inventoryService.createSupplier(parsed);

      res.status(201).json({
        success: true,
        message: 'Supplier registered successfully',
        data: supplier,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to register supplier',
      });
    }
  };

  static getSuppliers = async (req: Request, res: Response): Promise<void> => {
    try {
      const schoolId = (req.query.schoolId as string) || (req.headers['x-school-id'] as string) || req.user?.schoolId;

      if (!schoolId) {
        res.status(400).json({ success: false, error: 'School ID is required' });
        return;
      }

      const suppliers = await inventoryService.getSuppliers(schoolId);
      res.json({
        success: true,
        data: suppliers,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch suppliers',
      });
    }
  };

  static createPurchaseOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const parsed = CreatePurchaseOrderSchema.parse(req.body);
      const order = await inventoryService.createPurchaseOrder(parsed);

      res.status(201).json({
        success: true,
        message: 'Purchase order created successfully',
        data: order,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to create purchase order',
      });
    }
  };

  static getPurchaseOrders = async (req: Request, res: Response): Promise<void> => {
    try {
      const schoolId = (req.query.schoolId as string) || (req.headers['x-school-id'] as string) || req.user?.schoolId;
      const status = req.query.status as PurchaseOrderStatus | undefined;

      if (!schoolId) {
        res.status(400).json({ success: false, error: 'School ID is required' });
        return;
      }

      const orders = await inventoryService.getPurchaseOrders(schoolId, status);
      res.json({
        success: true,
        data: orders,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch purchase orders',
      });
    }
  };
}
