import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  schoolCode: z.string().optional()
});

export type LoginDto = z.infer<typeof LoginSchema>;

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, { message: 'Refresh token is required' })
});

export type RefreshTokenDto = z.infer<typeof RefreshTokenSchema>;

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, { message: 'Current password is required' }),
  newPassword: z.string().min(8, { message: 'New password must be at least 8 characters' })
});

export type ChangePasswordDto = z.infer<typeof ChangePasswordSchema>;
