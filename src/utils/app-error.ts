export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly errors?: any;

  constructor(message: string, statusCode = 500, isOperational = true, errors?: any) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errors = errors;

    Error.captureStackTrace(this);
  }
}

// 4xx Client Errors

export class ValidationError extends AppError {
  constructor(message = 'Validation Error', errors?: any) {
    super(message, 400, true, errors);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication Failed') {
    super(message, 401, true);
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403, true);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource Not Found') {
    super(message, 404, true);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(message, 409, true);
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message = 'Too Many Requests') {
    super(message, 429, true);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad Request', errors?: any) {
    super(message, 400, true, errors);
  }
}

// 5xx Server Errors

export class InternalServerError extends AppError {
  constructor(message = 'Internal Server Error') {
    super(message, 500, false);
  }
}

export class DatabaseError extends AppError {
  constructor(message = 'Database Error', errors?: any) {
    super(message, 500, false, errors);
  }
}

export class ExternalServiceError extends AppError {
  constructor(message = 'External Service Error', errors?: any) {
    super(message, 502, false, errors);
  }
}

// Domain-Specific Errors

export class PaymentError extends AppError {
  constructor(message = 'Payment Processing Error', errors?: any) {
    super(message, 402, true, errors);
  }
}

export class InventoryError extends AppError {
  constructor(message = 'Inventory Error', errors?: any) {
    super(message, 409, true, errors);
  }
}

export class ShippingError extends AppError {
  constructor(message = 'Shipping Error', errors?: any) {
    super(message, 500, false, errors);
  }
}

export class OrderProcessingError extends AppError {
  constructor(message = 'Order Processing Error', errors?: any) {
    super(message, 500, false, errors);
  }
}

