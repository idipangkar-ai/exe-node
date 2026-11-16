
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

// Generate a short-lived JWT access token for an authenticated user.
export const generateAccessToken = (user) => {
  // Include only the information needed to identify and authorize the user.
  const payload = {
    sub: user._id.toString(),
    role: user.role,
  };

  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    algorithm: 'HS256',
  });
};

// Verify a JWT access token and return its decoded claims.
export const verifyAccessToken = (token) => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET, {
    algorithms: ['HS256'],
  });
};
