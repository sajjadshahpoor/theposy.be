import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, maxlength: 2000 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    images: [{ type: String }],
    priceCents: { type: Number, required: true, min: 0 },
    inStock: { type: Boolean, default: true },
    quantity: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ["draft", "active", "archived"],
      default: "active",
    },
  },
  { timestamps: true }
);

productSchema.index({ title: "text", description: "text" });

export default mongoose.model("Product", productSchema);
