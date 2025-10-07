"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Selector from "@/uikit/selector";
import SearchBar from "@/components/search-bar";
import SimpleTable from "@/components/table/table";
import Pagination from "@/components/table/navigation/pagination";
import PageNav from "@/components/table/navigation/page-nav";
import { getStations, getSongs } from "@/utils/api";
import { formatDate } from "@/utils/date-formatter";
import styles from "@/styles/page-wrapper.module.css";
import ContactCTA from "@/components/modals/contact-us";
import PaymentSuccessModal from "@/components/modals/payment-success";

export default function PageWrapper() {
  const [station, setStation] = useState("");
  const [searchInput, setSearchInput] = useState("");
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

  // called from SearchBar (debounced)
  // memoize handler so its identity is stable -> prevents SearchBar's effect
  // from re-triggering when other state changes (this was causing extra requests).
  const handleSearchInput = useCallback(
    (text) => {
      setSearchInput(text ?? "");
      // when user types, apply default sort: Played Total desc
      setCountsDir("desc");
      setLastPlayedDir(null);
      setCurrentPage(1);
    },
    []
  );

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
        const { items, meta } = await getSongs(station, currentPage, sortBy, searchInput);
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
    // include sort state and searchInput in deps so change triggers reload
  }, [station, currentPage, countsDir, lastPlayedDir, searchInput]);

  const options = stations; // { label, value }[] from utils

  // table columns: Title, Artist, Last Played, Played Total, Genre, ISRC (spans 2 cols), <action>
  // note: we add an extra blank header at the end so ISRC can be rendered spanning 2 cols
  const tableHeaders = ["Title", "Artist", "Last played", "Played Total", "Genre", "ISRC", ""];
  // For the action column we pass an object so the table can open modal with full song info
  const tableData =
    files.length > 0
      ? files.map((f) => [
          f.title,
          f.artist,
          formatDate(f.last_played_at),
          // Played Total (counts)
          String(f.counts_all_time ?? 0),
          f.genre,
          f.isrc,
          // last column: payload with song info (id/title/artist)
          {
            songId: f._raw?.song?.id ?? f.id ?? f.song_id ?? "",
            title: f.title ?? f._raw?.song?.title ?? "",
            artist: f.artist ?? f._raw?.song?.artist ?? "",
          },
        ])
      : Array.from({ length: 10 }, () => [" ", " ", " ", " ", " ", " ", { songId: "", title: "", artist: "" }]);

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
    if (headerLabel === "Played Total") {
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
    "Played Total": {
      direction: countsDir,
      onToggle: () => handleHeaderToggle("Played Total"),
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

        {/* Row: selector left, search (now closer) and pagination right */}
        <div className="flex items-end justify-between gap-4">
          {/* left group: selector + search, aligned to left */}
          <div className="flex items-end gap-3">
            {/* left: selector (fixed width similar to pagination) */}
            <div className={`flex-none w-56 ${loading ? `${styles.loadingShimmer} rounded-md` : ""}`}>
              <Selector
                value={station}
                onChange={setStation}
                options={options}
                placeholder="Choose a station"
                className="text-[1.4rem] py-3 h-14"
              />
            </div>

            {/* search moved closer and made longer */}
            <div className="flex-none w-96">
              <SearchBar onSearch={handleSearchInput} />
            </div>
          </div>

          {/* right: pagination */}
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
                  <SimpleTable
                    headers={tableHeaders}
                    data={tableData}
                    headerControls={headerControls}
                    searchTerm={searchInput}
                  />
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

      {/* contact button / modal (fixed bottom-right) */}
      <ContactCTA />

     {/* payment success modal (opens when URL hash === #success) */}
     <PaymentSuccessModal />
    </>
  );
}
