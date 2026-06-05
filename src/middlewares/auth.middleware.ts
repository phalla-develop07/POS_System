import jwt from 'jsonwebtoken';
import type { NextFunction, Request, Response } from 'express';
import { jwtConfig } from '../config/jwt';
import { AppError } from '../core/errors/AppError';
import type { AuthUserPayload } from '../types/express';

export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const header = req.get('authorization');

  if (!header) {
    return next(new AppError('Unauthorized', 401));
  }

  const [scheme, token] = header.trim().split(/\s+/);

  if (!scheme || scheme.toLowerCase() !== 'bearer' || !token) {
    return next(new AppError('Unauthorized', 401));
  }

  try {
    const payload = jwt.verify(token, jwtConfig.secret) as AuthUserPayload;
    req.user = payload;
    return next();
  } catch {
    return next(new AppError('Invalid or expired token', 401));
  }
}
