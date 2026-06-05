import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../../../core/errors/AppError';

export function validateLogin(req: Request, _res: Response, next: NextFunction) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return next(new AppError('Email and password are required', 400));
  }

  return next();
}

export function validateRegister(req: Request, _res: Response, next: NextFunction) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return next(new AppError('Email and password are required', 400));
  }

  return next();
}
