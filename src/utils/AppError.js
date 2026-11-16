
export default class AppError extends Error {
  constructor(message, statusCode = 500) {
    // Initialize the standard JavaScript Error.
    super(message);

    // Give the error a recognizable name.
    this.name = 'AppError';

    // Store the HTTP status code.
    this.statusCode = statusCode;

    // Distinguish operational errors from unexpected programming errors.
    this.isOperational = true;

    // Capture the stack trace from this point.
    Error.captureStackTrace(this, this.constructor);
  }
}
