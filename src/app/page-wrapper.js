"use client";

import React, { useState, useEffect, useRef } from "react";
import Selector from "@/uikit/selector";
import SimpleTable from "@/components/table";
import Pagination from "@/components/pagination";
import PageNav from "@/components/page-nav";
import { getStations, getSongs } from "@/utils/api";
import styles from "@/styles/page-wrapper.module.css";

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

  // sort state for headers (controlled)
  // values: "asc" | "desc" | null
  const [countsDir, setCountsDir] = useState("desc"); // Playing counts default: arrow down
  const [lastPlayedDir, setLastPlayedDir] = useState(null);

  // ref to the page wrapper so we can scroll to its top (animated)
  const wrapperRef = useRef(null);

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

  // если станция не выбрана — автоматически выбираем первую после загрузки списка
  useEffect(() => {
    if (!station && Array.isArray(stations) && stations.length > 0) {
      setStation(stations[0].value);
    }
  }, [stations, station]);

  // reset paging when station changes
  useEffect(() => {
    setCurrentPage(1);
    setTotalPages(1);
    setNextPage(null);
    setPrevPage(null);
    setFiles([]);
    // keep sort state as is (countsDir default remains)
  }, [station]);

  // derive sortBy string from header state
  const getSortByForRequest = () => {
    if (countsDir) {
      return countsDir === "desc" ? "playCountDecrease" : "playCountIncrease";
    }
    if (lastPlayedDir) {
      return lastPlayedDir === "desc" ? "lastPlayedDecrease" : "lastPlayedIncrease";
    }
    // default fallback
    return "playCountDecrease";
  };

  // when user selects a station or currentPage or sort state changes -> fetch its songs (with page_id and sortBy)
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
        const sortBy = getSortByForRequest();
        const { items, meta } = await getSongs(station, currentPage, sortBy);
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
    // include sort state in deps so change triggers reload
  }, [station, currentPage, countsDir, lastPlayedDir]);

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
          (() => {
            const v = f.last_played_at;
            if (v == null) return "-";
            // support both seconds and milliseconds timestamps and ISO/date strings
            let date;
            if (typeof v === "number") {
              // if looks like milliseconds (large), use as is; otherwise treat as seconds
              date = v > 1e12 ? new Date(v) : new Date(v * 1000);
            } else {
              date = new Date(v);
            }
            if (isNaN(date.getTime())) return "-";
            return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
          })(),
        ])
      : Array.from({ length: 10 }, () => [" ", " ", " ", " ", " ", " "]);

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

    // animated scroll to top of PageWrapper (prefer scrolling wrapper itself,
    // fallback to scrollIntoView which scrolls the viewport)
    const el = wrapperRef.current;
    if (el) {
      try {
        if (el.scrollHeight > el.clientHeight) {
          el.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } catch (e) {
        // silent fallback
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  // header toggle handler: toggles clicked header, resets the other to null,
  // and resets page to 1 (triggers fetch via effect)
  const handleHeaderToggle = (headerLabel) => {
    if (headerLabel === "Playing counts") {
      // if already active, toggle direction; otherwise set to 'desc' by default
      setCountsDir((prev) => (prev === "desc" ? "asc" : prev === "asc" ? "desc" : "desc"));
      setLastPlayedDir(null);
    } else if (headerLabel === "Last played") {
      setLastPlayedDir((prev) => (prev === "desc" ? "asc" : prev === "asc" ? "desc" : "desc"));
      setCountsDir(null);
    }
    // reset to first page
    setCurrentPage(1);
  };

  // header controls to pass into SimpleTable
  const headerControls = {
    "Playing counts": {
      direction: countsDir,
      onToggle: () => handleHeaderToggle("Playing counts"),
    },
    "Last played": {
      direction: lastPlayedDir,
      onToggle: () => handleHeaderToggle("Last played"),
    },
  };

  return (
    <>
      <div ref={wrapperRef} className="p-4 flex flex-col gap-4">
        {error ? <div className="text-sm text-red-500">Error: {error}</div> : null}

        {/* Row: selector left, pagination right */}
        <div className="flex items-center justify-between gap-4">
          {/* selector gets shimmer while stations are loading */}
          <div className={`flex-1 ${loading ? `${styles.loadingShimmer} rounded-md` : ""}`}>
            <Selector
               value={station}
               onChange={setStation}
               options={options}
               placeholder="Choose a station"
              className="text-[1.4rem] py-3 h-14"
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

        {filesError && <div className="text-sm text-red-500">Files error: {filesError}</div>}

        <div>
          {/* render table when we have content; otherwise show placeholder text */}
          {files.length > 0 ? (
            <div>
              <div className={(filesLoading || loading) ? `${styles.loadingShimmer} rounded-md` : ""}>
                <div className={styles.tableAppear}>
                  <SimpleTable headers={tableHeaders} data={tableData} headerControls={headerControls} />
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-neutral-500 select-none">Nothing to show...</div>
          )}
         </div>
 
         {/* Page navigation centered under the table */}
         <div className="flex justify-center">
           <PageNav currentPage={currentPage} totalPages={totalPages} onChange={handlePageChange} />
         </div>
       </div>
    </>
  );
}
