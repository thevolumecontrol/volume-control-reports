"use client";
import React from "react";

export default function TableCell({ children, className = "", onClick, style = {}, highlight = "" }) {
  // only handle simple strings; passthrough for nodes/non-strings
  const renderWithHighlight = (text, query) => {
    if (!query || typeof text !== "string") return text;
    const q = String(query).trim();
    if (q === "") return text;

    // escape regexp special chars
    const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(esc(q), "ig");

    const parts = [];
    let lastIndex = 0;
    for (const m of text.matchAll(regex)) {
      const idx = m.index ?? 0;
      if (idx > lastIndex) parts.push(text.slice(lastIndex, idx));
      parts.push(
        <mark key={idx} className="bg-yellow-200 text-neutral-900 rounded-sm px-0.5">
          {m[0]}
        </mark>
      );
      lastIndex = idx + m[0].length;
    }
    if (lastIndex < text.length) parts.push(text.slice(lastIndex));
    // if no matches, return original text
    return parts.length > 0 ? parts : text;
  };

  const content =
    typeof children === "string" ? renderWithHighlight(children, highlight) : children;

  return (
    <td
      className={`bg-transparent px-4 py-3 text-sm text-neutral-800 overflow-hidden ${className}`}
      onClick={onClick}
      style={style}
    >
      <div className="min-w-0 w-full">
        <div
          className="w-full overflow-x-auto whitespace-nowrap hide-scroll"
          style={{ WebkitOverflowScrolling: "touch", msOverflowStyle: "none", scrollbarWidth: "none" }}
        >
          {content}
        </div>

        <style jsx>{`
          .hide-scroll::-webkit-scrollbar {
            display: none;
            width: 0;
            height: 0;
          }
          mark {
            padding: 0 0.125rem;
            border-radius: 2px;
          }
        `}</style>
      </div>
    </td>
  );
}