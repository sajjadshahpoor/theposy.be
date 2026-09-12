import Category from "../models/Category.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function slugify(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const listCategories = asyncHandler(async (req, res) => {
  const items = await Category.find().sort({ name: 1 });
  res.json({ items });
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const slug = slugify(name);

  const existing = await Category.findOne({ slug });
  if (existing) throw new ApiError(409, "Category already exists");

  const category = await Category.create({ name: name.trim(), slug });
  res.status(201).json({ category });
});
