
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// Define the structure of application roles.
const roleSchema = new Schema(
  {
    // Unique role identifier, such as user, admin or moderator.
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 50,
    },

    // Human-readable description of the role.
    description: {
      type: String,
      trim: true,
      maxlength: 250,
      default: '',
    },

    // Permissions assigned to this role.
    // Example: ['users.read', 'users.update']
    permissions: {
      type: [String],
      default: [],
    },

    // Prevent accidental deletion of built-in roles.
    isSystem: {
      type: Boolean,
      default: false,
    },

    // Allow administrators to disable a role.
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    // Automatically manage createdAt and updatedAt.
    timestamps: true,
    strict: 'throw',
  }
);

// Create the Role model.
const Role = model('Role', roleSchema);

export default Role;
