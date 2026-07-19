import express from "express";
import { createContact, getContacts } from "../controllers/contactController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/", createContact);              // public
router.get("/", adminAuth, getContacts);        // admin only

export default router;
