import Product from "../models/Product.js";
import Vendor from "../models/Vendor.js";
import Order from "../models/Order.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateOrderNumber } from "../utils/orderNumber.js";
import { stripe } from "../config/stripe.js";
import { emitOrderUpdate } from "../config/socket.js";

// Flat-rate delivery for this MVP; a future iteration could price by distance/vendor.
const DELIVERY_FEE_CENTS = 500;
const DEFAULT_DELIVERY_HOURS = 48;

export const createOrder = asyncHandler(async (req, res) => {
  const { vendorId, items, deliveryAddress, contactEmail, guestInfo } = req.body;

  const vendor = await Vendor.findOne({ _id: vendorId, status: "approved" });
  if (!vendor) throw new ApiError(404, "Vendor not found");

  const productIds = items.map((i) => i.productId);
  const products = await Product.find({
    _id: { $in: productIds },
    vendor: vendorId,
    status: "active",
  });

  if (products.length !== new Set(productIds).size) {
    throw new ApiError(400, "One or more products are unavailable");
  }

  const email = (req.user?.email || contactEmail || guestInfo?.email || "").toLowerCase();
  if (!email) throw new ApiError(400, "An email address is required to place an order");
  if (!req.user && !guestInfo?.name) {
    throw new ApiError(400, "Guest checkout requires a name");
  }

  // Validate stock and price the order WITHOUT writing anything yet -- the
  // Stripe call below can fail, and we don't want an orphaned unpaid order
  // or decremented stock for a checkout that never actually charges.
  const orderItems = items.map(({ productId, quantity }) => {
    const product = products.find((p) => String(p._id) === productId);
    if (!product.inStock || product.quantity < quantity) {
      throw new ApiError(400, `${product.title} does not have enough stock`);
    }
    return {
      product: product._id,
      title: product.title,
      priceCents: product.priceCents,
      quantity,
    };
  });

  const subtotalCents = orderItems.reduce((sum, i) => sum + i.priceCents * i.quantity, 0);
  const totalCents = subtotalCents + DELIVERY_FEE_CENTS;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalCents,
    currency: "eur",
    receipt_email: email,
  });

  const order = await Order.create({
    orderNumber: generateOrderNumber(),
    vendor: vendor._id,
    user: req.user?._id,
    guestInfo: req.user ? undefined : { name: guestInfo.name, email, phone: guestInfo?.phone },
    contactEmail: email,
    items: orderItems,
    deliveryAddress,
    subtotalCents,
    deliveryFeeCents: DELIVERY_FEE_CENTS,
    totalCents,
    statusHistory: [{ status: "received" }],
    estimatedDeliveryAt: new Date(Date.now() + DEFAULT_DELIVERY_HOURS * 60 * 60 * 1000),
    stripePaymentIntentId: paymentIntent.id,
  });

  await stripe.paymentIntents.update(paymentIntent.id, {
    metadata: { orderId: String(order._id), orderNumber: order.orderNumber },
  });

  for (const { productId, quantity } of items) {
    const product = products.find((p) => String(p._id) === productId);
    product.quantity -= quantity;
    if (product.quantity <= 0) {
      product.quantity = 0;
      product.inStock = false;
    }
    await product.save();
  }

  res.status(201).json({ order, clientSecret: paymentIntent.client_secret });
});

export const trackOrder = asyncHandler(async (req, res) => {
  const { orderNumber, email } = req.query;
  const order = await Order.findOne({
    orderNumber,
    contactEmail: String(email).toLowerCase(),
  });
  if (!order) throw new ApiError(404, "Order not found");
  res.json({ order });
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, "Order not found");

  const isOwnerUser = req.auth.role === "customer" && String(order.user) === String(req.auth.id);
  const isOwnerVendor = req.auth.role === "vendor" && String(order.vendor) === String(req.auth.id);
  if (!isOwnerUser && !isOwnerVendor) {
    throw new ApiError(403, "Not authorized to view this order");
  }

  res.json({ order });
});

export const listMyOrders = asyncHandler(async (req, res) => {
  const items = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ items });
});

export const listVendorOrders = asyncHandler(async (req, res) => {
  const items = await Order.find({ vendor: req.vendor._id }).sort({ createdAt: -1 });
  res.json({ items });
});

const ALLOWED_TRANSITIONS = {
  received: ["preparing", "cancelled"],
  preparing: ["out_for_delivery", "cancelled"],
  out_for_delivery: ["delivered"],
  delivered: [],
  cancelled: [],
};

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, "Order not found");
  if (String(order.vendor) !== String(req.vendor._id)) {
    throw new ApiError(403, "You do not own this order");
  }

  const { status } = req.body;
  const allowedNext = ALLOWED_TRANSITIONS[order.status] || [];
  if (!allowedNext.includes(status)) {
    throw new ApiError(400, `Cannot transition order from ${order.status} to ${status}`);
  }

  order.status = status;
  order.statusHistory.push({ status });
  await order.save();

  emitOrderUpdate(order);

  res.json({ order });
});
