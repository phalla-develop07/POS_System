import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../core/errors/AppError';

export function roleMiddleware(...allowedRoles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Authentication required. Please login to access this resource.', 401));
    }

    if (!allowedRoles.includes(req.user.role || '')) {
      return next(new AppError('Access denied. You do not have permission to access this resource.', 403));
    }

    return next();
  };
}
