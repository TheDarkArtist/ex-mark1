import type { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import type { LoginUserInput, RequestPasswordResetInput, ResetPasswordInput } from './auth.schema';

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const loginInput: LoginUserInput = req.body;
    const { accessToken, refreshToken, user } = await authService.loginUser(loginInput.email, loginInput.password);
    res.status(200).json({ accessToken, refreshToken, user });
  } catch (error) {
    next(error);
  }
}

export async function refreshToken(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshToken(refreshToken);
    res.status(200).json(tokens);
  } catch (error) {
    next(error);
  }
}

export async function requestPasswordReset(req: Request, res: Response, next: NextFunction) {
  try {
    const { email }: RequestPasswordResetInput = req.body;
    await authService.requestPasswordReset(email);
    res.status(200).json({ message: 'Password reset token sent to email' });
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { resetToken, newPassword }: ResetPasswordInput = req.body;
    await authService.resetPassword(resetToken, newPassword);
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    next(error);
  }
}

