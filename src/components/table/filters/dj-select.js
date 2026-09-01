"use client";

import React, { useState, useEffect, useMemo } from "react";
import Selector from "@/uikit/selector";
import { getDJs } from "@/network/actions-api";

export default function DjSelect({ value, onChange }) {
  const [djs, setDjs] = useState([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchDJs = async () => {
      setError(null);
      try {
        const list = await getDJs();
        if (mounted) setDjs(list);
      } catch (e) {
        console.error("fetchDJs error:", e);
        if (mounted) setError(e?.message ?? "Failed to load DJs");
      }
    };

    fetchDJs();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return djs;
    return djs.filter((dj) =>
      String(dj.label || "").toLowerCase().includes(q)
    );
  }, [djs, query]);

  return (
    <div className="flex flex-col gap-2">
      {error && <div className="text-sm text-red-500">Error: {error}</div>}
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search DJs"
        className="w-56 bg-white border border-neutral-200 rounded-lg px-3 py-2 text-sm"
      />
      <div className="flex-none w-56">
        <Selector
          value={value}
          onChange={onChange}
          options={filtered}
          placeholder="Choose a DJ"
          clearable
        />
      </div>
    </div>
  );
}
