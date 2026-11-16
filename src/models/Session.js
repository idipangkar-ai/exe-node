
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// Define the structure of an authenticated user session.
const sessionSchema = new Schema(
  {
    // Reference the user who owns this session.
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // Store only the SHA-256 hash of the refresh token.
    // Never store the original refresh token in MongoDB.
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      select: false,
    },

    // Optional device identification information.
    deviceName: {
      type: String,
      trim: true,
      maxlength: 100,
      default: null,
    },

    deviceType: {
      type: String,
      enum: ['mobile', 'tablet', 'desktop', 'other'],
      default: 'other',
    },

    // Browser or application information.
    userAgent: {
      type: String,
      maxlength: 1000,
      default: null,
    },

    // IP address associated with the session.
    ipAddress: {
      type: String,
      maxlength: 100,
      default: null,
    },

    // When the session was last used successfully.
    lastUsedAt: {
      type: Date,
      default: Date.now,
    },

    // Refresh token expiration date.
    expiresAt: {
      type: Date,
      required: true,
    },

    // Null means the session has not been revoked.
    revokedAt: {
      type: Date,
      default: null,
    },

    // Reason for session revocation.
    revocationReason: {
      type: String,
      enum: [
        'logout',
        'logout_all',
        'token_rotation',
        'password_changed',
        'account_blocked',
        'security_action',
      ],
      default: null,
    },

    // Reference to the replacement session after token rotation.
    replacedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Session',
      default: null,
    },
  },
  {
    // Automatically maintain createdAt and updatedAt.
    timestamps: true,

    // Reject fields that are not defined in this schema.
    strict: 'throw',
  }
);

// -------------------------
// Database indexes
// -------------------------

// Find sessions belonging to a user.
sessionSchema.index({ user: 1, revokedAt: 1 });

// Automatically remove expired session records.
// MongoDB TTL cleanup is asynchronous, so expiration
// must also be checked when authenticating a session.
sessionSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

// Create the Session model.
const Session = model('Session', sessionSchema);

export default Session;
