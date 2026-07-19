import app from "../../server.js";

// Explicit Vercel function route for a single testimonial.
export default function handler(req, res) {
  return app(req, res);
}
