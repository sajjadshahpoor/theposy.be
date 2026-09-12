import { stripe } from "../config/stripe.js";
import { env } from "../config/env.js";
import Order from "../models/Order.js";

// Mounted with express.raw() ahead of the global JSON parser -- Stripe's
// signature verification requires the untouched raw request body.
export async function stripeWebhook(req, res) {
  const signature = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, env.stripeWebhookSecret);
  } catch (err) {
    return res.status(400).send(`Webhook signature verification failed: ${err.message}`);
  }

  try {
    if (event.type === "payment_intent.succeeded") {
      const intent = event.data.object;
      await Order.updateOne(
        { stripePaymentIntentId: intent.id },
        { $set: { paymentStatus: "paid" } }
      );
    } else if (event.type === "payment_intent.payment_failed") {
      const intent = event.data.object;
      await Order.updateOne(
        { stripePaymentIntentId: intent.id },
        { $set: { paymentStatus: "failed" } }
      );
    }
    res.json({ received: true });
  } catch (err) {
    console.error("Error processing Stripe webhook:", err);
    res.status(500).json({ received: false });
  }
}
