
import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  generateRefreshToken,
  hashToken,
  verifyTokenHash,
} from '../src/utils/hash.js';

// Verify that refresh tokens are securely generated.
test('Refresh token should be generated successfully', () => {
  const token = generateRefreshToken();

  assert.equal(typeof token, 'string');
  assert.equal(token.length, 128);
});

// Verify that generated refresh tokens are unique.
test('Refresh tokens should be unique', () => {
  const firstToken = generateRefreshToken();
  const secondToken = generateRefreshToken();

  assert.notEqual(firstToken, secondToken);
});

// Verify that the same token produces the same SHA-256 hash.
test('Same token should produce the same hash', () => {
  const token = generateRefreshToken();

  assert.equal(hashToken(token), hashToken(token));
});

// Verify that different tokens produce different hashes.
test('Different tokens should produce different hashes', () => {
  const firstToken = generateRefreshToken();
  const secondToken = generateRefreshToken();

  assert.notEqual(hashToken(firstToken), hashToken(secondToken));
});

// Verify that a valid token matches its stored hash.
test('Correct refresh token should pass hash verification', () => {
  const token = generateRefreshToken();
  const storedHash = hashToken(token);

  assert.equal(verifyTokenHash(token, storedHash), true);
});

// Verify that an incorrect token is rejected.
test('Incorrect refresh token should fail hash verification', () => {
  const storedHash = hashToken(generateRefreshToken());

  assert.equal(
    verifyTokenHash(generateRefreshToken(), storedHash),
    false
  );
});

// Verify that empty tokens cannot be hashed.
test('Empty token should be rejected', () => {
  assert.throws(
    () => hashToken(''),
    { message: 'Token must be a non-empty string' }
  );
});
