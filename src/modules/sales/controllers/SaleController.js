const { SaleService } = require('../services/SaleService');
const { successResponse } = require('../../../core/utils/response');

class SaleController {
  constructor(saleService = new SaleService()) {
    this.saleService = saleService;
  }

  async search(req, res, next) {
    try {
      const query = String(req.query.q || '').trim();
      const products = await this.saleService.searchProducts(query);
      return successResponse(res, products, 'Products retrieved for sale');
    } catch (error) {
      return next(error);
    }
  }

  async checkout(req, res, next) {
    try {
      const receipt = await this.saleService.checkout(req.body);
      return successResponse(res, receipt, 'Sale completed successfully', 201);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports.SaleController = SaleController;
