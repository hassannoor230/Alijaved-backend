import app from "../../../server.js";

// Explicit Vercel function route for testimonial approval status updates.
export default function handler(req, res) {
  return app(req, res);
}
