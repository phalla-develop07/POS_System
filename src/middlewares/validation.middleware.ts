import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../core/errors/AppError';

export function validateBody(requiredFields: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const missing = requiredFields.filter((field) => req.body?.[field] === undefined || req.body?.[field] === '');

    if (missing.length > 0) {
      return next(new AppError(`Missing fields: ${missing.join(', ')}`, 400));
    }

    return next();
  };
}
