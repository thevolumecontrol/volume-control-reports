"use client";
import React from "react";

/**
 * PageNav
 * Props:
 * - currentPage: number
 * - totalPages: number
 * - onChange: (page: number) => void
 *
 * Отображает: "1 ... 7 8 9 10 11 ... N"
 * Всегда показывает 1 и N. Показывает до 7 чисел (включая 1 и N), внутри — окно из 5 страниц.
 */
export default function PageNav({ currentPage = 1, totalPages = 1, onChange = () => {} }) {
  if (totalPages <= 1) return null;

  const numericLimit = 7; // максимум числовых страниц (включая 1 и N)
  const middleCount = Math.max(1, numericLimit - 2); // обычно 5

  const makeRange = (from, to) => {
    const r = [];
    for (let i = from; i <= to; i++) r.push(i);
    return r;
  };

  let pages = [];

  if (totalPages <= numericLimit) {
    pages = makeRange(1, totalPages);
  } else {
    // center window:
    let start = currentPage - Math.floor(middleCount / 2);
    let end = start + middleCount - 1;

    if (start < 2) {
      start = 2;
      end = start + middleCount - 1;
    }
    if (end > totalPages - 1) {
      end = totalPages - 1;
      start = end - (middleCount - 1);
    }

    pages.push(1);
    if (start > 2) pages.push("left-ellipsis");
    pages = pages.concat(makeRange(start, end));
    if (end < totalPages - 1) pages.push("right-ellipsis");
    pages.push(totalPages);
  }

  const itemClass =
    "inline-flex items-center justify-center px-3 py-1 rounded-md text-sm font-medium border border-neutral-200 transition-colors cursor-pointer";
  // no default background; hover shows light gray
  const baseClass = "text-neutral-700 hover:bg-neutral-200 hover:text-black";
  // active: darker text + slightly bolder, keep light-gray background for current page
  const activeClass = "bg-neutral-200 text-neutral-900 font-semibold";

  return (
    <div className="flex items-center gap-2 mt-3">
      {pages.map((p, idx) => {
        if (typeof p === "number") {
          const isActive = p === currentPage;
          return (
            <button
              key={p}
              type="button"
              onClick={() => !isActive && onChange(p)}
              aria-current={isActive ? "page" : undefined}
              className={`${itemClass} ${isActive ? activeClass : baseClass}`}
            >
              {String(p)}
            </button>
          );
        }

        // ellipsis
        return (
          <span
            key={`e-${idx}-${p}`}
            className="px-2 text-sm text-neutral-500 select-none"
            aria-hidden="true"
          >
            …
          </span>
        );
      })}
    </div>
  );
}