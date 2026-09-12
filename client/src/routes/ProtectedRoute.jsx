import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

// role: "customer" | "vendor" -- redirects unauthenticated or wrong-role
// visitors to the matching login page, preserving where they were headed.
export function ProtectedRoute({ role, children }) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="p-8 text-center text-neutral-500">Loading...</div>;
  }

  if (!session || session.type !== role) {
    const loginPath = role === "vendor" ? "/vendor/login" : "/login";
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  return children;
}
