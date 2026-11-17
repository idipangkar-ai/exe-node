
import AppError from '../utils/AppError.js';
import { verifyAccessToken } from '../utils/token.js';

/**
 * Authenticate requests using a JWT access token.
 */
const authenticate = (req, res, next) => {
  try {
    // Read the Authorization header.
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new AppError('Authentication required', 401);
    }

    // Extract the JWT.
    const token = authorization.split(' ')[1];

    if (!token) {
      throw new AppError('Authentication required', 401);
    }

    // Verify the JWT and decode its payload.
    const decoded = verifyAccessToken(token);

    // Attach authenticated user information to the request.
    req.user = {
      id: decoded.sub,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }

    return next(new AppError('Invalid or expired access token', 401));
  }
};

export default authenticate;
