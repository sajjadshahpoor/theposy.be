import { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { formatEUR } from "../../utils/format.js";
import { Button } from "../common/Button.jsx";

export function PaymentStep({ order }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    setError("");

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-confirmation/${order._id}`,
      },
    });

    // A successful confirmPayment redirects the browser to return_url, so
    // reaching here means something went wrong.
    if (stripeError) {
      setError(stripeError.message);
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" className="w-full" disabled={!stripe || submitting}>
        {submitting ? "Processing..." : `Pay ${formatEUR(order.totalCents)}`}
      </Button>
    </form>
  );
}
