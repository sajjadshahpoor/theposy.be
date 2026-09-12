import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { apiErrorMessage } from "../../api/client.js";
import { Button } from "../../components/common/Button.jsx";
import { FormField, inputClass } from "../../components/common/FormField.jsx";

export function CustomerRegisterPage() {
  const { registerCustomer } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await registerCustomer(form);
      navigate("/", { replace: true });
    } catch (err) {
      setError(apiErrorMessage(err, "Could not create your account."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-2xl font-bold text-neutral-900">Create Account</h1>
      <p className="mt-1 text-sm text-neutral-600">Save your details for faster checkout.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <FormField label="Full name">
          <input type="text" name="name" required className={inputClass} value={form.name} onChange={handleChange} />
        </FormField>
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
        <FormField label="Phone (optional)">
          <input type="tel" name="phone" className={inputClass} value={form.phone} onChange={handleChange} />
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

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      <p className="mt-4 text-sm text-neutral-600">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-posy-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
