import type { Response } from 'express';

export function successResponse<T>(res: Response, data: T, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
}

export function errorResponse(res: Response, message = 'Error', statusCode = 500) {
  return res.status(statusCode).json({
    success: false,
    message
  });
}
