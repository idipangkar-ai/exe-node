# EXE-NODE — Dependency & Package Registry

**Project:** EXE-NODE  
**Project Type:** Standalone Authentication and Authorization Backend  
**Language:** JavaScript (ES Modules)  
**Framework:** Express.js 5  
**Database:** MongoDB Atlas  
**ODM:** Mongoose  
**Package Manager:** npm  
**Last Reviewed:** November 16, 2026

---

## 1. Purpose of This Document

This document is the central reference for all npm dependencies used or planned for EXE-NODE.

It explains:

- Which packages are currently installed.
- Which packages are planned for future implementation.
- Why each dependency is required.
- Which packages run in production versus development.
- How dependencies interact with application modules.
- How to install, update, audit and remove dependencies.
- What security considerations apply to each package.
- How to resume development after a break.

**Important:** The installed versions in `package.json` and `package-lock.json` are the authoritative record. This document records the versions last shared during development.

---

## 2. Technology Overview

| Layer | Technology | Responsibility |
|---|---|---|
| Runtime | Node.js | Execute backend JavaScript |
| Language | JavaScript ESM | Application source code |
| Framework | Express.js 5 | REST API and middleware |
| Database | MongoDB Atlas | Persistent data storage |
| ODM | Mongoose | Database schemas and queries |
| Authentication | JSON Web Tokens | Signed access tokens |
| Password security | Argon2id | Password hashing |
| Validation | Zod | Runtime input validation |
| Email | Nodemailer | Transactional email |
| Testing | Node.js Test Runner + Supertest | Automated testing |
| Development | Nodemon | Automatic server restart |

---

# 3. Currently Installed Production Dependencies

These packages were confirmed in the project's shared `package.json`.

### 3.1 Express

**Package:** `express`  
**Recorded version:** `^5.3.0`  
**Status:** Installed  
**Type:** Production dependency

**Purpose**

Express is the HTTP framework responsible for receiving requests and sending responses.

**Why EXE-NODE needs it**

- Create REST API routes.
- Organize authentication endpoints.
- Register middleware.
- Handle JSON request bodies.
- Return appropriate HTTP status codes.
- Centralize error handling.

**Example**

```javascript
import express from 'express';

const app = express();

app.use(express.json());

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'EXE-NODE API is running',
  });
});

export default app;
```

**Security considerations**

- Limit request-body sizes.
- Validate untrusted inputs.
- Configure centralized error handling.
- Avoid exposing internal stack traces in production.
- Configure trusted proxies carefully when deployed.

---

### 3.2 Mongoose

**Package:** `mongoose`  
**Recorded version:** `^9.12.1`  
**Status:** Installed  
**Type:** Production dependency

**Purpose**

Mongoose provides schemas, models and database operations for MongoDB.

**Why EXE-NODE needs it**

- Create user records.
- Query accounts by email.
- Define unique indexes.
- Store authentication sessions.
- Store refresh-token hashes.
- Implement account verification.
- Manage database timestamps.

**Example**

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('User', userSchema);
```

**Security considerations**

- Validate request data before database operations.
- Never pass arbitrary user-controlled query objects directly into authentication queries.
- Use least-privilege database credentials.
- Create and verify required indexes.
- Remember that `unique: true` defines an index; it is not a standalone application validator.

---

### 3.3 Dotenv

**Package:** `dotenv`  
**Recorded version:** `^18.0.10`  
**Status:** Installed  
**Type:** Production dependency

**Purpose**

Loads environment variables from a `.env` file.

**Why EXE-NODE needs it**

- Configure the server port.
- Provide MongoDB connection details.
- Configure token-signing secrets.
- Configure email credentials.
- Separate development and production settings.

**Example**

```javascript
import 'dotenv/config';

const PORT = process.env.PORT || 5000;
```

**Security considerations**

- Never commit `.env`.
- Never log environment secrets.
- Never expose secrets in API responses.
- Use a secret manager in production when available.
- Rotate credentials when compromised.

---

### 3.4 CORS

**Package:** `cors`  
**Recorded version:** `^2.8.6`  
**Status:** Installed  
**Type:** Production dependency

**Purpose**

Configures Cross-Origin Resource Sharing for browser clients.

**Why EXE-NODE needs it**

EXE-NODE will support multiple applications, including browser-based clients hosted on different origins.

**Example**

```javascript
import cors from 'cors';

