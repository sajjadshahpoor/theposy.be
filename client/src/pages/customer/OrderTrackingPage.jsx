import { useState } from "react";
import { ordersApi } from "../../api/orders.js";
import { apiErrorMessage } from "../../api/client.js";
import { formatEUR } from "../../utils/format.js";
import { Button } from "../../components/common/Button.jsx";
import { FormField, inputClass } from "../../components/common/FormField.jsx";
import { OrderStatusTracker } from "../../components/order/OrderStatusTracker.jsx";

export function OrderTrackingPage() {
  const [form, setForm] = useState({ orderNumber: "", email: "" });
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setOrder(null);
    try {
      const data = await ordersApi.track(form.orderNumber.trim(), form.email.trim());
      setOrder(data.order);
    } catch (err) {
      setError(apiErrorMessage(err, "Order not found. Check your order number and email."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-2xl font-bold text-neutral-900">Track Your Order</h1>
      <p className="mt-1 text-sm text-neutral-600">Enter your order number and the email used at checkout.</p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end">
        <FormField label="Order number">
          <input
            type="text"
            name="orderNumber"
            required
            className={inputClass}
            value={form.orderNumber}
            onChange={handleChange}
            placeholder="POSY-20260912-ABC123"
          />
        </FormField>
        <FormField label="Email">
          <input type="email" name="email" required className={inputClass} value={form.email} onChange={handleChange} />
        </FormField>
        <Button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Track"}
        </Button>
      </form>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {order && (
        <div className="mt-8 rounded-lg border border-neutral-200 bg-white p-5">
          <p className="text-sm text-neutral-500">Order {order.orderNumber}</p>
          <div className="mt-4">
            <OrderStatusTracker order={order} />
          </div>
          <p className="mt-4 text-right font-semibold text-neutral-900">{formatEUR(order.totalCents)}</p>
        </div>
      )}
    </div>
  );
}
