import type { NextFunction, Response } from 'express';

export class BaseController {
  sendSuccess<T>(res: Response, data: T, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  sendError(next: NextFunction, error: Error) {
    return next(error);
  }
}
