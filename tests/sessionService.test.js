
import { test, mock } from 'node:test';
import assert from 'node:assert/strict';

import Session from '../src/models/Session.js';

import { createSession } from '../src/services/session.service.js';

import {
  verifyTokenHash,
} from '../src/utils/hash.js';

// Restore mocked methods after every test.
test.afterEach(() => {
  mock.restoreAll();
});

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
