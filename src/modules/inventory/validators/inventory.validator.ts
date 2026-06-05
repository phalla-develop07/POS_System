import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../../../core/errors/AppError';

function parseInteger(value: unknown) {
  const parsedValue = Number(value);
  return Number.isInteger(parsedValue) ? parsedValue : null;
}

export function validateCreateProduct(req: Request, _res: Response, next: NextFunction) {
  const { name, sku, lowStockThreshold, initialStock } = req.body || {};

  if (!name || !sku) {
    return next(new AppError('Product name and SKU are required', 400));
  }

  if (lowStockThreshold !== undefined && (parseInteger(lowStockThreshold) === null || parseInteger(lowStockThreshold)! < 0)) {
    return next(new AppError('lowStockThreshold must be a non-negative integer', 400));
  }

  if (initialStock !== undefined && (parseInteger(initialStock) === null || parseInteger(initialStock)! < 0)) {
    return next(new AppError('initialStock must be a non-negative integer', 400));
  }

  return next();
}

export function validateUpdateProduct(req: Request, _res: Response, next: NextFunction) {
  const { name, sku, lowStockThreshold, isActive } = req.body || {};
  const hasUpdate = name !== undefined || sku !== undefined || lowStockThreshold !== undefined || isActive !== undefined;

  if (!hasUpdate) {
    return next(new AppError('At least one product field must be provided', 400));
  }

  if (lowStockThreshold !== undefined && (parseInteger(lowStockThreshold) === null || parseInteger(lowStockThreshold)! < 0)) {
    return next(new AppError('lowStockThreshold must be a non-negative integer', 400));
  }

  if (isActive !== undefined && typeof isActive !== 'boolean') {
    return next(new AppError('isActive must be a boolean', 400));
  }

  return next();
}

export function validateStockUpdate(req: Request, _res: Response, next: NextFunction) {
  const { movementType, quantity } = req.body || {};
  const normalizedMovementType = typeof movementType === 'string' ? movementType.trim().toUpperCase() : '';
  const parsedQuantity = parseInteger(quantity);

  if (!['IN', 'OUT'].includes(normalizedMovementType)) {
    return next(new AppError('movementType must be IN or OUT', 400));
  }

  if (parsedQuantity === null || parsedQuantity <= 0) {
    return next(new AppError('quantity must be a positive integer', 400));
  }

  return next();
}
