
import mongoose from 'mongoose';

// Stores email verification tokens securely.
// The original token is never stored in the database.
const emailVerificationSchema = new mongoose.Schema(
  {
    // Each verification record belongs to one user.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    // SHA-256 hash of the original verification token.
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      select: false,
    },

    // Verification tokens must expire.
    expiresAt: {
      type: Date,
      required: true,
    },

    // Records when the token was successfully used.
    usedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    strict: 'throw',
  }
);

// MongoDB automatically removes expired verification records.
// Token expiration must still be checked in application logic.
emailVerificationSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

const EmailVerification = mongoose.model(
  'EmailVerification',
  emailVerificationSchema
);

export default EmailVerification;
