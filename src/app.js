
import express from 'express';
import helmet from 'helmet';

import corsMiddleware from './config/cors.js';
import { generalLimiter } from './config/rateLimit.js';

import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';
import authRoutes from './routes/auth.routes.js';

// Create the Express application.
// This file configures the app but does not start the HTTP server.
const app = express();

// Add security-related HTTP response headers.
app.use(helmet());

// Configure which frontend origins can access the API.
app.use(corsMiddleware);

// Parse incoming JSON request bodies.
app.use(express.json({ limit: '10kb' }));

// Apply general rate limiting to all API endpoints.
app.use('/api', generalLimiter);

// Health check endpoint.
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'EXE-NODE API is running',
  });
});

app.use('/api/v1/auth', authRoutes);

// Handle requests to routes that do not exist.
app.use(notFound);

// Handle all errors passed through Express.
app.use(errorHandler);

export default app;
