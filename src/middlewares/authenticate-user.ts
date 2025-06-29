import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthorizationError } from '../utils/app-error';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateUser = (req: AuthRequest, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AuthorizationError('Authorization token is required'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return next(new AuthorizationError('Invalid or expired token'));
  }
};

