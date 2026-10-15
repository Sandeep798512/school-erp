import { z } from 'zod';

export const StockTransactionTypeEnum = z.enum(['IN', 'OUT', 'ADJUSTMENT']);
export type StockTransactionType = z.infer<typeof StockTransactionTypeEnum>;

export const PurchaseOrderStatusEnum = z.enum(['DRAFT', 'ORDERED', 'RECEIVED', 'CANCELLED']);
export type PurchaseOrderStatus = z.infer<typeof PurchaseOrderStatusEnum>;

export const CreateInventoryCategorySchema = z.object({
  organizationId: z.string().uuid({ message: 'Valid Organization ID is required' }),
  schoolId: z.string().uuid({ message: 'Valid School ID is required' }),
  name: z.string().min(1, { message: 'Category name is required' }),
  description: z.string().optional(),
});

export type CreateInventoryCategoryDto = z.infer<typeof CreateInventoryCategorySchema>;

export const CreateInventoryItemSchema = z.object({
  organizationId: z.string().uuid({ message: 'Valid Organization ID is required' }),
  schoolId: z.string().uuid({ message: 'Valid School ID is required' }),
  categoryId: z.string().uuid({ message: 'Valid Category ID is required' }),
  name: z.string().min(1, { message: 'Item name is required' }),
  sku: z.string().min(1, { message: 'SKU code is required' }),
  unit: z.string().min(1, { message: 'Unit of measurement is required' }),
  quantity: z.number().int().min(0).default(0),
  minReorderLevel: z.number().int().min(0).default(10),
  unitPrice: z.number().positive({ message: 'Unit price must be positive' }),
});

export type CreateInventoryItemDto = z.infer<typeof CreateInventoryItemSchema>;

export const StockTransactionSchema = z.object({
  organizationId: z.string().uuid({ message: 'Valid Organization ID is required' }),
  schoolId: z.string().uuid({ message: 'Valid School ID is required' }),
  itemId: z.string().uuid({ message: 'Valid Item ID is required' }),
  type: StockTransactionTypeEnum,
  quantity: z.number().int().positive({ message: 'Quantity must be positive' }),
  reference: z.string().optional(),
  remarks: z.string().optional(),
});

export type StockTransactionDto = z.infer<typeof StockTransactionSchema>;

export const CreateSupplierSchema = z.object({
  organizationId: z.string().uuid({ message: 'Valid Organization ID is required' }),
  schoolId: z.string().uuid({ message: 'Valid School ID is required' }),
  name: z.string().min(1, { message: 'Supplier name is required' }),
  contactPerson: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  taxId: z.string().optional(),
});

export type CreateSupplierDto = z.infer<typeof CreateSupplierSchema>;

export const PurchaseOrderItemSchema = z.object({
  itemId: z.string().uuid({ message: 'Valid Item ID is required' }),
  quantity: z.number().int().positive({ message: 'Quantity must be positive' }),
  unitPrice: z.number().positive({ message: 'Unit price must be positive' }),
});

export const CreatePurchaseOrderSchema = z.object({
  organizationId: z.string().uuid({ message: 'Valid Organization ID is required' }),
  schoolId: z.string().uuid({ message: 'Valid School ID is required' }),
  supplierId: z.string().uuid({ message: 'Valid Supplier ID is required' }),
  orderNumber: z.string().min(1, { message: 'Order number is required' }),
  expectedDate: z.string().datetime().optional(),
  items: z.array(PurchaseOrderItemSchema).min(1, { message: 'At least one item is required' }),
});

export type CreatePurchaseOrderDto = z.infer<typeof CreatePurchaseOrderSchema>;
