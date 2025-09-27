export default function Button({
  type = "black",
  size = "m",
  disabled = false,
  onClick,
  children,
  ...props
}) {
  const baseStyles =
    "cursor-pointer transition-all duration-200 font-medium rounded flex shrink-0";

  const typeStyles = {
    black:
      "bg-neutral-800 text-white hover:bg-neutral-700 focus:ring-neutral-500 disabled:bg-neutral-400",
    red: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 disabled:bg-red-300",
    green:
      "bg-green-500 text-white hover:bg-green-600 focus:ring-green-500 disabled:bg-green-300",
    secondary:
      "border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50 focus:ring-neutral-500 disabled:bg-neutral-100 disabled:text-neutral-400",
  };

  const sizeStyles = {
    s: "px-3 py-1 text-sm",
    m: "px-4 py-2",
  };

  const disabledStyles = disabled
    ? "opacity-50 cursor-not-allowed pointer-events-none"
    : "";

  const className =
    `${baseStyles} ${typeStyles[type]} ${sizeStyles[size]} ${disabledStyles}`.trim();

  return (
    <button
      className={className}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
