import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { apiErrorMessage } from "../../api/client.js";
import { Button } from "../../components/common/Button.jsx";
import { FormField, inputClass } from "../../components/common/FormField.jsx";

export function CustomerLoginPage() {
  const { loginCustomer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await loginCustomer(form);
      navigate(location.state?.from?.pathname || "/", { replace: true });
    } catch (err) {
      setError(apiErrorMessage(err, "Could not log in. Check your email and password."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-2xl font-bold text-neutral-900">Log In</h1>
      <p className="mt-1 text-sm text-neutral-600">Welcome back to The Posy.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
            className={inputClass}
            value={form.password}
            onChange={handleChange}
          />
        </FormField>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Logging in..." : "Log In"}
        </Button>
      </form>

      <p className="mt-4 text-sm text-neutral-600">
        New here?{" "}
        <Link to="/register" className="font-medium text-posy-600 hover:underline">
          Create an account
        </Link>
      </p>
      <p className="mt-1 text-sm text-neutral-600">
        Are you a florist?{" "}
        <Link to="/vendor/login" className="font-medium text-posy-600 hover:underline">
          Vendor log in
        </Link>
      </p>
    </div>
  );
}
