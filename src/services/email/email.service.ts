import nodemailer from 'nodemailer';
import config from '../../config';
import * as emailTemplates from './email.templates';

export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.secure,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string, text?: string) {
    const mailOptions = {
      from: `"TheDarkArtist" <${config.email.user}>`,
      to,
      subject,
      text: text || '',
      html,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async sendVerificationEmail(to: string, token: string, userName: string) {
    const verificationUrl = `${config.app.baseUrl}/api/auth/verify-email?token=${token}`;
    const html = emailTemplates.verificationEmailTemplate(
      verificationUrl,
      userName,
    );
    const subject = 'Verify your email address';

    return this.sendEmail(to, subject, html);
  }

  async sendPasswordResetEmail(to: string, resetUrl: string, userName: string) {
    const html = emailTemplates.passwordResetEmailTemplate(resetUrl, userName);
    const text = `Hi ${userName},\n\nYou requested a password reset. Click the link below to reset your password:\n${resetUrl}\n\nIf you did not request this, please ignore this email.`;

    return this.sendEmail(to, 'Password Reset Request', html, text);
  }

  async sendWelcomeEmail(to: string, userName: string) {
    const html = emailTemplates.welcomeEmailTemplate(userName);
    const text = `Welcome ${userName}!\n\nThank you for joining us. We're excited to have you on board.`;

    return this.sendEmail(to, 'Welcome to TheDarkArtist', html, text);
  }

  async sendNotificationEmail(to: string, subject: string, message: string) {
    const html = emailTemplates.notificationEmailTemplate(message);
    const text = message;

    return this.sendEmail(to, subject, html, text);
  }
}
