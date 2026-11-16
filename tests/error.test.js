
import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';

// Verify that unknown API routes return HTTP 404.
test('Unknown route should return HTTP 404', async () => {
  const response = await request(app).get('/api/v1/unknown');

  assert.equal(response.status, 404);
  assert.equal(response.body.success, false);
  assert.equal(
    response.body.message,
    'Route not found: /api/v1/unknown'
  );
});

// Verify that our error handler returns a consistent JSON response.
test('Unknown route should return JSON error response', async () => {
  const response = await request(app).get('/api/v1/another-unknown');

  assert.deepEqual(response.body, {
    success: false,
    message: 'Route not found: /api/v1/another-unknown',
  });
});
