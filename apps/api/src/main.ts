import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './common/utils/logger.js';

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(`🚀 Enterprise School ERP API Server running on port ${env.PORT} [${env.NODE_ENV}]`);
  logger.info(`📍 Base API endpoint: http://localhost:${env.PORT}${env.API_PREFIX}`);
  logger.info(`🏥 Health Check endpoint: http://localhost:${env.PORT}${env.API_PREFIX}/health/liveness`);
});

// Graceful Shutdown Handler
function shutdown(signal: string) {
  logger.info(`Received ${signal}. Shutting down HTTP server gracefully...`);
  server.close(() => {
    logger.info('HTTP server closed cleanly. Process terminating.');
    process.exit(0);
  });

  setTimeout(() => {
    logger.error('Forced shutdown due to timeout.');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
