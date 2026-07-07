/**
 * JWT Configuration
 * Exports JWT secrets and expiry settings.
 */

const config = require('./index');

const jwtConfig = {
  accessToken: {
    secret: config.jwt.accessSecret,
    expiresIn: config.jwt.accessExpiry,
  },
  refreshToken: {
    secret: config.jwt.refreshSecret,
    expiresIn: config.jwt.refreshExpiry,
  },
};

module.exports = jwtConfig;
