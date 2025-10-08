"use client";
import React from "react";
import TableHeaderCell from "./table-header-cell";

const HEADERS = [
  "Title",
  "Artist",
  "Last played",
  "Played Total",
  "Genre",
  "ISRC",
  "",
];

const DEFAULT_WIDTHS = {
  Title: 27.5,
  Artist: 22.5,
  "Last played": 17.5,
  "Played Total": 10,
  Genre: 10,
  ISRC: 5,
  "": 7.5,
};

export const getInitialWidths = (headers = HEADERS) => {
  const widths = headers.map((h) => DEFAULT_WIDTHS[h] ?? 0);
  const totalAssigned = widths.reduce((s, v) => s + v, 0);
  const unassignedCount = widths.filter((w) => w === 0).length;

  if (unassignedCount > 0) {
    const remaining = Math.max(0, 100 - totalAssigned);
    const each = remaining / unassignedCount;
    return widths.map((w) => (w === 0 ? each : w));
  }

  const factor = 100 / totalAssigned;
  return widths.map((w) => w * factor);
};

export { HEADERS };

export default function TableHeader({
  headerControls = {},
  onStartResize,
  minPercent = 5,
}) {
  return (
    <thead>
      <tr>
        {(() => {
          const ths = [];
          for (let i = 0; i < HEADERS.length; i++) {
            const h = HEADERS[i];
            if (h === "ISRC") {
              ths.push(
                <th
                  key={i}
                  colSpan={2}
                  className="bg-neutral-100 px-4 py-3 border-b border-neutral-200 text-sm font-medium text-neutral-700 text-left relative"
                  style={{
                    verticalAlign: "middle",
                    minWidth: `${minPercent}%`,
                  }}
                >
                  {headerControls[h] ? (
                    <TableHeaderCell
                      label={h}
                      direction={headerControls[h].direction ?? null}
                      onToggle={headerControls[h].onToggle}
                    />
                  ) : (
                    <div className="overflow-hidden text-ellipsis max-w-full">
                      {h}
                    </div>
                  )}

                  {i < HEADERS.length - 1 && (
                    <div
                      onMouseDown={(e) => onStartResize(e, i)}
                      className="absolute right-0 top-0 h-full w-2 -mr-1 cursor-col-resize z-10"
                      style={{ touchAction: "none" }}
                    >
                      <div className="h-full w-0.5 bg-neutral-200 mx-auto" />
                    </div>
                  )}
                </th>
              );
              i++;
              continue;
            }

            ths.push(
              <th
                key={i}
                className="bg-neutral-100 px-4 py-3 border-b border-neutral-200 text-sm font-medium text-neutral-700 text-left relative"
                style={{ verticalAlign: "middle", minWidth: `${minPercent}%` }}
              >
                {headerControls[h] ? (
                  <TableHeaderCell
                    label={h}
                    direction={headerControls[h].direction ?? null}
                    onToggle={headerControls[h].onToggle}
                  />
                ) : (
                  <div className="overflow-hidden text-ellipsis max-w-full">
                    {h}
                  </div>
                )}

                {i < HEADERS.length - 1 && (
                  <div
                    onMouseDown={(e) => onStartResize(e, i)}
                    className="absolute right-0 top-0 h-full w-2 -mr-1 cursor-col-resize z-10"
                    style={{ touchAction: "none" }}
                  >
                    <div className="h-full w-0.5 bg-neutral-200 mx-auto" />
                  </div>
                )}
              </th>
            );
          }
          return ths;
        })()}
      </tr>
    </thead>
  );
}
