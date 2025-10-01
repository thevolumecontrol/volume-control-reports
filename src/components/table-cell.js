"use client";
import React from "react";

export default function TableCell({ children, className = "", onClick, style = {} }) {
  return (
    <td
      // removed border-b so row separators are not shown (headers keep their border)
      className={`bg-transparent hover:bg-neutral-100 px-4 py-3 text-sm text-neutral-800 overflow-hidden ${className}`}
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