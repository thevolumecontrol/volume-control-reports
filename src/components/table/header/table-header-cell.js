"use client";
import React from "react";
import SortAscIcon from "@/uikit/icons/sort-asc";
import SortDescIcon from "@/uikit/icons/sort-desc";

export default function TableHeaderCell({
  label,
  direction = null,
  onToggle = () => {},
}) {
  const Icon = () => {
    if (direction === "asc") {
      return <SortAscIcon size={16} />;
    }
    if (direction === "desc") {
      return <SortDescIcon size={16} />;
    }

    return <span className="size-4 inline-block" />;
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
    >
      <span className="flex-none">
        <Icon />
      </span>
      <span className="truncate text-sm text-neutral-700">{label}</span>
    </div>
  );
}
