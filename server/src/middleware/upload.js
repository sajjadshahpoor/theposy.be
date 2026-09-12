import multer from "multer";
import path from "node:path";
import crypto from "node:crypto";
import { ApiError } from "../utils/ApiError.js";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${crypto.randomUUID()}${ext}`);
  },
});

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function fileFilter(req, file, cb) {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    return cb(new ApiError(400, "Only JPEG, PNG, or WEBP images are allowed"));
  }
  cb(null, true);
}

// Local disk storage for dev/portfolio use. Swap this module for a
// Cloudinary/S3-backed implementation in production without touching callers.
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 6 },
});
