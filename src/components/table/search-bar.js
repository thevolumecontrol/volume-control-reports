"use client";
import React, { useState, useEffect, useRef } from "react";
import SearchIcon from "@/uikit/icons/search";

export default function SearchBar({
  placeholder = "Search...",
  onSearch = null,
}) {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  // debounce 400ms -> call onSearch(value) if provided
  useEffect(() => {
    const t = setTimeout(() => {
      if (typeof onSearch === "function") onSearch(value);
    }, 400);
    return () => clearTimeout(t);
  }, [value, onSearch]);

  const handleClear = (e) => {
    e.stopPropagation();
    setValue("");
    if (typeof onSearch === "function") onSearch("");
    try {
      inputRef.current?.focus();
    } catch {}
  };

  return (
    <div
      // when focused -> do NOT apply hover darkening; otherwise allow hover:bg-neutral-200
      className={`w-full max-w-xl h-10.5 rounded-md px-3 flex items-center gap-2 shadow-base border-standard transition-colors ${
        !isFocused ? "hover:bg-neutral-200" : ""
      } focus-within:bg-neutral-100`}
      aria-hidden="false"
      onClick={() => {
        // clicking wrapper focuses input
        try {
          inputRef.current?.focus();
        } catch {}
      }}
    >
      <div className="text-neutral-500">
        <SearchIcon size={18} />
      </div>

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="bg-transparent outline-none w-full text-[1rem] text-neutral-700 placeholder:text-neutral-400"
        aria-label="Search"
      />

      {/* clear button (visible when there's text) */}
      {value !== "" && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={handleClear}
          className="flex-none rounded-md p-1 hover:bg-neutral-200 transition-colors cursor-pointer"
        >
          <svg
            className="w-4 h-4 text-neutral-600"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
