import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

export function requestLoggerMiddleware(req: Request, res: Response, next: NextFunction): void {
  const correlationId = (req.headers['x-correlation-id'] as string) || `req-${Math.random().toString(36).substring(2, 9)}`;
  req.headers['x-correlation-id'] = correlationId;
  res.setHeader('X-Correlation-ID', correlationId);

  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`[${req.method}] ${req.originalUrl} - ${res.statusCode} (${duration}ms)`, {
      correlationId,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      durationMs: duration
    });
  });

  next();
}
