
import { registerUser } from '../services/auth.service.js';

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
