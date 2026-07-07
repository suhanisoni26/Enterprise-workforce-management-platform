/**
 * Authentication Middleware
 * Verifies JWT access token from Authorization header.
 * Attaches decoded user to req.user.
 */

const { verifyAccessToken } = require('../utils/jwt.util');
const { sendError } = require('../utils/response.util');
const ERROR_CODES = require('../constants/error-codes.constants');

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Access denied. No token provided.', 401, ERROR_CODES.UNAUTHORIZED);
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return sendError(res, 'Access denied. No token provided.', 401, ERROR_CODES.UNAUTHORIZED);
    }

    const decoded = verifyAccessToken(token);
    req.user = decoded; // { userId, employeeId, email, role }
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 'Token has expired. Please refresh your token.', 401, ERROR_CODES.TOKEN_EXPIRED);
    }
    if (error.name === 'JsonWebTokenError') {
      return sendError(res, 'Invalid token.', 401, ERROR_CODES.TOKEN_INVALID);
    }
    return sendError(res, 'Authentication failed.', 401, ERROR_CODES.UNAUTHORIZED);
  }
};

module.exports = authenticate;
