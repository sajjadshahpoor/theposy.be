import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ordersApi } from "../../api/orders.js";
import { formatEUR } from "../../utils/format.js";
import { OrderStatusTracker } from "../../components/order/OrderStatusTracker.jsx";
import { Button } from "../../components/common/Button.jsx";

export function OrderConfirmationPage() {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");
  const email = searchParams.get("email");
  const redirectStatus = searchParams.get("redirect_status");

  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderNumber || !email) {
      setError("Missing order details.");
      return;
    }
    ordersApi
      .track(orderNumber, email)
      .then((data) => setOrder(data.order))
      .catch(() => setError("Could not find this order."));
  }, [orderNumber, email]);

  if (error) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <p className="text-neutral-600">{error}</p>
        <Link to="/track" className="mt-3 inline-block text-sm font-medium text-posy-600 hover:underline">
          Look up your order
        </Link>
      </div>
    );
  }

  if (!order) {
    return <div className="p-16 text-center text-neutral-500">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      {redirectStatus === "succeeded" ? (
        <div className="rounded-lg bg-green-50 p-4 text-green-800">
          <h1 className="text-xl font-bold">Thank you! Your order is confirmed.</h1>
          <p className="mt-1 text-sm">A receipt and invoice will be emailed to {order.contactEmail}.</p>
        </div>
      ) : (
        <h1 className="text-2xl font-bold text-neutral-900">Order {order.orderNumber}</h1>
      )}

      <div className="mt-6 rounded-lg border border-neutral-200 bg-white p-5">
        <OrderStatusTracker order={order} />
      </div>

      <div className="mt-6 rounded-lg border border-neutral-200 bg-white p-5">
        <h2 className="font-semibold text-neutral-900">Order Summary</h2>
        <ul className="mt-3 divide-y divide-neutral-100">
          {order.items.map((item, i) => (
            <li key={i} className="flex justify-between py-2 text-sm">
              <span>
                {item.title} &times; {item.quantity}
              </span>
              <span>{formatEUR(item.priceCents * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-neutral-200 pt-3 text-sm">
          <span>Subtotal</span>
          <span>{formatEUR(order.subtotalCents)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Delivery</span>
          <span>{formatEUR(order.deliveryFeeCents)}</span>
        </div>
        <div className="mt-1 flex justify-between font-semibold text-neutral-900">
          <span>Total</span>
          <span>{formatEUR(order.totalCents)}</span>
        </div>
      </div>

      <Link to="/products" className="mt-6 inline-block">
        <Button variant="secondary">Continue Shopping</Button>
      </Link>
    </div>
  );
}
