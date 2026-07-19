import app from "../server.js";

// Catch every /api/* request and hand it to the existing Express routes.
export default function handler(req, res) {
  return app(req, res);
}
