import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';

class PrismaService {
  private static instance: PrismaClient;

  public static getInstance(): PrismaClient {
    if (!PrismaService.instance) {
      PrismaService.instance = new PrismaClient({
        log: process.env.NODE_ENV === 'development'
          ? ['query', 'info', 'warn', 'error']
          : ['error']
      });

      logger.info('Prisma Client singleton initialized');
    }
    return PrismaService.instance;
  }
}

export const prisma = PrismaService.getInstance();
