import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "posy_cart";

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { vendorId: null, vendorName: null, items: [] };
  } catch {
    return { vendorId: null, vendorName: null, items: [] };
  }
}

// The cart is scoped to a single vendor per checkout (mirrors how many
// marketplaces handle multi-seller carts without needing split payments).
export function CartProvider({ children }) {
  const [cart, setCart] = useState(loadCart);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // localStorage unavailable (private mode, quota) -- cart just won't persist
    }
  }, [cart]);

  // Returns { ok: true } on success, or { ok: false, conflict: true } if the
  // cart already holds items from a different vendor -- caller decides how
  // to prompt (confirm dialog) and can retry with replace: true.
  const addItem = (product, quantity = 1, { replace = false } = {}) => {
    const vendorId = product.vendor?._id || product.vendor;
    const vendorName = product.vendor?.shopName;

    if (cart.vendorId && cart.vendorId !== vendorId && !replace) {
      return { ok: false, conflict: true };
    }

    setCart((prev) => {
      const base = prev.vendorId === vendorId ? prev : { vendorId, vendorName, items: [] };
      const existing = base.items.find((i) => i.productId === product._id);
      const items = existing
        ? base.items.map((i) =>
            i.productId === product._id ? { ...i, quantity: i.quantity + quantity } : i
          )
        : [
            ...base.items,
            {
              productId: product._id,
              title: product.title,
              priceCents: product.priceCents,
              image: product.images?.[0],
              quantity,
            },
          ];
      return { vendorId, vendorName, items };
    });

    return { ok: true };
  };

  const updateQuantity = (productId, quantity) => {
    setCart((prev) => ({
      ...prev,
      items:
        quantity <= 0
          ? prev.items.filter((i) => i.productId !== productId)
          : prev.items.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
    }));
  };

  const removeItem = (productId) => {
    setCart((prev) => ({ ...prev, items: prev.items.filter((i) => i.productId !== productId) }));
  };

  const clearCart = () => setCart({ vendorId: null, vendorName: null, items: [] });

  const subtotalCents = cart.items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0);
  const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);

  const value = { cart, addItem, updateQuantity, removeItem, clearCart, subtotalCents, itemCount };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
