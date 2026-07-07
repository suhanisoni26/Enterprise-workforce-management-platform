/**
 * Mail Configuration
 * Nodemailer transporter setup.
 * Uses Ethereal for development, real SMTP in production.
 */

const nodemailer = require('nodemailer');
const config = require('./index');

let transporter;

const createTransporter = async () => {
  // In development with no SMTP credentials, create an Ethereal test account
  if (config.isDev && (!config.smtp.user || !config.smtp.pass)) {
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log('📧 Email: Using Ethereal test account');
      console.log(`   User: ${testAccount.user}`);
      return transporter;
    } catch (error) {
      console.warn('⚠️  Could not create Ethereal account. Email will be logged to console.');
      return null;
    }
  }

  // Production / configured SMTP
  transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.port === 465,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass,
    },
  });

  console.log('📧 Email: SMTP configured');
  return transporter;
};

const getTransporter = async () => {
  if (!transporter) {
    await createTransporter();
  }
  return transporter;
};

module.exports = { createTransporter, getTransporter };
