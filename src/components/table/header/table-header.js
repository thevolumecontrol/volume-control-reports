"use client";
import React from "react";
import TableHeaderCell from "./table-header-cell";

export default function TableHeader({
  headers = [],
  headerControls = {},
}) {
  return (
    <thead>
      <tr>
        {headers.map((h, i) => (
          <th
            key={h}
            className="bg-[#1e4b8e] px-3 py-2 border-b border-[#16376b] text-[11px] font-bold uppercase tracking-wide text-white text-left"
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
