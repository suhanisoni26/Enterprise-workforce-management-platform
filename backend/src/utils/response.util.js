/**
 * Response Utility
 * Standardized API response formatters.
 */

/**
 * Send a success response.
 * @param {Object} res - Express response object
 * @param {Object} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code (default 200)
 */
const sendSuccess = (res, data = null, message = 'Success', statusCode = 200) => {
  const response = {
    success: true,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send an error response.
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default 500)
 * @param {string} errorCode - Application error code
 * @param {Array} errors - Validation errors array
 */
const sendError = (res, message = 'Internal Server Error', statusCode = 500, errorCode = null, errors = null) => {
  const response = {
    success: false,
    message,
  };

  if (errorCode) {
    response.errorCode = errorCode;
  }

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send a paginated response.
 * @param {Object} res - Express response object
 * @param {Array} data - Array of results
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} total - Total items count
 * @param {string} message - Success message
 */
const sendPaginated = (res, data, page, limit, total, message = 'Success') => {
  return res.status(200).json({
    success: true,
    message,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    data,
  });
};

module.exports = { sendSuccess, sendError, sendPaginated };
