import { Router } from "express";
import { listCategories, createCategory } from "../controllers/categoryController.js";
import { validate } from "../middleware/validate.js";
import { createCategoryValidator } from "../validators/categoryValidators.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.get("/", listCategories);
router.post("/", protect("vendor"), createCategoryValidator, validate, createCategory);

export default router;
