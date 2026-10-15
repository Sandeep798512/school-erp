import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { UserAuthContext } from '@school-erp/shared';

export interface JwtAccessTokenPayload extends UserAuthContext {
  sessionId: string;
}

export interface JwtRefreshTokenPayload {
  userId: string;
  sessionId: string;
}

export class TokenUtil {
  public static generateAccessToken(payload: JwtAccessTokenPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN
    } as jwt.SignOptions);
  }

  public static generateRefreshToken(payload: JwtRefreshTokenPayload): string {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN
    } as jwt.SignOptions);
  }

  public static verifyAccessToken(token: string): JwtAccessTokenPayload {
    return jwt.verify(token, env.JWT_SECRET) as JwtAccessTokenPayload;
  }

  public static verifyRefreshToken(token: string): JwtRefreshTokenPayload {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtRefreshTokenPayload;
  }
}
