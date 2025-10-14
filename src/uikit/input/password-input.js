"use client";
import { useState } from "react";
import EyeOpenIcon from "@/uikit/icons/eye-open";
import EyeClosedIcon from "@/uikit/icons/eye-closed";

export default function PasswordInput({
  name,
  label = "Password",
  value,
  onChange,
  onFocus,
  onKeyPress,
  autoComplete = "current-password",
  required = false,
  optional = false,
  error = false,
  visible = true,
  placeholder = "Enter your password",
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // показывать иконку только если есть текст
  const hasValue = value && String(value).trim().length > 0;

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
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          autoComplete={autoComplete}
          onChange={onChange}
          onFocus={onFocus}
          onKeyPress={onKeyPress}
          required={required}
          placeholder={placeholder}
          className={`input ${error ? "border-red-400 ring-red-400" : ""} ${hasValue ? "pr-10" : ""}`}
          {...props}
        />
        {hasValue && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-600 hover:text-neutral-800 transition-colors flex items-center justify-center h-6 w-6"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeClosedIcon size={18} />
            ) : (
              <EyeOpenIcon size={18} />
            )}
          </button>
        )}
      </div>
    </div>
  );
}