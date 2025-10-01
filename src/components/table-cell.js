"use client";
import React from "react";

export default function TableCell({ children, className = "", onClick, style = {} }) {
  return (
    <td
      className={`bg-white hover:bg-neutral-50 px-4 py-3 border-b border-neutral-200 text-sm text-neutral-800 overflow-hidden ${className}`}
      onClick={onClick}
      style={style}
    >
      <div className="min-w-0 w-full">
        <div
          className="w-full overflow-x-auto whitespace-nowrap hide-scroll"
          style={{ WebkitOverflowScrolling: "touch", msOverflowStyle: "none", scrollbarWidth: "none" }}
        >
          {children}
        </div>

        {/* styled-jsx hides webkit scrollbar while keeping scroll functionality */}
        <style jsx>{`
          .hide-scroll::-webkit-scrollbar {
            display: none;
            width: 0;
            height: 0;
          }
        `}</style>
      </div>
    </td>
  );
}