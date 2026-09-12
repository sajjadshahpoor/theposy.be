import { verifyToken } from "../utils/jwt.js";
import { env } from "../config/env.js";
import User from "../models/User.js";

// Populates req.user when a valid customer session cookie is present,
// but never rejects the request — checkout supports guest customers too.
export async function optionalAuth(req, res, next) {
  const token = req.cookies?.[env.cookieName];
  if (!token) return next();

  try {
    const payload = verifyToken(token);
    if (payload.role === "customer") {
      const user = await User.findById(payload.id);
      if (user) {
        req.auth = { id: payload.id, role: "customer" };
        req.user = user;
      }
    }
  } catch {
    // Invalid/expired token: fall through as an unauthenticated (guest) request.
  }

  next();
}
