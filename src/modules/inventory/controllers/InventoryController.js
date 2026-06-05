const { successResponse } = require('../../../core/utils/response');
const { InventoryService } = require('../services/InventoryService');

class InventoryController {
  constructor(inventoryService = new InventoryService()) {
    this.inventoryService = inventoryService;
  }

  async listProducts(_req, res, next) {
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

  async getProduct(req, res, next) {
    try {
      const product = await this.inventoryService.getProductById(req.params.id);
      return successResponse(res, product, 'Product retrieved');
    } catch (error) {
      return next(error);
    }
  }

  async createProduct(req, res, next) {
    try {
      const product = await this.inventoryService.createProduct(req.body || {}, req.user);
      return successResponse(res, product, 'Product created', 201);
    } catch (error) {
      return next(error);
    }
  }

  async updateProduct(req, res, next) {
    try {
      const product = await this.inventoryService.updateProduct(req.params.id, req.body || {}, req.user);
      return successResponse(res, product, 'Product updated');
    } catch (error) {
      return next(error);
    }
  }

  async adjustStock(req, res, next) {
    try {
      const result = await this.inventoryService.adjustStock(req.params.id, req.body || {}, req.user);
      return successResponse(res, result, 'Stock updated');
    } catch (error) {
      return next(error);
    }
  }

  async listHistory(req, res, next) {
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

  async listLowStockAlerts(_req, res, next) {
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

  async listLogs(req, res, next) {
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

  async dailyReport(req, res, next) {
    try {
      const report = await this.inventoryService.getDailyReport(req.query || {});
      return successResponse(res, report, 'Daily inventory report retrieved');
    } catch (error) {
      return next(error);
    }
  }
}

module.exports.InventoryController = InventoryController;
