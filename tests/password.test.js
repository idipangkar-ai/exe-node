
import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  hashPassword,
  verifyPassword,
} from '../src/utils/password.js';

// Verify that passwords are stored as hashes, not plain text.
test('Password should be hashed successfully', async () => {
  const password = 'MyStrongPassword123!';

  const hashedPassword = await hashPassword(password);

  assert.notEqual(hashedPassword, password);
  assert.ok(hashedPassword.startsWith('$argon2id$'));
});

// Verify that the correct password passes verification.
test('Correct password should pass verification', async () => {
  const password = 'MyStrongPassword123!';

  const hashedPassword = await hashPassword(password);

  const isValid = await verifyPassword(hashedPassword, password);

  assert.equal(isValid, true);
});

// Verify that an incorrect password is rejected.
test('Incorrect password should fail verification', async () => {
  const hashedPassword = await hashPassword('CorrectPassword123!');

  const isValid = await verifyPassword(
    hashedPassword,
    'WrongPassword123!'
  );

  assert.equal(isValid, false);
});

// Verify that identical passwords produce different hashes.
// Argon2 automatically generates a random salt.
test('Same password should produce different hashes', async () => {
  const password = 'MyStrongPassword123!';

  const firstHash = await hashPassword(password);
  const secondHash = await hashPassword(password);

  assert.notEqual(firstHash, secondHash);

  assert.equal(await verifyPassword(firstHash, password), true);
  assert.equal(await verifyPassword(secondHash, password), true);
});

// Verify that empty passwords are rejected.
test('Empty password should be rejected', async () => {
  await assert.rejects(
    () => hashPassword(''),
    { message: 'Password must be a non-empty string' }
  );
});

// Verify that malformed hashes cannot authenticate a user.
test('Invalid password hash should return false', async () => {
  const isValid = await verifyPassword('invalid-hash', 'SomePassword123!');

  assert.equal(isValid, false);
});
