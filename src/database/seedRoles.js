
import Role from '../models/Role.js';

// Define the default roles and their permissions.
export const defaultRoles = [
  {
    name: 'user',
    description: 'Standard registered user',
    permissions: [],
    isSystem: true,
  },
  {
    name: 'moderator',
    description: 'Moderates users and application content',
    permissions: [
      'users.read',
      'users.block',
    ],
    isSystem: true,
  },
  {
    name: 'admin',
    description: 'Manages users, roles and sessions',
    permissions: [
      'users.read',
      'users.update',
      'users.delete',
      'users.block',
      'roles.read',
      'roles.create',
      'roles.update',
      'roles.delete',
      'sessions.read',
      'sessions.revoke',
      'audit_logs.read',
    ],
    isSystem: true,
  },
  {
    name: 'superadmin',
    description: 'Full system administration',
    permissions: [
      'users.read',
      'users.update',
      'users.delete',
      'users.block',
      'roles.read',
      'roles.create',
      'roles.update',
      'roles.delete',
      'sessions.read',
      'sessions.revoke',
      'audit_logs.read',
    ],
    isSystem: true,
  },
];

// Seed roles into the database.
// The model parameter can be replaced with a fake model during tests.
const seedRoles = async (RoleModel = Role) => {
  for (const role of defaultRoles) {
    await RoleModel.updateOne(
      { name: role.name },
      { $setOnInsert: role },
      { upsert: true }
    );
  }

  return defaultRoles.length;
};

export default seedRoles;
