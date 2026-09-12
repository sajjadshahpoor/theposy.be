import { Link } from "react-router-dom";
import { Button } from "../../components/common/Button.jsx";

export function HomePage() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 py-20 text-center">
        <h1 className="text-4xl font-bold text-neutral-900 sm:text-5xl">
          Fresh bouquets from <span className="text-posy-600">Belgian florists</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-neutral-600">
          Shop handpicked flowers from independent shops across Belgium, delivered with a real
          invoice and live order tracking.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/products">
            <Button variant="primary">Shop Bouquets</Button>
          </Link>
          <Link to="/map">
            <Button variant="secondary">Find a Florist Near You</Button>
          </Link>
        </div>
      </section>

      <section className="border-t border-neutral-200 bg-white py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-3">
          <div>
            <h2 className="font-semibold text-neutral-900">Independent florists</h2>
            <p className="mt-1 text-sm text-neutral-600">
              Every bouquet is listed and prepared by a local Belgian flower shop, not a warehouse.
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-neutral-900">Real-time tracking</h2>
            <p className="mt-1 text-sm text-neutral-600">
              Follow your order from Received to Delivered, with live updates as it's prepared.
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-neutral-900">Guest checkout</h2>
            <p className="mt-1 text-sm text-neutral-600">
              No account needed -- just an email so we can send your invoice and delivery updates.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
