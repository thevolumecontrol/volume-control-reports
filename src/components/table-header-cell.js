"use client";
import React from "react";

/**
 * TableHeaderCell (controlled)
 * - label: string
 * - direction: "asc" | "desc" | null   // controlled prop
 * - onToggle: () => void               // called when user clicks (parent handles toggling logic)
 *
 * Visuals:
 * - when direction === "asc" shows up arrow
 * - when direction === "desc" shows down arrow
 * - when direction === null shows placeholder
 * - hover: light gray background (handled by parent class)
 */
export default function TableHeaderCell({ label, direction = null, onToggle = () => {} }) {
  const Icon = () => {
    if (direction === "asc") {
      return (
        <svg className="w-4 h-4 text-neutral-700" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M6 15l6-6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }
    if (direction === "desc") {
      return (
        <svg className="w-4 h-4 text-neutral-700" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }
    // null: placeholder to keep alignment
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