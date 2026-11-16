
import { z } from 'zod';

import {
  emailSchema,
  passwordSchema,
} from './common.validator.js';

// Validate data submitted during user registration.
export const registerSchema = z.object({
  // User's display name.
  name: z
    .string()
    .trim()
    .min(2, 'Name must contain at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),

  // Normalized email address.
  email: emailSchema,

  // Password must satisfy our shared password policy.
  password: passwordSchema,

  // Username is optional.
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, 'Username must contain at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(
      /^[a-z0-9_]+$/,
      'Username can only contain letters, numbers and underscores'
    )
    .optional(),
}).strict(); // Reject unexpected fields such as role and permissions.

// Validate login credentials.
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
}).strict(); // Reject unexpected login fields.