app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
  })
);
```

**Security considerations**

- Use explicit trusted origins in production.
- Do not reflect arbitrary origins when credentials are enabled.
- CORS is a browser restriction, not an authentication or authorization mechanism.
- Native mobile applications are not protected by browser CORS enforcement.

---

# 4. Planned Authentication Dependencies

These packages have been selected but their installation has not yet been confirmed.

### 4.1 JSON Web Token

**Package:** `jsonwebtoken`  
**Status:** Planned  
**Type:** Production dependency

**Purpose**

Signs and verifies JSON Web Tokens.

**Why EXE-NODE needs it**

- Generate access tokens after login.
- Authenticate protected API requests.
- Enforce token expiration.
- Verify token signatures.
- Validate issuer and audience claims.

**Planned access-token lifetime:** 15 minutes.

**Security requirements**

- Use a strong signing secret or appropriate asymmetric key.
- Explicitly allow only intended signing algorithms.
- Validate issuer, audience and expiration.
- Never store passwords or sensitive secrets in JWT payloads.
- Never accept unsigned tokens.
- Do not treat JWT payload contents as encrypted information.

**Installation**

```bash
npm install jsonwebtoken
```

---

### 4.2 Argon2

**Package:** `argon2`  
**Status:** Planned  
**Type:** Production dependency

**Purpose**

Securely hashes and verifies passwords.

**Why EXE-NODE needs it**

Passwords must never be stored in plaintext.

Argon2id is a memory-hard password-hashing algorithm designed to make offline password guessing more expensive.

**Example**

```javascript
import argon2 from 'argon2';

const passwordHash = await argon2.hash(password, {
  type: argon2.argon2id,
});

const isValid = await argon2.verify(
  passwordHash,
  submittedPassword
);
```

**Security requirements**

- Use Argon2id.
- Choose parameters appropriate for the deployment environment.
- Benchmark hashing performance.
- Never log plaintext passwords.
- Never return password hashes in API responses.
- Never use general-purpose fast hashes such as SHA-256 alone for password storage.

**Installation**

```bash
npm install argon2
```

---

### 4.3 Zod

**Package:** `zod`  
**Status:** Planned  
**Type:** Production dependency

**Purpose**

Validates untrusted input at runtime.

**Why EXE-NODE needs it**

- Validate registration requests.
- Validate login requests.
- Enforce password policies.
- Validate email formats.
- Validate query parameters.
- Reject malformed request bodies.

**Example**

```javascript
import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email(),
  password: z.string().min(12).max(128),
}).strict();
```

**Security requirements**

- Validate at the API boundary.
- Avoid trusting frontend validation alone.
- Restrict unknown or unexpected fields.
- Do not include submitted passwords in validation logs.
- Treat validation as one layer of protection, not a replacement for authorization.

**Installation**

```bash
npm install zod
```

---

# 5. Planned HTTP Security Dependencies

### 5.1 Helmet

**Package:** `helmet`  
**Status:** Planned

**Purpose**

Sets security-related HTTP response headers.

**Why EXE-NODE needs it**

- Reduce exposure to certain browser-based attacks.
- Configure common security headers.
- Improve baseline HTTP response security.

**Example**

```javascript
import helmet from 'helmet';

