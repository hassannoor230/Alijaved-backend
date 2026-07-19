import app from "../server.js";

// Vercel's `[...all]` route only matches paths below `/api` (for example
// `/api/health`). This explicit entrypoint also serves the exact `/api` URL.
export default function handler(req, res) {
  return app(req, res);
}
