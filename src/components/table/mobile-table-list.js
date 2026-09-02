"use client";
import React from "react";
import MobileTableCard from "./mobile-table-card";

export default function MobileTableList({ data, searchTerm, onGetReport }) {
  return (
    <div className="divide-y divide-gray-200">
      {data.map((row, rIdx) => {
        const songData = row[row.length - 1];
        const rank = row[0];
        const station = row[1];
        const artist = row[2];
        const title = row[3];
        const year = row[4];
        const spins = row[5];
        const liveDj = row[6];
        const lastPlayed = row[7];
        const genre = row[8];

        if (!songData || typeof songData !== "object" || !songData.songId) {
          return null;
        }

        return (
          <MobileTableCard
            key={rIdx}
            title={`${rank}. ${title}`}
            artist={`${artist} · ${station}`}
            lastPlayed={lastPlayed}
            totalPlayed={liveDj && liveDj !== "—" ? `${spins} (${liveDj} live dj)` : String(spins)}
            genre={genre}
            isrc={year}
            songData={songData}
            searchTerm={searchTerm}
            onGetReport={onGetReport}
          />
        );
      })}
    </div>
  );
}
