"use client";
import React from "react";
import TableHeaderCell from "./table-header-cell";
import { HEADERS } from "./column-resize";

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
            if (false && h === "ISRC") {
              ths.push(
                <th
                  key={i}
                  colSpan={2}
                  className="bg-[#1e4b8e] px-2 py-2 border-b border-[#16376b] text-[11px] font-bold uppercase tracking-wide text-white text-left relative"
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
                className="bg-[#1e4b8e] px-2 py-2 border-b border-[#16376b] text-[11px] font-bold uppercase tracking-wide text-white text-left relative"
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
