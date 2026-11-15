"use client";
import React from "react";
import TableCell from "./table-cell";

export default function TableData({
  data,
  visibleIndexes = [],
  visibleHeaders = [],
  searchTerm = "",
  onGetReport,
}) {
  return (
    <tbody>
      {data.map((row, rIdx) => {
        const song = row[row.length - 1];
        const canOpen = song && typeof song === "object" && song.songId;
        return (
          <tr
            key={rIdx}
            onClick={() => canOpen && onGetReport && onGetReport(song)}
            className={`${
              rIdx < 10
                ? "bg-amber-50"
                : rIdx % 2 === 1
                  ? "bg-neutral-50"
                  : "bg-white"
            } hover:bg-sky-50 text-[14px] ${canOpen ? "cursor-pointer" : ""}`}
          >
            {visibleIndexes.map((cIdx, i) => {
              const label = visibleHeaders[i];
              const tight = label === "Title" || label === "Artist";
              return (
                <TableCell key={cIdx} highlight={searchTerm}>
                  <span className={tight ? "block truncate max-w-[12rem] sm:max-w-[16rem]" : ""}>
                    {cIdx === 0 ? (
                      <span className="font-bold text-[#1e4b8e]">{row[cIdx]}</span>
                    ) : (
                      row[cIdx]
                    )}
                  </span>
                </TableCell>
              );
            })}
          </tr>
        );
      })}
    </tbody>
  );
}
