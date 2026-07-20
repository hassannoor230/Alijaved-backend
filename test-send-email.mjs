import dotenv from "dotenv";
dotenv.config();

import sendEmail from "./utils/sendEmail.js";

(async () => {
  try {
    console.log("Starting test send to:", process.env.ADMIN_EMAIL || process.env.SMTP_USER);
    const info = await sendEmail({
      to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
      subject: "SMTP test from portfolio-server",
      html: `<p>This is a test email to verify SMTP configuration.</p>`,
    });
    console.log("Email sent successfully:", info);
  } catch (err) {
    console.error("Test send failed:", err && err.message ? err.message : err);
    // ensure non-zero exit for automation
    process.exitCode = 1;
  }
})();
