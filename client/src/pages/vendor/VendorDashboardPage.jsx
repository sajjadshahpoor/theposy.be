import { NavLink, Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { VendorProductsPage } from "./VendorProductsPage.jsx";
import { VendorOrdersPage } from "./VendorOrdersPage.jsx";
import { VendorProfilePage } from "./VendorProfilePage.jsx";

const tabClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-medium ${
    isActive ? "bg-posy-600 text-white" : "text-neutral-600 hover:bg-neutral-100"
  }`;

export function VendorDashboardPage() {
  const { session } = useAuth();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold text-neutral-900">Welcome, {session.account.shopName}</h1>

      <nav className="mt-4 flex gap-2">
        <NavLink to="products" className={tabClass}>
          Bouquets
        </NavLink>
        <NavLink to="orders" className={tabClass}>
          Orders
        </NavLink>
        <NavLink to="profile" className={tabClass}>
          Shop Profile
        </NavLink>
      </nav>

      <div className="mt-6">
        <Routes>
          <Route index element={<Navigate to="products" replace />} />
          <Route path="products" element={<VendorProductsPage />} />
          <Route path="orders" element={<VendorOrdersPage />} />
          <Route path="profile" element={<VendorProfilePage />} />
        </Routes>
      </div>
    </div>
  );
}
