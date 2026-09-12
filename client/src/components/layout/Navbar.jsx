import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useCart } from "../../contexts/CartContext.jsx";

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors hover:text-posy-600 ${
    isActive ? "text-posy-600" : "text-neutral-600"
  }`;

export function Navbar() {
  const { session, isVendor, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="text-xl font-bold text-posy-600">
          The Posy
        </Link>

        <div className="hidden items-center gap-6 sm:flex">
          <NavLink to="/products" className={navLinkClass}>
            Shop
          </NavLink>
          <NavLink to="/map" className={navLinkClass}>
            Find a Florist
          </NavLink>
          <NavLink to="/track" className={navLinkClass}>
            Track Order
          </NavLink>
          {isVendor && (
            <NavLink to="/vendor/dashboard" className={navLinkClass}>
              Vendor Dashboard
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-3">
          {!isVendor && (
            <Link to="/cart" className="relative text-sm font-medium text-neutral-700 hover:text-posy-600">
              Cart
              {itemCount > 0 && (
                <span className="absolute -right-3 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-posy-600 text-[10px] text-white">
                  {itemCount}
                </span>
              )}
            </Link>
          )}

          {session ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:border-posy-400 hover:text-posy-600"
            >
              Log out
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:border-posy-400 hover:text-posy-600"
              >
                Log in
              </Link>
              <Link
                to="/vendor/login"
                className="rounded-full bg-posy-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-posy-700"
              >
                Sell on The Posy
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
