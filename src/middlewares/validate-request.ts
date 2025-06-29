import type { RequestHandler } from 'express';
import { ZodError } from 'zod';
import type { AnyZodObject } from 'zod';
import { ValidationError } from '../utils/app-error';

interface ValidationSchemas {
  body?: AnyZodObject;
  params?: AnyZodObject;
  query?: AnyZodObject;
}

/**
 * Middleware to validate request body, params, and query using Zod schemas.
 * If validation passes, assigns parsed data back to req and calls next().
 * If validation fails, responds with 400 and validation error details.
 */
export const validateRequest = (schemas: ValidationSchemas): RequestHandler => {
  return (req, _res, next) => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      if (schemas.params) {
        req.params = schemas.params.parse(req.params);
      }
      if (schemas.query) {
        req.query = schemas.query.parse(req.query);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(new ValidationError('Validation failed', error.errors));
      }
      next(error);
    }
  };
};

