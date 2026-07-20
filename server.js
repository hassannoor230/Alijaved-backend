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

const app = express();

// Allow the live frontend out of the box. CLIENT_ORIGIN can add custom domains
// or preview domains as a comma-separated list.
const defaultOrigins = [
  "http://localhost:5173",
  "https://alijaved-frontend.vercel.app",
];

// Accept full URLs in CLIENT_ORIGIN. The normalization also prevents a common
// Vercel configuration mistake: entering `my-site.vercel.app` without `https://`.
const allowedOrigins = [...defaultOrigins, ...(process.env.CLIENT_ORIGIN || "").split(",")]
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean)
  .map((origin) => {
    if (/^https?:\/\//i.test(origin)) return origin;
    return origin.startsWith("localhost") || origin.startsWith("127.0.0.1")
      ? `http://${origin}`
      : `https://${origin}`;
  });

app.use(
  cors({
    origin(origin, callback) {
      // Requests without an Origin header include server-to-server checks.
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Origin is not allowed by CORS"));
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.json({ status: "ok", service: "portfolio-api" }));
app.get("/api", (req, res) => res.json({ status: "ok", service: "portfolio-api" }));
app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.get("/favicon.ico", (req, res) => res.sendStatus(204));
app.get("/favicon.png", (req, res) => res.sendStatus(204));

// Keep a missing/invalid Vercel database configuration from crashing the
// function process. API routes return a useful 503 until MongoDB is available.
app.use(async (req, res, next) => {
  try {
    // Connect per invocation when needed. A failed initial connection must
    // not poison a warm Vercel function forever; later requests can retry.
    await connectDB();
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
