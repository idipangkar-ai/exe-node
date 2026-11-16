const errorHandler = (err, req, res, next) => {
  // Delegate to Express if response headers have already been sent.
  if (res.headersSent) {
    return next(err);
  }

  // Use the provided status code or default to HTTP 500.
  const statusCode = err.statusCode || 500;

  // Hide internal server error details in production.
  const message =
    statusCode === 500 && process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message || 'Something went wrong';

  // Log server errors for debugging.
  if (statusCode >= 500) {
    console.error(err);
  }

  // Build a consistent error response.
  const response = {
    success: false,
    message,
  };

  // Include field-level details when validation fails.
  if (err.details) {
    response.details = err.details;
  }

  res.status(statusCode).json(response);
};

export default errorHandler;
