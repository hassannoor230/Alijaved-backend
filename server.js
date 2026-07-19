import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import caseStudyRoutes from "./routes/caseStudies.js";
import testimonialRoutes from "./routes/testimonials.js";
import statRoutes from "./routes/stats.js";
import contactRoutes from "./routes/contact.js";
import analyticsRoutes from "./routes/analytics.js";

dotenv.config();
let dbError;
const dbReady = connectDB().catch((err) => {
  dbError = err;
});

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

app.get("/", (req, res) => res.json({ status: "ok", service: "portfolio-api" }));
app.get("/api", (req, res) => res.json({ status: "ok", service: "portfolio-api" }));
app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.get("/favicon.ico", (req, res) => res.sendStatus(204));
app.get("/favicon.png", (req, res) => res.sendStatus(204));

// Keep a missing/invalid Vercel database configuration from crashing the
// function process. API routes return a useful 503 until MongoDB is available.
app.use(async (req, res, next) => {
  try {
    await dbReady;
    if (dbError) throw dbError;
    next();
  } catch (err) {
    res.status(503).json({ message: "Database is not configured or unavailable" });
  }
});

app.use("/api/case-studies", caseStudyRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/stats", statRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/analytics", analyticsRoutes);

// fallback error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong on the server" });
});

// Vercel imports this Express app as a serverless function. Keep the listener
// only for local development so a function invocation never opens its own port.
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
