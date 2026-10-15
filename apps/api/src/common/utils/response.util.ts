import { Response } from 'express';
import { ApiResponse, ApiResponseMeta, ApiErrorResponse } from '@school-erp/shared';

export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode = 200,
  meta?: ApiResponseMeta
): Response {
  const correlationId = (res.req.headers['x-correlation-id'] as string) || `req-${Date.now()}`;
  const payload: ApiResponse<T> = {
    success: true,
    data,
    meta,
    timestamp: new Date().toISOString(),
    correlationId
  };
  return res.status(statusCode).json(payload);
}

export function sendError(
  res: Response,
  statusCode: number,
  title: string,
  detail: string,
  type = 'https://errors.schoolerp.com/GENERAL_ERROR',
  errors?: Record<string, string[]>
): Response {
  const correlationId = (res.req.headers['x-correlation-id'] as string) || `req-${Date.now()}`;
  const payload: ApiErrorResponse = {
    type,
    title,
    status: statusCode,
    detail,
    instance: res.req.originalUrl || res.req.url,
    correlationId,
    errors
  };
  return res.status(statusCode).json(payload);
}
