/**
 * Employee Controller
 * Handles employee listing, retrieval, update, and deactivation.
 * Admin, HR, and Managers can perform various operations here.
 */

const Employee = require('../models/Employee.model');
const User = require('../models/User.model');
const Department = require('../models/Department.model');
const AuditLog = require('../models/AuditLog.model');
const { sendSuccess, sendError } = require('../utils/response.util');
const ERROR_CODES = require('../constants/error-codes.constants');

/**
 * GET /api/employees
 * List all employees with pagination, search, and filters.
 * Accessible by: SUPER_ADMIN, ORG_ADMIN, HR_MANAGER, MANAGER
 */
const getAllEmployees = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      status = '',
      departmentId = '',
      employmentType = '',
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (departmentId) filter.departmentId = departmentId;
    if (employmentType) filter.employmentType = employmentType;

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { designation: { $regex: search, $options: 'i' } },
      ];
    }

    const [employees, total] = await Promise.all([
      Employee.find(filter)
        .populate('departmentId', 'departmentName departmentCode')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Employee.countDocuments(filter),
    ]);

    // Enrich with user role info
    const employeeIds = employees.map((e) => e.employeeId);
    const users = await User.find({ employeeId: { $in: employeeIds } }).select('employeeId role isActive status').lean();
    const userMap = {};
    users.forEach((u) => { userMap[u.employeeId] = u; });

    const enriched = employees.map((emp) => ({
      ...emp,
      role: userMap[emp.employeeId]?.role || 'EMPLOYEE',
      accountActive: userMap[emp.employeeId]?.isActive ?? true,
      accountStatus: userMap[emp.employeeId]?.status || 'active',
    }));

    return sendSuccess(res, {
      employees: enriched,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    }, 'Employees retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/employees/:employeeId
 * Get a single employee by employeeId.
 */
const getEmployeeById = async (req, res, next) => {
  try {
    const { employeeId } = req.params;

    const employee = await Employee.findOne({ employeeId })
      .populate('departmentId', 'departmentName departmentCode')
      .lean();

    if (!employee) {
      return sendError(res, 'Employee not found.', 404, ERROR_CODES.USER_NOT_FOUND);
    }

    // Get associated user data (role, account status)
    const user = await User.findOne({ employeeId }).select('role isActive status mustChangePassword lastLogin').lean();

    return sendSuccess(res, {
      employee: {
        ...employee,
        role: user?.role || 'EMPLOYEE',
        accountActive: user?.isActive ?? true,
        accountStatus: user?.status || 'active',
        mustChangePassword: user?.mustChangePassword ?? false,
        lastLogin: user?.lastLogin || null,
      },
    }, 'Employee retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/employees/:employeeId/deactivate
 * Deactivate an employee account (soft delete).
 * Only SUPER_ADMIN and ORG_ADMIN can deactivate.
 */
const deactivateEmployee = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const ipAddress = req.ip || req.connection.remoteAddress;

    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return sendError(res, 'Employee not found.', 404, ERROR_CODES.USER_NOT_FOUND);
    }

    // Update employee status
    await Employee.updateOne({ employeeId }, { status: 'inactive' });

    // Deactivate user account
    await User.updateOne({ employeeId }, { isActive: false, status: 'inactive' });

    // Audit log
    await AuditLog.create({
      userId: req.user.userId,
      userEmail: req.user.email,
      role: req.user.role,
      action: 'DEACTIVATE_EMPLOYEE',
      entity: 'Employee',
      entityId: employeeId,
      details: `Deactivated employee ${employee.firstName} ${employee.lastName} (${employeeId})`,
      ipAddress,
      status: 'success',
    });

    return sendSuccess(res, null, 'Employee deactivated successfully.', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/employees/:employeeId/activate
 * Reactivate a previously deactivated employee.
 */
const activateEmployee = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const ipAddress = req.ip || req.connection.remoteAddress;

    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return sendError(res, 'Employee not found.', 404, ERROR_CODES.USER_NOT_FOUND);
    }

    await Employee.updateOne({ employeeId }, { status: 'active' });
    await User.updateOne({ employeeId }, { isActive: true, status: 'active' });

    // Audit log
    await AuditLog.create({
      userId: req.user.userId,
      userEmail: req.user.email,
      role: req.user.role,
      action: 'ACTIVATE_EMPLOYEE',
      entity: 'Employee',
      entityId: employeeId,
      details: `Reactivated employee ${employee.firstName} ${employee.lastName} (${employeeId})`,
      ipAddress,
      status: 'success',
    });

    return sendSuccess(res, null, 'Employee reactivated successfully.', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/employees/stats
 * Get aggregate stats (total, active, by department) for dashboards.
 */
const getEmployeeStats = async (req, res, next) => {
  try {
    const [total, active, inactive] = await Promise.all([
      Employee.countDocuments({}),
      Employee.countDocuments({ status: 'active' }),
      Employee.countDocuments({ status: 'inactive' }),
    ]);

    // Department breakdown
    const byDept = await Employee.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$departmentId', count: { $sum: 1 } } },
      { $lookup: { from: 'departments', localField: '_id', foreignField: '_id', as: 'dept' } },
      { $unwind: { path: '$dept', preserveNullAndEmptyArrays: true } },
      { $project: { departmentName: '$dept.departmentName', count: 1 } },
      { $sort: { count: -1 } },
    ]);

    // Employment type breakdown
    const byType = await Employee.aggregate([
      { $group: { _id: '$employmentType', count: { $sum: 1 } } },
    ]);

    return sendSuccess(res, {
      total,
      active,
      inactive,
      byDepartment: byDept,
      byEmploymentType: byType,
    }, 'Employee stats retrieved', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/employees/:employeeId
 * Update an employee profile.
 * Only SUPER_ADMIN, ORG_ADMIN, or HR_MANAGER can perform.
 */
const updateEmployee = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const { firstName, lastName, email, phone, designation, employmentType, departmentId, role } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;

    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return sendError(res, 'Employee not found.', 404, ERROR_CODES.USER_NOT_FOUND);
    }

    // Check if email is being changed and if it is already taken
    if (email && email.toLowerCase() !== employee.email.toLowerCase()) {
      const emailExists = await Employee.findOne({ email: email.toLowerCase() });
      if (emailExists) {
        return sendError(res, 'An account with this email already exists.', 409, ERROR_CODES.DUPLICATE_ENTRY);
      }
      employee.email = email.toLowerCase();
      // Update User email as well
      await User.updateOne({ employeeId }, { email: email.toLowerCase() });
    }

    if (firstName !== undefined) employee.firstName = firstName;
    if (lastName !== undefined) employee.lastName = lastName;
    if (phone !== undefined) employee.phone = phone;
    if (designation !== undefined) employee.designation = designation;
    if (employmentType !== undefined) employee.employmentType = employmentType;
    if (departmentId !== undefined) employee.departmentId = departmentId || null;

    await employee.save();

    // If role is provided, update user role
    if (role) {
      await User.updateOne({ employeeId }, { role });
    }

    // Audit log
    await AuditLog.create({
      userId: req.user.userId,
      userEmail: req.user.email,
      role: req.user.role,
      action: 'UPDATE_EMPLOYEE',
      entity: 'Employee',
      entityId: employeeId,
      details: `Updated employee ${employeeId} details`,
      ipAddress,
      status: 'success',
    });

    const updatedEmployee = await Employee.findOne({ employeeId })
      .populate('departmentId', 'departmentName departmentCode')
      .lean();

    const user = await User.findOne({ employeeId }).select('role isActive status').lean();

    return sendSuccess(res, {
      employee: {
        ...updatedEmployee,
        role: user?.role || 'EMPLOYEE',
        accountActive: user?.isActive ?? true,
        accountStatus: user?.status || 'active',
      }
    }, 'Employee updated successfully.', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/employees/audit-logs
 * Fetch recent audit logs.
 * Accessible by: SUPER_ADMIN, ORG_ADMIN, HR_MANAGER
 */
const getAuditLogs = async (req, res, next) => {
  try {
    const logs = await AuditLog.find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return sendSuccess(res, { logs }, 'Audit logs retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  deactivateEmployee,
  activateEmployee,
  getEmployeeStats,
  updateEmployee,
  getAuditLogs,
};
