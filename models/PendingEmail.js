import mongoose from "mongoose";

const PendingEmailSchema = new mongoose.Schema(
  {
    to: { type: String, required: true },
    subject: { type: String, required: true },
    html: { type: String },
    text: { type: String },
    attemptCount: { type: Number, default: 0 },
    lastError: { type: String },
    lastAttemptAt: { type: Date },
    sent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const PendingEmail = mongoose.model("PendingEmail", PendingEmailSchema);
export default PendingEmail;
