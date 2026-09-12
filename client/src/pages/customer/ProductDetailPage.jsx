import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { productsApi } from "../../api/products.js";
import { assetUrl } from "../../utils/assetUrl.js";
import { formatEUR } from "../../utils/format.js";
import { Button } from "../../components/common/Button.jsx";
import { useAddToCart } from "../../hooks/useAddToCart.js";

export function ProductDetailPage() {
  const { id } = useParams();
  const addToCart = useAddToCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setProduct(null);
    setError("");
    productsApi
      .get(id)
      .then((data) => setProduct(data.product))
      .catch(() => setError("This bouquet could not be found."));
  }, [id]);

  if (error) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <p className="text-neutral-600">{error}</p>
        <Link to="/products" className="mt-3 inline-block text-sm font-medium text-posy-600 hover:underline">
          Back to shop
        </Link>
      </div>
    );
  }

  if (!product) {
    return <div className="p-16 text-center text-neutral-500">Loading...</div>;
  }

  const image = assetUrl(product.images?.[0]);

  const handleAdd = () => {
    const ok = addToCart(product, quantity);
    if (ok) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="grid gap-8 sm:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-xl bg-posy-50">
          {image ? (
            <img src={image} alt={product.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-6xl">🌸</div>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold text-neutral-900">{product.title}</h1>
          {product.vendor && (
            <p className="mt-1 text-sm text-neutral-500">
              Sold by{" "}
              <Link to={`/map?vendor=${product.vendor._id}`} className="font-medium text-posy-600 hover:underline">
                {product.vendor.shopName}
              </Link>
              {product.vendor.city ? `, ${product.vendor.city}` : ""}
            </p>
          )}

          <p className="mt-4 text-2xl font-semibold text-neutral-900">{formatEUR(product.priceCents)}</p>

          {product.description && <p className="mt-4 text-neutral-700">{product.description}</p>}

          <div className="mt-6 flex items-center gap-3">
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
              className="w-20 rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            />
            <Button disabled={!product.inStock} onClick={handleAdd}>
              {product.inStock ? "Add to cart" : "Sold out"}
            </Button>
            {added && <span className="text-sm text-green-600">Added!</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
