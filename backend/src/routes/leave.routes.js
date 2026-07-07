/**
 * Leave Routes
 * All leave request management endpoints.
 * Protected by authentication and role-based authorization.
 */

const express = require('express');
const router = express.Router();

const leaveController = require('../controllers/leave.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');

// All routes require authentication
router.use(authenticate);

// ──────────────────────────────────────────────
// Stats (admin / hr / manager)
// ──────────────────────────────────────────────
router.get(
  '/stats',
  authorize(['SUPER_ADMIN', 'ORG_ADMIN', 'HR_MANAGER', 'MANAGER']),
  leaveController.getLeaveStats
);

// ──────────────────────────────────────────────
// My leaves (any authenticated user)
// ──────────────────────────────────────────────
router.get(
  '/my',
  authorize(['SUPER_ADMIN', 'ORG_ADMIN', 'HR_MANAGER', 'MANAGER', 'TEAM_LEAD', 'EMPLOYEE']),
  leaveController.getMyLeaves
);

// ──────────────────────────────────────────────
// All leaves (admin / hr / manager)
// ──────────────────────────────────────────────
router.get(
  '/',
  authorize(['SUPER_ADMIN', 'ORG_ADMIN', 'HR_MANAGER', 'MANAGER', 'TEAM_LEAD']),
  leaveController.getAllLeaves
);

// ──────────────────────────────────────────────
// Submit new leave request (any authenticated user)
// ──────────────────────────────────────────────
router.post(
  '/',
  authorize(['SUPER_ADMIN', 'ORG_ADMIN', 'HR_MANAGER', 'MANAGER', 'TEAM_LEAD', 'EMPLOYEE']),
  leaveController.createLeaveRequest
);

// ──────────────────────────────────────────────
// Approve / Reject (admin / hr / manager only)
// ──────────────────────────────────────────────
router.patch(
  '/:id/approve',
  authorize(['SUPER_ADMIN', 'ORG_ADMIN', 'HR_MANAGER', 'MANAGER']),
  leaveController.approveLeave
);

router.patch(
  '/:id/reject',
  authorize(['SUPER_ADMIN', 'ORG_ADMIN', 'HR_MANAGER', 'MANAGER']),
  leaveController.rejectLeave
);

module.exports = router;
