"use client";
import React from "react";
import TableCell from "./table-cell";
import GetFullReportButton from "./get-song-report-button";

export default function TableData({
  data,
  searchTerm = "",
  minPercent = 5,
  onGetReport,
}) {
  return (
    <tbody>
      {data.map((row, rIdx) => (
        <tr
          key={rIdx}
          className={`${
            rIdx < 10
              ? "bg-amber-50"
              : rIdx % 2 === 1
                ? "bg-neutral-50"
                : "bg-white"
          } hover:bg-sky-50 group relative text-[13px]`}
        >
          {row.map((cellText, cIdx) => {
            const isActionCol = cIdx === row.length - 1;

            return (
              <TableCell
                key={cIdx}
                style={{ minWidth: `${minPercent}%` }}
                highlight={searchTerm}
                innerOverflowVisible={isActionCol}
              >
                {cIdx === 0 ? (
                  <span className="font-bold text-[#1e4b8e]">{cellText}</span>
                ) : isActionCol ? (
                  <div className="relative overflow-visible w-full h-full">
                    <GetFullReportButton
                      id={cellText}
                      onClick={onGetReport}
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                ) : (
                  cellText
                )}
              </TableCell>
            );
          })}
        </tr>
      ))}
    </tbody>
  );
}
