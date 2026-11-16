
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  generateEmailVerificationToken,
} from '../src/utils/emailVerification.js';

import { hashToken } from '../src/utils/hash.js';

test('Should generate a secure verification token', () => {
  const result = generateEmailVerificationToken();

  assert.ok(result.token);
  assert.equal(result.token.length, 64);
  assert.match(result.token, /^[a-f0-9]{64}$/);
});

test('Should return the correct token hash', () => {
  const result = generateEmailVerificationToken();

  assert.equal(result.tokenHash, hashToken(result.token));
});

test('Should not store the original token as its hash', () => {
  const result = generateEmailVerificationToken();

  assert.notEqual(result.token, result.tokenHash);
});

test('Should generate a different token each time', () => {
  const first = generateEmailVerificationToken();
  const second = generateEmailVerificationToken();

  assert.notEqual(first.token, second.token);
});

test('Should expire the token after approximately 15 minutes', () => {
  const beforeGeneration = Date.now();

  const result = generateEmailVerificationToken();

  const expectedExpiry = beforeGeneration + 15 * 60 * 1000;

  assert.ok(result.expiresAt instanceof Date);
  assert.ok(
    Math.abs(result.expiresAt.getTime() - expectedExpiry) < 1000
  );
});
