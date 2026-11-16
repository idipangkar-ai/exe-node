
import { Router } from 'express';

import { register } from '../controllers/auth.controller.js';
import validate from '../middleware/validate.js';
import { registerSchema } from '../validators/auth.validator.js';

const router = Router();

// POST /register
// Validate incoming data before calling the registration controller.
router.post(
  '/register',
  validate({ body: registerSchema }),
  register
);

export default router;
