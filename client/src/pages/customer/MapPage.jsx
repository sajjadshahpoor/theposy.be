import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { vendorsApi } from "../../api/vendors.js";
import { VendorMap } from "../../components/map/VendorMap.jsx";

export function MapPage() {
  const [vendors, setVendors] = useState([]);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const focusVendorId = searchParams.get("vendor");

  useEffect(() => {
    vendorsApi
      .list()
      .then((data) => setVendors(data.items))
      .catch(() => setError("Could not load florists. Please try again."));
  }, []);

  const focusVendor = vendors.find((v) => v._id === focusVendorId);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold text-neutral-900">Find a Florist</h1>
      <p className="mt-1 text-sm text-neutral-600">Browse independent flower shops across Belgium.</p>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-6 h-[500px] overflow-hidden rounded-xl border border-neutral-200">
        <VendorMap vendors={vendors} focusVendor={focusVendor} />
      </div>
    </div>
  );
}
