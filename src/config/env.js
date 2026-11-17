
import 'dotenv/config';
import { z } from 'zod';

// Define and validate all required environment variables.
const envSchema = z.object({
  // Application environment.
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  // Port on which the Express server will run.
  PORT: z.coerce.number().int().positive().default(5000),

  // MongoDB Atlas connection string.
  MONGODB_URI: z
    .string()
    .min(1, 'MONGODB_URI is required'),

  // Secret used to sign and verify JWT access tokens.
  // Keep this secret private and use a strong random value.
  JWT_ACCESS_SECRET: z
    .string()
    .min(32, 'JWT_ACCESS_SECRET must be at least 32 characters'),

  // Lifetime of an access token.
  // Example: 15m, 30m, 1h.
  JWT_ACCESS_EXPIRES_IN: z
    .string()
    .default('15m'),


  // Lifetime of a refresh token.
  // Example: 7d, 14d, 30d.
  JWT_REFRESH_EXPIRES_IN: z
    .string()
    .default('7d'),

  // Base URL used to construct email verification links.
  APP_BASE_URL: z.url().default('http://localhost:5000'),

  // Allowed frontend origins, separated by commas.
  // Example: http://localhost:3000,https://myapp.com
  CLIENT_ORIGINS: z
    .string()
    .default('http://localhost:3000'),

  EMAIL_USER: z.email(),
  EMAIL_PASS: z.string().min(1),
  EMAIL_FROM: z.email(),
  SMTP_HOST: z.string().default('smtp.gmail.com'),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_SECURE: z.string().default('false'),
}).strict();

// Validate environment variables when this module is imported.

const result = envSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
  CLIENT_ORIGINS: process.env.CLIENT_ORIGINS,
  APP_BASE_URL: process.env.APP_BASE_URL,

  // Email configuration.
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  EMAIL_FROM: process.env.EMAIL_FROM,

  // SMTP configuration.
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_SECURE: process.env.SMTP_SECURE,
});


// Stop application startup if configuration is invalid.
if (!result.success) {
  console.error('Invalid environment configuration:');

  // Display the exact validation errors from Zod.
  console.error(JSON.stringify(result.error.issues, null, 2));

  process.exit(1);
}

// Export validated configuration for use throughout the application.
export const env = result.data;
