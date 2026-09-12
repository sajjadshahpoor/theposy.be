import Vendor from "../models/Vendor.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Public listing for the customer-facing map: only approved vendors, and
// optionally sorted by proximity to a given point (?near=lng,lat&maxDistanceKm=).
export const listVendors = asyncHandler(async (req, res) => {
  const { near, maxDistanceKm } = req.query;
  const filter = { status: "approved" };

  if (near) {
    const [lng, lat] = String(near).split(",").map(Number);
    if (!Number.isNaN(lng) && !Number.isNaN(lat)) {
      filter.location = {
        $near: {
          $geometry: { type: "Point", coordinates: [lng, lat] },
          $maxDistance: (Number(maxDistanceKm) || 50) * 1000,
        },
      };
    }
  }

  const items = await Vendor.find(filter).select("-__v");
  res.json({ items });
});

export const getVendor = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOne({ _id: req.params.id, status: "approved" });
  if (!vendor) throw new ApiError(404, "Vendor not found");
  res.json({ vendor });
});

export const getMyProfile = asyncHandler(async (req, res) => {
  res.json({ vendor: req.vendor.toSafeObject() });
});

const EDITABLE_VENDOR_FIELDS = [
  "shopName",
  "description",
  "phone",
  "address",
  "city",
  "postalCode",
  "location",
];

export const updateMyProfile = asyncHandler(async (req, res) => {
  for (const field of EDITABLE_VENDOR_FIELDS) {
    if (req.body[field] !== undefined) req.vendor[field] = req.body[field];
  }
  await req.vendor.save();
  res.json({ vendor: req.vendor.toSafeObject() });
});

export const updateMyLogo = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "Logo image is required");
  req.vendor.logoUrl = `/uploads/${req.file.filename}`;
  await req.vendor.save();
  res.json({ vendor: req.vendor.toSafeObject() });
});
