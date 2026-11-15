"use client";
import React from "react";
import TableHeaderCell from "./table-header-cell";

const WIDTHS = {
  Rank: "6%",
  Title: "24%",
  Artist: "22%",
  Spins: "12%",
  Time: "18%",
  Station: "8%",
  "Live DJ": "8%",
  Year: "7%",
  Genre: "12%",
};

export default function TableHeader({
  headers = [],
  headerControls = {},
}) {
  return (
    <thead>
      <tr>
        {headers.map((h) => (
          <th
            key={h}
            className="bg-[#1e4b8e] px-2 py-2 border-b border-[#16376b] text-[11px] font-bold uppercase tracking-wide text-white text-left"
            style={{ width: WIDTHS[h] || "auto" }}
          >
            {headerControls[h] ? (
              <TableHeaderCell
                label={h}
                direction={headerControls[h].direction ?? null}
                onToggle={headerControls[h].onToggle}
              />
            ) : (
              <div className="overflow-hidden text-ellipsis max-w-full">{h}</div>
            )}
          </th>
        ))}
      </tr>
    </thead>
  );
}
