
import { z } from 'zod';

// Validate and normalize email addresses.
// Trim whitespace and convert the address to lowercase.
export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(
    z.email({
      message: 'Please provide a valid email address',
    })
  );

// Reusable password validation rule.
export const passwordSchema = z
  .string()
  .min(8, 'Password must contain at least 8 characters')
  .max(128, 'Password cannot exceed 128 characters');

// Reusable MongoDB document ID validation.
export const idParamsSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});

// Reusable pagination query validation.
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});
