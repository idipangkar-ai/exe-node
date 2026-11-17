
import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

import app from '../src/app.js';
import User from '../src/models/User.js';

import Session from '../src/models/Session.js';

import { hashPassword } from '../src/utils/password.js';

// Restore mocked methods after every test.
test.afterEach(() => {
    mock.restoreAll();
});

// 1. Reject login requests with missing credentials.
test('Login endpoint should reject missing credentials', async () => {
    const response = await request(app)
        .post('/api/v1/auth/login')
        .send({});

    assert.equal(response.status, 400);
    assert.equal(response.body.success, false);
});

// 2. Return HTTP 401 when the email is not registered.
test('Login endpoint should reject an unknown email', async () => {
    mock.method(User, 'findOne', () => ({
        select: async () => null,
    }));

    const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
            email: 'unknown@example.com',
            password: 'Password123!',
        });

    assert.equal(response.status, 401);
    assert.equal(response.body.success, false);
    assert.equal(response.body.message, 'Invalid email or password');
});

// 3. Successfully log in and return an access token.
test('Login endpoint should return HTTP 200 for valid credentials', async () => {
    const passwordHash = await hashPassword('Password123!');

    const user = {
        _id: 'user123',
        name: 'Alex Johnson',
        email: 'alex@example.com',
        username: 'alex',
        passwordHash,
        role: 'user',
        status: 'active',
        isEmailVerified: true,
        isActive: true,
    };

    mock.method(User, 'findOne', () => ({
        select: async () => user,
    }));

    // Mock session creation so the API test does not access MongoDB.
    mock.method(Session, 'create', async () => ({
        _id: 'session123',
    }));

    const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
            email: 'alex@example.com',
            password: 'Password123!',
        });

    assert.equal(response.status, 200);
    assert.equal(response.body.success, true);
    assert.equal(response.body.message, 'Login successful.');

    // Access token should remain in the JSON response.
    assert.ok(response.body.data.accessToken);

    // User information should be returned.
    assert.equal(response.body.data.user.email, 'alex@example.com');

    // Refresh token must not appear in the JSON response.
    assert.equal(response.body.data.refreshToken, undefined);

    // Refresh token should be delivered through an HTTP-only cookie.
    const cookies = response.headers['set-cookie'];

    assert.ok(cookies);

    const refreshCookie = cookies.find((cookie) =>
        cookie.startsWith('refreshToken=')
    );

    assert.ok(refreshCookie);
    assert.match(refreshCookie, /HttpOnly/i);
    assert.match(refreshCookie, /SameSite=Lax/i);

    // Ensure the password hash is never exposed.
    assert.equal(response.body.data.user.passwordHash, undefined);
});
