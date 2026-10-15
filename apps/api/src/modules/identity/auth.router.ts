import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { authenticateJwt } from '../../common/middleware/auth.middleware.js';

export const authRouter = Router();

authRouter.post('/login', AuthController.login);
authRouter.post('/refresh', AuthController.refreshToken);
authRouter.post('/logout', authenticateJwt, AuthController.logout);
authRouter.get('/me', authenticateJwt, AuthController.me);
