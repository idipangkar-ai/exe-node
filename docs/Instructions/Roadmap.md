# EXE-NODE — MASTER DEVELOPMENT ROADMAP

**Project Name:** EXE-NODE  
**Project Type:** Standalone Authentication Backend  
**Project Version:** 1.0.0  
**Development Status:** Foundation Completed  
**Primary Language:** JavaScript (ES Modules)  
**Runtime:** Node.js  
**API Framework:** Express.js 5  
**Database:** MongoDB Atlas  
**ODM:** Mongoose  
**API Testing:** Postman  
**Source Control:** Git / GitHub

---

# 1. PROJECT OVERVIEW

## 1.1 Project Objective

EXE-NODE is an independent, reusable authentication and authorization backend.

The primary objective is to develop a secure, maintainable and extensible authentication API that can be integrated with multiple frontend applications without depending on any particular frontend technology.

The backend should provide centralized identity management, authentication, session management, authorization and account security.

EXE-NODE will be developed independently of the React Native OTA project.

## 1.2 Intended Applications

The authentication backend should eventually support:

- React Native mobile applications.
- React Native CLI applications.
- Web applications.
- Admin dashboards.
- Desktop applications.
- Third-party applications.
- Other backend services.

## 1.3 Core Development Principles

1. Security must be considered from the beginning.
2. Passwords must never be stored as plaintext.
3. Authentication and authorization must remain separate concerns.
4. Every protected API endpoint must validate authentication.
5. Sensitive configuration must remain outside source code.
6. Database operations must use validated data.
7. API responses must follow a consistent format.
8. Every major feature must have corresponding documentation.
9. Important functionality must have automated tests.
10. Avoid unnecessary dependencies.
11. Prefer modular and reusable code.
12. Do not introduce features without understanding their purpose.

---

# 2. TECHNOLOGY STACK

## 2.1 Backend Runtime

**Node.js**

Purpose:
- Execute JavaScript on the server.
- Handle API requests.
- Manage asynchronous operations.
- Communicate with MongoDB.
- Run authentication and authorization logic.

## 2.2 API Framework

**Express.js 5**

Purpose:
- Create REST API endpoints.
- Handle HTTP requests and responses.
- Organize middleware.
- Manage routes.
- Handle API errors.

## 2.3 Database

**MongoDB Atlas**

Purpose:
- Store user information.
- Store authentication sessions.
- Store account verification information.
- Store password recovery information.
- Store roles and permissions.
- Store security-related records.

## 2.4 Database ODM

**Mongoose**

Purpose:
- Define database schemas.
- Create database models.
- Validate database documents.
- Perform database queries.
- Manage relationships and indexes.

## 2.5 Authentication

**JSON Web Tokens (JWT)**

Purpose:
- Generate signed access tokens.
- Verify access tokens.
- Authenticate API requests.
- Carry limited identity and authorization claims.

Planned token architecture:

- Short-lived access tokens.
- Long-lived refresh tokens.
- Refresh-token rotation.
- Refresh-token revocation.
- Server-side session tracking.

## 2.6 Password Security

**Argon2id**

Purpose:
- Hash user passwords.
- Verify submitted passwords.
- Protect stored password credentials against offline attacks.

## 2.7 Input Validation

**Zod**

Purpose:
- Validate request bodies.
- Validate email addresses.
- Validate password requirements.
- Validate route parameters.
- Validate query parameters.

## 2.8 HTTP Security

Planned packages:

- Helmet
- Express Rate Limit
- CORS
- Cookie Parser

Purpose:
- Apply HTTP security headers.
- Limit excessive requests.
- Control cross-origin access.
- Parse authentication cookies where needed.

## 2.9 Email Services

**Nodemailer**

Purpose:
- Send account verification emails.
- Send password recovery emails.
- Send security notifications.
- Send account-related communications.

---

# 3. PROJECT STRUCTURE

The backend will follow a modular architecture.

Planned structure:

