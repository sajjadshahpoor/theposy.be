import { useEffect, useState } from "react";
import { ordersApi } from "../../api/orders.js";
import { formatEUR, formatDateTime } from "../../utils/format.js";
import { ORDER_STATUS_LABELS, VENDOR_NEXT_STATUS } from "../../utils/orderStatus.js";
import { Button } from "../../components/common/Button.jsx";

export function VendorOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const load = () => {
    setLoading(true);
    ordersApi
      .vendorOrders()
      .then((data) => setOrders(data.items))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdvance = async (order, status) => {
    setUpdatingId(order._id);
    try {
      await ordersApi.updateStatus(order._id, status);
      load();
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <p className="text-neutral-500">Loading...</p>;

  return (
    <div>
      <h2 className="text-lg font-semibold text-neutral-900">Orders</h2>
      <ul className="mt-4 space-y-4">
        {orders.map((order) => (
          <li key={order._id} className="rounded-lg border border-neutral-200 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium text-neutral-900">{order.orderNumber}</p>
                <p className="text-sm text-neutral-500">
                  {order.user ? "Registered customer" : order.guestInfo?.name} &middot; {order.contactEmail}
                </p>
                <p className="text-xs text-neutral-500">{formatDateTime(order.createdAt)}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-neutral-900">{formatEUR(order.totalCents)}</p>
                <p className="text-sm text-neutral-500">{ORDER_STATUS_LABELS[order.status]}</p>
              </div>
            </div>

            <ul className="mt-2 text-sm text-neutral-600">
              {order.items.map((item, i) => (
                <li key={i}>
                  {item.title} &times; {item.quantity}
                </li>
              ))}
            </ul>

            <div className="mt-3 flex gap-2">
              {(VENDOR_NEXT_STATUS[order.status] || []).map((next) => (
                <Button
                  key={next}
                  variant={next === "cancelled" ? "danger" : "primary"}
                  disabled={updatingId === order._id}
                  onClick={() => handleAdvance(order, next)}
                >
                  Mark as {ORDER_STATUS_LABELS[next]}
                </Button>
              ))}
            </div>
          </li>
        ))}
        {orders.length === 0 && <li className="text-neutral-500">No orders yet.</li>}
      </ul>
    </div>
  );
}
