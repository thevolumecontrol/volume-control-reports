"use client";
import React, { useState } from "react";
import FullReportModal from "@/components/modals/full-report-modal";

export default function GetFullReportButton({ id, onClick, className = "", title, artist }) {
  const [open, setOpen] = useState(false);

  // support both primitive id or payload object { songId, title, artist }
  const payload = id && typeof id === "object" ? id : null;
  const songId = payload ? (payload.songId ?? payload.id ?? "") : id;
  const songTitle = payload ? (payload.title ?? payload.songTitle ?? "") : title ?? "";
  const songArtist = payload ? (payload.artist ?? payload.songArtist ?? "") : artist ?? "";

  const handle = (e) => {
    e.stopPropagation();
    setOpen(true);
    if (typeof onClick === "function") onClick(songId);
  };

  return (
    <>
      <button
        type="button"
        onClick={handle}
        className={`rounded-md px-2 py-0.5 bg-neutral-200 hover:bg-neutral-300 text-xs text-neutral-800 ${className}`}
        aria-label="Get report"
      >
        Get report
      </button>

      <FullReportModal
        isOpen={open}
        onClose={() => setOpen(false)}
        songId={songId}
        title={songTitle}
        artist={songArtist}
      />
    </>
  );
}