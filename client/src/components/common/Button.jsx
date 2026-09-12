const VARIANTS = {
  primary: "bg-posy-600 text-white hover:bg-posy-700 disabled:bg-posy-300",
  secondary:
    "border border-neutral-300 text-neutral-700 hover:border-posy-400 hover:text-posy-600 disabled:opacity-50",
  danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300",
};

export function Button({ variant = "primary", className = "", ...props }) {
  return (
    <button
      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  );
}
