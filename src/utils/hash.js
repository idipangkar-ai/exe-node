
import crypto from 'node:crypto';

// Generate a cryptographically secure random refresh token.
// 64 random bytes provide 512 bits of entropy.
export const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString('hex');
};

// Create a SHA-256 hash of a refresh token.
// Only this hash should be stored in the Session collection.
export const hashToken = (token) => {
  if (typeof token !== 'string' || token.length === 0) {
    throw new Error('Token must be a non-empty string');
  }

  return crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
};

// Compare a supplied refresh token against its stored hash.
// Use constant-time comparison to avoid timing-based leaks.
export const verifyTokenHash = (token, storedHash) => {
  if (
    typeof token !== 'string' ||
    typeof storedHash !== 'string'
  ) {
    return false;
  }

  try {
    const calculatedHash = Buffer.from(hashToken(token), 'hex');
    const expectedHash = Buffer.from(storedHash, 'hex');

    // Both SHA-256 hashes must be exactly 32 bytes.
    if (calculatedHash.length !== 32 || expectedHash.length !== 32) {
      return false;
    }

    return crypto.timingSafeEqual(calculatedHash, expectedHash);
  } catch {
    return false;
  }
};
