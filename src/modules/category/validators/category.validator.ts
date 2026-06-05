import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../../../core/errors/AppError';

export function validateCreateCategory(req: Request, _res: Response, next: NextFunction) {
  const { name } = req.body || {};

  if (!name) {
    return next(new AppError('Name is required', 400));
  }

  return next();
}

export function validateUpdateCategory(req: Request, _res: Response, next: NextFunction) {
  const { name, description, isActive } = req.body || {};

  if (name === undefined && description === undefined && isActive === undefined) {
    return next(new AppError('At least one field is required', 400));
  }

  return next();
}
