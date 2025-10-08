import { useRef, useState, useCallback } from "react";

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

const calculateInitialWidths = () => {
  const widths = HEADERS.map((h) => DEFAULT_WIDTHS[h] ?? 0);
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

export function useColumnResize(minPercent = 5) {
  const [colWidths, setColWidths] = useState(calculateInitialWidths());
  const tableRef = useRef(null);

  const resizing = useRef({
    active: false,
    colIndex: -1,
    startX: 0,
    startWidths: [],
    tableWidth: 0,
  });

  const onMouseMove = useCallback(
    (e) => {
      if (!resizing.current.active) return;

      const deltaX = e.clientX - resizing.current.startX;
      const deltaPercent = (deltaX / resizing.current.tableWidth) * 100;

      const i = resizing.current.colIndex;
      const newWidths = [...resizing.current.startWidths];

      let left = newWidths[i] + deltaPercent;
      let right = newWidths[i + 1] - deltaPercent;

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
    },
    [minPercent]
  );

  const onMouseUp = useCallback(() => {
    if (!resizing.current.active) return;
    resizing.current.active = false;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  }, [onMouseMove]);

  const startResize = useCallback(
    (e, index) => {
      if (e.button !== 0) return;
      const tableEl = tableRef.current;
      if (!tableEl) return;

      resizing.current = {
        active: true,
        colIndex: index,
        startX: e.clientX,
        startWidths: [...colWidths],
        tableWidth:
          tableEl.getBoundingClientRect().width || tableEl.offsetWidth || 1,
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [colWidths, onMouseMove, onMouseUp]
  );

  return { colWidths, tableRef, startResize };
}
