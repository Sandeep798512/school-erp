import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';
import { sendError } from '../utils/response.util.js';

export function errorHandlerMiddleware(
  err: Error & { status?: number; code?: string },
  _req: Request,
  res: Response,
  _next: NextFunction
): Response {
  logger.error('Unhandled Application Error', {
    error: err.message,
    stack: err.stack,
    code: err.code
  });

  const statusCode = err.status || 500;
  const message = statusCode === 500 ? 'An unexpected internal server error occurred.' : err.message;

  return sendError(
    res,
    statusCode,
    'Internal Server Error',
    message,
    'https://errors.schoolerp.com/INTERNAL_ERROR'
  );
}
