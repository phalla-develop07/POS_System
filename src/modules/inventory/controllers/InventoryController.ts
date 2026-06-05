import type { NextFunction, Request, Response } from 'express';
import { successResponse } from '../../../core/utils/response';
import { InventoryService } from '../services/InventoryService';

export class InventoryController {
  inventoryService: InventoryService;

  constructor(inventoryService = new InventoryService()) {
    this.inventoryService = inventoryService;
  }

  async listProducts(_req: Request, res: Response, next: NextFunction) {
    try {
      const products = await this.inventoryService.listProducts();
      return successResponse(res, {
        items: products,
        count: products.length
      }, 'Products retrieved');
    } catch (error) {
      return next(error);
    }
  }

  async getProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await this.inventoryService.getProductById(req.params.id);
      return successResponse(res, product, 'Product retrieved');
    } catch (error) {
      return next(error);
    }
  }

  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await this.inventoryService.createProduct(req.body || {}, req.user);
      return successResponse(res, product, 'Product created', 201);
    } catch (error) {
      return next(error);
    }
  }

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await this.inventoryService.updateProduct(req.params.id, req.body || {}, req.user);
      return successResponse(res, product, 'Product updated');
    } catch (error) {
      return next(error);
    }
  }

  async adjustStock(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.inventoryService.adjustStock(req.params.id, req.body || {}, req.user);
      return successResponse(res, result, 'Stock updated');
    } catch (error) {
      return next(error);
    }
  }

  async listHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const transactions = await this.inventoryService.listHistory(req.query || {});
      return successResponse(res, {
        items: transactions,
        count: transactions.length
      }, 'Inventory history retrieved');
    } catch (error) {
      return next(error);
    }
  }

  async listLowStockAlerts(_req: Request, res: Response, next: NextFunction) {
    try {
      const products = await this.inventoryService.listLowStockAlerts();
      return successResponse(res, {
        items: products,
        count: products.length
      }, 'Low stock products retrieved');
    } catch (error) {
      return next(error);
    }
  }

  async listLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const logs = await this.inventoryService.listLogs(req.query || {});
      return successResponse(res, {
        items: logs,
        count: logs.length
      }, 'Inventory logs retrieved');
    } catch (error) {
      return next(error);
    }
  }
}
