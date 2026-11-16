
import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  registerSchema,
  loginSchema,
} from '../src/validators/auth.validator.js';

// Verify valid registration data.
test('Valid registration data should pass validation', () => {
  const result = registerSchema.safeParse({
    name: 'Alex Johnson',
    email: 'alex@example.com',
    password: 'StrongPassword123!',
    username: 'alex_johnson',
  });

  assert.equal(result.success, true);
});

// Verify that email is normalized.
test('Registration email should be normalized', () => {
  const result = registerSchema.safeParse({
    name: 'Alex Johnson',
    email: 'ALEX@EXAMPLE.COM',
    password: 'StrongPassword123!',
  });

  assert.equal(result.success, true);
  assert.equal(result.data.email, 'alex@example.com');
});

// Verify that short names are rejected.
test('Registration should reject short names', () => {
  const result = registerSchema.safeParse({
    name: 'A',
    email: 'alex@example.com',
    password: 'StrongPassword123!',
  });

  assert.equal(result.success, false);
});

// Verify that invalid email addresses are rejected.
test('Registration should reject invalid email addresses', () => {
  const result = registerSchema.safeParse({
    name: 'Alex Johnson',
    email: 'invalid-email',
    password: 'StrongPassword123!',
  });

  assert.equal(result.success, false);
});

// Verify that weak passwords are rejected.
test('Registration should reject short passwords', () => {
  const result = registerSchema.safeParse({
    name: 'Alex Johnson',
    email: 'alex@example.com',
    password: '123',
  });

  assert.equal(result.success, false);
});

// Verify that invalid usernames are rejected.
test('Registration should reject invalid usernames', () => {
  const result = registerSchema.safeParse({
    name: 'Alex Johnson',
    email: 'alex@example.com',
    password: 'StrongPassword123!',
    username: 'alex@johnson',
  });

  assert.equal(result.success, false);
});

// Verify that login requires both email and password.
test('Login should reject missing credentials', () => {
  const result = loginSchema.safeParse({
    email: 'alex@example.com',
  });

  assert.equal(result.success, false);
});

// Verify that registration cannot accept administrator privileges.
test('Registration should reject client-supplied role', () => {
  const result = registerSchema.safeParse({
    name: 'Alex Johnson',
    email: 'alex@example.com',
    password: 'StrongPassword123!',
    role: 'admin',
  });

  assert.equal(result.success, false);
});
