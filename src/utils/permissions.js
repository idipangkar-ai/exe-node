
// Central registry of permissions supported by EXE-NODE.
const permissions = {
  // User management permissions.
  USERS_READ: 'users.read',
  USERS_UPDATE: 'users.update',
  USERS_DELETE: 'users.delete',
  USERS_BLOCK: 'users.block',

  // Role management permissions.
  ROLES_READ: 'roles.read',
  ROLES_CREATE: 'roles.create',
  ROLES_UPDATE: 'roles.update',
  ROLES_DELETE: 'roles.delete',

  // Session management permissions.
  SESSIONS_READ: 'sessions.read',
  SESSIONS_REVOKE: 'sessions.revoke',

  // Audit log permissions.
  AUDIT_LOGS_READ: 'audit_logs.read',
};

export default Object.freeze(permissions);
