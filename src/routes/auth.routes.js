
import { Router } from 'express';

import validate from '../middleware/validate.js';

import {
  register,
  login,
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

// Verify a user's email address.
router.get(
  '/verify-email',
  validate({ query: verifyEmailSchema }),
  verifyEmailAddress
);

export default router;
