import mongoose from "mongoose";
import { hashPassword, comparePassword } from "../utils/password.js";

const vendorSchema = new mongoose.Schema(
  {
    shopName: { type: String, required: true, trim: true },
    ownerName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    phone: { type: String, trim: true },
    description: { type: String, trim: true, maxlength: 2000 },
    logoUrl: { type: String },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        validate: {
          validator: (coords) => coords.length === 2,
          message: "location.coordinates must be [longitude, latitude]",
        },
      },
    },
    status: {
      type: String,
      enum: ["pending", "approved", "suspended"],
      default: "pending",
    },
  },
  { timestamps: true }
);

vendorSchema.index({ location: "2dsphere" });

vendorSchema.pre("save", async function hashIfModified(next) {
  if (!this.isModified("password")) return next();
  this.password = await hashPassword(this.password);
  next();
});

vendorSchema.methods.comparePassword = function comparePasswordMethod(candidate) {
  return comparePassword(candidate, this.password);
};

vendorSchema.methods.toSafeObject = function toSafeObject() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model("Vendor", vendorSchema);
