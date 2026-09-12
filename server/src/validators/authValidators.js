import { body } from "express-validator";

export const registerUserValidator = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("A valid email is required").normalizeEmail(),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
  body("phone").optional({ checkFalsy: true }).trim(),
];

export const loginValidator = [
  body("email").isEmail().withMessage("A valid email is required").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

export const registerVendorValidator = [
  body("shopName").trim().notEmpty().withMessage("Shop name is required"),
  body("ownerName").trim().notEmpty().withMessage("Owner name is required"),
  body("email").isEmail().withMessage("A valid email is required").normalizeEmail(),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
  body("phone").optional({ checkFalsy: true }).trim(),
  body("description").optional({ checkFalsy: true }).trim(),
  body("address").trim().notEmpty().withMessage("Street address is required"),
  body("city").trim().notEmpty().withMessage("City is required"),
  body("postalCode").trim().notEmpty().withMessage("Postal code is required"),
  body("location.coordinates")
    .isArray({ min: 2, max: 2 })
    .withMessage("location.coordinates must be [longitude, latitude]"),
  body("location.coordinates.*").isFloat().withMessage("Coordinates must be numbers"),
];
