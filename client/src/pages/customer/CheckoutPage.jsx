import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { useCart } from "../../contexts/CartContext.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { ordersApi } from "../../api/orders.js";
import { apiErrorMessage } from "../../api/client.js";
import { stripePromise } from "../../utils/stripe.js";
import { formatEUR } from "../../utils/format.js";
import { Button } from "../../components/common/Button.jsx";
import { FormField, inputClass } from "../../components/common/FormField.jsx";
import { PaymentStep } from "../../components/checkout/PaymentStep.jsx";

export function CheckoutPage() {
  const { cart, subtotalCents, clearCart } = useCart();
  const { session, isCustomer } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    street: "",
    city: "",
    postalCode: "",
    notes: "",
    guestName: "",
    guestEmail: "",
    guestPhone: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [checkoutResult, setCheckoutResult] = useState(null); // { order, clientSecret }

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  if (cart.items.length === 0 && !checkoutResult) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-neutral-900">Your cart is empty</h1>
        <Button className="mt-4" onClick={() => navigate("/products")}>
          Browse Bouquets
        </Button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = {
        vendorId: cart.vendorId,
        items: cart.items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        deliveryAddress: {
          street: form.street,
          city: form.city,
          postalCode: form.postalCode,
          notes: form.notes || undefined,
        },
      };

      if (isCustomer) {
        payload.contactEmail = session.account.email;
      } else {
        payload.guestInfo = {
          name: form.guestName,
          email: form.guestEmail,
          phone: form.guestPhone || undefined,
        };
      }

      const data = await ordersApi.checkout(payload);
      setCheckoutResult(data);
      clearCart();
    } catch (err) {
      setError(apiErrorMessage(err, "Could not start checkout. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  if (checkoutResult) {
    if (!stripePromise) {
      return (
        <div className="mx-auto max-w-xl px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-neutral-900">Order Created</h1>
          <p className="mt-2 text-neutral-600">
            Order {checkoutResult.order.orderNumber} was created, but Stripe isn't configured in this
            environment, so payment can't be completed here. Set VITE_STRIPE_PUBLISHABLE_KEY (and the
            server's STRIPE_SECRET_KEY) to a real Stripe test key to enable checkout.
          </p>
        </div>
      );
    }

    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-2xl font-bold text-neutral-900">Payment</h1>
        <p className="mt-1 text-sm text-neutral-600">Order {checkoutResult.order.orderNumber}</p>
        <div className="mt-6">
          <Elements stripe={stripePromise} options={{ clientSecret: checkoutResult.clientSecret }}>
            <PaymentStep order={checkoutResult.order} />
          </Elements>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-bold text-neutral-900">Checkout</h1>

      <div className="mt-4 rounded-lg border border-neutral-200 bg-white p-4 text-sm text-neutral-600">
        <p>From {cart.vendorName}</p>
        <p className="mt-1 font-medium text-neutral-900">Subtotal: {formatEUR(subtotalCents)}</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {!isCustomer && (
          <>
            <FormField label="Full name">
              <input
                type="text"
                name="guestName"
                required
                className={inputClass}
                value={form.guestName}
                onChange={handleChange}
              />
            </FormField>
            <FormField label="Email (required for your invoice)">
              <input
                type="email"
                name="guestEmail"
                required
                className={inputClass}
                value={form.guestEmail}
                onChange={handleChange}
              />
            </FormField>
            <FormField label="Phone (optional)">
              <input
                type="tel"
                name="guestPhone"
                className={inputClass}
                value={form.guestPhone}
                onChange={handleChange}
              />
            </FormField>
          </>
        )}

        <FormField label="Delivery street address">
          <input
            type="text"
            name="street"
            required
            className={inputClass}
            value={form.street}
            onChange={handleChange}
          />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="City">
            <input type="text" name="city" required className={inputClass} value={form.city} onChange={handleChange} />
          </FormField>
          <FormField label="Postal code">
            <input
              type="text"
              name="postalCode"
              required
              className={inputClass}
              value={form.postalCode}
              onChange={handleChange}
            />
          </FormField>
        </div>
        <FormField label="Delivery notes (optional)">
          <input type="text" name="notes" className={inputClass} value={form.notes} onChange={handleChange} />
        </FormField>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Creating order..." : "Continue to Payment"}
        </Button>
      </form>
    </div>
  );
}
