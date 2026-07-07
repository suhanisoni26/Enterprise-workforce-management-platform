/**
 * Role-Based Authorization Middleware
 * Checks if the authenticated user has one of the allowed roles.
 */

const { sendError } = require('../utils/response.util');
const ERROR_CODES = require('../constants/error-codes.constants');

/**
 * Create an authorization middleware for specific roles.
 * @param {string[]} allowedRoles - Array of role strings that are permitted.
 * @returns {Function} Express middleware
 *
 * Usage:
 *   router.post('/employees', authenticate, authorize(['SUPER_ADMIN', 'HR_MANAGER']), controller)
 */
const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Authentication required.', 401, ERROR_CODES.UNAUTHORIZED);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(
        res,
        'You do not have permission to perform this action.',
        403,
        ERROR_CODES.FORBIDDEN
      );
    }

    next();
  };
};

module.exports = authorize;
