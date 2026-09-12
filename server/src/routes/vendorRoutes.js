import { Router } from "express";
import {
  listVendors,
  getVendor,
  getMyProfile,
  updateMyProfile,
  updateMyLogo,
} from "../controllers/vendorController.js";
import { validate } from "../middleware/validate.js";
import { vendorIdValidator, updateVendorValidator } from "../validators/vendorValidators.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.get("/", listVendors);
router.get("/me", protect("vendor"), getMyProfile);
router.patch("/me", protect("vendor"), updateVendorValidator, validate, updateMyProfile);
router.post("/me/logo", protect("vendor"), upload.single("logo"), updateMyLogo);
router.get("/:id", vendorIdValidator, validate, getVendor);

export default router;
