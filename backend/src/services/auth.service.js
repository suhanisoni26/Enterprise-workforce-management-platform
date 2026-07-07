/**
 * Auth Service
 * Core business logic for authentication & authorization.
 * Implements: login, employee creation, password management, token refresh.
 */

const crypto = require('crypto');
const config = require('../config');
const userRepository = require('../repositories/user.repository');
const User = require('../models/User.model');
const Employee = require('../models/Employee.model');
const AuditLog = require('../models/AuditLog.model');
const { hashPassword, comparePassword, generateTempPassword } = require('../utils/password.util');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt.util');
const emailService = require('./email.service');
const { generateEmployeeId } = require('../utils/generate-id.util');
const ERROR_CODES = require('../constants/error-codes.constants');

class AuthService {
  /**
   * Create a new employee and user account.
   * Admin/HR creates the employee → temp password generated → welcome email sent.
   *
   * @param {Object} employeeData - { firstName, lastName, email, phone, designation, role, employmentType, departmentId }
   * @param {Object} createdBy - { userId, employeeId, email, role } from req.user
   * @param {string} ipAddress
   * @returns {Object} { employee, user, tempPassword }
   */
  async createEmployee(employeeData, createdBy, ipAddress) {
    const { firstName, lastName, email, phone, designation, role, employmentType, departmentId } = employeeData;

    // Check if email already exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      const error = new Error('An account with this email already exists.');
      error.statusCode = 409;
      error.errorCode = ERROR_CODES.DUPLICATE_ENTRY;
      throw error;
    }

    // Generate employee ID
    const employeeId = await generateEmployeeId();

    // Generate temporary password
    const tempPassword = generateTempPassword();
    const hashedPassword = await hashPassword(tempPassword);

    // Create Employee record
    const employee = await Employee.create({
      employeeId,
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone: phone || '',
      designation: designation || '',
      employmentType: employmentType || 'full_time',
      departmentId: departmentId || null,
      createdBy: createdBy.employeeId,
    });

    // Create User record (for authentication)
    const user = await userRepository.create({
      employeeId,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || 'EMPLOYEE',
      isActive: true,
      mustChangePassword: true,
      isFirstLogin: true,
    });

    // Send welcome email with credentials
    await emailService.sendWelcomeEmail(email, firstName, employeeId, tempPassword);

    // Audit log
    await AuditLog.create({
      userId: createdBy.userId,
      userEmail: createdBy.email,
      role: createdBy.role,
      action: 'CREATE_EMPLOYEE',
      entity: 'Employee',
      entityId: employeeId,
      details: `Created employee ${firstName} ${lastName} (${email}) with role ${role || 'EMPLOYEE'}`,
      ipAddress,
      status: 'success',
    });

