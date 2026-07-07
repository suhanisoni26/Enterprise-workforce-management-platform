/**
 * Password Utility
 * Hash and compare passwords using bcrypt.
 */

const bcrypt = require('bcryptjs');
const config = require('../config');

/**
 * Hash a plain text password.
 * @param {string} plainPassword
 * @returns {Promise<string>} hashed password
 */
const hashPassword = async (plainPassword) => {
  const salt = await bcrypt.genSalt(config.security.bcryptSaltRounds);
  return bcrypt.hash(plainPassword, salt);
};

/**
 * Compare a plain text password with a hash.
 * @param {string} plainPassword
 * @param {string} hashedPassword
 * @returns {Promise<boolean>}
 */
const comparePassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

/**
 * Generate a random temporary password.
 * Format: 2 uppercase + 4 lowercase + 2 digits + 1 special char
 * @returns {string}
 */
const generateTempPassword = () => {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghjkmnpqrstuvwxyz';
  const digits = '23456789';
  const special = '@#$!%&*';

  let password = '';
  // 2 uppercase
  for (let i = 0; i < 2; i++) password += upper[Math.floor(Math.random() * upper.length)];
  // 4 lowercase
  for (let i = 0; i < 4; i++) password += lower[Math.floor(Math.random() * lower.length)];
  // 2 digits
  for (let i = 0; i < 2; i++) password += digits[Math.floor(Math.random() * digits.length)];
  // 1 special
  password += special[Math.floor(Math.random() * special.length)];

  // Shuffle the password
  return password
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('');
};

module.exports = { hashPassword, comparePassword, generateTempPassword };
