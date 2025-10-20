import nodemailer from 'nodemailer';

export async function sendReportEmail({ to, subject, text, html, attachments }) {
  // Configure transport via env (works with any SMTP, e.g., Gmail, Mailgun, SES SMTP)
  // For Gmail, remember to use an App Password if 2FA is on.
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Boolean(process.env.SMTP_SECURE === 'true'), // true for 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const info = await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    html,
    attachments
  });

  return info;
}
