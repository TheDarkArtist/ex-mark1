import { Router } from 'express';
import {
  login,
  refreshToken,
  requestPasswordReset,
  resetPassword,
} from './auth.controller';
import {
  loginUserSchema,
  refreshTokenSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
} from './auth.schema';
import { validateRequest } from '../../../middlewares/validate-request';

const router = Router();

router.post('/login', validateRequest({ body: loginUserSchema }), login);

router.post('/refresh-token', validateRequest({ body: refreshTokenSchema }), refreshToken);

router.post('/request-password-reset', validateRequest({ body: requestPasswordResetSchema }), requestPasswordReset);

router.post('/reset-password', validateRequest({ body: resetPasswordSchema }), resetPassword);

export default router;

