import express from "express";
import {
  trackVisit,
  trackResumeDownload,
  trackProjectClick,
  getAnalyticsSummary,
} from "../controllers/analyticsController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// Public tracking pings
router.post("/visit", trackVisit);
router.post("/resume-download", trackResumeDownload);
router.post("/project-click", trackProjectClick);

// Admin dashboard data
router.get("/summary", adminAuth, getAnalyticsSummary);

export default router;
