/**
 * Auth Routes
 * All authentication and authorization endpoints.
 */

const express = require('express');
const router = express.Router();

// Controller
const authController = require('../controllers/auth.controller');

// Middlewares
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const { authLimiter, passwordResetLimiter } = require('../middlewares/rate-limiter.middleware');

// Validators
const {
  validateLogin,
  validateRegister,
  validateCreateEmployee,
  validateChangePassword,
  validateForgotPassword,
  validateResetPassword,
} = require('../validators/auth.validator');

// ──────────────────────────────────────────────
// Public Routes (No authentication required)
// ──────────────────────────────────────────────

// POST /api/auth/login
router.post('/login', authLimiter, validateLogin, authController.login);

// POST /api/auth/register
router.post('/register', validateRegister, authController.register);

// POST /api/auth/refresh-token
router.post('/refresh-token', authController.refreshToken);

// POST /api/auth/forgot-password
router.post('/forgot-password', passwordResetLimiter, validateForgotPassword, authController.forgotPassword);

// POST /api/auth/reset-password
router.post('/reset-password', validateResetPassword, authController.resetPassword);

// ──────────────────────────────────────────────
// Protected Routes (Authentication required)
// ──────────────────────────────────────────────

// POST /api/auth/logout
router.post('/logout', authenticate, authController.logout);

// GET /api/auth/profile
router.get('/profile', authenticate, authController.getProfile);

// POST /api/auth/change-password
router.post('/change-password', authenticate, validateChangePassword, authController.changePassword);

// ──────────────────────────────────────────────
// Admin Routes (Authentication + Authorization)
// ──────────────────────────────────────────────

// POST /api/auth/create-employee
router.post(
  '/create-employee',
  authenticate,
  authorize(['SUPER_ADMIN', 'ORG_ADMIN', 'HR_MANAGER']),
  validateCreateEmployee,
  authController.createEmployee
);

module.exports = router;
