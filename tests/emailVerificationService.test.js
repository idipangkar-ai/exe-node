
import { test, mock } from 'node:test';
import assert from 'node:assert/strict';

import mongoose from 'mongoose';

import User from '../src/models/User.js';
import EmailVerification from '../src/models/EmailVerification.js';

import { verifyEmail } from '../src/services/emailVerification.service.js';

// Restore mocked methods after every test.
test.afterEach(() => {
    mock.restoreAll();
});

// 1. Reject incorrectly formatted tokens.
test('Email verification should reject an invalid token format', async () => {
    await assert.rejects(
        verifyEmail('invalid-token'),
        {
            message: 'Invalid or expired verification link',
        }
    );
});

// 2. Reject tokens that do not exist.
test('Email verification should reject an unknown token', async () => {
    const sessionMock = {
        withTransaction: async (callback) => callback(),
        endSession: async () => { },
    };

    mock.method(mongoose, 'startSession', async () => sessionMock);

    const findOneMock = mock.method(
        EmailVerification,
        'findOne',
        () => ({
            session: async () => null,
        })
    );

    await assert.rejects(
        verifyEmail('a'.repeat(64)),
        {
            message: 'Invalid or expired verification link',
        }
    );

    assert.equal(findOneMock.mock.callCount(), 1);
});

// 3. Reject tokens that have already been used.
test('Email verification should reject an already-used token', async () => {
    const sessionMock = {
        withTransaction: async (callback) => callback(),
        endSession: async () => { },
    };

    mock.method(mongoose, 'startSession', async () => sessionMock);

    const usedVerification = {
        usedAt: new Date(),
        expiresAt: new Date(Date.now() + 60_000),
    };

    mock.method(EmailVerification, 'findOne', () => ({
        session: async () => usedVerification,
    }));

    await assert.rejects(
        verifyEmail('c'.repeat(64)),
        {
            message: 'This verification link has already been used',
        }
    );
});

// 4. Successfully verify an email and activate the account.
test('Email verification should activate a valid user account', async () => {
    const sessionMock = {
        withTransaction: async (callback) => callback(),
        endSession: async () => { },
    };

    mock.method(mongoose, 'startSession', async () => sessionMock);

    const user = {
        _id: 'user123',
        name: 'Alex Johnson',
        email: 'alex@example.com',
        role: 'user',
        status: 'pending',
        isEmailVerified: false,
        isActive: false,
        save: async () => { },
    };

    const verification = {
        user: 'user123',
        usedAt: null,
        expiresAt: new Date(Date.now() + 60_000),
        save: async () => { },
    };

    mock.method(EmailVerification, 'findOne', () => ({
        session: async () => verification,
    }));

    mock.method(User, 'findById', () => ({
        session: async () => user,
    }));

    const result = await verifyEmail('d'.repeat(64));

    assert.equal(result.id, 'user123');
    assert.equal(result.isEmailVerified, true);
    assert.equal(result.status, 'active');

    assert.ok(verification.usedAt);
    assert.equal(user.isActive, true);
    assert.ok(user.emailVerifiedAt);
});

// 5. Reject accounts that are already verified.
test('Email verification should reject an already-verified account', async () => {
    const sessionMock = {
        withTransaction: async (callback) => callback(),
        endSession: async () => { },
    };

    mock.method(mongoose, 'startSession', async () => sessionMock);

    const verification = {
        user: 'user123',
        usedAt: null,
        expiresAt: new Date(Date.now() + 60_000),
    };

    const user = {
        isEmailVerified: true,
    };

    mock.method(EmailVerification, 'findOne', () => ({
        session: async () => verification,
    }));

    mock.method(User, 'findById', () => ({
        session: async () => user,
    }));

    await assert.rejects(
        verifyEmail('e'.repeat(64)),
        {
            message: 'Email address is already verified',
        }
    );
});

// 6. Reject verification records linked to missing users.
test('Email verification should reject a missing user account', async () => {
    const sessionMock = {
        withTransaction: async (callback) => callback(),
        endSession: async () => { },
    };

    mock.method(mongoose, 'startSession', async () => sessionMock);

    const verification = {
        user: 'missing-user',
        usedAt: null,
        expiresAt: new Date(Date.now() + 60_000),
    };

    mock.method(EmailVerification, 'findOne', () => ({
        session: async () => verification,
    }));

    mock.method(User, 'findById', () => ({
        session: async () => null,
    }));

    await assert.rejects(
        verifyEmail('f'.repeat(64)),
        {
            message: 'User account not found',
            statusCode: 404,
        }
    );
});

// 7. Ensure the database session is closed after a verification failure.
// test('Email verification should close the session when verification fails', async () => {
//     const endSessionMock = mock.fn(async () => { });

//     const sessionMock = {
//         withTransaction: async (callback) => callback(),
//         endSession: endSessionMock,
//     };

//     const startSessionMock = mock.method(
//         mongoose,
//         'startSession',
//         async () => sessionMock
//     );

//     mock.method(EmailVerification, 'findOne', () => ({
//         session: async () => null,
//     }));

//     await assert.rejects(
//   verifyEmail('g'.repeat(64)),
//   {
//     message: 'Invalid or expired verification link',
//   }
// );

// console.log('Session created:', startSessionMock.mock.callCount());
// console.log('Session closed:', endSessionMock.mock.callCount());

// assert.equal(startSessionMock.mock.callCount(), 1);
// assert.equal(endSessionMock.mock.callCount(), 1);
    
// });
