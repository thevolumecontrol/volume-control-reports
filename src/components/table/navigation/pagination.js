"use client";
import React from "react";

/**
 * Minimal pagination buttons with page info.
 *
 * Styled to match selector / search bar:
 * - light gray background (bg-neutral-100) — static (no hover)
 * - buttons: default same color, on hover become darker (bg-neutral-300)
 * - disabled: text gray, not clickable
 *
 * Prevent mouse-focus so buttons don't stay highlighted after click.
 * Keyboard focus still works (accessibility).
 */
export default function Pagination({
  onPrev,
  onNext,
  disabledPrev = false,
  disabledNext = false,
  currentPage = 1,
  totalPages = 1,
  className = "",
}) {
  return (
    <div
      className={`inline-flex items-center gap-3 rounded-md px-3 h-10 bg-neutral-100 transition-colors ${className}`}
    >
      <div className="text-sm text-neutral-600 select-none" aria-hidden="true">
        Page {currentPage} of {totalPages}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onMouseDown={(e) => {
            // prevent mouse-driven focus so button won't stay highlighted after click
            e.preventDefault();
          }}
          onClick={() => {
            if (!disabledPrev && typeof onPrev === "function") onPrev();
          }}
          disabled={disabledPrev}
          aria-label="Previous page"
          className={`inline-flex items-center gap-2 px-2 py-1 rounded-md text-sm font-medium
            bg-transparent text-neutral-700 border border-neutral-200
            hover:bg-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-300
            transition-colors cursor-pointer
            disabled:text-neutral-400 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-neutral-400`}
        >
          <span aria-hidden>←</span>
          <span className="sr-only sm:not-sr-only">Prev</span>
        </button>

        <button
          type="button"
          onMouseDown={(e) => {
            // prevent mouse-driven focus so button won't stay highlighted after click
            e.preventDefault();
          }}
          onClick={() => {
            if (!disabledNext && typeof onNext === "function") onNext();
          }}
          disabled={disabledNext}
          aria-label="Next page"
          className={`inline-flex items-center gap-2 px-2 py-1 rounded-md text-sm font-medium
            bg-transparent text-neutral-700 border border-neutral-200
            hover:bg-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-300
            transition-colors cursor-pointer
            disabled:text-neutral-400 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-neutral-400`}
        >
          <span className="sr-only sm:not-sr-only">Next</span>
          <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
}