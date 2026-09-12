import { useCart } from "../contexts/CartContext.jsx";

// Cart is scoped to one vendor at a time; this centralizes the
// "start a new cart?" confirmation so every add-to-cart entry point
// (product card, product detail) behaves consistently.
export function useAddToCart() {
  const { addItem, cart } = useCart();

  return function addToCart(product, quantity = 1) {
    const result = addItem(product, quantity);
    if (result.ok) return true;

    if (result.conflict) {
      const confirmed = window.confirm(
        `Your cart has items from ${cart.vendorName}. Adding this bouquet will start a new cart for ${product.vendor.shopName}. Continue?`
      );
      if (confirmed) {
        addItem(product, quantity, { replace: true });
        return true;
      }
    }
    return false;
  };
}
