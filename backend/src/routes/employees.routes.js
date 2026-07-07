/**
 * Employee Routes
 * All employee management endpoints (listing, profile, status changes).
 * Protected by authentication and role-based authorization.
 */

const express = require('express');
const router = express.Router();

const employeeController = require('../controllers/employee.controller');
const analyticsController = require('../controllers/analytics.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');

// All routes require authentication
router.use(authenticate);

// ──────────────────────────────────────────────
// Stats (accessible by admin, hr, manager)
// ──────────────────────────────────────────────

// GET /api/employees/stats
router.get(
  '/stats',
  authorize(['SUPER_ADMIN', 'ORG_ADMIN', 'HR_MANAGER', 'MANAGER']),
  employeeController.getEmployeeStats
);

// GET /api/employees/analytics
router.get(
  '/analytics',
  authorize(['SUPER_ADMIN', 'ORG_ADMIN', 'HR_MANAGER']),
  analyticsController.getDashboardAnalytics
);

// ──────────────────────────────────────────────
// Employee Listing & Details
// ──────────────────────────────────────────────

// GET /api/employees
router.get(
  '/',
  authorize(['SUPER_ADMIN', 'ORG_ADMIN', 'HR_MANAGER', 'MANAGER', 'TEAM_LEAD']),
  employeeController.getAllEmployees
);

// GET /api/employees/audit-logs
router.get(
  '/audit-logs',
  authorize(['SUPER_ADMIN', 'ORG_ADMIN', 'HR_MANAGER']),
  employeeController.getAuditLogs
);

// GET /api/employees/:employeeId
router.get(
  '/:employeeId',
  authorize(['SUPER_ADMIN', 'ORG_ADMIN', 'HR_MANAGER', 'MANAGER', 'TEAM_LEAD', 'EMPLOYEE']),
  employeeController.getEmployeeById
);

// ──────────────────────────────────────────────
// Employee Status Management (Admin/HR only)
// ──────────────────────────────────────────────

// PATCH /api/employees/:employeeId/deactivate
router.patch(
  '/:employeeId/deactivate',
  authorize(['SUPER_ADMIN', 'ORG_ADMIN']),
  employeeController.deactivateEmployee
);

// PATCH /api/employees/:employeeId/activate
router.patch(
  '/:employeeId/activate',
  authorize(['SUPER_ADMIN', 'ORG_ADMIN']),
  employeeController.activateEmployee
);



// PUT /api/employees/:employeeId
router.put(
  '/:employeeId',
  authorize(['SUPER_ADMIN', 'ORG_ADMIN', 'HR_MANAGER']),
  employeeController.updateEmployee
);

module.exports = router;
