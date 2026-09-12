export const ORDER_STATUS_LABELS = {
  received: "Order Received",
  preparing: "Preparing Bouquet",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const ORDER_STATUS_STEPS = ["received", "preparing", "out_for_delivery", "delivered"];

export const VENDOR_NEXT_STATUS = {
  received: ["preparing", "cancelled"],
  preparing: ["out_for_delivery", "cancelled"],
  out_for_delivery: ["delivered"],
  delivered: [],
  cancelled: [],
};
