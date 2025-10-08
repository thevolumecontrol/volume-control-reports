"use client";
import React, { useState } from "react";
import TableCell from "./table-cell";
import GetFullReportButton from "./get-report-button";
import FullReportModal from "@/components/modals/get-report-modal";

export default function TableData({ data, searchTerm = "", minPercent = 5 }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState({
    songId: "",
    title: "",
    artist: "",
  });

  const handleGetReport = (songData) => {
    setSelectedSong(songData);
    setModalOpen(true);
  };

  return (
    <>
      <tbody>
        {data.map((row, rIdx) => (
          <tr
            key={rIdx}
            className={`${
              rIdx % 2 === 1 ? "bg-neutral-50" : ""
            } hover:bg-neutral-100 group relative`}
          >
            {row.map((cellText, cIdx) => {
              const isActionCol = cIdx === row.length - 1;
              return (
                <TableCell
                  key={cIdx}
                  style={{ minWidth: `${minPercent}%` }}
                  highlight={searchTerm}
                  innerOverflowVisible={isActionCol}
                >
                  {isActionCol ? (
                    <div className="relative overflow-visible w-full h-full">
                      <GetFullReportButton
                        id={cellText}
                        onClick={handleGetReport}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                  ) : (
                    cellText
                  )}
                </TableCell>
              );
            })}
          </tr>
        ))}
      </tbody>

      {modalOpen && (
        <FullReportModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          songId={selectedSong.songId}
          title={selectedSong.title}
          artist={selectedSong.artist}
        />
      )}
    </>
  );
}
