
import { test } from 'node:test';
import assert from 'node:assert/strict';

import seedRoles, {
  defaultRoles,
} from '../src/database/seedRoles.js';

// Create a fake Role model to test without MongoDB.
const createFakeRoleModel = () => {
  const insertedRoles = new Map();
  const calls = [];

  return {
    insertedRoles,
    calls,

    async updateOne(filter, update, options) {
      calls.push({ filter, update, options });

      // Simulate MongoDB's upsert and $setOnInsert behavior.
      if (!insertedRoles.has(filter.name) && options.upsert) {
        insertedRoles.set(filter.name, update.$setOnInsert);
      }
    },
  };
};

// Verify that all four default roles are created.
test('Seeder should create all four default roles', async () => {
  const fakeRoleModel = createFakeRoleModel();

  const count = await seedRoles(fakeRoleModel);

  assert.equal(count, 4);
  assert.equal(fakeRoleModel.insertedRoles.size, 4);

  assert.ok(fakeRoleModel.insertedRoles.has('user'));
  assert.ok(fakeRoleModel.insertedRoles.has('moderator'));
  assert.ok(fakeRoleModel.insertedRoles.has('admin'));
  assert.ok(fakeRoleModel.insertedRoles.has('superadmin'));
});

// Verify that the seeder uses upsert and $setOnInsert.
test('Seeder should use upsert without overwriting existing roles', async () => {
  const fakeRoleModel = createFakeRoleModel();

  await seedRoles(fakeRoleModel);

  assert.equal(fakeRoleModel.calls.length, 4);

  for (const call of fakeRoleModel.calls) {
    assert.equal(call.options.upsert, true);
    assert.ok(call.update.$setOnInsert);
    assert.equal(call.update.$set, undefined);
  }
});

// Verify that default roles are marked as system roles.
test('All default roles should be system roles', () => {
  assert.equal(defaultRoles.length, 4);

  for (const role of defaultRoles) {
    assert.equal(role.isSystem, true);
  }
});
