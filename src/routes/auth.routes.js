
import { Router } from 'express';

import validate from '../middleware/validate.js';
import authenticate from '../middleware/authenticate.js';

import {
  register,
  login,
  refresh,
  logout,
  logoutAll,
  verifyEmailAddress,
} from '../controllers/auth.controller.js';

import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
} from '../validators/auth.validator.js';

const router = Router();

// Register a new user.
router.post(
  '/register',
  validate({ body: registerSchema }),
  register
);

// Authenticate an existing user.
router.post(
  '/login',
  validate({ body: loginSchema }),
  login
);

// Refresh the access token using the HTTP-only refresh cookie.
router.post(
  '/refresh',
  refresh
);

// Log out the current authenticated session.
router.post(
  '/logout',
  logout
);


// Log out the user from all devices.
router.post(
  '/logout-all',
  authenticate,
  logoutAll
);


// Verify a user's email address.
router.get(
  '/verify-email',
  validate({ query: verifyEmailSchema }),
  verifyEmailAddress
);

export default router;
