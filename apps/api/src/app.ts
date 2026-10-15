import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { requestLoggerMiddleware } from './common/middleware/request-logger.middleware.js';
import { tenantContextMiddleware } from './common/middleware/tenant-context.middleware.js';
import { errorHandlerMiddleware } from './common/middleware/error-handler.middleware.js';
import { apiRouter } from './routes.js';

export function createApp(): Express {
  const app = express();

  // Security Middleware
  app.use(helmet());
  app.use(cors({
    origin: [env.WEB_APP_URL, 'http://localhost:3000', 'http://localhost:5173'],
    credentials: true
  }));

  // Body & Cookie Parsing
  app.use(cookieParser());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Request Context Middleware
  app.use(requestLoggerMiddleware);
  app.use(tenantContextMiddleware);

  // Mount API V1 Routes
  app.use(env.API_PREFIX, apiRouter);

  // Central Error Handler
  app.use(errorHandlerMiddleware);

  return app;
}
