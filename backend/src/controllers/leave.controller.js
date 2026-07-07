/**
 * Leave Controller
 * CRUD + approval workflow for leave requests.
 */

const LeaveRequest = require('../models/LeaveRequest.model');
const Employee = require('../models/Employee.model');
const AuditLog = require('../models/AuditLog.model');
const { sendSuccess, sendError } = require('../utils/response.util');
const ERROR_CODES = require('../constants/error-codes.constants');

/**
 * POST /api/leave
 * Submit a new leave request (any authenticated user for themselves).
 */
const createLeaveRequest = async (req, res, next) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;

    if (!leaveType || !startDate || !endDate) {
      return sendError(res, 'Leave type, start date, and end date are required.', 400, ERROR_CODES.VALIDATION_ERROR);
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) {
      return sendError(res, 'End date cannot be before start date.', 400, ERROR_CODES.VALIDATION_ERROR);
    }

    // Calculate total days (simple: calendar days inclusive)
    const diffMs = end.getTime() - start.getTime();
    const totalDays = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1);

    // Find the employee profile for the current user
    const employee = await Employee.findOne({ employeeId: req.user.employeeId });
    const employeeName = employee
      ? `${employee.firstName || ''} ${employee.lastName || ''}`.trim()
      : req.user.email;

    const leave = await LeaveRequest.create({
      employeeId: req.user.employeeId,
      employeeName,
      leaveType,
      startDate: start,
      endDate: end,
      totalDays,
      reason: reason || '',
      status: 'pending',
    });

    // Audit log
    await AuditLog.create({
      userId: req.user.userId,
      userEmail: req.user.email,
      role: req.user.role,
      action: 'CREATE_LEAVE_REQUEST',
      entity: 'LeaveRequest',
      entityId: leave._id.toString(),
      details: `Submitted ${leaveType} leave for ${totalDays} day(s)`,
      ipAddress,
      status: 'success',
    });

    return sendSuccess(res, { leave }, 'Leave request submitted successfully.', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/leave/my
 * Get all leave requests for the current user.
 */
const getMyLeaves = async (req, res, next) => {
  try {
    const leaves = await LeaveRequest.find({ employeeId: req.user.employeeId })
      .sort({ createdAt: -1 })
      .lean();

    return sendSuccess(res, { leaves }, 'Leave requests retrieved.', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/leave
 * Get all leave requests (admin/hr/manager view). Optional ?status= filter.
 */
const getAllLeaves = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const leaves = await LeaveRequest.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return sendSuccess(res, { leaves }, 'Leave requests retrieved.', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/leave/stats
 * Get leave statistics (pending count, approved count, rejected count).
 */
const getLeaveStats = async (req, res, next) => {
  try {
    const [pending, approved, rejected] = await Promise.all([
      LeaveRequest.countDocuments({ status: 'pending' }),
      LeaveRequest.countDocuments({ status: 'approved' }),
      LeaveRequest.countDocuments({ status: 'rejected' }),
    ]);

    return sendSuccess(res, { pending, approved, rejected }, 'Leave stats retrieved.', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/leave/:id/approve
 * Approve a pending leave request.
 */
const approveLeave = async (req, res, next) => {
  try {
    const ipAddress = req.ip || req.connection.remoteAddress;

    const leave = await LeaveRequest.findById(req.params.id);
    if (!leave) {
      return sendError(res, 'Leave request not found.', 404, ERROR_CODES.RESOURCE_NOT_FOUND);
    }
    if (leave.status !== 'pending') {
      return sendError(res, `Cannot approve a request that is already ${leave.status}.`, 400, ERROR_CODES.VALIDATION_ERROR);
    }

    leave.status = 'approved';
    leave.reviewedBy = req.user.userId;
    leave.reviewerEmail = req.user.email;
    leave.reviewedAt = new Date();
    leave.reviewComment = req.body.comment || '';
    await leave.save();

    // Audit log
    await AuditLog.create({
      userId: req.user.userId,
      userEmail: req.user.email,
      role: req.user.role,
      action: 'APPROVE_LEAVE',
      entity: 'LeaveRequest',
      entityId: leave._id.toString(),
      details: `Approved ${leave.leaveType} leave for ${leave.employeeName || leave.employeeId} (${leave.totalDays} day(s))`,
      ipAddress,
      status: 'success',
    });

    return sendSuccess(res, { leave }, 'Leave request approved.', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/leave/:id/reject
 * Reject a pending leave request.
 */
const rejectLeave = async (req, res, next) => {
  try {
    const ipAddress = req.ip || req.connection.remoteAddress;

    const leave = await LeaveRequest.findById(req.params.id);
    if (!leave) {
      return sendError(res, 'Leave request not found.', 404, ERROR_CODES.RESOURCE_NOT_FOUND);
    }
    if (leave.status !== 'pending') {
      return sendError(res, `Cannot reject a request that is already ${leave.status}.`, 400, ERROR_CODES.VALIDATION_ERROR);
    }

    leave.status = 'rejected';
    leave.reviewedBy = req.user.userId;
    leave.reviewerEmail = req.user.email;
    leave.reviewedAt = new Date();
    leave.reviewComment = req.body.comment || '';
    await leave.save();

    // Audit log
    await AuditLog.create({
      userId: req.user.userId,
      userEmail: req.user.email,
      role: req.user.role,
      action: 'REJECT_LEAVE',
      entity: 'LeaveRequest',
      entityId: leave._id.toString(),
      details: `Rejected ${leave.leaveType} leave for ${leave.employeeName || leave.employeeId} (${leave.totalDays} day(s))`,
      ipAddress,
      status: 'success',
    });

    return sendSuccess(res, { leave }, 'Leave request rejected.', 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createLeaveRequest,
  getMyLeaves,
  getAllLeaves,
  getLeaveStats,
  approveLeave,
  rejectLeave,
};
