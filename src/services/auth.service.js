
import User from '../models/User.js';
import EmailVerification from '../models/EmailVerification.js';

import AppError from '../utils/AppError.js';
import {
  hashPassword,
  verifyPassword,
} from '../utils/password.js';

import { generateAccessToken } from '../utils/token.js';

import {
  generateEmailVerificationToken,
} from '../utils/emailVerification.js';

import { sendVerificationEmail } from './email.service.js';
import { env } from '../config/env.js';
import { createSession } from './session.service.js';



/**
 * Register a new user and send an email verification link.
 */
export const registerUser = async ({
  name,
  email,
  password,
  username,
}) => {
  // 1. Check whether this email is already registered.
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError(
      'An account with this email already exists',
      409
    );
  }

  // 2. Hash the password before storing it.
  const passwordHash = await hashPassword(password);

  // 3. Create the account in pending status.
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

  // 4. Generate a secure email verification token.
  const {
    token,
    tokenHash,
    expiresAt,
  } = generateEmailVerificationToken();

  // 5. Store only the token hash in MongoDB.
  await EmailVerification.create({
    user: user._id,
    tokenHash,
    expiresAt,
  });

  // 6. Construct the verification link.
  const verificationUrl =
    `${env.APP_BASE_URL}/api/v1/auth/verify-email?token=${encodeURIComponent(token)}`;

  // 7. Send the verification email.
  await sendVerificationEmail({
    to: user.email,
    name: user.name,
    verificationUrl,
  });

  // 8. Return public user information.
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



/**
 * Authenticate a user and generate an access token.
 */
export const loginUser = async ({ email, password }, metadata = {}) => {
  // 1. Find the user and explicitly include the hidden password hash.
  const user = await User.findOne({ email }).select('+passwordHash');

  // Use the same error for unknown emails and incorrect passwords.
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  // 2. Reject accounts that have not verified their email.
  if (!user.isEmailVerified || user.status !== 'active' || !user.isActive) {
    throw new AppError('Please verify your email before logging in', 403);
  }

  // 3. Verify the supplied password.
  const isPasswordValid = await verifyPassword(
    user.passwordHash,
    password
  );

  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  // 4. Generate a short-lived access token.
  const accessToken = generateAccessToken(user);

  // Create a refresh-token session for this user.
  const session = await createSession(user, metadata);

  // 5. Return the token and safe public user information.
  return {
    accessToken,
    refreshToken: session.refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
      status: user.status,
      isEmailVerified: user.isEmailVerified,
    },
  };
};
