"use client";

import "./button.css";

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
}) {
  // decide which prop is style vs html type
  const variantKeys = ["black", "red", "green", "secondary"];
  let styleType;
  let htmlTypeFinal = htmlType;

  if (variant) {
    styleType = variant;
  } else if (variantKeys.includes(type)) {
    styleType = type;
  } else {
    // `type` looks like an HTML button type (e.g. "submit"), use it as html type
    htmlTypeFinal = type;
    styleType = "black";
  }

  const classNameFinal = [
    "button-base",
    `button-variant-${styleType}`,
    `button-size-${size}`,
    (disabled || loading) && "button-disabled",
    fullWidth && "button-full-width",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={htmlTypeFinal}
      className={classNameFinal}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
      ) : null}
      {children}
    </button>
  );
}
