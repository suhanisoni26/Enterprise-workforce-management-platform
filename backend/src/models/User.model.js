/**
 * User Model
 * Handles authentication, login credentials, and session management.
 * Separated from Employee model for clean auth boundary.
 */

const mongoose = require('mongoose');
const { ROLES_ARRAY, ROLES } = require('../constants/roles.constants');
const { USER_STATUS } = require('../constants/status.constants');

const userSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      ref: 'Employee',
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Never return password by default
    },
    role: {
      type: String,
      enum: {
        values: ROLES_ARRAY,
        message: '{VALUE} is not a valid role',
      },
      default: ROLES.EMPLOYEE,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.ACTIVE,
    },
    mustChangePassword: {
      type: Boolean,
      default: true, // True on first creation, employee must change on first login
    },
    isFirstLogin: {
      type: Boolean,
      default: true,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockedUntil: {
      type: Date,
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
      select: false,
    },
    passwordResetToken: {
      type: String,
      default: null,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      default: null,
      select: false,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    lastPasswordChange: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.refreshToken;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Index for account lock queries
userSchema.index({ lockedUntil: 1 }, { sparse: true });

/**
 * Check if the account is currently locked.
 * @returns {boolean}
 */
userSchema.methods.isLocked = function () {
  if (!this.lockedUntil) return false;
  return this.lockedUntil > new Date();
};

const User = mongoose.model('User', userSchema);

module.exports = User;
