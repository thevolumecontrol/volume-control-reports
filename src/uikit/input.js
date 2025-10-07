"use client";
import React, { useId } from "react";

export default function Input({
  type = "plain", // "plain" | "textarea"
  label,
  value,
  onChange = () => {},
  onFocus = () => {},
  onBlur = () => {},
  error = false,
  required = false,
  placeholder = "",
  className = "",
  name,
}) {
  const id = useId();

  const baseWrapper =
    "w-full flex flex-col gap-2 text-sm";
  const fieldWrapper = `rounded-md transition-colors ${
    error ? "border border-red-400" : "border border-neutral-200"
  } bg-neutral-100 hover:bg-neutral-200 focus-within:bg-neutral-100 ${className}`;

  const commonProps = {
    id,
    name,
    value,
    onChange,
    onFocus,
    onBlur,
    placeholder,
    "aria-invalid": !!error,
    className:
      "bg-transparent outline-none w-full text-[1rem] text-neutral-700 placeholder:text-neutral-400",
  };

  return (
    <div className={baseWrapper}>
      {label && (
        <label htmlFor={id} className={`font-medium ${error ? "text-red-600" : "text-neutral-700"}`}>
          {label} {required && <span className="text-neutral-500">*</span>}
        </label>
      )}

      {type === "textarea" ? (
        <div className={`${fieldWrapper} px-3 py-2`}>
          <textarea
            rows={6}
            {...commonProps}
            className={`${commonProps.className} min-h-[6rem] resize-y`}
          />
        </div>
      ) : (
        <div className={`${fieldWrapper} px-3 h-10 flex items-center`}>
          <input type="text" {...commonProps} />
        </div>
      )}

      {error && <div className="text-xs text-red-500">This field is required</div>}
    </div>
  );
}