```text
exe-node/
│
├── docs/
│   ├── Instructions/
│   ├── Architecture/
│   ├── Packages/
│   ├── API/
│   ├── Security/
│   ├── Database/
│   ├── Testing/
│   ├── Deployment/
│   └── others/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── validators/
│   ├── utils/
│   ├── constants/
│   ├── templates/
│   ├── app.js
│   └── index.js
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── helpers/
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

This is the target structure. Directories will be introduced as their corresponding features are developed.

---

# 4. DEVELOPMENT PHASES

# PHASE 1 — BACKEND FOUNDATION

**Status: COMPLETED**

Objective: Establish a functioning Node.js backend connected to MongoDB Atlas.

## Tasks

- [x] Initialize Node.js project.
- [x] Configure ES Modules.
- [x] Create package.json.
- [x] Install Express.
- [x] Install Mongoose.
- [x] Install dotenv.
- [x] Install CORS.
- [x] Install Nodemon.
- [x] Create source directory.
- [x] Create configuration directory.
- [x] Create database connection file.
- [x] Configure MongoDB Atlas.
- [x] Create Express application.
- [x] Create server entry point.
- [x] Configure environment variables.
- [x] Implement health-check endpoint.
- [x] Start development server.
- [x] Verify MongoDB connection.
- [x] Test API through Postman.

## Completed Components

`src/config/database.js`

Responsible for establishing the MongoDB connection.

`src/app.js`

Responsible for initializing Express and configuring application-level middleware and routes.

`src/index.js`

Responsible for starting the HTTP server.

## Verification

Expected database output:

```text
MongoDB connected successfully
```

Expected server output:

```text
EXE-NODE server running on port 5000
```

Health-check endpoint:

```http
GET /api/health
```

Expected response:

```json
{
  "success": true,
  "message": "EXE-NODE API is running"
}
```

## Completion Criteria

- MongoDB connection succeeds.
- Express server starts successfully.
- Health-check endpoint responds with HTTP 200.
- Postman can communicate with the local API.

---

# PHASE 2 — AUTHENTICATION FOUNDATION

**Status: NOT STARTED**

Objective: Implement the core user identity and authentication system.

## 2.1 Dependency Installation

- [ ] jsonwebtoken
- [ ] argon2
- [ ] helmet
- [ ] express-rate-limit
- [ ] zod
- [ ] cookie-parser
- [ ] nodemailer

## 2.2 User Database Model

Create:

`src/models/User.js`

Planned user fields:

- User ID.
- Full name.
- Email.
- Password hash.
- Email verification status.
- Account status.
- Role.
- Created timestamp.
- Updated timestamp.
- Last login timestamp.

Requirements:

- Email must be unique.
- Email must be normalized.
- Password hash must never be returned in normal API responses.
- Password must be hashed before storage.
- Database indexes must support common queries.
- Account status must be validated.

## 2.3 Request Validation

Create:

`src/validators/auth.validator.js`

Validation requirements:

- Required fields.
- Valid email format.
- Password length and policy.
- Valid input types.
- Unknown fields handling.
- Consistent validation errors.

## 2.4 User Registration

Endpoint:

```http
POST /api/v1/auth/register
```

Expected request:

```json
{
  "name": "Example User",
  "email": "user@example.com",
  "password": "ExampleStrongPassword123!"
}
```

Expected behavior:

1. Receive registration request.
2. Validate request data.
3. Normalize email.
4. Check whether account already exists.
5. Hash password using Argon2id.
6. Create user record.
7. Trigger email verification workflow.
8. Return a safe API response.

Requirements:

- Never return password hashes.
- Prevent duplicate accounts.
- Avoid leaking sensitive account information.
- Apply registration rate limits.
- Use appropriate HTTP status codes.

## 2.5 User Login

Endpoint:

```http
POST /api/v1/auth/login
```

Expected behavior:

1. Receive email and password.
2. Validate input.
3. Find user account.
4. Verify password hash.
5. Check account status.
6. Create authenticated session.
7. Generate access token.
8. Generate refresh token.
9. Return authentication response.

Security requirements:

- Generic invalid-credential responses.
- Rate limiting.
- No plaintext password storage.
- Secure refresh-token handling.
- Account suspension checks.

## 2.6 JWT Access Token

Create:

`src/services/token.service.js`

Responsibilities:

- Generate JWT access tokens.
- Verify JWT signatures.
- Configure token expiration.
- Validate issuer.
- Validate audience.
- Validate permitted algorithms.

JWT payload should contain only necessary claims.

Never include:

- Passwords.
- Password hashes.
- Refresh tokens.
- Sensitive personal information.
- Database credentials.

## 2.7 Authentication Middleware

Create:

`src/middleware/auth.middleware.js`

Responsibilities:

- Extract access token.
- Verify token signature.
- Check expiration.
- Validate claims.
- Identify authenticated user.
- Attach authenticated identity to request context.
- Reject unauthorized requests.

## Completion Criteria

- User can register.
- Password is stored as an Argon2id hash.
- Duplicate email registration is rejected.
- User can log in.
- JWT access token is generated.
- Protected endpoint rejects missing or invalid tokens.
- Protected endpoint accepts valid tokens.

---

# PHASE 3 — REFRESH TOKENS AND SESSION MANAGEMENT

**Status: NOT STARTED**

Objective: Maintain secure authentication sessions across multiple devices.

## 3.1 Session Database Model

Create:

`src/models/Session.js`

Planned fields:

- Session ID.
- User ID.
- Refresh-token hash.
- Token family identifier.
- Device information.
- IP information where appropriate.
- Created timestamp.
- Expiration timestamp.
- Revocation timestamp.
- Last-used timestamp.

## 3.2 Refresh Token

Responsibilities:

- Generate secure refresh tokens.
- Store only refresh-token hashes.
- Associate tokens with sessions.
- Validate refresh requests.
- Rotate refresh tokens after successful use.
- Detect reuse of revoked tokens.
- Revoke compromised token families.

## 3.3 Refresh Endpoint

Endpoint:

```http
POST /api/v1/auth/refresh
```

Expected behavior:

1. Receive refresh token.
2. Identify corresponding session.
3. Verify token.
4. Check session status.
5. Revoke or rotate previous token.
6. Issue new access token.
7. Issue new refresh token.
8. Return updated authentication credentials.

## 3.4 Logout

Endpoint:

```http
POST /api/v1/auth/logout
```

Expected behavior:

- Revoke current session.
- Invalidate refresh-token use.
- Clear authentication cookies when cookie-based transport is used.

## 3.5 Session Management

Planned endpoints:

```http
GET    /api/v1/auth/sessions
DELETE /api/v1/auth/sessions/:sessionId
DELETE /api/v1/auth/sessions
```

Features:

- List active sessions.
- Revoke individual sessions.
- Revoke all sessions.
- Support multiple devices.
- Track session expiration.

## Completion Criteria

- Refresh-token rotation works.
- Revoked tokens cannot be reused.
- Logout invalidates the corresponding session.
- Users can manage their active sessions.
- Multiple-device sessions work independently.

---

# PHASE 4 — EMAIL VERIFICATION

**Status: NOT STARTED**

Objective: Verify ownership of user email addresses.

## Features

- Email verification token generation.
- Secure verification-token storage.
- Verification email delivery.
- Email verification endpoint.
- Token expiration.
- Single-use verification.
- Resend verification email.
- Verification status management.

Planned endpoints:

```http
POST /api/v1/auth/verify-email
POST /api/v1/auth/resend-verification
```

Requirements:

- Verification tokens must be unpredictable.
- Store verification-token hashes.
- Verification links must expire.
- Tokens must not be reusable.
- Email changes must require re-verification.

## Completion Criteria

- User receives verification email.
- Valid verification link activates email verification.
- Expired tokens are rejected.
- Used tokens cannot be reused.

---

# PHASE 5 — PASSWORD MANAGEMENT

**Status: NOT STARTED**

Objective: Provide secure password recovery and password changes.

## 5.1 Forgot Password

Endpoint:

```http
POST /api/v1/auth/forgot-password
```

Features:

- Accept email address.
- Generate secure recovery token.
- Store token hash.
- Set token expiration.
- Send password-reset email.
- Return a generic response to prevent account enumeration.

## 5.2 Reset Password

Endpoint:

```http
POST /api/v1/auth/reset-password
```

Features:

- Verify recovery token.
- Check expiration.
- Validate new password.
- Hash new password.
- Update password.
- Invalidate used recovery token.
- Revoke existing sessions according to security policy.

## 5.3 Change Password

Endpoint:

```http
POST /api/v1/auth/change-password
```

Requirements:

- User must be authenticated.
- Verify current password.
- Validate new password.
- Hash new password.
- Update account credentials.
- Apply session-revocation policy.

## Completion Criteria

- Forgot-password flow works.
- Password-reset links expire.
- Used reset tokens cannot be reused.
- Passwords remain securely hashed.
- Existing sessions are handled according to policy.

---

# PHASE 6 — AUTHORIZATION AND ACCESS CONTROL

**Status: NOT STARTED**

Objective: Control what authenticated users can access.

Authentication determines who the user is.

Authorization determines what the user is allowed to do.

## 6.1 Role-Based Access Control

Initial roles:

- USER
- ADMIN
- SUPER_ADMIN

Additional roles may be introduced later.

## 6.2 Permissions

Example permissions:

- user:read
- user:update
- user:delete
- user:list
- session:revoke
- admin:access
- role:manage

## 6.3 Authorization Middleware

Create:

`src/middleware/role.middleware.js`

Responsibilities:

- Verify user roles.
- Check required permissions.
- Reject unauthorized access.
- Prevent privilege escalation.

## 6.4 Administration

Planned endpoints:

```http
GET    /api/v1/admin/users
GET    /api/v1/admin/users/:userId
PATCH  /api/v1/admin/users/:userId/status
DELETE /api/v1/admin/users/:userId
```

Requirements:

- Admin-only access.
- Explicit permission checks.
- Audit logging.
- Account suspension.
- Appropriate administrative error handling.

## Completion Criteria

- Roles are stored and validated.
- Protected routes enforce permissions.
- Ordinary users cannot access administrative endpoints.
- Privilege changes are controlled and auditable.

---

# PHASE 7 — MULTI-FACTOR AUTHENTICATION

**Status: FUTURE DEVELOPMENT**

Objective: Add additional account protection.

Planned features:

- Time-based one-time passwords (TOTP).
- Authenticator application support.
- MFA enrollment.
- MFA verification.
- Recovery codes.
- MFA disable workflow.
- MFA recovery procedures.

Additional security requirements:

- Store MFA secrets encrypted.
- Protect recovery codes.
- Require appropriate verification before changing MFA settings.
- Rate-limit MFA attempts.

---

# PHASE 8 — ACCOUNT AND PROFILE MANAGEMENT

**Status: NOT STARTED**

Objective: Provide account-management functionality.

Planned endpoints:

```http
GET    /api/v1/users/me
PATCH  /api/v1/users/me
PATCH  /api/v1/users/me/email
DELETE /api/v1/users/me
```

Features:

- View profile.
- Update profile.
- Change email.
- Account deletion.
- Account deactivation.
- Account suspension.
- Account recovery policy.

Requirements:

- Users can access only their own profiles unless authorized.
- Sensitive changes require additional verification.
- Account deletion must follow a documented data-retention policy.

---

# PHASE 9 — SECURITY HARDENING

**Status: NOT STARTED**

Objective: Prepare the authentication backend for production use.

## Security Areas

### Password Security

- Argon2id hashing.
- Appropriate password policy.
- No plaintext password storage.
- No password logging.
- Password-reset token expiration.

### JWT Security

- Strong signing secrets or private keys.
- Short access-token lifetime.
- Explicit algorithm allowlist.
- Issuer validation.
- Audience validation.
- Expiration validation.
- Secure refresh-token rotation.

### API Security

- Helmet.
- CORS allowlist.
- Rate limiting.
- Request validation.
- Centralized error handling.
- Request-size limits.
- Safe error responses.
- Protection against brute-force attacks.

### Database Security

- Dedicated database credentials.
- Least-privilege database permissions.
- TLS connections.
- Network access restrictions.
- Secure environment configuration.
- Database backup policy.

### Session Security

- Refresh-token hashing.
- Session expiration.
- Token rotation.
- Session revocation.
- Reuse detection.
- Device/session management.

### Operational Security

- Never commit `.env`.
- Never expose database credentials.
- Never expose JWT secrets.
- Avoid logging authentication tokens.
- Keep dependencies updated.
- Review security advisories.

## Completion Criteria

- Security configuration reviewed.
- Sensitive values protected.
- Authentication endpoints rate-limited.
- Session lifecycle tested.
- Common attack scenarios tested.
- Security documentation updated.

---

# PHASE 10 — TESTING AND QUALITY ASSURANCE

**Status: NOT STARTED**

Objective: Ensure features work correctly and securely.

## 10.1 Unit Testing

Test individual components:

- Password hashing.
- Password verification.
- Token generation.
- Token verification.
- Input validation.
- Session services.
- Permission checks.

## 10.2 Integration Testing

Test complete workflows:

- Registration.
- Login.
- Invalid credentials.
- Duplicate registration.
- Email verification.
- Refresh-token rotation.
- Logout.
- Password recovery.
- Protected routes.
- Role restrictions.

## 10.3 Security Testing

Test:

- Missing access tokens.
- Invalid JWT signatures.
- Expired access tokens.
- Invalid refresh tokens.
- Refresh-token reuse.
- Excessive login attempts.
- Invalid input.
- Unauthorized administrative access.
- Account enumeration behavior.

## 10.4 API Testing

Use Postman to verify:

- HTTP methods.
- Request bodies.
- Headers.
- Authentication.
- Response status codes.
- Error responses.
- Token behavior.

## Completion Criteria

- Critical authentication workflows have automated tests.
- Integration tests cover important API flows.
- Security-related failure scenarios are tested.
- No known critical authentication failures remain unresolved.

---

# PHASE 11 — API DOCUMENTATION

**Status: NOT STARTED**

Objective: Make EXE-NODE easy to integrate with any frontend.

Planned documentation:

- API overview.
- Endpoint reference.
- Request examples.
- Response examples.
- Authentication requirements.
- Error codes.
- Token lifecycle.
- Refresh-token workflow.
- Session management.
- Role and permission requirements.

Planned tooling:

- OpenAPI specification.
- Swagger UI.

The API documentation must remain synchronized with the actual implementation.

---

# PHASE 12 — PRODUCTION DEPLOYMENT

**Status: NOT STARTED**

Objective: Deploy EXE-NODE as a production-ready authentication service.

## Deployment Requirements

- Production environment variables.
- Production MongoDB configuration.
- HTTPS.
- Secure secret management.
- Process management.
- Logging.
- Monitoring.
- Health checks.
- Database backup.
- Error monitoring.
- Deployment documentation.

## Production Verification

- Database connection verified.
- Registration tested.
- Login tested.
- Refresh-token rotation tested.
- Logout tested.
- Password recovery tested.
- Rate limiting verified.
- HTTPS verified.
- Secrets verified.
- Monitoring verified.

---

# 5. API VERSIONING STRATEGY

Initial API prefix:

```text
/api/v1/
```

Planned route groups:

```text
/api/v1/auth/
/api/v1/users/
/api/v1/admin/
/api/v1/sessions/
```

API versioning will allow future changes without immediately breaking existing client applications.

---

# 6. DATABASE COLLECTION PLAN

Planned MongoDB collections:

| Collection | Responsibility |
|---|---|
| users | User identity and account information |
| sessions | Authentication sessions and refresh-token hashes |
| verificationtokens | Email verification |
| passwordresets | Password recovery |
| roles | Role definitions |
| permissions | Permission definitions |
| auditlogs | Security and administrative events |

Collections will be introduced when their corresponding features are implemented.

---

# 7. ERROR HANDLING STANDARD

All API responses should follow a consistent structure.

Example success response:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

Example error response:

```json
{
  "success": false,
  "message": "Invalid request",
  "errors": []
}
```

Requirements:

- Appropriate HTTP status codes.
- No database stack traces in production.
- No secret values in error responses.
- Consistent error structures.
- Centralized error-handling middleware.

---

# 8. ENVIRONMENT CONFIGURATION

Planned environment variables:

```env
NODE_ENV=development
PORT=5000

