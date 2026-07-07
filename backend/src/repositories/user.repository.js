/**
 * User Repository
 * Data access layer for User collection.
 * Only interacts with MongoDB. No business logic.
 */

const User = require('../models/User.model');

class UserRepository {
  /**
   * Create a new user.
   * @param {Object} userData
   * @returns {Promise<Object>}
   */
  async create(userData) {
    const user = new User(userData);
    return user.save();
  }

  /**
   * Find user by email (includes password for auth).
   * @param {string} email
   * @returns {Promise<Object|null>}
   */
  async findByEmail(email) {
    return User.findOne({ email: email.toLowerCase() }).select('+password +refreshToken');
  }

  /**
   * Find user by ID.
   * @param {string} userId
   * @returns {Promise<Object|null>}
   */
  async findById(userId) {
    return User.findById(userId);
  }

  /**
   * Find user by ID with password (for password change).
   * @param {string} userId
   * @returns {Promise<Object|null>}
   */
  async findByIdWithPassword(userId) {
    return User.findById(userId).select('+password');
  }

  /**
   * Find user by employee ID.
   * @param {string} employeeId
   * @returns {Promise<Object|null>}
   */
  async findByEmployeeId(employeeId) {
    return User.findOne({ employeeId });
  }

  /**
   * Update user by ID.
   * @param {string} userId
   * @param {Object} updateData
   * @returns {Promise<Object|null>}
   */
  async updateById(userId, updateData) {
    return User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true });
  }

  /**
   * Increment failed login attempts.
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async incrementFailedAttempts(userId) {
    return User.findByIdAndUpdate(
      userId,
      { $inc: { failedLoginAttempts: 1 } },
      { new: true }
    );
  }

  /**
   * Lock the user account.
   * @param {string} userId
   * @param {Date} lockedUntil
   * @returns {Promise<Object>}
   */
  async lockAccount(userId, lockedUntil) {
    return User.findByIdAndUpdate(
      userId,
      {
        lockedUntil,
        status: 'locked',
      },
      { new: true }
    );
  }

  /**
   * Reset failed login attempts and unlock.
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async resetFailedAttempts(userId) {
    return User.findByIdAndUpdate(
      userId,
      {
        failedLoginAttempts: 0,
        lockedUntil: null,
        status: 'active',
      },
      { new: true }
    );
  }

  /**
   * Update refresh token.
   * @param {string} userId
   * @param {string|null} refreshToken
   * @returns {Promise<Object>}
   */
  async updateRefreshToken(userId, refreshToken) {
    return User.findByIdAndUpdate(userId, { refreshToken }, { new: true });
  }

  /**
   * Find user by password reset token.
   * @param {string} token
   * @returns {Promise<Object|null>}
   */
  async findByResetToken(token) {
    return User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() },
    }).select('+password +passwordResetToken +passwordResetExpires');
  }

  /**
   * Get all users with pagination.
   * @param {Object} filter
   * @param {number} page
   * @param {number} limit
   * @returns {Promise<{users: Array, total: number}>}
   */
  async findAll(filter = {}, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      User.countDocuments(filter),
    ]);
    return { users, total };
  }
}

module.exports = new UserRepository();
