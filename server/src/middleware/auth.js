import { verifyToken } from "../utils/jwt.js";
import { ApiError } from "../utils/ApiError.js";
import { env } from "../config/env.js";
import User from "../models/User.js";
import Vendor from "../models/Vendor.js";

// protect() allows any authenticated role; protect("vendor") restricts to vendors, etc.
export function protect(...allowedRoles) {
  return async function protectMiddleware(req, res, next) {
    const token = req.cookies?.[env.cookieName];
    if (!token) return next(new ApiError(401, "Not authenticated"));

    let payload;
    try {
      payload = verifyToken(token);
    } catch {
      return next(new ApiError(401, "Invalid or expired session"));
    }

    if (allowedRoles.length && !allowedRoles.includes(payload.role)) {
      return next(new ApiError(403, "Not authorized for this resource"));
    }

    const Model = payload.role === "vendor" ? Vendor : User;
    const account = await Model.findById(payload.id);
    if (!account) return next(new ApiError(401, "Account no longer exists"));

    req.auth = { id: payload.id, role: payload.role };
    req[payload.role] = account;
    next();
  };
}
