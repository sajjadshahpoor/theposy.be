import { useEffect } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../../utils/leafletIconFix.js";

const BELGIUM_CENTER = [50.5039, 4.4699];

function FlyToVendor({ vendor }) {
  const map = useMap();
  useEffect(() => {
    if (vendor) {
      map.setView([vendor.location.coordinates[1], vendor.location.coordinates[0]], 13);
    }
  }, [vendor, map]);
  return null;
}

export function VendorMap({ vendors, focusVendor }) {
  return (
    <MapContainer center={BELGIUM_CENTER} zoom={8} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {focusVendor && <FlyToVendor vendor={focusVendor} />}
      {vendors.map((vendor) => (
        <Marker key={vendor._id} position={[vendor.location.coordinates[1], vendor.location.coordinates[0]]}>
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">{vendor.shopName}</p>
              <p className="text-neutral-600">
                {vendor.address}, {vendor.postalCode} {vendor.city}
              </p>
              {vendor.description && <p className="mt-1 text-neutral-600">{vendor.description}</p>}
              <Link to={`/products?vendor=${vendor._id}`} className="mt-2 inline-block text-posy-600 hover:underline">
                View bouquets
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
