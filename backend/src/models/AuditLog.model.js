/**
 * AuditLog Model
 * Tracks all sensitive actions for security compliance.
 */

const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    userEmail: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      default: '',
    },
    action: {
      type: String,
      required: [true, 'Action is required'],
      // e.g., 'LOGIN', 'LOGOUT', 'CREATE_EMPLOYEE', 'CHANGE_PASSWORD', 'FAILED_LOGIN'
    },
    entity: {
      type: String,
      default: '', // e.g., 'User', 'Employee'
    },
    entityId: {
      type: String,
      default: '',
    },
    details: {
      type: String,
      default: '',
    },
    ipAddress: {
      type: String,
      default: '',
    },
    userAgent: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['success', 'failure'],
      default: 'success',
    },
  },
  {
    timestamps: true,
  }
);

// Index for querying audit logs efficiently
auditLogSchema.index({ userId: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;
