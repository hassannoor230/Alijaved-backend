import nodemailer from "nodemailer";

let transporter;

// Lazily create the transporter so the app doesn't crash on boot if SMTP
// env vars aren't set yet — emails will just fail loudly when actually sent.
const getTransporter = () => {
  if (transporter) return transporter;

  const requiredKeys = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"];
  const missingKeys = requiredKeys.filter((key) => !process.env[key]);
  if (missingKeys.length) {
    throw new Error(`SMTP is not configured. Missing: ${missingKeys.join(", ")}`);
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465, // true for port 465, false for 587/others
    auth: {
      user: process.env.SMTP_USER,
      // Gmail displays App Passwords in groups of four characters. Ignore
      // those display spaces so either form works in a Vercel env variable.
      pass: process.env.SMTP_PASS.replace(/\s/g, ""),
    },
    connectionTimeout: 7000,
    greetingTimeout: 7000,
    socketTimeout: 7000,
  });

  return transporter;
};

/**
 * Send an email.
 * @param {{to: string, subject: string, html: string, text?: string}} opts
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  const t = getTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  return t.sendMail({
    from: `"Ali.Ecom Portfolio" <${from}>`,
    to,
    subject,
    html,
    text,
  });
};

export default sendEmail;
