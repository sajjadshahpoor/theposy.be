import { describe, test, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "./CartContext.jsx";

const productA = { _id: "p1", title: "Rose", priceCents: 1000, vendor: { _id: "v1", shopName: "Shop A" } };
const productB = { _id: "p2", title: "Tulip", priceCents: 500, vendor: { _id: "v1", shopName: "Shop A" } };
const productOtherVendor = { _id: "p3", title: "Lily", priceCents: 700, vendor: { _id: "v2", shopName: "Shop B" } };

function wrapper({ children }) {
  return <CartProvider>{children}</CartProvider>;
}

beforeEach(() => {
  localStorage.clear();
});

describe("CartContext", () => {
  test("adds an item and computes subtotal/itemCount", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(productA, 2);
    });

    expect(result.current.cart.items).toHaveLength(1);
    expect(result.current.cart.items[0].quantity).toBe(2);
    expect(result.current.subtotalCents).toBe(2000);
    expect(result.current.itemCount).toBe(2);
  });

  test("adding the same product again increments quantity instead of duplicating", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addItem(productA, 1));
    act(() => result.current.addItem(productA, 1));

    expect(result.current.cart.items).toHaveLength(1);
    expect(result.current.cart.items[0].quantity).toBe(2);
  });

  test("adding a second product from the same vendor is allowed", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addItem(productA, 1));
    let outcome;
    act(() => {
      outcome = result.current.addItem(productB, 1);
    });

    expect(outcome.ok).toBe(true);
    expect(result.current.cart.items).toHaveLength(2);
  });

  test("adding a product from a different vendor reports a conflict without replace", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addItem(productA, 1));
    let outcome;
    act(() => {
      outcome = result.current.addItem(productOtherVendor, 1);
    });

    expect(outcome).toEqual({ ok: false, conflict: true });
    expect(result.current.cart.items).toHaveLength(1);
    expect(result.current.cart.vendorId).toBe("v1");
  });

  // Mirrors useAddToCart's real call pattern: addItem() then, after the
  // user confirms via a blocking window.confirm(), addItem(..., {replace:true})
  // -- both within the same synchronous click handler.
  test("addItem with replace:true starts a fresh cart for the new vendor", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(productA, 1);
      result.current.addItem(productOtherVendor, 1, { replace: true });
    });

    expect(result.current.cart.vendorId).toBe("v2");
    expect(result.current.cart.items).toHaveLength(1);
    expect(result.current.cart.items[0].productId).toBe("p3");
  });

  test("updateQuantity removes the item when set to 0", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addItem(productA, 1));
    act(() => result.current.updateQuantity("p1", 0));

    expect(result.current.cart.items).toHaveLength(0);
  });

  test("clearCart resets vendor and items", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addItem(productA, 1));
    act(() => result.current.clearCart());

    expect(result.current.cart).toEqual({ vendorId: null, vendorName: null, items: [] });
  });
});
