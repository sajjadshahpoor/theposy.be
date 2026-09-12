import { Router } from "express";
import {
  listProducts,
  getProduct,
  listVendorProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { validate } from "../middleware/validate.js";
import {
  createProductValidator,
  updateProductValidator,
  productIdValidator,
} from "../validators/productValidators.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.get("/", listProducts);
router.get("/mine", protect("vendor"), listVendorProducts);
router.get("/:id", productIdValidator, validate, getProduct);

router.post(
  "/",
  protect("vendor"),
  upload.array("images", 6),
  createProductValidator,
  validate,
  createProduct
);
router.patch(
  "/:id",
  protect("vendor"),
  upload.array("images", 6),
  updateProductValidator,
  validate,
  updateProduct
);
router.delete("/:id", protect("vendor"), productIdValidator, validate, deleteProduct);

export default router;
