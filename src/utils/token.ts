import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const VERIFICATION_TOKEN_EXPIRY = '1h';

export function generateVerificationToken(user: { id: string; email: string }) {
  const payload = {
    sub: user.id,
    email: user.email,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: VERIFICATION_TOKEN_EXPIRY,
  });
}
