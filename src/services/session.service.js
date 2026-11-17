
import mongoose from 'mongoose';

import Session from '../models/Session.js';
import User from '../models/User.js';

import {
  generateRefreshToken,
  hashToken,
} from '../utils/hash.js';

import { generateAccessToken } from '../utils/token.js';
import AppError from '../utils/AppError.js';

import { env } from '../config/env.js';

/**
 * Convert a duration such as 7d or 12h into milliseconds.
 */
const parseDuration = (duration) => {
  const match = /^(\d+)([smhd])$/.exec(duration);

  if (!match) {
    throw new Error('Invalid refresh token expiration format');
  }

  const value = Number(match[1]);

  const units = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return value * units[match[2]];
};

/**
 * Create a new authenticated session for a user.
 */
export const createSession = async (user, metadata = {}) => {
  const refreshToken = generateRefreshToken();
  const tokenHash = hashToken(refreshToken);

  const expiresAt = new Date(
    Date.now() + parseDuration(env.JWT_REFRESH_EXPIRES_IN)
  );

  const session = await Session.create({
    user: user._id,
    tokenHash,
    expiresAt,
    deviceName: metadata.deviceName || null,
    deviceType: metadata.deviceType || 'other',
    userAgent: metadata.userAgent || null,
    ipAddress: metadata.ipAddress || null,
  });

  return {
    refreshToken,
    sessionId: session._id,
    expiresAt,
  };
};

/**
 * Rotate a refresh token and create a replacement session.
 */
export const rotateRefreshToken = async (refreshToken, metadata = {}) => {
  if (
    typeof refreshToken !== 'string' ||
    !/^[a-f0-9]{128}$/i.test(refreshToken)
  ) {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  const oldTokenHash = hashToken(refreshToken);
  const newRefreshToken = generateRefreshToken();
  const newTokenHash = hashToken(newRefreshToken);

  const now = new Date();

  const expiresAt = new Date(
    now.getTime() + parseDuration(env.JWT_REFRESH_EXPIRES_IN)
  );

  const mongoSession = await mongoose.startSession();

  let result;

  try {
    await mongoSession.withTransaction(async () => {
      // Find the session associated with the supplied refresh token.
      const oldSession = await Session.findOne({
        tokenHash: oldTokenHash,
      })
        .select('+tokenHash')
        .session(mongoSession);

      if (!oldSession) {
        result = { invalid: true };
        return;
      }

      // Detect reuse of a refresh token that was already rotated.
      if (
        oldSession.revokedAt &&
        oldSession.revocationReason === 'token_rotation'
      ) {
        // Revoke all remaining active sessions for this user.
        await Session.updateMany(
          {
            user: oldSession.user,
            revokedAt: null,
            expiresAt: { $gt: now },
          },
          {
            $set: {
              revokedAt: now,
              revocationReason: 'security_action',
            },
          },
          { session: mongoSession }
        );

        result = { reused: true };
        return;
      }

      // Reject revoked or expired sessions.
      if (oldSession.revokedAt || oldSession.expiresAt <= now) {
        result = { invalid: true };
        return;
      }

      // Confirm that the account is still allowed to authenticate.
      const user = await User.findById(oldSession.user).session(mongoSession);

      if (
        !user ||
        !user.isActive ||
        user.status !== 'active' ||
        !user.isEmailVerified
      ) {
        result = { invalid: true };
        return;
      }

      // Create the replacement session while preserving the old record.
      const [newSession] = await Session.create(
        [
          {
            user: oldSession.user,
            tokenHash: newTokenHash,
            expiresAt,
            deviceName: metadata.deviceName || oldSession.deviceName,
            deviceType: metadata.deviceType || oldSession.deviceType,
            userAgent: metadata.userAgent || oldSession.userAgent,
            ipAddress: metadata.ipAddress || oldSession.ipAddress,
          },
        ],
        { session: mongoSession }
      );

      // Revoke the old session and link it to its replacement.
      const updatedOldSession = await Session.findOneAndUpdate(
        {
          _id: oldSession._id,
          revokedAt: null,
          expiresAt: { $gt: now },
        },
        {
          $set: {
            revokedAt: now,
            revocationReason: 'token_rotation',
            replacedBy: newSession._id,
            lastUsedAt: now,
          },
        },
        {
          new: true,
          session: mongoSession,
        }
      );

      // Abort the transaction if another request already rotated the token.
      if (!updatedOldSession) {
        throw new AppError('Invalid or expired refresh token', 401);
      }

      result = {
        refreshToken: newRefreshToken,
        accessToken: generateAccessToken(user),
        expiresAt,
      };
    });
  } finally {
    await mongoSession.endSession();
  }

  // Throw after the transaction commits so reuse-triggered revocations persist.
  if (result?.reused) {
    throw new AppError(
      'Refresh token reuse detected. Please log in again.',
      401
    );
  }

  if (result?.invalid || !result) {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  return result;
};



/**
 * Revoke the session associated with a refresh token.
 */
export const revokeSession = async (refreshToken) => {
  if (
    typeof refreshToken !== 'string' ||
    !/^[a-f0-9]{128}$/i.test(refreshToken)
  ) {
    return false;
  }

  const tokenHash = hashToken(refreshToken);
  const now = new Date();

  const session = await Session.findOneAndUpdate(
    {
      tokenHash,
      revokedAt: null,
      expiresAt: { $gt: now },
    },
    {
      $set: {
        revokedAt: now,
        revocationReason: 'logout',
      },
    },
    {
      new: true,
    }
  );

  return Boolean(session);
};



/**
 * Revoke all active sessions belonging to a user.
 */
export const revokeAllSessions = async (userId) => {
  if (!userId) {
    throw new AppError('Authenticated user is required', 401);
  }

  const now = new Date();

  const result = await Session.updateMany(
    {
      user: userId,
      revokedAt: null,
      expiresAt: { $gt: now },
    },
    {
      $set: {
        revokedAt: now,
        revocationReason: 'logout_all',
      },
    }
  );

  return result.modifiedCount;
};
