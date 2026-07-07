/**
 * Department Controller
 * CRUD operations for departments.
 * Accessible by SUPER_ADMIN, ORG_ADMIN, HR_MANAGER.
 */

const Department = require('../models/Department.model');
const Employee = require('../models/Employee.model');
const AuditLog = require('../models/AuditLog.model');
const { sendSuccess, sendError } = require('../utils/response.util');
const ERROR_CODES = require('../constants/error-codes.constants');

/**
 * GET /api/departments
 * List all departments with employee count.
 */
const getAllDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find({}).sort({ departmentName: 1 }).lean();

    // Enrich with employee count per department
    const enriched = await Promise.all(
      departments.map(async (dept) => {
        const employeeCount = await Employee.countDocuments({ departmentId: dept._id, status: 'active' });
        return { ...dept, employeeCount };
      })
    );

    return sendSuccess(res, { departments: enriched }, 'Departments retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/departments/:id
 * Get a single department by ID.
 */
const getDepartmentById = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id).lean();
    if (!department) {
      return sendError(res, 'Department not found.', 404, ERROR_CODES.DEPARTMENT_NOT_FOUND);
    }

    const employeeCount = await Employee.countDocuments({ departmentId: department._id, status: 'active' });

    return sendSuccess(res, {
      department: { ...department, employeeCount },
    }, 'Department retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/departments
 * Create a new department.
 */
const createDepartment = async (req, res, next) => {
  try {
    const { departmentCode, departmentName, description, managerId } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;

    if (!departmentCode || !departmentName) {
      return sendError(res, 'Department code and name are required.', 400, ERROR_CODES.VALIDATION_ERROR);
    }

    // Check for duplicate code
    const existing = await Department.findOne({ departmentCode: departmentCode.toUpperCase() });
    if (existing) {
      return sendError(res, 'A department with this code already exists.', 409, ERROR_CODES.DUPLICATE_ENTRY);
    }

    const department = await Department.create({
      departmentCode: departmentCode.toUpperCase(),
      departmentName,
      description: description || '',
      managerId: managerId || null,
      status: 'active',
    });

    // Audit log
    await AuditLog.create({
      userId: req.user.userId,
      userEmail: req.user.email,
      role: req.user.role,
      action: 'CREATE_DEPARTMENT',
      entity: 'Department',
      entityId: department._id.toString(),
      details: `Created department "${departmentName}" (${departmentCode})`,
      ipAddress,
      status: 'success',
    });

    return sendSuccess(res, { department }, 'Department created successfully.', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/departments/:id
 * Update a department.
 */
const updateDepartment = async (req, res, next) => {
  try {
    const { departmentName, description, managerId, status } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;

    const department = await Department.findById(req.params.id);
    if (!department) {
      return sendError(res, 'Department not found.', 404, ERROR_CODES.DEPARTMENT_NOT_FOUND);
    }

    if (departmentName !== undefined) department.departmentName = departmentName;
    if (description !== undefined) department.description = description;
    if (managerId !== undefined) department.managerId = managerId || null;
    if (status !== undefined) department.status = status;

    await department.save();

    // Audit log
    await AuditLog.create({
      userId: req.user.userId,
      userEmail: req.user.email,
      role: req.user.role,
      action: 'UPDATE_DEPARTMENT',
      entity: 'Department',
      entityId: department._id.toString(),
      details: `Updated department "${department.departmentName}" (${department.departmentCode})`,
      ipAddress,
      status: 'success',
    });

    return sendSuccess(res, { department }, 'Department updated successfully.', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/departments/:id
 * Soft-delete a department (set status to inactive).
 */
const deleteDepartment = async (req, res, next) => {
  try {
    const ipAddress = req.ip || req.connection.remoteAddress;

    const department = await Department.findById(req.params.id);
    if (!department) {
      return sendError(res, 'Department not found.', 404, ERROR_CODES.DEPARTMENT_NOT_FOUND);
    }

    department.status = 'inactive';
    await department.save();

    // Audit log
    await AuditLog.create({
      userId: req.user.userId,
      userEmail: req.user.email,
      role: req.user.role,
      action: 'DELETE_DEPARTMENT',
      entity: 'Department',
      entityId: department._id.toString(),
      details: `Deactivated department "${department.departmentName}" (${department.departmentCode})`,
      ipAddress,
      status: 'success',
    });

    return sendSuccess(res, null, 'Department deactivated successfully.', 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
