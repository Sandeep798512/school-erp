import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '4000', 10),
  API_PREFIX: process.env.API_PREFIX || '/api/v1',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://school_admin:secure_password_123@localhost:5432/school_erp_db',
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379', 10),
  JWT_SECRET: process.env.JWT_SECRET || 'dev_secret_key_32_bytes_long_string_123',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_key_32_bytes_long',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  WEB_APP_URL: process.env.WEB_APP_URL || 'http://localhost:3000'
};
