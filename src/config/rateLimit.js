
import { rateLimit } from 'express-rate-limit';

// General API rate limiter.
// Limits excessive requests from a single client IP.
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes

  limit: 200, // Maximum 200 requests per 15 minutes

  standardHeaders: 'draft-8', // Return modern rate-limit headers

  legacyHeaders: false, // Disable older X-RateLimit headers

  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
});
