"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import TableHeader from "./header/table-header";
import TableData from "./table-data";
import Pagination from "./pagination/pagination";
import PageNav from "./pagination/page-nav";
import SearchBar from "@/components/table/search-bar";
import FullReportModal from "@/components/modals/get-report-modal";
import { getSongs } from "@/utils/network/api";
import { formatDate } from "@/utils/date-formatter";
import { useColumnResize } from "./header/column-resize";
import { getSortByForRequest, createHeaderControls } from "../../utils/sorting";

export default function Table({ station }) {
  const wrapperRef = useRef(null);
  const [searchInput, setSearchInput] = useState("");
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);

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

  const { colWidths, tableRef, startResize } = useColumnResize();

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
  }, [station]);

  const handleSearchInput = useCallback((text) => {
    setSearchInput(text ?? "");
    setCountsDir("desc");
    setLastPlayedDir(null);
    setCurrentPage(1);
  }, []);

  // Fetch data
  useEffect(() => {
    if (!station) {
      setFiles([]);
      setError(null);
      return;
    }

    let mounted = true;
    const fetchFiles = async () => {
      setError(null);
      try {
        const sortBy = getSortByForRequest(countsDir, lastPlayedDir);
        const { items, meta } = await getSongs(
          station,
          currentPage,
          sortBy,
          searchInput
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
      }
    };

    fetchFiles();
    return () => {
      mounted = false;
    };
  }, [station, currentPage, countsDir, lastPlayedDir, searchInput]);

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
    if (headerLabel === "Played Total") {
      setCountsDir((prev) =>
        prev === "desc" ? "asc" : prev === "asc" ? "desc" : "desc"
      );
      setLastPlayedDir(null);
    } else if (headerLabel === "Last played") {
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

  // Direct mapping without transformation
  const tableData =
    files.length > 0
      ? files.map((f) => [
          f.title,
          f.artist,
          formatDate(f.last_played_at),
          String(f.counts_all_time ?? 0),
          f.genre,
          f.isrc,
          {
            songId: f._raw?.song?.id ?? f.id ?? f.song_id ?? "",
            title: f.title ?? f._raw?.song?.title ?? "",
            artist: f.artist ?? f._raw?.song?.artist ?? "",
          },
        ])
      : Array.from({ length: 10 }, () => [
          " ",
          " ",
          " ",
          " ",
          " ",
          " ",
          { songId: "", title: "", artist: "" },
        ]);

  return (
    <>
      <div ref={wrapperRef} className="flex flex-col gap-4">
        {error && <div className="text-sm text-red-500">Error: {error}</div>}

        <div className="flex items-end justify-between gap-4">
          <div className="flex-none w-96">
            <SearchBar onSearch={handleSearchInput} />
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

        <div>
          {files.length > 0 ? (
            <div className="w-full overflow-auto bg-white rounded-md shadow-sm border border-neutral-200">
              <div ref={tableRef} className="w-full">
                <table
                  className="min-w-full table-fixed"
                  style={{ tableLayout: "fixed", width: "100%" }}
                >
                  <colgroup>
                    {colWidths.map((w, i) => (
                      <col key={i} style={{ width: `${w}%` }} />
                    ))}
                  </colgroup>

                  <TableHeader
                    colWidths={colWidths}
                    headerControls={headerControls}
                    onStartResize={startResize}
                  />

                  <TableData
                    data={tableData}
                    searchTerm={searchInput}
                    onGetReport={handleGetReport}
                  />
                </table>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-neutral-500 select-none">
              Nothing to show...
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
