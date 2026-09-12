import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  registerUser,
  loginUser,
  registerVendor,
  loginVendor,
  logout,
  getMe,
} from "../controllers/authController.js";
import { validate } from "../middleware/validate.js";
import {
  registerUserValidator,
  registerVendorValidator,
  loginValidator,
} from "../validators/authValidators.js";
import { protect } from "../middleware/auth.js";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts, please try again later." },
});

router.use(authLimiter);

router.post("/register", registerUserValidator, validate, registerUser);
router.post("/login", loginValidator, validate, loginUser);

router.post("/vendor/register", registerVendorValidator, validate, registerVendor);
router.post("/vendor/login", loginValidator, validate, loginVendor);

router.post("/logout", logout);
router.get("/me", protect(), getMe);

export default router;
