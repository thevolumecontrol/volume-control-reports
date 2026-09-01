"use client";

import React, { useState } from "react";
import StationSelect from "./station-select";
import DjSelect from "./dj-select";

export default function Filters({ station, onStationChange, dj, onDjChange, className = "" }) {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className="flex flex-row gap-4 items-start">
        <StationSelect value={station} onChange={onStationChange} />
        <DjSelect value={dj} onChange={onDjChange} />
      </div>
    </div>
  );
}
