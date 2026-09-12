import { Router } from "express";
import {
  createOrder,
  trackOrder,
  getOrder,
  listMyOrders,
  listVendorOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { validate } from "../middleware/validate.js";
import {
  createOrderValidator,
  orderIdValidator,
  trackOrderValidator,
  updateOrderStatusValidator,
} from "../validators/orderValidators.js";
import { protect } from "../middleware/auth.js";
import { optionalAuth } from "../middleware/optionalAuth.js";

const router = Router();

router.post("/", optionalAuth, createOrderValidator, validate, createOrder);
router.get("/track", trackOrderValidator, validate, trackOrder);
router.get("/mine", protect("customer"), listMyOrders);
router.get("/vendor", protect("vendor"), listVendorOrders);
router.patch("/:id/status", protect("vendor"), updateOrderStatusValidator, validate, updateOrderStatus);
router.get("/:id", protect(), orderIdValidator, validate, getOrder);

export default router;
