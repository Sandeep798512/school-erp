import { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { sendSuccess, sendError } from '../../common/utils/response.util.js';
import { LoginSchema, RefreshTokenSchema } from '@school-erp/shared';

export class AuthController {
  public static async login(req: Request, res: Response): Promise<Response> {
    const parseResult = LoginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return sendError(
        res,
        400,
        'Bad Request',
        'Invalid login request payload',
        'https://errors.schoolerp.com/VALIDATION_ERROR',
        parseResult.error.flatten().fieldErrors
      );
    }

    try {
      const clientIp = req.ip || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const result = await AuthService.login(parseResult.data, clientIp, userAgent);

      // Set Refresh Token in HttpOnly cookie
      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      return sendSuccess(res, result);
    } catch (err: any) {
      if (err.message === 'INVALID_CREDENTIALS') {
        return sendError(res, 401, 'Unauthorized', 'Invalid email or password', 'https://errors.schoolerp.com/INVALID_CREDENTIALS');
      }
      return sendError(res, 500, 'Internal Server Error', 'An unexpected error occurred during login');
    }
  }

  public static async refreshToken(req: Request, res: Response): Promise<Response> {
    const rawToken = req.cookies?.refreshToken || req.body?.refreshToken;

    const parseResult = RefreshTokenSchema.safeParse({ refreshToken: rawToken });
    if (!parseResult.success) {
      return sendError(res, 400, 'Bad Request', 'Refresh token is required');
    }

    try {
      const result = await AuthService.refreshToken(parseResult.data.refreshToken);
      return sendSuccess(res, result);
    } catch (err) {
      return sendError(res, 401, 'Unauthorized', 'Invalid or expired refresh token');
    }
  }

  public static async logout(req: Request, res: Response): Promise<Response> {
    if (req.user?.sessionId) {
      await AuthService.logout(req.user.sessionId);
    }
    res.clearCookie('refreshToken');
    return sendSuccess(res, { message: 'Logged out successfully' });
  }

  public static async me(req: Request, res: Response): Promise<Response> {
    if (!req.user) {
      return sendError(res, 401, 'Unauthorized', 'Not authenticated');
    }
    return sendSuccess(res, { user: req.user });
  }
}
