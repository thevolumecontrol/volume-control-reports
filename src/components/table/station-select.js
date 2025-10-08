"use client";

import React, { useState, useEffect } from "react";
import Selector from "@/uikit/selector";
import { getStations } from "@/utils/api";

export default function StationSelect({ value, onChange, className = "" }) {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchStations = async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await getStations();
        if (mounted) {
          setStations(list);
          // Auto-select first station if none selected
          if (!value && list.length > 0) {
            onChange(list[0].value);
          }
        }
      } catch (e) {
        console.error("fetchStations error:", e);
        if (mounted) setError(e?.message ?? "Failed to load stations");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchStations();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="flex flex-col gap-2">
      {error && <div className="text-sm text-red-500">Error: {error}</div>}
      <div className={`flex-none w-56 ${className}`}>
        <Selector
          value={value}
          onChange={onChange}
          options={stations}
          placeholder="Choose a station"
          className="text-[1.4rem] py-3 h-14"
        />
      </div>
    </div>
  );
}
