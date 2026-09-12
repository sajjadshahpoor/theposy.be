import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext.jsx";
import { formatEUR } from "../../utils/format.js";
import { Button } from "../../components/common/Button.jsx";

export function CartPage() {
  const { cart, updateQuantity, removeItem, subtotalCents } = useCart();
  const navigate = useNavigate();

  if (cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-neutral-900">Your cart is empty</h1>
        <Link to="/products" className="mt-4 inline-block">
          <Button>Browse Bouquets</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold text-neutral-900">Your Cart</h1>
      <p className="mt-1 text-sm text-neutral-500">From {cart.vendorName}</p>

      <ul className="mt-6 divide-y divide-neutral-200">
        {cart.items.map((item) => (
          <li key={item.productId} className="flex items-center justify-between gap-4 py-4">
            <div>
              <p className="font-medium text-neutral-900">{item.title}</p>
              <p className="text-sm text-neutral-500">{formatEUR(item.priceCents)} each</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => updateQuantity(item.productId, Math.max(1, Number(e.target.value) || 1))}
                className="w-16 rounded-lg border border-neutral-300 px-2 py-1 text-sm"
              />
              <span className="w-20 text-right font-medium text-neutral-900">
                {formatEUR(item.priceCents * item.quantity)}
              </span>
              <button
                type="button"
                onClick={() => removeItem(item.productId)}
                className="text-sm text-neutral-400 hover:text-red-600"
                aria-label={`Remove ${item.title}`}
              >
                &times;
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between border-t border-neutral-200 pt-4">
        <span className="font-medium text-neutral-700">Subtotal</span>
        <span className="text-lg font-semibold text-neutral-900">{formatEUR(subtotalCents)}</span>
      </div>
      <p className="mt-1 text-xs text-neutral-500">Delivery fee is calculated at checkout.</p>

      <Button className="mt-6 w-full" onClick={() => navigate("/checkout")}>
        Proceed to Checkout
      </Button>
    </div>
  );
}
