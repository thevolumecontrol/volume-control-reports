"use client";
import React from "react";
import Button from "@/uikit/button/button";
import { formatDate } from "@/utils/date-formatter";
import FileIcon from "@/uikit/icons/file";

export default function MobileTableCard({ 
  title, 
  artist, 
  station,
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
          <h3 className="text-lg font-semibold text-gray-900 mb-1 break-words">
            {renderWithHighlight(title, searchTerm)}
          </h3>
          <p className="text-sm text-gray-700 mb-3 break-words">
            {renderWithHighlight(artist, searchTerm)}
          </p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <p className="text-sm">
              <span className="text-gray-500 block text-xs uppercase tracking-wide">Spins</span>
              <span className="text-gray-900 font-semibold">{totalPlayed}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-500 block text-xs uppercase tracking-wide">Time</span>
              <span className="text-gray-900 font-semibold">{formatDate(lastPlayed)}</span>
            </p>
          </div>
          {station ? (
            <p className="text-xs text-gray-500 mb-3">Station {station}</p>
          ) : null}
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