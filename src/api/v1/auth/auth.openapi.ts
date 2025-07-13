import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import {
  loginUserSchema,
  refreshTokenSchema,
  requestPasswordResetSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from './auth.schema';

export function registerAuth(registry: OpenAPIRegistry) {
  registry.register('LoginUser', loginUserSchema);
  registry.register('RefreshToken', refreshTokenSchema);
  registry.register('RequestPasswordReset', requestPasswordResetSchema);
  registry.register('ResendVerification', resendVerificationSchema);
  registry.register('ResetPassword', resetPasswordSchema);
  registry.register('VerifyEmail', verifyEmailSchema);

  const tag = ['Authentication'];

  registry.registerPath({
    method: 'post',
    path: '/api/auth/login',
    tags: tag,
    request: {
      body: { content: { 'application/json': { schema: loginUserSchema } } },
    },
    responses: {
      200: { description: 'User logged in successfully' },
      400: { description: 'Validation failed' },
      401: { description: 'Invalid credentials' },
    },
  });

  registry.registerPath({
    method: 'post',
    path: '/api/auth/refresh-token',
    tags: tag,
    request: {
      body: { content: { 'application/json': { schema: refreshTokenSchema } } },
    },
    responses: {
      200: { description: 'Token refreshed successfully' },
      400: { description: 'Validation failed' },
      401: { description: 'Invalid refresh token' },
    },
  });

  registry.registerPath({
    method: 'post',
    path: '/api/auth/request-password-reset',
    tags: tag,
    request: {
      body: {
        content: { 'application/json': { schema: requestPasswordResetSchema } },
      },
    },
    responses: {
      200: { description: 'Password reset email sent' },
      400: { description: 'Validation failed' },
    },
  });

  registry.registerPath({
    method: 'post',
    path: '/api/auth/reset-password',
    tags: tag,
    request: {
      body: {
        content: { 'application/json': { schema: resetPasswordSchema } },
      },
    },
    responses: {
      200: { description: 'Password reset successful' },
      400: { description: 'Validation failed' },
      401: { description: 'Invalid or expired reset token' },
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/api/auth/verify-email/{token}',
    tags: tag,
    request: {
      params: verifyEmailSchema,
    },
    responses: {
      200: { description: 'Email verified successfully' },
      400: { description: 'Validation failed' },
      401: { description: 'Invalid or expired verification token' },
    },
  });

  registry.registerPath({
    method: 'post',
    path: '/api/auth/resend-verification',
    tags: tag,
    request: {
      body: {
        content: { 'application/json': { schema: resendVerificationSchema } },
      },
    },
    responses: {
      200: { description: 'Verification email resent' },
      400: { description: 'Validation failed' },
    },
  });
}

export default registerAuth;
