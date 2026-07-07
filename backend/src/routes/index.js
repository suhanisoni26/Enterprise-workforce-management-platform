/**
 * Route Aggregator
 * Central file that mounts all module routes.
 * New modules add their routes here.
 */

const express = require('express');
const router = express.Router();

// Module Routes
const authRoutes = require('./auth.routes');
const employeeRoutes = require('./employees.routes');
const departmentRoutes = require('./departments.routes');
const leaveRoutes = require('./leave.routes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/employees', employeeRoutes);
router.use('/departments', departmentRoutes);
router.use('/leave', leaveRoutes);

// Future module routes will be mounted here:
// router.use('/attendance', attendanceRoutes);
// router.use('/payroll', payrollRoutes);
// router.use('/recruitment', recruitmentRoutes);
// router.use('/performance', performanceRoutes);
// router.use('/projects', projectRoutes);
// router.use('/assets', assetRoutes);
// router.use('/documents', documentRoutes);
// router.use('/notifications', notificationRoutes);
// router.use('/reports', reportRoutes);
// router.use('/ai-assistant', aiRoutes);

module.exports = router;

