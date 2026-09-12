import crypto from "node:crypto";

export function generateOrderNumber() {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `POSY-${datePart}-${randomPart}`;
}
