export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-neutral-500">
        <p>&copy; {new Date().getFullYear()} The Posy. Connecting Belgian florists with flower lovers.</p>
      </div>
    </footer>
  );
}
