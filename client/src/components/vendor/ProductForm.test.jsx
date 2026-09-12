import { describe, test, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ProductForm } from "./ProductForm.jsx";

describe("ProductForm", () => {
  test("converts a EUR price string to integer cents on submit", async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    render(<ProductForm categories={[]} onSubmit={handleSubmit} submitLabel="Create" />);

    fireEvent.change(screen.getByLabelText("Title"), { target: { value: "Rose Bouquet" } });
    fireEvent.change(screen.getByLabelText("Price (EUR)"), { target: { value: "25.50" } });
    fireEvent.change(screen.getByLabelText("Quantity in stock"), { target: { value: "4" } });

    fireEvent.click(screen.getByRole("button", { name: "Create" }));

    await waitFor(() => expect(handleSubmit).toHaveBeenCalledTimes(1));

    const formData = handleSubmit.mock.calls[0][0];
    expect(formData.get("priceCents")).toBe("2550");
    expect(formData.get("title")).toBe("Rose Bouquet");
    expect(formData.get("quantity")).toBe("4");
  });

  test("pre-fills fields from initialValues, converting cents back to a EUR string", () => {
    render(
      <ProductForm
        categories={[]}
        initialValues={{ title: "Tulip Bunch", priceCents: 2000, quantity: 3, status: "active" }}
        onSubmit={vi.fn()}
        submitLabel="Save changes"
      />
    );

    expect(screen.getByLabelText("Title")).toHaveValue("Tulip Bunch");
    expect(screen.getByLabelText("Price (EUR)")).toHaveValue(20);
    expect(screen.getByLabelText("Quantity in stock")).toHaveValue(3);
  });
});
