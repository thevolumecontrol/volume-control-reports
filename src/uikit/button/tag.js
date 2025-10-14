"use client";

export default function Tag({
  variant = "green",
  size = "m",
  disabled = false,
  onClick,
  children,
  className = "",
  ...rest
}) {
  const baseStyles =
    "cursor-pointer transition-all duration-200 font-medium rounded-full flex shrink-0 items-center justify-center border-2";

  const variantStyles = {
    green:
      "bg-transparent text-green-700 border-green-700 hover:border-green-800 hover:text-green-800 focus:ring-green-800 disabled:bg-transparent disabled:text-green-800 disabled:border-green-800",
    blue:
      "bg-transparent text-blue-700 border-blue-700 hover:border-blue-800 hover:text-blue-800 focus:ring-blue-800 disabled:bg-transparent disabled:text-blue-900 disabled:border-blue-900",
    red:
      "bg-transparent text-red-700 border-red-700 hover:border-red-800 hover:text-red-800 focus:ring-red-800 disabled:bg-transparent disabled:text-red-900 disabled:border-red-900",
  };

  const sizeStyles = {
    s: "px-2 py-1 text-xs font-semibold",
    m: "px-3 py-1 text-sm font-semibold",
    l: "px-4 py-2 text-base font-semibold",
  };

  const disabledStyles = disabled ? "cursor-not-allowed pointer-events-none" : "";

  const classNameFinal = [
    baseStyles,
    variantStyles[variant] || variantStyles.green,
    sizeStyles[size] || sizeStyles.m,
    disabledStyles,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={classNameFinal}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}