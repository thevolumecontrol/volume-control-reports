"use client";
export default function Button({
  // `type` kept for backward compatibility (was used for style),
  // but if it's not one of style keys and looks like "submit"/"button"/"reset"
  // treat it as HTML button `type`.
  type = "black",
  variant,
  htmlType = "button", // explicit prop for HTML type
  size = "m",
  disabled = false,
  onClick,
  children,
  fullWidth = false,
  loading = false,
  className = "",
  ...rest
}) {
  const baseStyles =
    "cursor-pointer transition-all duration-200 font-medium rounded flex shrink-0 items-center justify-center";

  const variantStyles = {
    black:
      "bg-neutral-800 text-white hover:bg-neutral-700 focus:ring-neutral-500 disabled:bg-neutral-400",
    red: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 disabled:bg-red-300",
    green:
      "bg-green-500 text-white hover:bg-green-600 focus:ring-green-500 disabled:bg-green-300",
    secondary:
      "border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50 focus:ring-neutral-500 disabled:bg-neutral-100 disabled:text-neutral-400",
    tag:
      "bg-transparent text-green-700 border-2 border-green-700 hover:border-green-800 hover:text-green-800 focus:ring-green-800 disabled:bg-transparent disabled:text-green-300 disabled:border-green-300",
  };

  const sizeStyles = {
    s: "px-3 py-1 text-sm",
    m: "px-4 py-2",
    tag: "px-2 text-font-semibold text-sm",
  };

  // decide which prop is style vs html type
  const styleKeys = Object.keys(variantStyles);
  let styleType;
  let htmlTypeFinal = htmlType;

  if (variant) {
    styleType = variant;
  } else if (styleKeys.includes(type)) {
    styleType = type;
  } else {
    // `type` looks like an HTML button type (e.g. "submit"), use it as html type
    htmlTypeFinal = type;
    styleType = "black";
  }

  // Special border radius for tag variant
  const radiusClass = styleType === "tag" ? "rounded-full" : "rounded";

  const disabledStyles = disabled || loading ? "opacity-50 cursor-not-allowed pointer-events-none" : "";

  const fullWidthClass = fullWidth ? "w-full" : "";

  const classNameFinal = [
    baseStyles.replace("rounded", radiusClass), // replace default rounded with variant-specific
    variantStyles[styleType] || variantStyles.black,
    sizeStyles[size] || sizeStyles.m,
    disabledStyles,
    fullWidthClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={htmlTypeFinal}
      className={classNameFinal}
      onClick={onClick}
      disabled={disabled || loading}
      {...rest} // safe: we already removed custom props via destructuring
    >
      {loading ? (
        // simple inline spinner
        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
      ) : null}
      {children}
    </button>
  );
}
