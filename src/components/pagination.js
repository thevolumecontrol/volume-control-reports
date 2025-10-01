"use client";
import React from "react";

/**
 * Minimal pagination buttons with page info above: "Page 1 of 10"
 *
 * Props:
 * - onPrev: () => void
 * - onNext: () => void
 * - disabledPrev: boolean
 * - disabledNext: boolean
 * - currentPage: number (default 1)
 * - totalPages: number (default 1)
 * - className: additional classes for wrapper
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
    <div className={`flex flex-col items-end ${className}`}>
      <div className="text-sm text-neutral-600 mb-1 select-none" aria-hidden="true">
        Page {currentPage} of {totalPages}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={disabledPrev}
          aria-label="Previous page"
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium
            bg-neutral-100 text-neutral-700 border border-neutral-200
            hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-300
            transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <span aria-hidden>←</span>
          <span>Prev page</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={disabledNext}
          aria-label="Next page"
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium
            bg-neutral-100 text-neutral-700 border border-neutral-200
            hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-300
            transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <span>Next page</span>
          <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
}