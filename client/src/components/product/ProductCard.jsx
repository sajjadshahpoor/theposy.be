import { Link } from "react-router-dom";
import { assetUrl } from "../../utils/assetUrl.js";
import { formatEUR } from "../../utils/format.js";
import { Button } from "../common/Button.jsx";
import { useAddToCart } from "../../hooks/useAddToCart.js";

export function ProductCard({ product }) {
  const addToCart = useAddToCart();
  const image = assetUrl(product.images?.[0]);

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white">
      <Link to={`/products/${product._id}`} className="block aspect-square bg-posy-50">
        {image ? (
          <img src={image} alt={product.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl">🌸</div>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <Link to={`/products/${product._id}`} className="font-medium text-neutral-900 hover:text-posy-600">
          {product.title}
        </Link>
        {product.vendor?.shopName && (
          <p className="text-xs text-neutral-500">
            {product.vendor.shopName} · {product.vendor.city}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-semibold text-neutral-900">{formatEUR(product.priceCents)}</span>
          <Button
            variant="secondary"
            disabled={!product.inStock}
            onClick={() => addToCart(product, 1)}
          >
            {product.inStock ? "Add to cart" : "Sold out"}
          </Button>
        </div>
      </div>
    </div>
  );
}
