import mongoose from "mongoose";
import { hashPassword, comparePassword } from "../utils/password.js";

const addressSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true },
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
    country: { type: String, default: "Belgium", trim: true },
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    phone: { type: String, trim: true },
    addresses: [addressSchema],
    role: { type: String, enum: ["customer"], default: "customer" },
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashIfModified(next) {
  if (!this.isModified("password")) return next();
  this.password = await hashPassword(this.password);
  next();
});

userSchema.methods.comparePassword = function comparePasswordMethod(candidate) {
  return comparePassword(candidate, this.password);
};

userSchema.methods.toSafeObject = function toSafeObject() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model("User", userSchema);
