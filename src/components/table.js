"use client";
import React, { useRef, useState, useEffect } from "react";
import TableCell from "./table-cell";
import TableHeaderCell from "./table-header-cell";

/**
 * SimpleTable with resizable columns.
 *
 * New prop:
 * - headerControls: { [headerLabel]: { direction: "asc"|"desc"|null, onToggle: () => void } }
 */
export default function SimpleTable({ headers: propHeaders, data: propData, headerControls = {} }) {
  const headers = propHeaders ?? [];
  const data = propData ?? [];

  const tableRef = useRef(null);

  const defaultMap = {
    Title: 30,
    Artist: 30,
    Genre: 10,
    ISRC: 5,
    "Playing counts": 12.5,
    "Last played": 12.5,
  };

  const initialWidths = (() => {
    const widths = headers.map((h) => defaultMap[h] ?? 0);
    const totalAssigned = widths.reduce((s, v) => s + v, 0);
    const unassignedCount = widths.filter((w) => w === 0).length;
    if (unassignedCount > 0) {
      const remaining = Math.max(0, 100 - totalAssigned);
      const each = remaining / unassignedCount;
      return widths.map((w) => (w === 0 ? each : w));
    }
    const factor = 100 / totalAssigned;
    return widths.map((w) => w * factor);
  })();

  const [colWidths, setColWidths] = useState(initialWidths);

  useEffect(() => {
    setColWidths(initialWidths);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headers.join("|")]);

  const resizing = useRef({
    active: false,
    colIndex: -1,
    startX: 0,
    startWidths: [],
    tableWidth: 0,
  });

  // set minimum percent to 5%
  const minPercent = 5;

  const onMouseMove = (e) => {
    if (!resizing.current.active) return;
    const deltaX = e.clientX - resizing.current.startX;
    const tableRect = { width: resizing.current.tableWidth };
    const deltaPercent = (deltaX / tableRect.width) * 100;

    const i = resizing.current.colIndex;
    const newWidths = [...resizing.current.startWidths];

    // apply delta to column i (increase) and i+1 (decrease)
    let left = newWidths[i] + deltaPercent;
    let right = newWidths[i + 1] - deltaPercent;

    // enforce min widths (minPercent) and ensure total stays ~100
    if (left < minPercent) {
      const diff = minPercent - left;
      left = minPercent;
      right -= diff;
    }
    if (right < minPercent) {
      const diff = minPercent - right;
      right = minPercent;
      left -= diff;
    }

    if (left < minPercent || right < minPercent) return;

    newWidths[i] = left;
    newWidths[i + 1] = right;

    setColWidths(newWidths);
  };

  const onMouseUp = () => {
    if (!resizing.current.active) return;
    resizing.current.active = false;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };

  const startResize = (e, index) => {
    if (e.button !== 0) return;
    const tableEl = tableRef.current;
    if (!tableEl) return;
    resizing.current = {
      active: true,
      colIndex: index,
      startX: e.clientX,
      startWidths: [...colWidths],
      tableWidth: tableEl.getBoundingClientRect().width || tableEl.offsetWidth || 1,
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div className="w-full overflow-auto bg-white rounded-md shadow-sm border border-neutral-200">
      <div ref={tableRef} className="w-full">
        {/* ensure fixed layout */}
        <table className="min-w-full table-fixed" style={{ tableLayout: "fixed", width: "100%" }}>
          <colgroup>
            {colWidths.map((w, i) => (
              <col key={i} style={{ width: `${w}%` }} />
            ))}
          </colgroup>

          <thead>
            <tr>
              {headers.map((h, i) => (
                <th
                  key={i}
                  className="bg-neutral-100 px-4 py-3 border-b border-neutral-200 text-sm font-medium text-neutral-700 text-left relative"
                  style={{ verticalAlign: "middle", minWidth: `${minPercent}%` }}
                >
                  {/* Make specific headers tappable (sort UI) - controlled via headerControls */}
                  {headerControls && headerControls[h] ? (
                    <TableHeaderCell
                      label={h}
                      direction={headerControls[h].direction ?? null}
                      onToggle={headerControls[h].onToggle}
                    />
                  ) : (
                    <div className="overflow-hidden text-ellipsis max-w-full">{h}</div>
                  )}

                  {i < headers.length - 1 && (
                    <div
                      onMouseDown={(e) => startResize(e, i)}
                      className="absolute right-0 top-0 h-full w-2 -mr-1 cursor-col-resize z-10"
                      style={{ touchAction: "none" }}
                    >
                      <div className="h-full w-0.5 bg-neutral-200 mx-auto" />
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row, rIdx) => (
              <tr key={rIdx} className={rIdx % 2 === 1 ? "bg-neutral-50" : ""}>
                {row.map((cellText, cIdx) => (
                  <TableCell key={cIdx} style={{ minWidth: `${minPercent}%` }}>
                    {cellText}
                  </TableCell>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}