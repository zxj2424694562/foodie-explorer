import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error('[Error]', err.message);
  res.status(500).json({
    ok: false,
    error: err.message || 'Internal server error',
    code: 'INTERNAL_ERROR',
  });
}
