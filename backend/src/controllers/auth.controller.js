/**
 * Auth Controller
 * Thin controller layer — receives requests, delegates to auth.service, returns responses.
 * No business logic here.
 */

const authService = require('../services/auth.service');
const { sendSuccess, sendError } = require('../utils/response.util');
const User = require('../models/User.model');
const Employee = require('../models/Employee.model');
const Department = require('../models/Department.model');
const { hashPassword } = require('../utils/password.util');
const { ROLES } = require('../constants/roles.constants');

/**
 * POST /api/auth/login
 * Employee login with email and password.
 */
const login = async (req, res, next) => {
  try {
    const { email, password, recaptchaToken } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'] || '';

    const result = await authService.login(email, password, ipAddress, userAgent, recaptchaToken);

    return sendSuccess(res, result, 'Login successful', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/create-employee
 * Admin/HR creates a new employee account.
 */
const createEmployee = async (req, res, next) => {
  try {
    const ipAddress = req.ip || req.connection.remoteAddress;
    const result = await authService.createEmployee(req.body, req.user, ipAddress);

    return sendSuccess(res, result, 'Employee created successfully. Credentials have been sent via email.', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/refresh-token
 * Refresh JWT access token using refresh token.
 */
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;
    const result = await authService.refreshToken(token);

    return sendSuccess(res, result, 'Token refreshed successfully', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/change-password
 * Change password (first login mandatory or voluntary).
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;

    const result = await authService.changePassword(req.user.userId, currentPassword, newPassword, ipAddress);

    return sendSuccess(res, result, result.message, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/forgot-password
 * Request a password reset email.
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);

    return sendSuccess(res, null, result.message, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/reset-password
 * Reset password using the token from email.
 */
const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    const result = await authService.resetPassword(token, newPassword);

    return sendSuccess(res, null, result.message, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/logout
 * Logout — clear refresh token.
 */
const logout = async (req, res, next) => {
  try {
    const ipAddress = req.ip || req.connection.remoteAddress;
    const result = await authService.logout(req.user.userId, ipAddress);

    return sendSuccess(res, null, result.message, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/profile
 * Get current user's profile.
 */
const getProfile = async (req, res, next) => {
  try {
    const result = await authService.getProfile(req.user.userId);

    return sendSuccess(res, result, 'Profile retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/register
 * Public registration (self sign-up).
 */
const register = async (req, res, next) => {
  try {
    const ipAddress = req.ip || req.connection.remoteAddress;
    const result = await authService.register(req.body, ipAddress);

    return sendSuccess(res, result, 'Registration successful', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/seed-cloud
 * Temporary endpoint to seed the cloud database because of ISP DNS issues.
 */
const seedCloud = async (req, res, next) => {
  try {
    const departments = [
      { departmentCode: 'HR', departmentName: 'Human Resources', description: 'HR and People Operations' },
      { departmentCode: 'ENG', departmentName: 'Engineering', description: 'Software Development & IT' },
    ];
    for (const dept of departments) {
      if (!(await Department.findOne({ departmentCode: dept.departmentCode }))) {
        await Department.create(dept);
      }
    }

    const demoUsers = [
      { role: ROLES.SUPER_ADMIN, email: 'superadmin@ewm.edu', firstName: 'Super', lastName: 'Admin', empId: 'EMP-1001' },
      { role: ROLES.HR_MANAGER, email: 'hr@ewm.edu', firstName: 'HR', lastName: 'Manager', empId: 'EMP-1003' },
      { role: ROLES.TEAM_LEAD, email: 'teamlead@ewm.edu', firstName: 'Team', lastName: 'Lead', empId: 'EMP-1005' },
    ];

    const defaultPassword = 'DemoPass@123';
    const hashedDemoPass = await hashPassword(defaultPassword);

    for (const u of demoUsers) {
      if (!(await User.findOne({ email: u.email }))) {
        await Employee.create({
          employeeId: u.empId,
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email,
          designation: u.role.replace('_', ' '),
          employmentType: 'full_time',
          salary: 100000,
          joiningDate: new Date(),
        });
        await User.create({
          employeeId: u.empId,
          email: u.email,
          password: hashedDemoPass,
          role: u.role,
          isActive: true,
          mustChangePassword: false,
          isFirstLogin: false,
        });
      }
    }
    return sendSuccess(res, null, 'Cloud database seeded successfully!', 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  register,
  createEmployee,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
  logout,
  getProfile,
  seedCloud,
};
