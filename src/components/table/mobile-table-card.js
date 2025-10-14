"use client";
import React from "react";
import Button from "@/uikit/button/button";
import { formatDate } from "@/utils/date-formatter";
import FileIcon from "@/uikit/icons/file";

export default function MobileTableCard({ 
  title, 
  artist, 
  lastPlayed, 
  totalPlayed, 
  genre, 
  isrc, 
  songData,
  searchTerm,
  onGetReport 
}) {
  const renderWithHighlight = (text, query) => {
    if (!query || typeof text !== "string") return text;
    const q = String(query).trim();
    if (q === "") return text;

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
    return parts.length > 0 ? parts : text;
  };

  const handleGetReport = () => {
    if (typeof onGetReport === "function") {
      onGetReport(songData);
    }
  };

  return (
    <div className="bg-white py-4">
      <div className="flex-1 min-w-0">
          <h3 className="text-m text-gray-900 mb-4 break-words">
            {renderWithHighlight(title, searchTerm)} by {renderWithHighlight(artist, searchTerm)}
          </h3>
          <div className="flex flex-col gap-2 mb-4">
            <p className="text-sm">
              <span className="text-gray-500">🕞 Last played: </span>
              <span className="text-gray-900">{formatDate(lastPlayed)}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-500">🔄 Total played: </span>
              <span className="text-gray-900">{totalPlayed}</span>
            </p>
          </div>
          <Button
            variant="black"
            size="m"
            onClick={handleGetReport}
            className="text-sm flex items-center gap-2 mb-2"
          >
            Get report
          </Button>
      </div>
    </div>
  );
}