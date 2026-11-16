
import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { z } from 'zod';

import validate from '../src/middleware/validate.js';
import errorHandler from '../src/middleware/errorHandler.js';

// Create a separate Express app for testing validation.
const app = express();

app.use(express.json());

// Test route that requires a name with at least 3 characters.
app.post(
  '/test',
  validate({
    body: z.object({
      name: z.string().min(3, 'Name must contain at least 3 characters'),
    }),
  }),
  (req, res) => {
    // Return only the validated request data.
    res.status(200).json({
      success: true,
      data: req.validated.body,
    });
  }
);

// Test route that validates and transforms query parameters.
app.get(
  '/test-query',
  validate({
    query: z.object({
      page: z.coerce.number().int().min(1),
    }),
  }),
  (req, res) => {
    res.status(200).json({
      success: true,
      data: req.validated.query,
    });
  }
);

// Register the error handler after all routes.
app.use(errorHandler);

// Verify that valid request data is accepted.
test('Valid request body should pass validation', async () => {
  const response = await fetchTest('/test', {
    method: 'POST',
    body: { name: 'Alex' },
  });

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, {
    success: true,
    data: { name: 'Alex' },
  });
});

// Verify that invalid request data is rejected.
test('Invalid request body should return HTTP 400', async () => {
  const response = await fetchTest('/test', {
    method: 'POST',
    body: { name: 'Al' },
  });

  assert.equal(response.status, 400);
  assert.equal(response.body.success, false);
  assert.equal(response.body.message, 'Request validation failed');
  assert.equal(response.body.details[0].field, 'name');
});

// Verify that query values are converted to the expected type.
test('Query parameters should be validated and transformed', async () => {
  const response = await fetchTest('/test-query?page=2');

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, {
    success: true,
    data: { page: 2 },
  });
});

// Supertest helper for sending requests to the test Express app.
async function fetchTest(path, options = {}) {
  const { default: request } = await import('supertest');

  let req = request(app)[options.method?.toLowerCase() || 'get'](path);

  if (options.body) {
    req = req.send(options.body);
  }

  return req;
}
