/**
 * Department Routes
 * All department management endpoints.
 * Protected by authentication and role-based authorization.
 */

const express = require('express');
const router = express.Router();

const departmentController = require('../controllers/department.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');

// All routes require authentication
router.use(authenticate);

// GET /api/departments – list all
router.get(
  '/',
  authorize(['SUPER_ADMIN', 'ORG_ADMIN', 'HR_MANAGER', 'MANAGER', 'TEAM_LEAD', 'EMPLOYEE']),
  departmentController.getAllDepartments
);

// GET /api/departments/:id – single
router.get(
  '/:id',
  authorize(['SUPER_ADMIN', 'ORG_ADMIN', 'HR_MANAGER', 'MANAGER', 'TEAM_LEAD']),
  departmentController.getDepartmentById
);

// POST /api/departments – create
router.post(
  '/',
  authorize(['SUPER_ADMIN', 'ORG_ADMIN', 'HR_MANAGER']),
  departmentController.createDepartment
);

// PUT /api/departments/:id – update
router.put(
  '/:id',
  authorize(['SUPER_ADMIN', 'ORG_ADMIN', 'HR_MANAGER']),
  departmentController.updateDepartment
);

// DELETE /api/departments/:id – soft-delete
router.delete(
  '/:id',
  authorize(['SUPER_ADMIN', 'ORG_ADMIN']),
  departmentController.deleteDepartment
);

module.exports = router;
