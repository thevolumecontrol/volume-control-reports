"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import TableHeader from "./header/table-header";
import TableData from "./table-data";
import MobileTableList from "./mobile-table-list";
import Pagination from "./pagination/pagination";
import PageNav from "./pagination/page-nav";
import SearchBar from "@/components/table/search-bar";
import FullReportModal from "@/components/modals/get-report-modal";
import { getSongs, getStations } from "@/network/actions-api";
import { formatDate } from "@/utils/date-formatter";
import { HEADERS } from "./header/column-resize";
import { getSortByForRequest, createHeaderControls } from "./filters/sorting";


const STATION_LETTERS = {
  "atl 285 fm": "ATL",
  "chicago 94 fm": "CHI",
  "charlotte 77 fm": "CLT",
  "detroit 313 fm": "DET",
  "dmv 495 fm": "DMV",
  "houston 610 fm": "HOU",
  "la 405 fm": "LA",
  "kc 70 fm": "KC",
  "nyc 212 fm": "NYC",
  "miami 305 fm": "MIA",
  "memphis 40 fm": "MEM",
  "mile high fm": "DEN",
  "philly 76 fm": "PHL",
  "phoenix 101 fm": "PHX",
  "stl 66 fm": "STL",
  "dallas 35 fm": "DAL",
  "tha culture 808 fm": "808",
  "digital dope radio": "DDR",
  "otown 407 fm": "OTO",
  "805 breaking djs": "SD",
  "blessed fm": "BLSD",
  "zaytown global radio": "ZAY",
  "strip club radio": "SCR",
  "all talk fm": "ATK",
  "volume control lagos": "LOS",
  "volume control accra": "ACC",
  "volume control abidjan": "ABJ",
  "volume control dakar": "DKR",
  "volume control johannesburg": "JHB",
  "volume control cape town": "CPT",
  "volume control lusaka": "LUN",
  "volume control london": "LON",
  "volume control paris": "PAR",
  "volume control berlin": "BER",
  "all stations": "ALL",
};

function stationLetters(label) {
  const key = String(label || "").trim().toLowerCase();
  if (!key) return "";
  if (STATION_LETTERS[key]) return STATION_LETTERS[key];
  const first = key.split(/\s+/)[0];
  if (/^[a-z]{2,4}$/.test(first)) return first.toUpperCase();
  return key.replace(/[^a-z0-9]/g, "").slice(0, 3).toUpperCase();
}

