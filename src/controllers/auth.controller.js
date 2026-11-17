
import {
  registerUser,
  loginUser,
} from '../services/auth.service.js';

import { verifyEmail } from '../services/emailVerification.service.js';


import {
  rotateRefreshToken,
  revokeSession,
  revokeAllSessions,
} from '../services/session.service.js';

/**
 * Handle user registration requests.
 */
export const register = async (req, res) => {
  const user = await registerUser(req.validated.body);

  res.status(201).json({
    success: true,
    message: 'Registration successful. Please verify your email.',
    data: {
      user,
    },
  });
};

/**
 * Handle user login requests.
 */
export const login = async (req, res) => {
  const metadata = {
    userAgent: req.get('user-agent') || null,
    ipAddress: req.ip || null,
  };

  const result = await loginUser(req.validated.body, metadata);

  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api/v1/auth',
  });

  res.status(200).json({
    success: true,
    message: 'Login successful.',
    data: {
      accessToken: result.accessToken,
      user: result.user,
    },
  });
};

/**
 * Handle refresh token requests.
 */
export const refresh = async (req, res) => {
  // Read the refresh token from the HTTP-only cookie.
  const refreshToken = req.cookies?.refreshToken;

  // Collect updated device and request information.
  const metadata = {
    userAgent: req.get('user-agent') || null,
    ipAddress: req.ip || null,
  };

  // Validate the old token and create a replacement session.
  const result = await rotateRefreshToken(refreshToken, metadata);

  // Replace the old refresh token cookie.
  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api/v1/auth',
  });

  // Return the new access token without exposing the refresh token.
  res.status(200).json({
    success: true,
    message: 'Token refreshed successfully.',
    data: {
      accessToken: result.accessToken,
    },
  });
};


/**
 * Handle user logout requests.
 */
export const logout = async (req, res) => {
  // Read the refresh token from the HTTP-only cookie.
  const refreshToken = req.cookies?.refreshToken;

  // Revoke the associated session, if one exists.
  await revokeSession(refreshToken);

  // Clear the refresh token cookie.
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/v1/auth',
  });

  res.status(200).json({
    success: true,
    message: 'Logout successful.',
  });
};



/**
 * Log out the authenticated user from all devices.
 */
export const logoutAll = async (req, res) => {
  // Get the authenticated user's ID.
  const userId = req.user.id;

  // Revoke all active sessions belonging to this user.
  const revokedCount = await revokeAllSessions(userId);

  // Clear the current device's refresh token cookie.
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/v1/auth',
  });

  res.status(200).json({
    success: true,
    message: 'Logged out from all devices successfully.',
    data: {
      revokedSessions: revokedCount,
    },
  });
};



/**
 * Handle email verification requests.
 */
export const verifyEmailAddress = async (req, res) => {
  const { token } = req.validated.query;

  const user = await verifyEmail(token);

  res.status(200).json({
    success: true,
    message: 'Email verified successfully. Your account is now active.',
    data: {
      user,
    },
  });
};
