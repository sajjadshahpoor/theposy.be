export function formatEUR(cents) {
  return new Intl.NumberFormat("en-BE", { style: "currency", currency: "EUR" }).format(
    (cents ?? 0) / 100
  );
}

export function formatDate(value) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(value) {
  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
