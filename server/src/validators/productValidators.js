import { body, param } from "express-validator";

export const createProductValidator = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").optional({ checkFalsy: true }).trim(),
  body("category").optional({ checkFalsy: true }).isMongoId().withMessage("Invalid category id"),
  body("priceCents").isInt({ min: 0 }).withMessage("Price must be a non-negative integer (cents)"),
  body("quantity").optional().isInt({ min: 0 }).withMessage("Quantity must be a non-negative integer"),
  body("status").optional().isIn(["draft", "active", "archived"]),
];

export const updateProductValidator = [
  param("id").isMongoId().withMessage("Invalid product id"),
  body("title").optional().trim().notEmpty(),
  body("description").optional({ checkFalsy: true }).trim(),
  body("category").optional({ checkFalsy: true }).isMongoId(),
  body("priceCents").optional().isInt({ min: 0 }),
  body("quantity").optional().isInt({ min: 0 }),
  body("status").optional().isIn(["draft", "active", "archived"]),
];

export const productIdValidator = [param("id").isMongoId().withMessage("Invalid product id")];
