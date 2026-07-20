import PendingEmail from "../models/PendingEmail.js";
import sendEmail from "../utils/sendEmail.js";

export const listPendingEmails = async (req, res) => {
  try {
    const items = await PendingEmail.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to load pending emails", error: err.message });
  }
};

export const resendPendingEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await PendingEmail.findById(id);
    if (!item) return res.status(404).json({ message: "Pending email not found" });

    try {
      await sendEmail({ to: item.to, subject: item.subject, html: item.html, text: item.text });
      await item.remove();
      return res.json({ message: "Email resent and removed from queue" });
    } catch (sendErr) {
      item.attemptCount = (item.attemptCount || 0) + 1;
      item.lastError = sendErr && sendErr.message ? sendErr.message : String(sendErr);
      item.lastAttemptAt = new Date();
      await item.save();
      return res.status(500).json({ message: "Resend failed", error: item.lastError });
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to resend pending email", error: err.message });
  }
};
