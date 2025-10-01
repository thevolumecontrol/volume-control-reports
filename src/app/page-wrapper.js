"use client";

import React, { useState, useEffect } from "react";
import Selector from "@/uikit/selector";
import SimpleTable from "@/components/table";
import Pagination from "@/components/pagination";
import PageNav from "@/components/page-nav";
import { getStations, getSongs } from "@/utils/api";

export default function PageWrapper() {
  const [station, setStation] = useState("");
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [files, setFiles] = useState([]); // fetched songs for selected station
  const [filesLoading, setFilesLoading] = useState(false);
  const [filesError, setFilesError] = useState(null);

  // pagination state (driven by API meta)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

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

  // reset paging when station changes
  useEffect(() => {
    setCurrentPage(1);
    setTotalPages(1);
    setNextPage(null);
    setPrevPage(null);
    setFiles([]);
  }, [station]);

  // when user selects a station or currentPage changes -> fetch its songs (with page_id)
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
        const { items, meta } = await getSongs(station, currentPage);
        if (mounted) {
          setFiles(items);
          setCurrentPage(meta.curPage ?? currentPage);
          setTotalPages(meta.pageTotal ?? 1);
          setNextPage(meta.nextPage ?? null);
          setPrevPage(meta.prevPage ?? null);
        }
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
  }, [station, currentPage]);

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
          f.last_played_at ? new Date(f.last_played_at * 1000).toLocaleString() : "-",
        ])
      : Array.from({ length: 10 }, (_, i) => [
          `Mock Title ${i + 1}`,
          `Mock Artist ${i + 1}`,
          `Genre ${((i % 4) + 1)}`,
          `ISRC${i + 1}`,
          "0",
          "-",
        ]);

  // pagination handlers use API-provided nextPage/prevPage values
  const handlePrev = () => {
    if (prevPage == null) return;
    setCurrentPage(prevPage);
    console.log("Prev page ->", prevPage);
  };
  const handleNext = () => {
    if (nextPage == null) return;
    setCurrentPage(nextPage);
    console.log("Next page ->", nextPage);
  };

  // page nav handler (page number clicked under table)
  const handlePageChange = (page) => {
    if (!page || page === currentPage) return;
    setCurrentPage(page);
  };

  return (
    <>
      <div className="p-4 flex flex-col gap-4">
        {loading ? (
          <div className="text-sm text-neutral-600">Loading stations...</div>
        ) : error ? (
          <div className="text-sm text-red-500">Error: {error}</div>
        ) : null}

        {/* Row: selector left, pagination right */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <Selector
              label="Select station"
              value={station}
              onChange={setStation}
              options={options}
              placeholder="Choose a station"
            />
          </div>

          <div className="ml-4">
            <Pagination
              onPrev={handlePrev}
              onNext={handleNext}
              disabledPrev={prevPage == null}
              disabledNext={nextPage == null}
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </div>
        </div>

        {filesLoading && <div className="text-sm text-neutral-600">Loading songs...</div>}
        {filesError && <div className="text-sm text-red-500">Files error: {filesError}</div>}

        <div>
          <SimpleTable headers={tableHeaders} data={tableData} />
        </div>

        {/* Page navigation centered under the table */}
        <div className="flex justify-center">
          <PageNav
            currentPage={currentPage}
            totalPages={totalPages}
            onChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
}
