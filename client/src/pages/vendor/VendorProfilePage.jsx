import { useEffect, useState } from "react";
import { vendorsApi } from "../../api/vendors.js";
import { apiErrorMessage } from "../../api/client.js";
import { Button } from "../../components/common/Button.jsx";
import { FormField, inputClass } from "../../components/common/FormField.jsx";
import { assetUrl } from "../../utils/assetUrl.js";

export function VendorProfilePage() {
  const [vendor, setVendor] = useState(null);
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    vendorsApi.me().then((data) => {
      setVendor(data.vendor);
      setForm({
        shopName: data.vendor.shopName,
        description: data.vendor.description || "",
        phone: data.vendor.phone || "",
        address: data.vendor.address,
        city: data.vendor.city,
        postalCode: data.vendor.postalCode,
        lat: data.vendor.location.coordinates[1],
        lng: data.vendor.location.coordinates[0],
      });
    });
  }, []);

  if (!form) return <p className="text-neutral-500">Loading...</p>;

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      const { lat, lng, ...rest } = form;
      const data = await vendorsApi.updateProfile({
        ...rest,
        location: { coordinates: [Number(lng), Number(lat)] },
      });
      setVendor(data.vendor);
      setSuccess("Shop profile updated.");
    } catch (err) {
      setError(apiErrorMessage(err, "Could not update your profile."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("logo", file);
    try {
      const data = await vendorsApi.uploadLogo(fd);
      setVendor(data.vendor);
    } catch {
      setError("Could not upload logo.");
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-neutral-900">Shop Profile</h2>

      <div className="mt-4 flex items-center gap-4">
        <div className="h-16 w-16 overflow-hidden rounded-full bg-posy-50">
          {vendor.logoUrl ? (
            <img src={assetUrl(vendor.logoUrl)} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl">🌸</div>
          )}
        </div>
        <FormField label="Shop logo">
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleLogoChange} />
        </FormField>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <FormField label="Shop name">
          <input
            type="text"
            name="shopName"
            required
            className={inputClass}
            value={form.shopName}
            onChange={handleChange}
          />
        </FormField>
        <FormField label="Description">
          <textarea
            name="description"
            rows={3}
            className={inputClass}
            value={form.description}
            onChange={handleChange}
          />
        </FormField>
        <FormField label="Phone">
          <input type="tel" name="phone" className={inputClass} value={form.phone} onChange={handleChange} />
        </FormField>
        <FormField label="Street address">
          <input
            type="text"
            name="address"
            required
            className={inputClass}
            value={form.address}
            onChange={handleChange}
          />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="City">
            <input type="text" name="city" required className={inputClass} value={form.city} onChange={handleChange} />
          </FormField>
          <FormField label="Postal code">
            <input
              type="text"
              name="postalCode"
              required
              className={inputClass}
              value={form.postalCode}
              onChange={handleChange}
            />
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Latitude">
            <input
              type="number"
              step="any"
              name="lat"
              required
              className={inputClass}
              value={form.lat}
              onChange={handleChange}
            />
          </FormField>
          <FormField label="Longitude">
            <input
              type="number"
              step="any"
              name="lng"
              required
              className={inputClass}
              value={form.lng}
              onChange={handleChange}
            />
          </FormField>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}

        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
