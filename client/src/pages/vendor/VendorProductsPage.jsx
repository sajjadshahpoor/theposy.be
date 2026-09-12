import { useEffect, useState } from "react";
import { productsApi, categoriesApi } from "../../api/products.js";
import { formatEUR } from "../../utils/format.js";
import { assetUrl } from "../../utils/assetUrl.js";
import { Button } from "../../components/common/Button.jsx";
import { ProductForm } from "../../components/vendor/ProductForm.jsx";

export function VendorProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    productsApi
      .mine()
      .then((data) => setProducts(data.items))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    categoriesApi.list().then((data) => setCategories(data.items)).catch(() => {});
  }, []);

  const handleCreate = async (formData) => {
    await productsApi.create(formData);
    setShowForm(false);
    load();
  };

  const handleUpdate = async (formData) => {
    await productsApi.update(editing._id, formData);
    setEditing(null);
    load();
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.title}"?`)) return;
    await productsApi.remove(product._id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-900">Your Bouquets</h2>
        {!showForm && !editing && <Button onClick={() => setShowForm(true)}>Add Bouquet</Button>}
      </div>

      {showForm && (
        <div className="mt-4">
          <ProductForm
            categories={categories}
            onSubmit={handleCreate}
            submitLabel="Create"
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {editing && (
        <div className="mt-4">
          <ProductForm
            initialValues={editing}
            categories={categories}
            onSubmit={handleUpdate}
            submitLabel="Save changes"
            onCancel={() => setEditing(null)}
          />
        </div>
      )}

      {loading ? (
        <p className="mt-6 text-neutral-500">Loading...</p>
      ) : (
        <ul className="mt-6 divide-y divide-neutral-200 rounded-lg border border-neutral-200 bg-white">
          {products.map((product) => (
            <li key={product._id} className="flex items-center gap-4 p-4">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-posy-50">
                {product.images?.[0] ? (
                  <img src={assetUrl(product.images[0])} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xl">🌸</div>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-neutral-900">{product.title}</p>
                <p className="text-sm text-neutral-500">
                  {formatEUR(product.priceCents)} &middot; {product.quantity} in stock &middot; {product.status}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setEditing(product);
                    setShowForm(false);
                  }}
                >
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDelete(product)}>
                  Delete
                </Button>
              </div>
            </li>
          ))}
          {products.length === 0 && <li className="p-6 text-center text-neutral-500">No bouquets yet.</li>}
        </ul>
      )}
    </div>
  );
}
