"use client";

import React, { useState, useEffect } from "react";
import Selector from "@/uikit/selector";
import SimpleTable from "@/components/table";
import { getStations, getSongs } from "@/utils/api";

export default function PageWrapper() {
  const [station, setStation] = useState("");
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [files, setFiles] = useState([]); // fetched songs for selected station
  const [filesLoading, setFilesLoading] = useState(false);
  const [filesError, setFilesError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchStations = async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await getStations();
        if (mounted) setStations(list);
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

  // when user selects a station -> fetch its songs
  useEffect(() => {
    if (!station) {
      setFiles([]);
      setFilesError(null);
      return;
    }

    let mounted = true;
    const fetchFiles = async () => {
      setFilesLoading(true);
      setFilesError(null);
      try {
        const result = await getSongs(station);
        if (mounted) setFiles(result);
      } catch (e) {
        console.error("fetchFiles error:", e);
        if (mounted) setFilesError(e?.message ?? "Failed to load files");
      } finally {
        if (mounted) setFilesLoading(false);
      }
    };

    fetchFiles();
    return () => {
      mounted = false;
    };
  }, [station]);

  const options = stations; // { label, value }[] from utils

  // table columns: title | artist | genre | isrc | playing counts | last played
  const tableHeaders = ["Title", "Artist", "Genre", "ISRC", "Playing counts", "Last played"];
  const tableData =
    files.length > 0
      ? files.map((f) => [
          f.title,
          f.artist,
          f.genre,
          f.isrc,
          String(f.counts_all_time ?? 0),
          f.last_played_at > 0 ? new Date(f.last_played_at).toLocaleString() : "-",
        ])
      : Array.from({ length: 10 }, (_, i) => [
          `Mock Title ${i + 1}`,
          `Mock Artist ${i + 1}`,
          `Genre ${((i % 4) + 1)}`,
          `ISRC${i + 1}`,
          "0",
          "-",
        ]);

  return (
    <>
      <div className="p-4 flex flex-col gap-4">
        {loading ? (
          <div className="text-sm text-neutral-600">Loading stations...</div>
        ) : error ? (
          <div className="text-sm text-red-500">Error: {error}</div>
        ) : null}

        <Selector
          label="Select station"
          value={station}
          onChange={setStation}
          options={options}
          placeholder="Choose a station"
        />

        {filesLoading && <div className="text-sm text-neutral-600">Loading songs...</div>}
        {filesError && <div className="text-sm text-red-500">Files error: {filesError}</div>}

        <div>
          <SimpleTable headers={tableHeaders} data={tableData} />
        </div>
      </div>
    </>
  );
}
