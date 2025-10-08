"use client";
import React from "react";
import Button from "@/uikit/button/button";

export default function GetFullReportButton({
  id,
  onClick,
  className = "",
  title,
  artist,
}) {
  const payload = id && typeof id === "object" ? id : null;
  const songId = payload ? payload.songId ?? payload.id ?? "" : id;
  const songTitle = payload
    ? payload.title ?? payload.songTitle ?? ""
    : title ?? "";
  const songArtist = payload
    ? payload.artist ?? payload.songArtist ?? ""
    : artist ?? "";

  const handle = (e) => {
    e?.stopPropagation();
    if (typeof onClick === "function") {
      onClick({ songId, title: songTitle, artist: songArtist });
    }
  };

  return (
    <Button
      type="button"
      onClick={handle}
      variant="black"
      size="s"
      className={`text-xm px-2 py-0.5 rounded-md transition-colors duration-150 ${className}`}
    >
      Get report
    </Button>
  );
}
