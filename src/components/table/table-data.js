"use client";
import React from "react";
import TableCell from "./table-cell";
import GetFullReportButton from "./get-full-report-button";

export default function TableData({
  data,
  headers,
  searchTerm = "",
  minPercent = 5,
}) {
  return (
    <tbody>
      {data.map((row, rIdx) => (
        <tr
          key={rIdx}
          className={`${
            rIdx % 2 === 1 ? "bg-neutral-50" : ""
          } hover:bg-neutral-100 group relative`}
        >
          {row.map((cellText, cIdx) => {
            const isActionCol = cIdx === headers.length - 1;
            return (
              <TableCell
                key={cIdx}
                style={{ minWidth: `${minPercent}%` }}
                highlight={searchTerm}
                innerOverflowVisible={isActionCol}
              >
                {isActionCol ? (
                  <div className="relative overflow-visible w-full h-full">
                    <GetFullReportButton
                      id={cellText}
                      onClick={(id) => {
                        console.log("Get full report for id:", id);
                      }}
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
