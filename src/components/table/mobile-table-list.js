"use client";
import React from "react";
import MobileTableCard from "./mobile-table-card";

export default function MobileTableList({ data, searchTerm, onGetReport }) {
  return (
    <div className="divide-y divide-gray-200">
      {data.map((row, rIdx) => {
        const [title, artist, lastPlayed, totalPlayed, genre, isrc, songData] = row;
        
        // Skip empty placeholder rows
        if (title === " " || !songData?.songId) {
          return null;
        }

        return (
          <MobileTableCard
            key={rIdx}
            title={title}
            artist={artist}
            lastPlayed={lastPlayed}
            totalPlayed={totalPlayed}
            genre={genre}
            isrc={isrc}
            songData={songData}
            searchTerm={searchTerm}
            onGetReport={onGetReport}
          />
        );
      })}
    </div>
  );
}