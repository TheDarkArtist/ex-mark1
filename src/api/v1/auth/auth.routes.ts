import { Router } from 'express';
import {
  login,
  refreshToken,
  requestPasswordReset,
  resendVerificationEmail,
  resetPassword,
  verifyEmail,
} from './auth.controller';
import {
  loginUserSchema,
  requestPasswordResetSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from './auth.schema';
import { validateRequest } from '../../../middlewares/validate-request';

const router = Router();

router.post('/login', validateRequest({ body: loginUserSchema }), login);

router.post('/refresh-token', refreshToken);

router.post(
  '/request-password-reset',
  validateRequest({ body: requestPasswordResetSchema }),
  requestPasswordReset,
);

router.post(
  '/reset-password',
  validateRequest({ body: resetPasswordSchema }),
  resetPassword,
);

router.get(
  '/verify-email',
  validateRequest({ params: verifyEmailSchema }),
  verifyEmail,
);

router.post(
  '/resend-verification',
  validateRequest({ body: resendVerificationSchema }),
  resendVerificationEmail,
);

export default router;
