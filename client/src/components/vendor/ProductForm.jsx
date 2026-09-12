import { useState } from "react";
import { FormField, inputClass } from "../common/FormField.jsx";
import { Button } from "../common/Button.jsx";
import { apiErrorMessage } from "../../api/client.js";

export function ProductForm({ initialValues, categories, onSubmit, submitLabel = "Save", onCancel }) {
  const [form, setForm] = useState({
    title: initialValues?.title || "",
    description: initialValues?.description || "",
    category: initialValues?.category?._id || "",
    price: initialValues ? (initialValues.priceCents / 100).toFixed(2) : "",
    quantity: initialValues?.quantity ?? "",
    status: initialValues?.status || "active",
  });
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      if (form.category) fd.append("category", form.category);
      fd.append("priceCents", String(Math.round(Number(form.price) * 100)));
      fd.append("quantity", String(form.quantity));
      fd.append("status", form.status);
      images.forEach((file) => fd.append("images", file));

      await onSubmit(fd);
    } catch (err) {
      setError(apiErrorMessage(err, "Could not save this bouquet."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-neutral-200 bg-white p-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Title">
          <input type="text" name="title" required className={inputClass} value={form.title} onChange={handleChange} />
        </FormField>
        <FormField label="Category">
          <select name="category" className={inputClass} value={form.category} onChange={handleChange}>
            <option value="">Uncategorized</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <FormField label="Description">
        <textarea
          name="description"
          rows={3}
          className={inputClass}
          value={form.description}
          onChange={handleChange}
        />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-3">
        <FormField label="Price (EUR)">
          <input
            type="number"
            step="0.01"
            min="0"
            name="price"
            required
            className={inputClass}
            value={form.price}
            onChange={handleChange}
          />
        </FormField>
        <FormField label="Quantity in stock">
          <input
            type="number"
            min="0"
            name="quantity"
            required
            className={inputClass}
            value={form.quantity}
            onChange={handleChange}
          />
        </FormField>
        <FormField label="Status">
          <select name="status" className={inputClass} value={form.status} onChange={handleChange}>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </FormField>
      </div>

      <FormField label="Images">
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          onChange={(e) => setImages(Array.from(e.target.files))}
        />
      </FormField>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
