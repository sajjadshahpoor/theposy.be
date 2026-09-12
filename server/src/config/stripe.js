import Stripe from "stripe";
import { env } from "./env.js";

export const stripe = new Stripe(env.stripeSecretKey || "sk_test_missing_key", {
  apiVersion: "2024-06-20",
});
