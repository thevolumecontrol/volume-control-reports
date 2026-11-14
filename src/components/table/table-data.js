"use client";
import React from "react";
import TableCell from "./table-cell";

export default function TableData({
  data,
  visibleIndexes = [],
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
            {visibleIndexes.map((cIdx) => (
              <TableCell key={cIdx} highlight={searchTerm}>
                {cIdx === 0 ? (
                  <span className="font-bold text-[#1e4b8e]">{row[cIdx]}</span>
                ) : (
                  row[cIdx]
                )}
              </TableCell>
            ))}
          </tr>
        );
      })}
    </tbody>
  );
}