    return {
      employee: {
        employeeId: employee.employeeId,
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        designation: employee.designation,
        employmentType: employee.employmentType,
      },
      tempPassword, // Return to admin for display (one-time)
    };
  }

  /**
   * Register a new user (Self Sign-Up).
   *
   * @param {Object} registrationData - { firstName, lastName, email, role, password }
   * @param {string} ipAddress
   * @returns {Object} { user, accessToken, refreshToken }
   */
  async register(registrationData, ipAddress) {
    const { firstName, lastName, email, role, password } = registrationData;

    // Check if email already exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      const error = new Error('An account with this email already exists.');
      error.statusCode = 409;
      error.errorCode = ERROR_CODES.DUPLICATE_ENTRY;
      throw error;
    }

    // Generate employee ID
    const employeeId = await generateEmployeeId();

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create Employee record
    const employee = await Employee.create({
      employeeId,
      firstName,
      lastName,
      email: email.toLowerCase(),
      designation: 'Self Registered',
      employmentType: 'full_time',
    });

    // Create User record
    const user = await userRepository.create({
      employeeId,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || 'EMPLOYEE',
      isActive: true,
      mustChangePassword: false,
      isFirstLogin: false,
    });

    // Audit log
    await AuditLog.create({
      userId: user._id,
      userEmail: email,
      role: user.role,
      action: 'REGISTER',
      entity: 'User',
      entityId: user._id.toString(),
      details: `Self-registered user with role ${user.role}`,
      ipAddress,
      status: 'success',
    });

    // Generate tokens
    const tokenPayload = {
      userId: user._id.toString(),
      employeeId: user.employeeId,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken({ userId: user._id.toString() });

    // Store refresh token
    await userRepository.updateRefreshToken(user._id, refreshToken);

    return {
      user: {
        id: user._id,
        employeeId: user.employeeId,
        email: user.email,
        role: user.role,
        mustChangePassword: user.mustChangePassword,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Login user with email and password.
   * Checks account lock, verifies password, generates tokens.
   *
   * @param {string} email
   * @param {string} password
   * @param {string} ipAddress
   * @param {string} userAgent
   * @returns {Object} { user, accessToken, refreshToken, mustChangePassword }
   */
  async login(email, password, ipAddress, userAgent, recaptchaToken) {
    // 1. Verify Recaptcha
    if (recaptchaToken) {
      const axios = require('axios');
      try {
        const response = await axios.post(
          `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY || '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe'}&response=${recaptchaToken}`
        );
        if (!response.data.success) {
          const error = new Error('reCAPTCHA verification failed.');
          error.statusCode = 400;
          error.errorCode = ERROR_CODES.INVALID_CREDENTIALS;
          throw error;
        }
      } catch (err) {
        console.error('Recaptcha error:', err.message);
      }
    }

    // Find user with password
    const user = await userRepository.findByEmail(email);

    if (!user) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      error.errorCode = ERROR_CODES.INVALID_CREDENTIALS;
      throw error;
    }

    // Check if account is active
    if (!user.isActive) {
      const error = new Error('Your account has been deactivated. Contact your administrator.');
      error.statusCode = 403;
      error.errorCode = ERROR_CODES.ACCOUNT_INACTIVE;
      throw error;
    }

    // Check if account is locked
    if (user.isLocked()) {
      const lockRemaining = Math.ceil((user.lockedUntil - new Date()) / 60000);
      const error = new Error(
        `Account is locked due to multiple failed login attempts. Try again in ${lockRemaining} minute(s).`
      );
      error.statusCode = 423;
      error.errorCode = ERROR_CODES.ACCOUNT_LOCKED;
      throw error;
    }

    // If lock has expired, reset
    if (user.lockedUntil && user.lockedUntil <= new Date()) {
      await userRepository.resetFailedAttempts(user._id);
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      // Increment failed attempts
      const updatedUser = await userRepository.incrementFailedAttempts(user._id);

      // Audit log for failed login
      await AuditLog.create({
        userId: user._id,
        userEmail: email,
        role: user.role,
        action: 'FAILED_LOGIN',
        entity: 'User',
        entityId: user._id.toString(),
        details: `Failed login attempt ${updatedUser.failedLoginAttempts}/${config.security.maxLoginAttempts}`,
        ipAddress,
        userAgent,
        status: 'failure',
      });

      // Lock account if max attempts reached
      if (updatedUser.failedLoginAttempts >= config.security.maxLoginAttempts) {
        const lockUntil = new Date(Date.now() + config.security.lockDurationMinutes * 60 * 1000);
        await userRepository.lockAccount(user._id, lockUntil);

        const error = new Error(
          `Account locked due to ${config.security.maxLoginAttempts} failed login attempts. Try again after ${config.security.lockDurationMinutes} minutes.`
        );
        error.statusCode = 423;
        error.errorCode = ERROR_CODES.ACCOUNT_LOCKED;
        throw error;
      }

      const remainingAttempts = config.security.maxLoginAttempts - updatedUser.failedLoginAttempts;
      const error = new Error(
        `Invalid email or password. ${remainingAttempts} attempt(s) remaining before account lock.`
      );
      error.statusCode = 401;
      error.errorCode = ERROR_CODES.INVALID_CREDENTIALS;
      throw error;
    }

    // Successful login — reset failed attempts
    await userRepository.resetFailedAttempts(user._id);

    // Generate tokens
    const tokenPayload = {
      userId: user._id.toString(),
      employeeId: user.employeeId,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken({ userId: user._id.toString() });

    // Store refresh token
    await userRepository.updateRefreshToken(user._id, refreshToken);

    // Update last login and first login flag
    const updateData = { lastLogin: new Date() };
    if (user.isFirstLogin) {
      updateData.isFirstLogin = false;
    }
    await userRepository.updateById(user._id, updateData);

    // Audit log
    await AuditLog.create({
      userId: user._id,
      userEmail: email,
      role: user.role,
      action: 'LOGIN',
      entity: 'User',
      entityId: user._id.toString(),
      details: 'Successful login',
      ipAddress,
      userAgent,
      status: 'success',
    });

    // Send Login Alert asynchronously
    const employee = await Employee.findOne({ employeeId: user.employeeId });
    if (employee) {
      emailService.sendLoginAlert(email, employee.firstName, ipAddress, userAgent).catch(e => console.error("Email error:", e));
    }

    return {
      user: {
        id: user._id,
        employeeId: user.employeeId,
        email: user.email,
        role: user.role,
        mustChangePassword: user.mustChangePassword,
      },
      accessToken,
      refreshToken,
      mustChangePassword: user.mustChangePassword,
    };
  }

  /**
   * Refresh access token using a valid refresh token.
   *
   * @param {string} token - Refresh token
   * @returns {Object} { accessToken, refreshToken }
   */
  async refreshToken(token) {
    if (!token) {
      const error = new Error('Refresh token is required.');
      error.statusCode = 400;
      error.errorCode = ERROR_CODES.REFRESH_TOKEN_INVALID;
      throw error;
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch (err) {
      const error = new Error('Invalid or expired refresh token.');
      error.statusCode = 401;
      error.errorCode = ERROR_CODES.REFRESH_TOKEN_INVALID;
      throw error;
    }

    const user = await userRepository.findByEmail(decoded.userId);
    // Actually, let's find by ID since refresh token payload has userId
    const userById = await User.findById(decoded.userId).select('+refreshToken');

    if (!userById || userById.refreshToken !== token) {
      const error = new Error('Invalid refresh token. Please login again.');
      error.statusCode = 401;
      error.errorCode = ERROR_CODES.REFRESH_TOKEN_INVALID;
      throw error;
    }

    // Generate new tokens (rotation)
    const tokenPayload = {
      userId: userById._id.toString(),
      employeeId: userById.employeeId,
      email: userById.email,
      role: userById.role,
    };

    const newAccessToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken({ userId: userById._id.toString() });

    // Update stored refresh token
    await userRepository.updateRefreshToken(userById._id, newRefreshToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Change password (for first login mandatory change or voluntary change).
   *
   * @param {string} userId
   * @param {string} currentPassword
   * @param {string} newPassword
   * @param {string} ipAddress
   * @returns {Object} { message }
   */
  async changePassword(userId, currentPassword, newPassword, ipAddress) {
    const user = await userRepository.findByIdWithPassword(userId);

    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      error.errorCode = ERROR_CODES.USER_NOT_FOUND;
      throw error;
    }

    // Verify current password
    const isCurrentValid = await comparePassword(currentPassword, user.password);
    if (!isCurrentValid) {
      const error = new Error('Current password is incorrect.');
      error.statusCode = 400;
      error.errorCode = ERROR_CODES.PASSWORD_MISMATCH;
      throw error;
    }

    // Check new password is different from current
    const isSame = await comparePassword(newPassword, user.password);
    if (isSame) {
      const error = new Error('New password must be different from current password.');
      error.statusCode = 400;
      error.errorCode = ERROR_CODES.PASSWORD_SAME_AS_OLD;
      throw error;
    }

    // Hash and save new password
    const hashedPassword = await hashPassword(newPassword);
    await userRepository.updateById(userId, {
      password: hashedPassword,
      mustChangePassword: false,
      lastPasswordChange: new Date(),
    });

    // Audit log
    await AuditLog.create({
      userId: user._id,
      userEmail: user.email,
      role: user.role,
      action: 'CHANGE_PASSWORD',
      entity: 'User',
      entityId: user._id.toString(),
      details: 'Password changed successfully',
      ipAddress,
      status: 'success',
    });

    return { message: 'Password changed successfully.' };
  }

  /**
   * Forgot password — generates reset token and sends email.
   *
   * @param {string} email
   * @returns {Object} { message }
   */
  async forgotPassword(email) {
    const user = await userRepository.findByEmail(email);

    // Don't reveal if email exists
    if (!user) {
      return { message: 'If an account with that email exists, a password reset link has been sent.' };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Save token with 1 hour expiry
    await userRepository.updateById(user._id, {
      passwordResetToken: hashedToken,
      passwordResetExpires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    });

    // Get employee info for email
    const employee = await Employee.findOne({ employeeId: user.employeeId });
    const firstName = employee ? employee.firstName : 'User';

    // Send reset email
    await emailService.sendPasswordResetEmail(email, firstName, resetToken);

    // Audit log
    await AuditLog.create({
      userId: user._id,
      userEmail: email,
      role: user.role,
      action: 'FORGOT_PASSWORD',
      entity: 'User',
      entityId: user._id.toString(),
      details: 'Password reset requested',
      status: 'success',
    });

    return { message: 'If an account with that email exists, a password reset link has been sent.' };
  }

  /**
   * Reset password using reset token.
   *
   * @param {string} token - Plain reset token from email link
   * @param {string} newPassword
   * @returns {Object} { message }
   */
  async resetPassword(token, newPassword) {
    // Hash the token to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await userRepository.findByResetToken(hashedToken);

    if (!user) {
      const error = new Error('Invalid or expired reset token.');
      error.statusCode = 400;
      error.errorCode = ERROR_CODES.RESET_TOKEN_INVALID;
      throw error;
    }

    // Hash new password and update
    const hashedPassword = await hashPassword(newPassword);
    await userRepository.updateById(user._id, {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
      mustChangePassword: false,
      failedLoginAttempts: 0,
      lockedUntil: null,
      status: 'active',
      lastPasswordChange: new Date(),
    });

    // Audit log
    await AuditLog.create({
      userId: user._id,
      userEmail: user.email,
      role: user.role,
      action: 'RESET_PASSWORD',
      entity: 'User',
      entityId: user._id.toString(),
      details: 'Password reset via email link',
      status: 'success',
    });

    return { message: 'Password has been reset successfully. You can now login with your new password.' };
  }

  /**
   * Logout — clear refresh token.
   *
   * @param {string} userId
   * @param {string} ipAddress
   * @returns {Object} { message }
   */
  async logout(userId, ipAddress) {
    const user = await userRepository.findById(userId);

    if (user) {
      await userRepository.updateRefreshToken(userId, null);

      await AuditLog.create({
        userId: user._id,
        userEmail: user.email,
        role: user.role,
        action: 'LOGOUT',
        entity: 'User',
        entityId: user._id.toString(),
        details: 'User logged out',
        ipAddress,
        status: 'success',
      });
    }

    return { message: 'Logged out successfully.' };
  }

  /**
   * Get current user profile info.
   *
   * @param {string} userId
   * @returns {Object} user and employee info
   */
  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      error.errorCode = ERROR_CODES.USER_NOT_FOUND;
      throw error;
    }

    const employee = await Employee.findOne({ employeeId: user.employeeId });

    return {
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        employeeId: user.employeeId,
        lastLogin: user.lastLogin,
        mustChangePassword: user.mustChangePassword,
      },
      employee: employee
        ? {
            employeeId: employee.employeeId,
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            phone: employee.phone,
            designation: employee.designation,
            departmentId: employee.departmentId,
            joiningDate: employee.joiningDate,
            employmentType: employee.employmentType,
            profilePhoto: employee.profilePhoto,
          }
        : null,
    };
  }
}

module.exports = new AuthService();
