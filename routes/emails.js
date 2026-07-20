import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import { listPendingEmails, resendPendingEmail } from "../controllers/emailController.js";

const router = express.Router();

// GET /api/admin/emails/pending
router.get("/pending", adminAuth, listPendingEmails);

// POST /api/admin/emails/:id/resend
router.post("/:id/resend", adminAuth, resendPendingEmail);

export default router;
