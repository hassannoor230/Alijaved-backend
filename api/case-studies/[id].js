import app from "../../server.js";

// Explicit nested Vercel function route for /api/case-studies/:id.
export default function handler(req, res) {
  return app(req, res);
}
