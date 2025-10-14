"use client";

export default function Button({
  type = "black",
  variant,
  htmlType = "button",
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
  };

  const sizeStyles = {
    s: "px-3 py-1 text-sm",
    m: "px-4 py-2",
    l: "px-5 py-3 text-lg",
    xs: "px-2 py-1 text-xs",
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

  const disabledStyles = disabled || loading ? "opacity-50 cursor-not-allowed pointer-events-none" : "";

  const fullWidthClass = fullWidth ? "w-full" : "";

  const classNameFinal = [
    baseStyles,
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
      {...rest}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
      ) : null}
      {children}
    </button>
  );
}
