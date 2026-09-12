import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { apiErrorMessage } from "../../api/client.js";
import { Button } from "../../components/common/Button.jsx";
import { FormField, inputClass } from "../../components/common/FormField.jsx";

const BRUSSELS_COORDS = { lat: "50.8503", lng: "4.3517" };

export function VendorRegisterPage() {
  const { registerVendor } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    shopName: "",
    ownerName: "",
    email: "",
    password: "",
    phone: "",
    description: "",
    address: "",
    city: "",
    postalCode: "",
    lat: BRUSSELS_COORDS.lat,
    lng: BRUSSELS_COORDS.lng,
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const { lat, lng, ...rest } = form;
      await registerVendor({
        ...rest,
        location: { coordinates: [Number(lng), Number(lat)] },
      });
      navigate("/vendor/dashboard", { replace: true });
    } catch (err) {
      setError(apiErrorMessage(err, "Could not register your shop."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <h1 className="text-2xl font-bold text-neutral-900">Register Your Shop</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Join The Posy and reach flower lovers across Belgium.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
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
          <FormField label="Your name">
            <input
              type="text"
              name="ownerName"
              required
              className={inputClass}
              value={form.ownerName}
              onChange={handleChange}
            />
          </FormField>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Email">
            <input
              type="email"
              name="email"
              required
              className={inputClass}
              value={form.email}
              onChange={handleChange}
            />
          </FormField>
          <FormField label="Password">
            <input
              type="password"
              name="password"
              required
              minLength={8}
              className={inputClass}
              value={form.password}
              onChange={handleChange}
            />
          </FormField>
        </div>

        <FormField label="Phone (optional)">
          <input type="tel" name="phone" className={inputClass} value={form.phone} onChange={handleChange} />
        </FormField>

        <FormField label="Shop description (optional)">
          <textarea
            name="description"
            rows={3}
            className={inputClass}
            value={form.description}
            onChange={handleChange}
          />
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

        <div className="grid gap-4 sm:grid-cols-2">
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

        <div>
          <span className="mb-1 block text-sm font-medium text-neutral-700">Map location</span>
          <div className="grid gap-4 sm:grid-cols-2">
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
          <p className="mt-1 text-xs text-neutral-500">
            Find your coordinates by right-clicking your shop on Google Maps and copying the numbers shown.
          </p>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Creating shop..." : "Register Shop"}
        </Button>
      </form>

      <p className="mt-4 text-sm text-neutral-600">
        Already registered?{" "}
        <Link to="/vendor/login" className="font-medium text-posy-600 hover:underline">
          Vendor log in
        </Link>
      </p>
    </div>
  );
}
