
import AppError from '../utils/AppError.js';

// Check whether the authenticated user has the required permissions.
const authorize = (...requiredPermissions) => {
  return (req, res, next) => {
    // Authentication middleware must run before authorization.
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    // Permissions are attached to req.user by authentication middleware.
    const userPermissions = req.user.permissions || [];

    // Check whether the user has every required permission.
    const hasPermission = requiredPermissions.every((permission) =>
      userPermissions.includes(permission)
    );

    // Reject users who do not have the required permissions.
    if (!hasPermission) {
      return next(new AppError('Insufficient permissions', 403));
    }

    next();
  };
};

export default authorize;
