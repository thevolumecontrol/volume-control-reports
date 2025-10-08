"use client";
import { useRef, useEffect } from "react";

export default function Input({
  name,
  type = "text",
  label,
  value,
  onChange,
  onFocus,
  onKeyPress,
  autoComplete,
  required = false,
  optional = false,
  error = false,
  visible = true,
  placeholder,
}) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (type === "textarea" && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value, type]);

  const inputStyles = `input ${error ? "border-red-400 ring-red-400" : ""}`;

  return (
    <div className={`flex flex-col gap-2 ${visible ? "" : "hidden"}`}>
      {label && (
        <p className="input-label">
          {label}
          {optional && (
            <span className="text-xs text-secondary"> (Optional)</span>
          )}
        </p>
      )}
      <div className="relative">
        {type === "textarea" ? (
          <textarea
            ref={textareaRef}
            name={name}
            value={value}
            onChange={onChange}
            onFocus={onFocus}
            required={required}
            placeholder={placeholder}
            className={`${inputStyles} resize-none overflow-hidden`}
            rows={3}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            autoComplete={autoComplete}
            onChange={onChange}
            onFocus={onFocus}
            onKeyPress={onKeyPress}
            required={required}
            placeholder={placeholder}
            className={`input ${error ? "border-red-400 ring-red-400" : ""}`}
          />
        )}
      </div>
    </div>
  );
}
