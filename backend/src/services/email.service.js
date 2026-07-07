/**
 * Email Service
 * Handles all email sending operations.
 */

const nodemailer = require('nodemailer');
const { getTransporter } = require('../config/mail.config');
const config = require('../config');

class EmailService {
  /**
   * Send an email.
   * Falls back to console logging if transporter is not configured.
   */
  async sendMail(to, subject, html) {
    try {
      const transporter = await getTransporter();

      if (!transporter) {
        // Fallback: log to console
        console.log('\n📧 ════════════════════════════════════════');
        console.log(`   To: ${to}`);
        console.log(`   Subject: ${subject}`);
        console.log(`   Body: ${html.replace(/<[^>]*>/g, '')}`);
        console.log('════════════════════════════════════════\n');
        return { messageId: 'console-fallback', previewUrl: null };
      }

      const info = await transporter.sendMail({
        from: `"EWM Platform" <${config.smtp.from}>`,
        to,
        subject,
        html,
      });

      // For Ethereal, log the preview URL
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log(`📧 Email Preview URL: ${previewUrl}`);
      }

      return { messageId: info.messageId, previewUrl };
    } catch (error) {
      console.error('❌ Email send error:', error.message);
      // Don't throw — email failure shouldn't break the main flow
      return { messageId: null, error: error.message };
    }
  }

  /**
   * Send welcome email with login credentials to new employee.
   */
  async sendWelcomeEmail(to, firstName, employeeId, tempPassword) {
    const subject = 'Welcome to Enterprise Workforce Management Platform';
    const html = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 24px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Welcome aboard, ${firstName}! 🎉</h1>
        </div>
        <div style="background: white; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0; border-top: none;">
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            Your account has been created on the Enterprise Workforce Management Platform. 
            Here are your login credentials:
          </p>
          <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 8px 0; color: #334155;"><strong>Employee ID:</strong> ${employeeId}</p>
            <p style="margin: 8px 0; color: #334155;"><strong>Email:</strong> ${to}</p>
            <p style="margin: 8px 0; color: #334155;"><strong>Temporary Password:</strong> <code style="background: #e2e8f0; padding: 2px 8px; border-radius: 4px; font-size: 15px;">${tempPassword}</code></p>
          </div>
          <div style="background: #fef3cd; padding: 16px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
            <p style="margin: 0; color: #92400e; font-size: 14px;">
              ⚠️ <strong>Important:</strong> You will be required to change your password on first login.
            </p>
          </div>
          <a href="${config.clientUrl}/login" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">
            Login Now →
          </a>
          <p style="color: #94a3b8; font-size: 13px; margin-top: 24px;">
            If you did not expect this email, please contact your IT administrator.
          </p>
        </div>
      </div>
    `;

    return this.sendMail(to, subject, html);
  }

  /**
   * Send password reset email with reset link.
   */
  async sendPasswordResetEmail(to, firstName, resetToken) {
    const resetUrl = `${config.clientUrl}/reset-password?token=${resetToken}`;
    const subject = 'Password Reset Request - EWM Platform';
    const html = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 24px;">
        <div style="background: linear-gradient(135deg, #f97316 0%, #ef4444 100%); padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Password Reset 🔐</h1>
        </div>
        <div style="background: white; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0; border-top: none;">
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            Hi ${firstName}, we received a request to reset your password. Click the button below to create a new password:
          </p>
          <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ef4444 100%); color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0;">
            Reset Password →
          </a>
          <p style="color: #94a3b8; font-size: 13px;">
            This link will expire in 1 hour. If you didn't request this, please ignore this email.
          </p>
        </div>
      </div>
    `;

    return this.sendMail(to, subject, html);
  }
  /**
   * Send login security alert email.
   */
  async sendLoginAlert(to, firstName, ipAddress, userAgent) {
    const subject = 'Security Alert: New Login Detected';
    const html = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 24px;">
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">New Login Detected 🛡️</h1>
        </div>
        <div style="background: white; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0; border-top: none;">
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            Hi ${firstName},
          </p>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            We noticed a successful login to your NexForce workspace account. If this was you, you can safely ignore this email.
          </p>
          <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 8px 0; color: #334155;"><strong>Date/Time:</strong> ${new Date().toLocaleString()}</p>
            <p style="margin: 8px 0; color: #334155;"><strong>IP Address:</strong> ${ipAddress || 'Unknown'}</p>
            <p style="margin: 8px 0; color: #334155;"><strong>Device/Browser:</strong> ${userAgent || 'Unknown'}</p>
          </div>
          <p style="color: #94a3b8; font-size: 13px; margin-top: 24px;">
            If you did not authorize this login, please contact your IT administrator immediately.
          </p>
        </div>
      </div>
    `;

    return this.sendMail(to, subject, html);
  }
}

module.exports = new EmailService();
