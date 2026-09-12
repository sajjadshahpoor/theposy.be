import { describe, test, expect } from "vitest";
import { VENDOR_NEXT_STATUS, ORDER_STATUS_LABELS, ORDER_STATUS_STEPS } from "./orderStatus.js";

describe("order status state machine", () => {
  test("every step and terminal state has a label", () => {
    for (const step of [...ORDER_STATUS_STEPS, "cancelled"]) {
      expect(ORDER_STATUS_LABELS[step]).toBeTruthy();
    }
  });

  test("delivered and cancelled have no further transitions", () => {
    expect(VENDOR_NEXT_STATUS.delivered).toEqual([]);
    expect(VENDOR_NEXT_STATUS.cancelled).toEqual([]);
  });

  test("received can move to preparing or cancelled, never straight to delivered", () => {
    expect(VENDOR_NEXT_STATUS.received).toContain("preparing");
    expect(VENDOR_NEXT_STATUS.received).toContain("cancelled");
    expect(VENDOR_NEXT_STATUS.received).not.toContain("delivered");
  });
});
