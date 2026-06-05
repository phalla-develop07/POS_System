import type { NextFunction, Request, Response } from 'express';
import { SaleService } from '../services/SaleService';
import { successResponse } from '../../../core/utils/response';

export class SaleController {
  saleService: SaleService;

  constructor(saleService = new SaleService()) {
    this.saleService = saleService;
  }

  async search(req: Request, res: Response, next: NextFunction) {
    try {
      const query = String(req.query.q || '').trim();
      const products = await this.saleService.searchProducts(query);
      return successResponse(res, products, 'Products retrieved for sale');
    } catch (error) {
      return next(error);
    }
  }

  async checkout(req: Request, res: Response, next: NextFunction) {
    try {
      const receipt = await this.saleService.checkout(req.body);
      return successResponse(res, receipt, 'Sale completed successfully', 201);
    } catch (error) {
      return next(error);
    }
  }
}
