import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    title: { type: String, required: true },
    priceCents: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const guestInfoSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
  },
  { _id: false }
);

const deliveryAddressSchema = new mongoose.Schema(
  {
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
    country: { type: String, default: "Belgium", trim: true },
    notes: { type: String, trim: true },
  },
  { _id: false }
);

export const ORDER_STATUS_VALUES = [
  "received",
  "preparing",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true, index: true },

    // Set when placed by a signed-in customer; guestInfo is set otherwise.
    // contactEmail is always populated from one or the other, since every
    // order needs a destination for the PDF invoice regardless of account status.
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    guestInfo: guestInfoSchema,
    contactEmail: { type: String, required: true, lowercase: true, trim: true, index: true },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items) => items.length > 0,
        message: "An order must contain at least one item",
      },
    },
    deliveryAddress: { type: deliveryAddressSchema, required: true },

    subtotalCents: { type: Number, required: true, min: 0 },
    deliveryFeeCents: { type: Number, required: true, min: 0, default: 0 },
    totalCents: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "EUR" },

    status: { type: String, enum: ORDER_STATUS_VALUES, default: "received" },
    statusHistory: [
      {
        status: { type: String, enum: ORDER_STATUS_VALUES, required: true },
        at: { type: Date, default: Date.now },
      },
    ],
    estimatedDeliveryAt: { type: Date },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    stripePaymentIntentId: { type: String, index: true },
    invoiceGenerated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
