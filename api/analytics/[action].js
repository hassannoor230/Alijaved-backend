import app from "../../server.js";

// Explicit nested Vercel function route for /api/analytics/:action.
export default function handler(req, res) {
  return app(req, res);
}
