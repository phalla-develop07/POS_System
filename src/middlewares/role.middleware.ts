import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../core/errors/AppError';

export function roleMiddleware(...allowedRoles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Unauthorized', 401));
    }

    if (!allowedRoles.includes(req.user.role || '')) {
      return next(new AppError('Forbidden', 403));
    }

    return next();
  };
}
