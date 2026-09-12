import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-3 px-4 py-24 text-center">
      <h1 className="text-3xl font-bold text-posy-600">Page not found</h1>
      <p className="text-neutral-600">The page you're looking for doesn't exist.</p>
      <Link to="/" className="text-sm font-medium text-posy-600 hover:underline">
        Back to home
      </Link>
    </div>
  );
}
