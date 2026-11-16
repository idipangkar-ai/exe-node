
import mongoose from 'mongoose';

import User from '../models/User.js';
import EmailVerification from '../models/EmailVerification.js';

import AppError from '../utils/AppError.js';
import { hashToken } from '../utils/hash.js';

/**
 * Verify a user's email address and activate their account.
 */
export const verifyEmail = async (token) => {
  // Reject missing or incorrectly formatted tokens.
  if (!token || !/^[a-f0-9]{64}$/i.test(token)) {
    throw new AppError('Invalid or expired verification link', 400);
  }

  // Hash the received token to find its database record.
  const tokenHash = hashToken(token);

  // Use a transaction so token consumption and account activation
  // succeed together or are rolled back together.
  const session = await mongoose.startSession();

  try {
    let verifiedUser;

    await session.withTransaction(async () => {
      // Find the verification record.
      const verification = await EmailVerification.findOne({
        tokenHash,
      }).session(session);

      if (!verification) {
        throw new AppError(
          'Invalid or expired verification link',
          400
        );
      }

      // Reject tokens that have already been used.
      if (verification.usedAt) {
        throw new AppError(
          'This verification link has already been used',
          400
        );
      }

      // Explicitly check expiration.
      if (verification.expiresAt <= new Date()) {
        throw new AppError(
          'Verification link has expired',
          400
        );
      }

      // Find the account associated with the token.
      const user = await User.findById(
        verification.user
      ).session(session);

      if (!user) {
        throw new AppError('User account not found', 404);
      }

      // Reject accounts that have already been verified.
      if (user.isEmailVerified) {
        throw new AppError(
          'Email address is already verified',
          400
        );
      }

      // Mark the verification token as consumed.
      verification.usedAt = new Date();
      await verification.save({ session });

      // Activate the account.
      user.isEmailVerified = true;
      user.emailVerifiedAt = new Date();
      user.status = 'active';
      user.isActive = true;

      await user.save({ session });

      verifiedUser = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        isEmailVerified: user.isEmailVerified,
      };
    });

    return verifiedUser;
  } finally {
    // Always release the database session.
    await session.endSession();
  }
};
