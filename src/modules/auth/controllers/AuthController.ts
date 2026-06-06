import type { NextFunction, Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { successResponse } from '../../../core/utils/response';

export class AuthController {
  authService: AuthService;

  constructor(authService = new AuthService()) {
    this.authService = authService;
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, role } = req.body;
      const result = await this.authService.register(email, password, role);
      return successResponse(res, result, 'User registered', 201);
    } catch (error) {
      return next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);
      return successResponse(res, result, 'Login successful');
    } catch (error) {
      return next(error);
    }
  }
}
