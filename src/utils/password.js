
import argon2 from 'argon2';

// Configure Argon2id password hashing.
// Argon2id provides protection against brute-force and GPU-based attacks.
const hashOptions = {
  type: argon2.argon2id,

  // Memory cost in KiB (64 MiB).
  memoryCost: 65536,

  // Number of hashing iterations.
  timeCost: 3,

  // Number of parallel threads.
  parallelism: 1,
};

// Hash a plain-text password before storing it in MongoDB.
export const hashPassword = async (password) => {
  if (typeof password !== 'string' || password.length === 0) {
    throw new Error('Password must be a non-empty string');
  }

  return argon2.hash(password, hashOptions);
};

// Verify a supplied password against its stored Argon2id hash.
export const verifyPassword = async (hashedPassword, plainPassword) => {
  if (
    typeof hashedPassword !== 'string' ||
    typeof plainPassword !== 'string'
  ) {
    return false;
  }

  try {
    return await argon2.verify(hashedPassword, plainPassword);
  } catch {
    // Invalid or malformed hashes should never authenticate a user.
    return false;
  }
};
