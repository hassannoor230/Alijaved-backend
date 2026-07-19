import express from "express";
import { getCaseStudies, createCaseStudy, updateCaseStudy, deleteCaseStudy } from "../controllers/caseStudyController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/", getCaseStudies);
router.post("/", adminAuth, createCaseStudy);
router.patch("/:id", adminAuth, updateCaseStudy);
router.delete("/:id", adminAuth, deleteCaseStudy);

export default router;
