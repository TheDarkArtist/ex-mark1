import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app-error';

export class ErrorHandler {
  public static handle(
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
  ): void {
    if (err instanceof SyntaxError && 'body' in err) {
      const jsonError = new AppError('Invalid JSON payload', 400, false);
      return ErrorHandler.sendErrorResponse(jsonError, res);
    }

    if (
      err instanceof Error &&
      err.message === 'request size did not match content length'
    ) {
      const contentLengthError = new AppError(
        'Request body size does not match Content-Length header',
        400,
        false
      );
      return ErrorHandler.sendErrorResponse(contentLengthError, res);
    }

    if (err instanceof AppError) {
      return ErrorHandler.sendErrorResponse(err, res);
    }

    console.error('Unexpected Error:', err);
    const genericError = new AppError('Internal Server Error', 500, false);
    return ErrorHandler.sendErrorResponse(genericError, res);
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

