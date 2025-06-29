import type { Response, NextFunction } from 'express';
import type { AuthRequest } from './authenticate-user';
import { AuthorizationError } from '../utils/app-error';

//Aren't middlewares cool
export const authorizeAdmin = (req: AuthRequest, _res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AuthorizationError('User not authenticated'));
  }

  if (req.user.role !== 'admin') {
    return next(new AuthorizationError('Admin role required'));
  }

  next();
};

