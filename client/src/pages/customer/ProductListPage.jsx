import { useEffect, useState } from "react";
import { productsApi, categoriesApi } from "../../api/products.js";
import { ProductCard } from "../../components/product/ProductCard.jsx";
import { inputClass } from "../../components/common/FormField.jsx";
import { Button } from "../../components/common/Button.jsx";

export function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    categoriesApi.list().then((data) => setCategories(data.items)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError("");
    productsApi
      .list({ search: search || undefined, category: category || undefined, page })
      .then((data) => {
        setProducts(data.items);
        setPages(data.pages);
      })
      .catch(() => setError("Could not load bouquets. Please try again."))
      .finally(() => setLoading(false));
  }, [search, category, page]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold text-neutral-900">Shop Bouquets</h1>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          placeholder="Search bouquets..."
          className={`${inputClass} sm:max-w-xs`}
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
        <select
          className={`${inputClass} sm:max-w-xs`}
          value={category}
          onChange={(e) => {
            setPage(1);
            setCategory(e.target.value);
          }}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p className="mt-10 text-center text-neutral-500">No bouquets found.</p>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {pages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <span className="text-sm text-neutral-600">
            Page {page} of {pages}
          </span>
          <Button variant="secondary" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
