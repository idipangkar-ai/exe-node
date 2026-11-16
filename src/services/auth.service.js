
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import { hashPassword } from '../utils/password.js';

/**
 * Register a new user.
 *
 * This service handles the business logic:
 * 1. Check whether the email is already registered.
 * 2. Hash the user's password.
 * 3. Create the user with safe default values.
 */
export const registerUser = async ({ name, email, password, username }) => {
  // Check for an existing account using the normalized email.
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError('An account with this email already exists', 409);
  }

  // Hash the password before saving it.
  const passwordHash = await hashPassword(password);

  // Never accept role or account status from the client.
  const user = await User.create({
    name,
    email,
    username,
    passwordHash,
    role: 'user',
    status: 'pending',
    isActive: false,
    isEmailVerified: false,
  });

  // Return only public account information.
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    username: user.username,
    role: user.role,
    status: user.status,
    isEmailVerified: user.isEmailVerified,
    createdAt: user.createdAt,
  };
};
