import app from "../../server.js";

// Explicit Vercel function route for the admin testimonial list.
export default function handler(req, res) {
  return app(req, res);
}
