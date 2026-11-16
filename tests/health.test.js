
import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';

test('GET /api/v1/health should return HTTP 200', async () => {
  const response = await request(app).get('/api/v1/health');

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, {
    success: true,
    message: 'EXE-NODE API is running',
  });
});
