import { body, param, query } from "express-validator";

export const createOrderValidator = [
  body("vendorId").isMongoId().withMessage("Invalid vendor id"),
  body("items").isArray({ min: 1 }).withMessage("At least one item is required"),
  body("items.*.productId").isMongoId().withMessage("Invalid product id"),
  body("items.*.quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
  body("deliveryAddress.street").trim().notEmpty().withMessage("Street address is required"),
  body("deliveryAddress.city").trim().notEmpty().withMessage("City is required"),
  body("deliveryAddress.postalCode").trim().notEmpty().withMessage("Postal code is required"),
  body("contactEmail").optional({ checkFalsy: true }).isEmail().withMessage("A valid email is required"),
  body("guestInfo.name").optional({ checkFalsy: true }).trim().notEmpty(),
  body("guestInfo.email").optional({ checkFalsy: true }).isEmail(),
];

export const orderIdValidator = [param("id").isMongoId().withMessage("Invalid order id")];

export const trackOrderValidator = [
  query("orderNumber").trim().notEmpty().withMessage("Order number is required"),
  query("email").isEmail().withMessage("A valid email is required"),
];

export const updateOrderStatusValidator = [
  param("id").isMongoId().withMessage("Invalid order id"),
  body("status")
    .isIn(["preparing", "out_for_delivery", "delivered", "cancelled"])
    .withMessage("Invalid status"),
];