app.use(helmet());
```

**Installation**

```bash
npm install helmet
```

Helmet does not replace input validation, HTTPS, authentication or authorization.

---

### 5.2 Express Rate Limit

**Package:** `express-rate-limit`  
**Status:** Planned

**Purpose**

Limits excessive requests to selected endpoints.

**Why EXE-NODE needs it**

Authentication endpoints are common targets for automated abuse.

Rate limiting will be applied to:

- Registration.
- Login.
- Password recovery.
- Verification-email resend.
- Refresh-token requests where appropriate.

**Security requirements**

- Use stricter limits for sensitive operations.
- Configure proxy handling correctly.
- Use shared rate-limit storage when running multiple server instances.
- Consider account-based controls in addition to IP-based limits.

**Installation**

```bash
npm install express-rate-limit
```

---

### 5.3 Cookie Parser

**Package:** `cookie-parser`  
**Status:** Planned

**Purpose**

Parses incoming HTTP cookies.

**Why EXE-NODE may need it**

For browser applications, we may transport refresh tokens in secure, HttpOnly cookies.

**Security requirements**

- Use `HttpOnly` for refresh-token cookies.
- Use `Secure` over HTTPS.
- Configure `SameSite` appropriately.
- Implement CSRF protection where required.
- Never store access or refresh tokens in publicly readable cookies.

**Installation**

```bash
npm install cookie-parser
```

**Note:** This package is optional if we implement cookie parsing through another mechanism or do not use cookie-based sessions.

---

# 6. Planned Email Dependency

### 6.1 Nodemailer

**Package:** `nodemailer`  
**Status:** Planned

**Purpose**

Sends transactional email through a configured mail transport.

**Why EXE-NODE needs it**

- Verify email ownership.
- Send password-reset links.
- Send account security notifications.
- Notify users of sensitive account changes.

**Security requirements**

- Keep SMTP credentials secret.
- Use secure transport configuration.
- Never email passwords.
- Avoid exposing whether an email account exists.
- Use expiring, single-use verification and recovery tokens.
- Rate-limit email-triggering endpoints.

**Installation**

```bash
npm install nodemailer
```

**Note:** Nodemailer is an email transport library. An SMTP provider or other compatible delivery service will still be required.

---

# 7. Development Dependencies

### 7.1 Nodemon

**Package:** `nodemon`  
**Recorded version:** `^3.1.14`  
**Status:** Installed  
**Type:** Development dependency

**Purpose**

Automatically restarts the development server after source-code changes.

**Existing command**

```bash
npm run dev
```

**Existing package.json script**

```json
{
  "dev": "nodemon src/index.js"
}
```

Nodemon is not required to run the application in production.

---

### 7.2 Supertest

**Package:** `supertest`  
**Status:** Planned  
**Type:** Development dependency

**Purpose**

Tests HTTP APIs without manually sending requests from Postman.

**Why EXE-NODE needs it**

- Test registration.
- Test login.
- Test protected endpoints.
- Test invalid inputs.
- Test HTTP status codes.
- Test authentication error responses.

**Installation**

```bash
npm install --save-dev supertest
```

**Testing framework decision**

Use the built-in Node.js test runner initially.

This avoids introducing another dependency until a dedicated testing framework is necessary.

---

# 8. Dependency Summary

| Package | Type | Status |
|---|---|---|
| express | Production | Installed |
| mongoose | Production | Installed |
| dotenv | Production | Installed |
| cors | Production | Installed |
| jsonwebtoken | Production | Planned |
| argon2 | Production | Planned |
| zod | Production | Planned |
| helmet | Production | Planned |
| express-rate-limit | Production | Planned |
| cookie-parser | Production | Planned |
| nodemailer | Production | Planned |
| nodemon | Development | Installed |
| supertest | Development | Planned |

**Recorded baseline:** 4 production dependencies and 1 development dependency installed.

**Planned additions:** 7 production dependencies and 1 development dependency.

Update this summary after checking the actual package.json.

---

# 9. Installation Commands

## Authentication and Security

Run from the project root:

```bash
npm install jsonwebtoken argon2 zod helmet express-rate-limit cookie-parser nodemailer
```

## Testing

```bash
npm install --save-dev supertest
```

## Verify Installed Packages

```bash
npm ls --depth=0
```

## Inspect Package Versions

```bash
npm outdated
```

## Audit Dependencies

```bash
npm audit
```

Review audit findings before applying fixes. Avoid blindly running breaking dependency upgrades.

---

# 10. Dependency Ownership by Module

| Application module | Primary packages |
|---|---|
| HTTP server | express |
| Database configuration | mongoose, dotenv |
| User model | mongoose |
| Registration | express, mongoose, zod, argon2 |
| Login | express, mongoose, zod, argon2, jsonwebtoken |
| Authentication middleware | jsonwebtoken, mongoose |
| Sessions | mongoose, Node.js crypto |
| Input validation | zod |
| HTTP security | helmet, cors |
| Abuse protection | express-rate-limit |
| Browser refresh cookies | cookie-parser |
| Email verification | nodemailer, Node.js crypto |
| Password recovery | nodemailer, argon2, Node.js crypto |
| API testing | supertest, Node.js test runner |

---

# 11. Built-In Node.js Modules

Some functionality does not require an additional npm package.

## crypto

Used for:

- Generating cryptographically secure random tokens.
- Hashing refresh tokens before storage.
- Generating secure identifiers when needed.
- Constant-time comparisons where appropriate.

Example:

```javascript
import { randomBytes, createHash } from 'node:crypto';

