import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../users/users.model';
import bcrypt from 'bcrypt';
import { AuthenticationError, NotFoundError, BadRequestError } from '../../../utils/app-error';
import { generateVerificationToken } from '../../../utils/token';
import { EmailService } from '../../../services/email/email.service';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = '15000m';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your_refresh_secret';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

const emailService = new EmailService();

export async function resendVerificationEmail(email: string) {
  const user = await User.findOne({ email });
  if (!user) throw new NotFoundError('User not found');

  if (user.emailVerified) {
    throw new BadRequestError('Email is already verified');
  }

  const verificationToken = generateVerificationToken({ id: user.id.toString(), email: user.email });
  await emailService.sendVerificationEmail(user.email, verificationToken, user.name);

  return { message: 'Verification email resent successfully' };
}


export async function verifyEmail(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { sub: string; email: string };
    const user = await User.findById(decoded.sub);
    if (!user) throw new NotFoundError('User not found');
    if (user.emailVerified) return user;

    user.emailVerified = true;
    await user.save();

    return user;
  } catch {
    throw new BadRequestError('Invalid or expired verification token');
  }
}


function generateAccessToken(user: { id: string; email: string; role: string }) {
  return jwt.sign(user, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function generateRefreshToken(user: { id: string }) {
  return jwt.sign({ id: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
}

export async function loginUser(email: string, password: string) {
  const user = await User.findOne({ email });
  if (!user) throw new AuthenticationError('Invalid email or password');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AuthenticationError('Invalid email or password');

  const accessToken = generateAccessToken({ id: user.id.toString(), email: user.email, role: user.role });
  const refreshToken = generateRefreshToken({ id: user.id.toString() });

  return { accessToken, refreshToken, user };
}

export async function refreshToken(oldRefreshToken: string) {
  try {
    const payload = jwt.verify(oldRefreshToken, REFRESH_TOKEN_SECRET) as { id: string };

    const user = await User.findById(payload.id);
    if (!user) throw new AuthenticationError('User not found');

    const newAccessToken = generateAccessToken({ id: user.id.toString(), email: user.email, role: user.role });
    const newRefreshToken = generateRefreshToken({ id: user.id.toString() });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch {
    throw new AuthenticationError('Invalid refresh token');
  }
}

export async function requestPasswordReset(email: string) {
  const user = await User.findOne({ email });
  if (!user) throw new NotFoundError('User not found');

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

  user.passwordResetToken = resetTokenHash;
  user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
  await user.save();

  const resetUrl = `${process.env.APP_BASE_URL}/api/auth/reset-password?token=${resetToken}`;

  await emailService.sendPasswordResetEmail(user.email, resetUrl, user.name);

  return { message: 'Password reset email sent' };
}

export async function resetPassword(resetToken: string, newPassword: string) {
  const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

  const user = await User.findOne({
    passwordResetToken: resetTokenHash,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) throw new BadRequestError('Invalid or expired password reset token');

  user.password = await bcrypt.hash(newPassword, 10);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  return user;
}

