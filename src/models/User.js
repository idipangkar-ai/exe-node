
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// Define the structure and validation rules for user accounts.
const userSchema = new Schema(
  {
    // -------------------------
    // 1. Identity and profile
    // -------------------------

    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    username: {
      type: String,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 30,
      match: /^[a-z0-9_]+$/,
      sparse: true,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },

    phone: {
      type: String,
      trim: true,
      default: null,
    },

    avatar: {
      type: String,
      default: null,
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },

    // -------------------------
    // 2. Authentication
    // -------------------------

    // Store only the Argon2id hash, never the original password.
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false,
    },

    // Default role for newly registered users.
    role: {
      type: String,
      enum: ['user', 'admin', 'moderator'],
      default: 'user',
    },

    // -------------------------
    // 3. Verification
    // -------------------------

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerifiedAt: {
      type: Date,
      default: null,
    },

    isPhoneVerified: {
      type: Boolean,
      default: false,
    },

    // -------------------------
    // 4. Account status
    // -------------------------

    status: {
      type: String,
      enum: ['pending', 'active', 'suspended', 'deleted'],
      default: 'pending',
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    blockedAt: {
      type: Date,
      default: null,
    },

    blockReason: {
      type: String,
      default: null,
      maxlength: 500,
    },

    // -------------------------
    // 5. Security
    // -------------------------

    passwordChangedAt: {
      type: Date,
      default: null,
    },

    passwordResetRequired: {
      type: Boolean,
      default: false,
    },

    failedLoginAttempts: {
      type: Number,
      default: 0,
      min: 0,
    },

    lockedUntil: {
      type: Date,
      default: null,
    },

    // -------------------------
    // 6. Activity and presence
    // -------------------------

    // Cached online status. Active sessions will be
    // the source of truth for online/offline presence.
    isOnline: {
      type: Boolean,
      default: false,
    },

    lastSeenAt: {
      type: Date,
      default: null,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },

    // Consider privacy requirements before retaining IP addresses.
    lastLoginIP: {
      type: String,
      default: null,
      select: false,
    },

    // -------------------------
    // 7. User preferences
    // -------------------------

    preferredLanguage: {
      type: String,
      default: 'en',
    },

    timezone: {
      type: String,
      default: 'UTC',
    },

    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system',
    },

    notificationPreferences: {
      email: {
        type: Boolean,
        default: true,
      },
      push: {
        type: Boolean,
        default: true,
      },
      marketing: {
        type: Boolean,
        default: false,
      },
    },

    // -------------------------
    // 8. Account lifecycle
    // -------------------------

    termsAcceptedAt: {
      type: Date,
      default: null,
    },

    privacyPolicyAcceptedAt: {
      type: Date,
      default: null,
    },

    deletionRequestedAt: {
      type: Date,
      default: null,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },

  {
    // Automatically maintain createdAt and updatedAt.
    timestamps: true,

    // Prevent accidental storage of fields not defined in this schema.
    strict: 'throw',
  }
);

// -------------------------
// 9. Database indexes
// -------------------------

// Email must be unique across users.
userSchema.index({ email: 1 }, { unique: true });

// Username must be unique when provided.
// Sparse allows multiple users without a username.
userSchema.index(
  { username: 1 },
  {
    unique: true,
    sparse: true,
  }
);

// Useful for finding users by account status.
userSchema.index({ status: 1, isActive: 1 });

// Export the model for use in controllers and services.
const User = model('User', userSchema);

export default User;
