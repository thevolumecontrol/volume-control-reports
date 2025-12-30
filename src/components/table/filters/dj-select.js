"use client";

import React, { useState, useEffect } from "react";
import Selector from "@/uikit/selector";
import { getDJs } from "@/utils/network/api";

export default function DjSelect({ value, onChange }) {
  const [djs, setDjs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchDJs = async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await getDJs();
        if (mounted) {
          setDjs(list);
        }
      } catch (e) {
        console.error("fetchDJs error:", e);
        if (mounted) setError(e?.message ?? "Failed to load DJs");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchDJs();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="flex flex-col gap-2">
      {error && <div className="text-sm text-red-500">Error: {error}</div>}
      <div className="flex-none w-56">
        <Selector
          value={value}
          onChange={onChange}
          options={djs}
          placeholder="Choose a DJ"
          className="text-[1.4rem] py-3 h-14"
        />
      </div>
    </div>
  );
}
