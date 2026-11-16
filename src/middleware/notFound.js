
import AppError from '../utils/AppError.js';

// Handle requests that did not match any registered route.
const notFound = (req, res, next) => {
  // Create a 404 error containing the requested URL.
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
};

export default notFound;
