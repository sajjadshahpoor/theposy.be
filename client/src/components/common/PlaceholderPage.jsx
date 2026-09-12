export function PlaceholderPage({ title, description }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-2xl font-bold text-neutral-900">{title}</h1>
      <p className="mt-2 text-neutral-600">{description}</p>
    </div>
  );
}
