
import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';

import Session from '../src/models/Session.js';
import User from '../src/models/User.js';

import {
  createSession,
  rotateRefreshToken,
} from '../src/services/session.service.js';

import {
  verifyTokenHash,
} from '../src/utils/hash.js';

// Restore mocked methods after every test.
test.afterEach(() => {
  mock.restoreAll();
});

// Mock a MongoDB transaction.
const mockTransaction = () => {
  const transaction = {
    withTransaction: async (callback) => callback(),
    endSession: async () => {},
  };

  mock.method(mongoose, 'startSession', async () => transaction);
};

// Verify that a session is created with a hashed refresh token.
test('Session should store a hashed refresh token', async () => {
  let savedSession;

  mock.method(Session, 'create', async (data) => {
    savedSession = data;
    return { _id: 'session123' };
  });

  const result = await createSession({
    _id: 'user123',
  });

  assert.ok(result.refreshToken);
  assert.equal(result.sessionId, 'session123');

  assert.ok(savedSession.tokenHash);
  assert.notEqual(savedSession.tokenHash, result.refreshToken);

  assert.equal(
    verifyTokenHash(result.refreshToken, savedSession.tokenHash),
    true
  );
});

// Verify that the session expires after seven days.
test('Session should expire after the configured duration', async () => {
  let savedSession;

  mock.method(Session, 'create', async (data) => {
    savedSession = data;
    return { _id: 'session456' };
  });

  const beforeCreation = Date.now();

  await createSession({ _id: 'user123' });

  const afterCreation = Date.now();

  const expectedDuration = 7 * 24 * 60 * 60 * 1000;

  assert.ok(
    savedSession.expiresAt.getTime() >= beforeCreation + expectedDuration
  );

  assert.ok(
    savedSession.expiresAt.getTime() <= afterCreation + expectedDuration
  );
});

// Verify that device metadata is saved.
test('Session should save device metadata', async () => {
  let savedSession;

  mock.method(Session, 'create', async (data) => {
    savedSession = data;
    return { _id: 'session789' };
  });

  await createSession(
    { _id: 'user123' },
    {
      deviceName: 'My Android Phone',
      deviceType: 'mobile',
      userAgent: 'Test Browser',
      ipAddress: '127.0.0.1',
    }
  );

  assert.equal(savedSession.deviceName, 'My Android Phone');
  assert.equal(savedSession.deviceType, 'mobile');
  assert.equal(savedSession.userAgent, 'Test Browser');
  assert.equal(savedSession.ipAddress, '127.0.0.1');
});

// Verify that a valid refresh token creates a replacement session.
test('Refresh token should rotate successfully', async () => {
  mockTransaction();

  const oldSession = {
    _id: 'oldSession123',
    user: 'user123',
    revokedAt: null,
    expiresAt: new Date(Date.now() + 60_000),
    deviceName: 'My Phone',
    deviceType: 'mobile',
    userAgent: 'Test Browser',
    ipAddress: '127.0.0.1',
  };

  const user = {
    _id: 'user123',
    isActive: true,
    status: 'active',
    isEmailVerified: true,
    role: 'user',
  };

  mock.method(Session, 'findOne', () => ({
    select() {
      return this;
    },
    session: async () => oldSession,
  }));

  mock.method(User, 'findById', () => ({
    session: async () => user,
  }));

  let replacementData;

  mock.method(Session, 'create', async (data) => {
    replacementData = data[0];
    return [{ _id: 'newSession123' }];
  });

  let updatedOldSession;

  mock.method(Session, 'findOneAndUpdate', async (filter, update) => {
    updatedOldSession = { filter, update };
    return { _id: oldSession._id };
  });

  const result = await rotateRefreshToken('a'.repeat(128));

  assert.ok(result.refreshToken);
  assert.ok(result.accessToken);

  assert.equal(replacementData.user, oldSession.user);
  assert.ok(replacementData.tokenHash);
  assert.notEqual(replacementData.tokenHash, result.refreshToken);

  assert.equal(
    updatedOldSession.update.$set.revocationReason,
    'token_rotation'
  );

  assert.equal(
    updatedOldSession.update.$set.replacedBy,
    'newSession123'
  );
});

// Verify that an expired refresh token is rejected.
test('Expired refresh token should be rejected', async () => {
  mockTransaction();

  const expiredSession = {
    _id: 'expiredSession123',
    user: 'user123',
    revokedAt: null,
    expiresAt: new Date(Date.now() - 60_000),
    revocationReason: null,
  };

  mock.method(Session, 'findOne', () => ({
    select() {
      return this;
    },
    session: async () => expiredSession,
  }));

  await assert.rejects(
    rotateRefreshToken('a'.repeat(128)),
    {
      message: 'Invalid or expired refresh token',
      statusCode: 401,
    }
  );
});

// Verify that reusing a rotated token revokes other active sessions.
test('Reused refresh token should revoke all active sessions', async () => {
  mockTransaction();

  const oldSession = {
    _id: 'oldSession123',
    user: 'user123',
    revokedAt: new Date(),
    expiresAt: new Date(Date.now() + 60_000),
    revocationReason: 'token_rotation',
  };

  mock.method(Session, 'findOne', () => ({
    select() {
      return this;
    },
    session: async () => oldSession,
  }));

  let revokedSessions;

  mock.method(Session, 'updateMany', async (filter, update) => {
    revokedSessions = { filter, update };
  });

  await assert.rejects(
    rotateRefreshToken('a'.repeat(128)),
    {
      message: 'Refresh token reuse detected. Please log in again.',
      statusCode: 401,
    }
  );

  assert.equal(revokedSessions.filter.user, 'user123');

  assert.equal(
    revokedSessions.update.$set.revocationReason,
    'security_action'
  );
});
