import Product from "../models/Product.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listProducts = asyncHandler(async (req, res) => {
  const { category, vendor, search, page = 1, limit = 20 } = req.query;

  const filter = { status: "active" };
  if (category) filter.category = category;
  if (vendor) filter.vendor = vendor;
  if (search) filter.$text = { $search: search };

  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(50, Math.max(1, Number(limit) || 20));

  const [items, total] = await Promise.all([
    Product.find(filter)
      .populate("vendor", "shopName city")
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Product.countDocuments(filter),
  ]);

  res.json({ items, total, page: pageNum, pages: Math.ceil(total / limitNum) });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate("vendor", "shopName city address")
    .populate("category", "name slug");
  if (!product) throw new ApiError(404, "Product not found");
  res.json({ product });
});

export const listVendorProducts = asyncHandler(async (req, res) => {
  const items = await Product.find({ vendor: req.vendor._id }).sort({ createdAt: -1 });
  res.json({ items });
});

export const createProduct = asyncHandler(async (req, res) => {
  const { title, description, category, priceCents, quantity, status } = req.body;
  const images = (req.files || []).map((f) => `/uploads/${f.filename}`);

  const product = await Product.create({
    vendor: req.vendor._id,
    title,
    description,
    category: category || undefined,
    images,
    priceCents,
    quantity: quantity ?? 0,
    inStock: quantity === undefined ? true : Number(quantity) > 0,
    status: status || "active",
  });

  res.status(201).json({ product });
});

const EDITABLE_FIELDS = ["title", "description", "category", "priceCents", "quantity", "status"];

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, "Product not found");
  if (String(product.vendor) !== String(req.vendor._id)) {
    throw new ApiError(403, "You do not own this product");
  }

  for (const field of EDITABLE_FIELDS) {
    if (req.body[field] !== undefined) product[field] = req.body[field];
  }

  if (req.files?.length) {
    product.images.push(...req.files.map((f) => `/uploads/${f.filename}`));
  }

  if (req.body.quantity !== undefined) {
    product.inStock = Number(req.body.quantity) > 0;
  }

  await product.save();
  res.json({ product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, "Product not found");
  if (String(product.vendor) !== String(req.vendor._id)) {
    throw new ApiError(403, "You do not own this product");
  }
  await product.deleteOne();
  res.json({ message: "Product deleted" });
});
