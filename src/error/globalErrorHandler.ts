import { Request, Response, NextFunction } from 'express';

export function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: err,
  });
}
