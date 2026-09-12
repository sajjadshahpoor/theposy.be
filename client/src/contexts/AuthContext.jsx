import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authApi } from "../api/auth.js";

const AuthContext = createContext(null);

// A browser session is either a customer or a vendor (both use the same
// auth cookie), never both at once -- matches the typical buyer/seller
// portal split in real marketplaces.
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const data = await authApi.me();
      setSession(data.vendor ? { type: "vendor", account: data.vendor } : { type: "customer", account: data.user });
    } catch {
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const loginCustomer = async (payload) => {
    const data = await authApi.loginCustomer(payload);
    setSession({ type: "customer", account: data.user });
    return data;
  };

  const registerCustomer = async (payload) => {
    const data = await authApi.registerCustomer(payload);
    setSession({ type: "customer", account: data.user });
    return data;
  };

  const loginVendor = async (payload) => {
    const data = await authApi.loginVendor(payload);
    setSession({ type: "vendor", account: data.vendor });
    return data;
  };

  const registerVendor = async (payload) => {
    const data = await authApi.registerVendor(payload);
    setSession({ type: "vendor", account: data.vendor });
    return data;
  };

  const logout = async () => {
    await authApi.logout();
    setSession(null);
  };

  const value = {
    session,
    loading,
    isCustomer: session?.type === "customer",
    isVendor: session?.type === "vendor",
    loginCustomer,
    registerCustomer,
    loginVendor,
    registerVendor,
    logout,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
