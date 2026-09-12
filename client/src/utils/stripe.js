import { loadStripe } from "@stripe/stripe-js";

const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

// null when unconfigured (or still the .env.example placeholder) so the
// checkout page can degrade gracefully instead of throwing at import time.
export const stripePromise = key && key.startsWith("pk_") && !key.includes("xxxx") ? loadStripe(key) : null;
