import { body, param } from "express-validator";

export const vendorIdValidator = [param("id").isMongoId().withMessage("Invalid vendor id")];

export const updateVendorValidator = [
  body("shopName").optional().trim().notEmpty(),
  body("description").optional({ checkFalsy: true }).trim(),
  body("phone").optional({ checkFalsy: true }).trim(),
  body("address").optional().trim().notEmpty(),
  body("city").optional().trim().notEmpty(),
  body("postalCode").optional().trim().notEmpty(),
  body("location.coordinates")
    .optional()
    .isArray({ min: 2, max: 2 })
    .withMessage("location.coordinates must be [longitude, latitude]"),
  body("location.coordinates.*").optional().isFloat().withMessage("Coordinates must be numbers"),
];
