
import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import Session from '../src/models/Session.js';

import User from '../src/models/User.js';

import { loginUser } from '../src/services/auth.service.js';
import { hashPassword } from '../src/utils/password.js';
import { verifyAccessToken } from '../src/utils/token.js';

// Restore mocked methods after every test.
test.afterEach(() => {
    mock.restoreAll();
});

// 1. Reject an email address that does not exist.
test('Login should reject an unknown email', async () => {
    mock.method(User, 'findOne', () => ({
        select: async () => null,
    }));

    await assert.rejects(
        loginUser({
            email: 'unknown@example.com',
            password: 'Password123!',
        }),
        {
            message: 'Invalid email or password',
            statusCode: 401,
        }
    );
});

// 2. Reject an incorrect password.
test('Login should reject an incorrect password', async () => {
    const passwordHash = await hashPassword('CorrectPassword123!');

    const user = {
        passwordHash,
        isEmailVerified: true,
        status: 'active',
        isActive: true,
    };

    mock.method(User, 'findOne', () => ({
        select: async () => user,
    }));

    await assert.rejects(
        loginUser({
            email: 'alex@example.com',
            password: 'WrongPassword123!',
        }),
        {
            message: 'Invalid email or password',
            statusCode: 401,
        }
    );
});

// 3. Reject accounts that have not verified their email.
test('Login should reject an unverified account', async () => {
    const user = {
        isEmailVerified: false,
        status: 'pending',
        isActive: false,
    };

    mock.method(User, 'findOne', () => ({
        select: async () => user,
    }));

    await assert.rejects(
        loginUser({
            email: 'alex@example.com',
            password: 'Password123!',
        }),
        {
            message: 'Please verify your email before logging in',
            statusCode: 403,
        }
    );
});

// 4. Successfully authenticate a verified user.
test('Login should return an access token and public user information', async () => {
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

    // Mock session creation so the test does not access MongoDB.
    mock.method(Session, 'create', async () => ({
        _id: 'session123',
    }));

    
    const result = await loginUser({
        email: 'alex@example.com',
        password: 'Password123!',
    }, {
        userAgent: 'Test User Agent',
        ipAddress: '127.0.0.1',
    });

    assert.ok(result.accessToken);
    assert.equal(result.user.id, 'user123');
    assert.equal(result.user.email, 'alex@example.com');
    assert.equal(result.user.name, 'Alex Johnson');

    const decodedToken = verifyAccessToken(result.accessToken);

    assert.equal(decodedToken.sub, 'user123');
    assert.equal(decodedToken.role, 'user');

    // Password hashes must never appear in the response.
    assert.equal(result.user.passwordHash, undefined);
});
