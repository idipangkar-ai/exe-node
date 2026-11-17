
import {
  registerUser,
  loginUser,
} from '../services/auth.service.js';

import { verifyEmail } from '../services/emailVerification.service.js';


/**
 * Handle user registration requests.
 */
export const register = async (req, res) => {
    // The validation middleware provides validated request data.
    const user = await registerUser(req.validated.body);

    // Return HTTP 201 when the account is successfully created.
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
  // Collect basic information about the device and request.
  const metadata = {
    userAgent: req.get('user-agent') || null,
    ipAddress: req.ip || null,
  };

  // Authenticate the user and create an authenticated session.
  const result = await loginUser(req.validated.body, metadata);

  // Store the refresh token in a secure HTTP-only cookie.
  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api/v1/auth',
  });

  // Return only the access token and public user information.
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
 * Handle email verification requests.
 */
export const verifyEmailAddress = async (req, res) => {
    // Read the verification token from the URL query parameters.
    // const { token } = req.query;
    const { token } = req.validated.query;

    // Verify the token and activate the associated account.
    const user = await verifyEmail(token);

    // Return the verified account information.
    res.status(200).json({
        success: true,
        message: 'Email verified successfully. Your account is now active.',
        data: {
            user,
        },
    });
};