export default function Table({ station, dj, onStationChange }) {
  const wrapperRef = useRef(null);
  const [searchInput, setSearchInput] = useState("");
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stations, setStations] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  const [countsDir, setCountsDir] = useState("desc");
  const [lastPlayedDir, setLastPlayedDir] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState({
    songId: "",
    title: "",
    artist: "",
  });

  const DEFAULT_ON = ["Title", "Artist", "Time"];
  const [visible, setVisible] = useState(() => new Set(DEFAULT_ON));
  const toggleColumn = (name) => {
    setVisible((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        if (next.size === 1) return prev;
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };
  const visibleIndexes = HEADERS
    .map((h, i) => (h && visible.has(h) ? i : -1))
    .filter((i) => i >= 0);
  const visibleHeaders = visibleIndexes.map((i) => HEADERS[i]);

  useEffect(() => {
    let mounted = true;
    getStations()
      .then((list) => {
        if (mounted) setStations(list || []);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);


  // Reset when station changes
  useEffect(() => {
    setCurrentPage(1);
    setTotalPages(1);
    setNextPage(null);
    setPrevPage(null);
    setFiles([]);
    setSearchInput("");
    setCountsDir("desc");
    setLastPlayedDir(null);
  }, [station, dj]);

  const handleSearchInput = useCallback((text) => {
    const q = (text ?? "").trim();
    setSearchInput(q);
    setCountsDir("desc");
    setLastPlayedDir(null);
    setCurrentPage(1);
    if (q && typeof onStationChange === "function") {
      const hit = stations.find((st) =>
        String(st.label || "").toLowerCase().includes(q.toLowerCase())
      );
      if (hit && String(hit.value) !== String(station || "")) {
        onStationChange(String(hit.value));
      }
    }
  }, [stations, station, onStationChange]);

  // Fetch data
  useEffect(() => {
    if (station === null || station === undefined) {
      setFiles([]);
      setError(null);
      setLoading(false);
      return;
    }

    let mounted = true;
    const fetchFiles = async () => {
      setError(null);
      setLoading(true);
      try {
        const sortBy = getSortByForRequest(countsDir, lastPlayedDir);
        const { items, meta } = await getSongs(
          station,
          currentPage,
          sortBy,
          searchInput,
          dj
        );

        if (mounted) {
          setFiles(items);
          setCurrentPage(meta.curPage ?? currentPage);
          setTotalPages(meta.pageTotal ?? 1);
          setNextPage(meta.nextPage ?? null);
          setPrevPage(meta.prevPage ?? null);
        }
      } catch (e) {
        console.error("fetchFiles error:", e);
        if (mounted) setError(e?.message ?? "Failed to load files");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchFiles();
    return () => {
      mounted = false;
    };
  }, [station, currentPage, countsDir, lastPlayedDir, searchInput, dj]);

  const handlePrev = () => prevPage != null && setCurrentPage(prevPage);
  const handleNext = () => nextPage != null && setCurrentPage(nextPage);

  const handlePageChange = (page) => {
    if (!page || page === currentPage) return;
    setCurrentPage(page);

    const el = wrapperRef.current;
    if (el) {
      try {
        if (el.scrollHeight > el.clientHeight) {
          el.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } catch (e) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handleHeaderToggle = (headerLabel) => {
    if (headerLabel === "Played Total" || headerLabel === "Spins") {
      setCountsDir((prev) =>
        prev === "desc" ? "asc" : prev === "asc" ? "desc" : "desc"
      );
      setLastPlayedDir(null);
    } else if (headerLabel === "Last played" || headerLabel === "Time") {
      setLastPlayedDir((prev) =>
        prev === "desc" ? "asc" : prev === "asc" ? "desc" : "desc"
      );
      setCountsDir(null);
    }
    setCurrentPage(1);
  };

  const handleGetReport = (songData) => {
    setSelectedSong(songData);
    setModalOpen(true);
  };

  const headerControls = createHeaderControls(
    countsDir,
    lastPlayedDir,
    handleHeaderToggle
  );

  // Direct mapping with live stream formatting
  const tableData =
    files.length > 0
      ? files.map((f, idx) => {
          const totalCount = Number(f.counts_all_time ?? 0) || 0;
          const liveCount =
            Number(
              f.counts_live_streams ??
                f.count_live_streams ??
                f._raw?.counts_live_streams ??
                f._raw?.count_live_streams ??
                0
            ) || 0;
          const rotationCount = Math.max(0, totalCount - liveCount);

          // Station rotation outside (); live DJ spins inside ().
          const playedTotalDisplay =
            liveCount > 0
              ? `${rotationCount} (${liveCount} live dj spins)`
              : String(rotationCount || totalCount);

          // Extract songId from the correct path
          const songId =
            f._raw?.song?.id ?? f.song?.id ?? f.id ?? f.song_id ?? "";

          const lastPlayed = f.last_played_at ? new Date(f.last_played_at) : null;
          const year =
            lastPlayed && !Number.isNaN(lastPlayed.getTime())
              ? String(lastPlayed.getFullYear())
              : "";
          const rank = (currentPage - 1) * 50 + idx + 1;
          const stationLabel =
            (stations.find((st) => String(st.value) === String(station || "")) || {}).label ||
            (station ? String(station) : "All stations");

          return [
            String(rank),
            f.song?.title ?? f.title ?? "",
            f.song?.artist ?? f.artist ?? "",
            String(rotationCount || totalCount),
            formatDate(f.last_played_at),
            stationLetters(stationLabel),
            liveCount > 0 ? String(liveCount) : "—",
            year,
            f.song?.genre ?? f.genre ?? "",
            {
              songId: songId,
              title: f.song?.title ?? f.title ?? "",
              artist: f.song?.artist ?? f.artist ?? "",
            },
          ];
        })
      : Array.from({ length: 10 }, () => [" "," "," "," "," "," "," "," "," ",{ songId: "", title: "", artist: "" }]);

  return (
    <>
      <div ref={wrapperRef} className="flex flex-col gap-4">
        {error && <div className="text-sm text-red-500">Error: {error}</div>}

        <div className="bg-[#1e4b8e] text-white px-4 py-3">
          <div className="text-[11px] uppercase tracking-[0.18em] text-blue-100">
            Volume Control Chart
          </div>
          <div className="text-xl font-bold leading-tight">Panel by rank</div>
          <div className="text-xs text-blue-100 mt-1">
            Ranked by spins. Live DJ plays are listed separately from station rotation.
          </div>
        </div>

        <div className="flex items-end justify-between gap-4">
          <div className="flex-none w-full sm:w-96">
            <SearchBar onSearch={handleSearchInput} />
          </div>

          <div className="ml-4">
            <div className="hidden sm:block">
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
        </div>

        <div
          className={`transition-opacity duration-300 ${
            loading ? "opacity-50" : "opacity-100"
          }`}
        >
          {files.length > 0 ? (
            <>
              <div className="flex flex-wrap gap-2">
                {HEADERS.filter(Boolean).map((name) => {
                  const on = visible.has(name);
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => toggleColumn(name)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                        on
                          ? "bg-[#1e4b8e] text-white border-[#1e4b8e]"
                          : "bg-white text-neutral-500 border-neutral-300"
                      }`}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>

              {/* Desktop Table */}
              <div className="hidden sm:block w-full overflow-auto bg-white rounded-md shadow-sm border border-neutral-200">
                <table className="min-w-full" style={{ width: "100%" }}>
                  <TableHeader
                    headers={visibleHeaders}
                    headerControls={headerControls}
                  />
                  <TableData
                    data={tableData}
                    visibleIndexes={visibleIndexes}
                    searchTerm={searchInput}
                    onGetReport={handleGetReport}
                  />
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="sm:hidden">
                <MobileTableList
                  data={tableData}
                  searchTerm={searchInput}
                  onGetReport={handleGetReport}
                />
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-neutral-500 select-none">
              {loading ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-neutral-300 border-t-red-600 rounded-full animate-spin" />
                  <p className="text-base text-neutral-700">
                    Database is loading. Play counts are coming in…
                  </p>
                  <p className="text-sm text-neutral-500 max-w-md">
                    All-stations view has to add up every station. Pick one
                    station from the list for a faster result.
                  </p>
                </div>
              ) : (
                "Nothing to show..."
              )}
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <PageNav
            currentPage={currentPage}
            totalPages={totalPages}
            onChange={handlePageChange}
          />
        </div>
      </div>

      <FullReportModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        songId={selectedSong.songId}
        title={selectedSong.title}
        artist={selectedSong.artist}
      />
    </>
  );
}
