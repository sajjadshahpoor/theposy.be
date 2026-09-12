import path from "node:path";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";

import { env, isProduction } from "./config/env.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { stripeWebhook } from "./controllers/webhookController.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true,
    })
  );

  // Registered before express.json() -- Stripe needs the raw, unparsed body
  // to verify the webhook signature.
  app.post("/api/orders/webhook", express.raw({ type: "application/json" }), stripeWebhook);

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(mongoSanitize());
  app.use(morgan(isProduction ? "combined" : "dev"));
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "theposy-api" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/categories", categoryRoutes);
  app.use("/api/vendors", vendorRoutes);
  app.use("/api/orders", orderRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
