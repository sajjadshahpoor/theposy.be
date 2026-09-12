import { describe, test, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CartProvider } from "../../contexts/CartContext.jsx";
import { ProductCard } from "./ProductCard.jsx";

const product = {
  _id: "p1",
  title: "Sunflower Bunch",
  priceCents: 1800,
  inStock: true,
  images: [],
  vendor: { _id: "v1", shopName: "Leuven Lily", city: "Leuven" },
};

function renderWithProviders(ui) {
  return render(
    <MemoryRouter>
      <CartProvider>{ui}</CartProvider>
    </MemoryRouter>
  );
}

beforeEach(() => {
  localStorage.clear();
});

describe("ProductCard", () => {
  test("renders title, vendor, and price", () => {
    renderWithProviders(<ProductCard product={product} />);
    expect(screen.getByText("Sunflower Bunch")).toBeInTheDocument();
    expect(screen.getByText(/Leuven Lily/)).toBeInTheDocument();
    expect(screen.getByText("€18.00")).toBeInTheDocument();
  });

  test("shows 'Sold out' and disables the button when out of stock", () => {
    renderWithProviders(<ProductCard product={{ ...product, inStock: false }} />);
    expect(screen.getByRole("button", { name: "Sold out" })).toBeDisabled();
  });

  test("clicking 'Add to cart' adds the item to the cart", () => {
    renderWithProviders(<ProductCard product={product} />);
    fireEvent.click(screen.getByRole("button", { name: "Add to cart" }));

    const stored = JSON.parse(localStorage.getItem("posy_cart"));
    expect(stored.items).toHaveLength(1);
    expect(stored.items[0].productId).toBe("p1");
  });
});
