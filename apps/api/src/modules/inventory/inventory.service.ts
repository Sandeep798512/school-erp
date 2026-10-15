import {
  CreateInventoryCategoryDto,
  CreateInventoryItemDto,
  StockTransactionDto,
  CreateSupplierDto,
  CreatePurchaseOrderDto,
  PurchaseOrderStatus,
} from '@school-erp/shared';
import { prisma } from '../../common/prisma/prisma.service.js';

export class InventoryService {
  async createCategory(dto: CreateInventoryCategoryDto) {
    return prisma.inventoryCategory.create({
      data: {
        organizationId: dto.organizationId,
        schoolId: dto.schoolId,
        name: dto.name,
        description: dto.description,
      },
    });
  }

  async getCategories(schoolId: string) {
    return prisma.inventoryCategory.findMany({
      where: { schoolId },
      include: {
        _count: {
          select: { items: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async createItem(dto: CreateInventoryItemDto) {
    return prisma.inventoryItem.create({
      data: {
        organizationId: dto.organizationId,
        schoolId: dto.schoolId,
        categoryId: dto.categoryId,
        name: dto.name,
        sku: dto.sku,
        unit: dto.unit,
        quantity: dto.quantity,
        minReorderLevel: dto.minReorderLevel,
        unitPrice: dto.unitPrice,
      },
      include: {
        category: true,
      },
    });
  }

  async getItems(schoolId: string, categoryId?: string) {
    const where: any = { schoolId };
    if (categoryId) where.categoryId = categoryId;

    return prisma.inventoryItem.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async recordStockTransaction(dto: StockTransactionDto) {
    return prisma.$transaction(async (tx) => {
      const item = await tx.inventoryItem.findUnique({
        where: { id: dto.itemId },
      });

      if (!item) {
        throw new Error('Inventory item not found');
      }

      if (dto.type === 'OUT' && item.quantity < dto.quantity) {
        throw new Error(`Insufficient stock. Current stock: ${item.quantity}, Requested: ${dto.quantity}`);
      }

      let newQuantity = item.quantity;
      if (dto.type === 'IN') {
        newQuantity += dto.quantity;
      } else if (dto.type === 'OUT') {
        newQuantity -= dto.quantity;
      } else if (dto.type === 'ADJUSTMENT') {
        newQuantity = dto.quantity;
      }

      await tx.inventoryItem.update({
        where: { id: item.id },
        data: { quantity: newQuantity },
      });

      const transaction = await tx.stockTransaction.create({
        data: {
          organizationId: dto.organizationId,
          schoolId: dto.schoolId,
          itemId: dto.itemId,
          type: dto.type,
          quantity: dto.quantity,
          reference: dto.reference,
          remarks: dto.remarks,
        },
        include: {
          item: true,
        },
      });

      return {
        transaction,
        updatedQuantity: newQuantity,
      };
    });
  }

  async createSupplier(dto: CreateSupplierDto) {
    return prisma.supplier.create({
      data: {
        organizationId: dto.organizationId,
        schoolId: dto.schoolId,
        name: dto.name,
        contactPerson: dto.contactPerson,
        email: dto.email,
        phone: dto.phone,
        address: dto.address,
        taxId: dto.taxId,
      },
    });
  }

  async getSuppliers(schoolId: string) {
    return prisma.supplier.findMany({
      where: { schoolId },
      orderBy: { name: 'asc' },
    });
  }

  async createPurchaseOrder(dto: CreatePurchaseOrderDto) {
    return prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      const orderItems = dto.items.map((item) => {
        const itemTotal = item.quantity * item.unitPrice;
        totalAmount += itemTotal;
        return {
          itemId: item.itemId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: itemTotal,
        };
      });

      return tx.purchaseOrder.create({
        data: {
          organizationId: dto.organizationId,
          schoolId: dto.schoolId,
          supplierId: dto.supplierId,
          orderNumber: dto.orderNumber,
          status: 'DRAFT',
          totalAmount,
          expectedDate: dto.expectedDate ? new Date(dto.expectedDate) : null,
          items: {
            create: orderItems,
          },
        },
        include: {
          supplier: true,
          items: {
            include: {
              item: true,
            },
          },
        },
      });
    });
  }

  async getPurchaseOrders(schoolId: string, status?: PurchaseOrderStatus) {
    const where: any = { schoolId };
    if (status) where.status = status;

    return prisma.purchaseOrder.findMany({
      where,
      include: {
        supplier: true,
        items: {
          include: {
            item: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
