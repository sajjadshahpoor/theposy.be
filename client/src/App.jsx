import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { CartProvider } from "./contexts/CartContext.jsx";
import { Layout } from "./components/layout/Layout.jsx";
import { ProtectedRoute } from "./routes/ProtectedRoute.jsx";

import { HomePage } from "./pages/customer/HomePage.jsx";
import { ProductListPage } from "./pages/customer/ProductListPage.jsx";
import { ProductDetailPage } from "./pages/customer/ProductDetailPage.jsx";
import { MapPage } from "./pages/customer/MapPage.jsx";
import { CartPage } from "./pages/customer/CartPage.jsx";
import { CheckoutPage } from "./pages/customer/CheckoutPage.jsx";
import { OrderConfirmationPage } from "./pages/customer/OrderConfirmationPage.jsx";
import { OrderTrackingPage } from "./pages/customer/OrderTrackingPage.jsx";
import { CustomerLoginPage } from "./pages/auth/CustomerLoginPage.jsx";
import { CustomerRegisterPage } from "./pages/auth/CustomerRegisterPage.jsx";
import { VendorLoginPage } from "./pages/auth/VendorLoginPage.jsx";
import { VendorRegisterPage } from "./pages/auth/VendorRegisterPage.jsx";
import { VendorDashboardPage } from "./pages/vendor/VendorDashboardPage.jsx";
import { NotFoundPage } from "./pages/NotFoundPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="products" element={<ProductListPage />} />
              <Route path="products/:id" element={<ProductDetailPage />} />
              <Route path="map" element={<MapPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="order-confirmation/:orderId" element={<OrderConfirmationPage />} />
              <Route path="track" element={<OrderTrackingPage />} />

              <Route path="login" element={<CustomerLoginPage />} />
              <Route path="register" element={<CustomerRegisterPage />} />
              <Route path="vendor/login" element={<VendorLoginPage />} />
              <Route path="vendor/register" element={<VendorRegisterPage />} />

              <Route
                path="vendor/dashboard/*"
                element={
                  <ProtectedRoute role="vendor">
                    <VendorDashboardPage />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
