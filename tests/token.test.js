
import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  generateAccessToken,
  verifyAccessToken,
} from '../src/utils/token.js';

// Verify that an access token can be generated and decoded.
test('Access token should be generated successfully', () => {
  const user = {
    _id: '507f1f77bcf86cd799439011',
    role: 'user',
  };

  const token = generateAccessToken(user);
  const decoded = verifyAccessToken(token);

  assert.equal(decoded.sub, user._id);
  assert.equal(decoded.role, user.role);
  assert.ok(decoded.iat);
  assert.ok(decoded.exp);
});

// Verify that modified tokens are rejected.
test('Invalid access token should be rejected', () => {
  assert.throws(
    () => verifyAccessToken('invalid.token.value'),
    { name: 'JsonWebTokenError' }
  );
});

// Verify that an empty token is rejected.
test('Empty access token should be rejected', () => {
  assert.throws(() => verifyAccessToken(''));
});
