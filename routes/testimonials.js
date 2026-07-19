import express from "express";
import {
  getTestimonials,
  createTestimonial,
  getAllTestimonials,
  setTestimonialStatus,
  deleteTestimonial,
} from "../controllers/testimonialController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// Public
router.get("/", getTestimonials);          // approved only
router.post("/", createTestimonial);         // submit review -> pending

// Admin
router.get("/all", adminAuth, getAllTestimonials);
router.patch("/:id/status", adminAuth, setTestimonialStatus);
router.delete("/:id", adminAuth, deleteTestimonial);

export default router;
