/**
 * Department Model
 * Organizational structure — departments.
 */

const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema(
  {
    departmentCode: {
      type: String,
      required: [true, 'Department code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    departmentName: {
      type: String,
      required: [true, 'Department name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    managerId: {
      type: String, // employeeId of department manager
      default: null,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

const Department = mongoose.model('Department', departmentSchema);

module.exports = Department;