const token = randomBytes(32).toString('hex');

const tokenHash = createHash('sha256')
  .update(token)
  .digest('hex');
```

This is suitable for hashing high-entropy random tokens, not for hashing user passwords.

## node:test

Used for writing automated tests without installing a separate test framework.

## node:assert

Used for checking expected results in tests.

---

# 12. Environment Variables

The following variables are planned.

| Variable | Purpose |
|---|---|
| NODE_ENV | Application environment |
| PORT | HTTP server port |
| MONGODB_URI | MongoDB connection |
| JWT_ACCESS_SECRET | Access-token signing secret |
| JWT_ISSUER | Expected JWT issuer |
| JWT_AUDIENCE | Expected JWT audience |
| ACCESS_TOKEN_EXPIRES_IN | Access-token lifetime |
| REFRESH_TOKEN_EXPIRES_IN | Refresh-session lifetime |
| CORS_ORIGIN | Trusted browser origins |
| SMTP_HOST | Email server |
| SMTP_PORT | Email server port |
| SMTP_USER | Email username |
| SMTP_PASSWORD | Email password |
| EMAIL_FROM | Sender address |

**Design decision:** Refresh tokens are planned as opaque, cryptographically random values rather than JWTs. They will be stored as hashes in MongoDB.

This means a `JWT_REFRESH_SECRET` is not required for the current design.

All real secrets must remain outside Git.

---

# 13. Package Management Policy

## Adding a Dependency

Before installing a package:

1. Identify the feature requiring it.
2. Check whether Node.js already provides the functionality.
3. Review package maintenance and compatibility.
4. Evaluate security implications.
5. Install with npm.
6. Record its purpose in this document.
7. Commit package.json and package-lock.json.
8. Test the affected feature.

## Updating a Dependency

1. Review release notes.
2. Check breaking changes.
3. Update in a development environment.
4. Run automated tests.
5. Verify affected API endpoints.
6. Update documentation when behavior changes.

## Removing a Dependency

1. Confirm the package is no longer used.
2. Remove imports and related code.
3. Run `npm uninstall`.
4. Run tests.
5. Update this registry.

---

# 14. Package Security Rules

- Never install unknown packages without reviewing them.
- Prefer maintained libraries with a clear security history.
- Avoid duplicate libraries serving the same purpose.
- Do not expose dependency-related secrets.
- Review transitive dependencies.
- Run dependency audits regularly.
- Use a lockfile for reproducible installations.
- Keep Node.js on a supported release.
- Test dependency upgrades before deployment.
- Avoid unnecessary production dependencies.

---

# 15. Current Development Snapshot

## Confirmed Working

- Express application starts.
- MongoDB Atlas connects.
- Environment variables load.
- API health check responds successfully.
- Postman receives HTTP 200.

## Not Yet Confirmed

- Installation of authentication dependencies.
- User model.
- Password hashing.
- Registration endpoint.
- Login endpoint.
- JWT generation.
- Refresh-token sessions.
- Email verification.
- Password recovery.
- Authorization middleware.

## Next Development Task

**Install and verify the authentication dependencies.**

After that:

1. Design the User model.
2. Create validation schemas.
3. Implement password hashing.
4. Implement registration.
5. Test registration using Postman.

---

# 16. Development History

| Date | Change | Status |
|---|---|---|
| 2026-11-16 | Express and MongoDB baseline verified | Complete |
| 2026-11-16 | Authentication dependency stack selected | Planned |
| 2026-11-16 | Dependency documentation prepared | Documented |
| Pending | Install security packages | Not verified |
| Pending | Implement User model | Not started |

---

# 17. Final Reference

**The three sources of truth are:**

1. `package.json` — direct dependencies and declared version ranges.
2. `package-lock.json` — resolved dependency versions.
3. `docs/Packages/package-used.md` — reasons, architecture and maintenance decisions.

Whenever dependencies change, update all relevant records.

**EXE-NODE dependency principle: Every package must have a purpose, and every purpose must be documented.**