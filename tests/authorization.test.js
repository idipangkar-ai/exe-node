
import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import request from 'supertest';

import authorize from '../src/middleware/authorize.js';
import errorHandler from '../src/middleware/errorHandler.js';

// Create a separate Express application for authorization tests.
const app = express();

// Simulate a route that requires users.read permission.
app.get(
  '/protected',
  (req, res, next) => {
    // Simulate an authenticated user for testing.
    // In production, authentication middleware will populate req.user.
    req.user = {
      id: 'test-user-id',
      permissions: ['users.read'],
    };

    next();
  },
  authorize('users.read'),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Access granted',
    });
  }
);

// Simulate a route without an authenticated user.
app.get(
  '/unauthenticated',
  authorize('users.read'),
  (req, res) => {
    res.status(200).json({ success: true });
  }
);

// Simulate a user who lacks the required permission.
app.get(
  '/forbidden',
  (req, res, next) => {
    req.user = {
      id: 'test-user-id',
      permissions: ['users.update'],
    };

    next();
  },
  authorize('users.read'),
  (req, res) => {
    res.status(200).json({ success: true });
  }
);

// Register centralized error handling.
app.use(errorHandler);

// Test unauthenticated access.
test('Unauthenticated user should receive HTTP 401', async () => {
  const response = await request(app).get('/unauthenticated');

  assert.equal(response.status, 401);
  assert.equal(response.body.message, 'Authentication required');
});

// Test authorized access.
test('User with required permission should receive HTTP 200', async () => {
  const response = await request(app).get('/protected');

  assert.equal(response.status, 200);
  assert.equal(response.body.message, 'Access granted');
});

// Test forbidden access.
test('User without required permission should receive HTTP 403', async () => {
  const response = await request(app).get('/forbidden');

  assert.equal(response.status, 403);
  assert.equal(response.body.message, 'Insufficient permissions');
});
