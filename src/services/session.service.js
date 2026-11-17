
import Session from '../models/Session.js';

import {
  generateRefreshToken,
  hashToken,
} from '../utils/hash.js';

import { env } from '../config/env.js';

/**
 * Create a new authenticated session for a user.
 */
export const createSession = async (user, metadata = {}) => {
  // 1. Generate a secure refresh token.
  const refreshToken = generateRefreshToken();

  // 2. Hash the token before storing it.
  const tokenHash = hashToken(refreshToken);

  // 3. Calculate the session expiration date.
  const expiresAt = new Date(
    Date.now() + parseDuration(env.JWT_REFRESH_EXPIRES_IN)
  );

  // 4. Store the session and token hash in MongoDB.
  const session = await Session.create({
    user: user._id,
    tokenHash,
    expiresAt,
    deviceName: metadata.deviceName || null,
    deviceType: metadata.deviceType || 'other',
    userAgent: metadata.userAgent || null,
    ipAddress: metadata.ipAddress || null,
  });

  // 5. Return the original token only to the caller.
  return {
    refreshToken,
    sessionId: session._id,
    expiresAt,
  };
};

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
