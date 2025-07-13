export function verificationEmailTemplate(
  verificationUrl: string,
  userName: string,
) {
  return `
    <h1>Hello, ${userName}</h1>
    <p>Please verify your email by clicking the link below:</p>
    <a href="${verificationUrl}">${verificationUrl}</a>
  `;
}

export function passwordResetEmailTemplate(resetUrl: string, userName: string) {
  return `
    <p>Hi ${userName},</p>
    <p>You requested a password reset. Click the link below to reset your password:</p>
    <a href="${resetUrl}">Reset Password</a>
    <p>If you did not request this, please ignore this email.</p>
  `;
}

export function welcomeEmailTemplate(userName: string) {
  return `
    <p>Welcome ${userName}!</p>
    <p>Thank you for joining TheDarkArtist. We're thrilled to have you with us.</p>
  `;
}

export function notificationEmailTemplate(message: string) {
  return `
    <p>${message}</p>
  `;
}
