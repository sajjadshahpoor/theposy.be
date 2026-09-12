import { useOrderSocket } from "../../hooks/useOrderSocket.js";
import { ORDER_STATUS_LABELS, ORDER_STATUS_STEPS } from "../../utils/orderStatus.js";
import { formatDateTime } from "../../utils/format.js";

export function OrderStatusTracker({ order }) {
  const { status, statusHistory } = useOrderSocket(order._id, order.status, order.statusHistory);

  if (status === "cancelled") {
    return <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">This order was cancelled.</div>;
  }

  const currentIndex = ORDER_STATUS_STEPS.indexOf(status);

  return (
    <div>
      <ol className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-0">
        {ORDER_STATUS_STEPS.map((step, index) => {
          const reached = index <= currentIndex;
          return (
            <li key={step} className="flex flex-1 items-center">
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    reached ? "bg-posy-600 text-white" : "bg-neutral-200 text-neutral-500"
                  }`}
                >
                  {index + 1}
                </span>
                <span className={`text-sm ${reached ? "font-medium text-neutral-900" : "text-neutral-400"}`}>
                  {ORDER_STATUS_LABELS[step]}
                </span>
              </div>
              {index < ORDER_STATUS_STEPS.length - 1 && (
                <div className={`mx-3 hidden h-px flex-1 sm:block ${reached ? "bg-posy-600" : "bg-neutral-200"}`} />
              )}
            </li>
          );
        })}
      </ol>

      {order.estimatedDeliveryAt && (
        <p className="mt-4 text-sm text-neutral-600">
          Estimated delivery: {formatDateTime(order.estimatedDeliveryAt)}
        </p>
      )}

      <ul className="mt-4 space-y-1 text-xs text-neutral-500">
        {statusHistory.map((h, i) => (
          <li key={i}>
            {ORDER_STATUS_LABELS[h.status]} &mdash; {formatDateTime(h.at)}
          </li>
        ))}
      </ul>
    </div>
  );
}
