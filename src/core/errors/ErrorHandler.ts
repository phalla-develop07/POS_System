import type { NextFunction, Request, Response } from 'express';

export function errorHandler(err: Error & { statusCode?: number }, _req: Request, res: Response, _next: NextFunction) {
  if (err && typeof err.statusCode === 'number') {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    message: 'Internal Server Error'
  });
}
