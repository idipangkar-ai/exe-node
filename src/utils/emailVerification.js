
import { randomBytes } from 'node:crypto';
import { hashToken } from './hash.js';

// Verification links remain valid for 15 minutes.
const EMAIL_VERIFICATION_EXPIRY_MINUTES = 15;

/**
 * Generate a secure email verification token.
 *
 * The original token is sent to the user.
 * Only its hash should be stored in MongoDB.
 */
export const generateEmailVerificationToken = () => {
  // Generate 32 cryptographically secure random bytes.
  const token = randomBytes(32).toString('hex');

  // Hash the token before storing it.
  const tokenHash = hashToken(token);

  // Calculate the token expiration time.
  const expiresAt = new Date(
    Date.now() + EMAIL_VERIFICATION_EXPIRY_MINUTES * 60 * 1000
  );

  return {
    token,
    tokenHash,
    expiresAt,
  };
};
