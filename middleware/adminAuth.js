// Lightweight admin protection: the client sends the shared secret in the
// "x-admin-key" header. Good enough for a single-owner portfolio; swap for
// proper JWT/user auth if you ever add multiple admins.
const adminAuth = (req, res, next) => {
  const key = req.headers["x-admin-key"];

  if (!process.env.ADMIN_KEY) {
    return res.status(500).json({ message: "ADMIN_KEY is not configured on the server" });
  }

  if (!key || key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ message: "Unauthorized — invalid or missing admin key" });
  }

  next();
};

export default adminAuth;
