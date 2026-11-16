
import cors from 'cors';
import { env } from './env.js';

// Convert the comma-separated frontend origins into an array.
// Example: http://localhost:3000,https://myapp.com
const allowedOrigins = env.CLIENT_ORIGINS
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// Configure Cross-Origin Resource Sharing (CORS).
const corsOptions = {
  origin(origin, callback) {
    // Allow requests without an Origin header.
    // This includes tools such as Postman and server-to-server requests.
    if (!origin) {
      return callback(null, true);
    }

    // Allow requests only from configured frontend origins.
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Reject requests from unapproved origins.
    return callback(new Error('Not allowed by CORS'));
  },

  // Allow credentials such as cookies when needed.
  credentials: true,

  // Supported HTTP methods.
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
};

export default cors(corsOptions);
