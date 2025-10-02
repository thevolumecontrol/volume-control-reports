"use client";
import React from "react";

/**
 * TableHeaderCell (controlled)
 * - label: string
 * - direction: "asc" | "desc" | null   // controlled prop
 * - onToggle: () => void               // called when user clicks (parent handles toggling logic)
 *
 * Uses external SVGs for sort icons (public/images/sortInc.svg, sortDec.svg)
 */
export default function TableHeaderCell({ label, direction = null, onToggle = () => {} }) {
  const Icon = () => {
    if (direction === "asc") {
      return (
        <img
          src="/images/sortInc.svg"
          alt="sort ascending"
          className="w-4 h-4"
          aria-hidden="true"
        />
      );
    }
    if (direction === "desc") {
      return (
        <img
          src="/images/sortDec.svg"
          alt="sort descending"
          className="w-4 h-4"
          aria-hidden="true"
        />
      );
    }
    // null: placeholder with same width as icon so label stays aligned to icon column
    return <span className="w-4 h-4 inline-block" aria-hidden />;
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onToggle()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      className="flex items-center gap-2 px-1 py-1 rounded-md hover:bg-neutral-200 cursor-pointer select-none"
      aria-pressed={direction !== null}
      title={`Toggle sort for ${label}`}
    >
      <span className="flex-none">
        <Icon />
      </span>
      <span className="truncate text-sm text-neutral-700">{label}</span>
    </div>
  );
}