import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app-error';

export class ErrorHandler {
  public static handle(
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
  ): void {
    if (err instanceof AppError) {
      ErrorHandler.sendErrorResponse(err, res);
    } else {
      console.error('Unexpected Error:', err);
      const genericError = new AppError('Internal Server Error', 500, false);
      ErrorHandler.sendErrorResponse(genericError, res);
    }
  }

  private static sendErrorResponse(err: AppError, res: Response): void {
    const responseBody: any = {
      status: 'error',
      message: err.message,
    };

    if (err.errors) {
      responseBody.errors = err.errors;
    }

    if (process.env.NODE_ENV === 'development') {
      responseBody.stack = err.stack;
    }

    res.status(err.statusCode).json(responseBody);
  }
}

