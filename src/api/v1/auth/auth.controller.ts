import type { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import type { LoginUserInput, RequestPasswordResetInput } from './auth.schema';
import { BadRequestError } from '../../../utils/app-error';

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const loginInput: LoginUserInput = req.body;
    const { accessToken, refreshToken, user } = await authService.loginUser(
      loginInput.email,
      loginInput.password,
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ accessToken, user });
  } catch (error) {
    next(error);
  }
}

export async function refreshToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const refreshToken = req.cookies.refreshToken
    const tokens = await authService.refreshToken(refreshToken);
    res.status(200).json(tokens);
  } catch (error) {
    next(error);
  }
}

export async function requestPasswordReset(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email }: RequestPasswordResetInput = req.body;
    await authService.requestPasswordReset(email);
    res.status(200).json({ message: 'Password reset token sent to email' });
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const resetToken = req.body.resetToken || req.query.token;
    const newPassword = req.body.newPassword;

    if (!resetToken || typeof resetToken !== 'string') {
      throw new BadRequestError('Reset token is required and must be a string');
    }

    if (!newPassword || typeof newPassword !== 'string') {
      throw new BadRequestError(
        'New password is required and must be a string',
      );
    }

    await authService.resetPassword(resetToken, newPassword);

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    next(error);
  }
}

export async function verifyEmail(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { token } = req.query;
    if (!token || typeof token !== 'string') {
      throw new BadRequestError('Verification token is missing');
    }

    await authService.verifyEmail(token);
    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    next(error);
  }
}

export async function resendVerificationEmail(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email } = req.body;
    if (!email) throw new BadRequestError('Email is required');

    const result = await authService.resendVerificationEmail(email);
    res.json(result);
  } catch (error) {
    next(error);
  }
}
