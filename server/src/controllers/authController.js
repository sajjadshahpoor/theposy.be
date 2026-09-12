import User from "../models/User.js";
import Vendor from "../models/Vendor.js";
import { signToken } from "../utils/jwt.js";
import { setAuthCookie, clearAuthCookie } from "../utils/cookies.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, "An account with this email already exists");

  const user = await User.create({ name, email, password, phone });
  const token = signToken({ id: user._id, role: "customer" });
  setAuthCookie(res, token);

  res.status(201).json({ user: user.toSafeObject() });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = signToken({ id: user._id, role: "customer" });
  setAuthCookie(res, token);
  res.json({ user: user.toSafeObject() });
});

export const registerVendor = asyncHandler(async (req, res) => {
  const {
    shopName,
    ownerName,
    email,
    password,
    phone,
    description,
    address,
    city,
    postalCode,
    location,
  } = req.body;

  const existing = await Vendor.findOne({ email });
  if (existing) throw new ApiError(409, "An account with this email already exists");

  const vendor = await Vendor.create({
    shopName,
    ownerName,
    email,
    password,
    phone,
    description,
    address,
    city,
    postalCode,
    location,
  });

  const token = signToken({ id: vendor._id, role: "vendor" });
  setAuthCookie(res, token);
  res.status(201).json({ vendor: vendor.toSafeObject() });
});

export const loginVendor = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const vendor = await Vendor.findOne({ email }).select("+password");
  if (!vendor || !(await vendor.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = signToken({ id: vendor._id, role: "vendor" });
  setAuthCookie(res, token);
  res.json({ vendor: vendor.toSafeObject() });
});

export const logout = asyncHandler(async (req, res) => {
  clearAuthCookie(res);
  res.json({ message: "Logged out" });
});

export const getMe = asyncHandler(async (req, res) => {
  if (req.auth.role === "vendor") {
    return res.json({ vendor: req.vendor.toSafeObject() });
  }
  res.json({ user: req.user.toSafeObject() });
});