MONGODB_URI=

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

CORS_ORIGIN=

EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASSWORD=
EMAIL_FROM=
```

Actual values must be stored in `.env` or an appropriate production secret manager.

Never commit real credentials to GitHub.

`.env.example` must contain variable names and safe placeholder values only.

---

# 9. DEVELOPMENT WORKFLOW

Every feature should follow this process:

1. Define the feature.
2. Document its purpose.
3. Identify required dependencies.
4. Design its data model.
5. Implement the service logic.
6. Implement its API routes.
7. Add middleware and validation.
8. Test success scenarios.
9. Test failure scenarios.
10. Review security implications.
11. Update documentation.
12. Update the roadmap.

No major feature should be marked complete before its acceptance criteria are satisfied.

---

# 10. GIT AND VERSION CONTROL

Repository:

https://github.com/idipangkar-ai/exe-node

Branch strategy:

- main: stable project history.
- feature branches: individual development tasks.
- bugfix branches: bug corrections.

Commit examples:

```text
Initial backend setup
Add MongoDB connection
Implement user registration
Add JWT authentication
Implement refresh-token rotation
Add email verification
```

Git requirements:

- Commit source code.
- Commit documentation.
- Commit package-lock.json.
- Exclude node_modules.
- Exclude build artifacts.
- Exclude real environment secrets.
- Never commit production credentials.

---

# 11. PROJECT COMPLETION DEFINITION

EXE-NODE will be considered ready for its first production release when:

- User registration works.
- User login works.
- Password hashing is secure.
- Access-token verification works.
- Refresh-token rotation works.
- Logout and session revocation work.
- Email verification works.
- Password recovery works.
- Role-based authorization works.
- Account management works.
- API validation is implemented.
- Rate limiting is configured.
- Security testing is completed.
- Integration tests pass.
- API documentation is available.
- Production configuration is documented.
- Deployment verification is complete.

Advanced features such as MFA, social login and enterprise identity integrations may be released in subsequent versions.

---

# 12. CURRENT PROJECT STATUS

## Completed

- Node.js project initialized.
- JavaScript ES Modules configured.
- Express server created.
- Mongoose configured.
- MongoDB Atlas connection established.
- Environment variables loaded.
- Health-check endpoint implemented.
- Postman connectivity verified.
- GitHub repository established.
- Documentation structure created.

## Current Development Phase

**Phase 2 — Authentication Foundation**

## Immediate Next Tasks

1. Finalize dependency registry.
2. Install authentication and security dependencies.
3. Document package selection.
4. Design the User model.
5. Implement request validation.
6. Implement Argon2id password hashing.
7. Build registration endpoint.
8. Test registration through Postman.

---

# 13. DEVELOPMENT LOG

| Date | Activity | Status |
|---|---|---|
| 2026-11-16 | Node.js foundation | Completed |
| 2026-11-16 | MongoDB Atlas connection | Completed |
| 2026-11-16 | Express health check | Completed |
| 2026-11-16 | GitHub repository setup | Completed |
| 2026-11-16 | Documentation structure | Created |
| Pending | Authentication foundation | Not started |

Update this section after each meaningful development session.

---

# FINAL PROJECT PRINCIPLE

EXE-NODE is intended to be a reusable authentication service, not a one-time login implementation.

The architecture should prioritize:

- Security.
- Maintainability.
- Reusability.
- Scalability.
- Clear documentation.
- Testability.
- Long-term compatibility.

Every architectural decision should support these objectives.

**Project motto: Build securely. Document everything. Test everything.**