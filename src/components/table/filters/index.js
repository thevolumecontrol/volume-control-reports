"use client";

import React, { useState } from "react";
import StationSelect from "./station-select";
import DjSelect from "./dj-select";
import { useUser } from "@/providers/user/user-provider";

export default function Filters({ station, onStationChange, dj, onDjChange, className = "" }) {
  const { isVisitor } = useUser();

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className="flex flex-row gap-4 items-start">
        <StationSelect value={station} onChange={onStationChange} />
        {!isVisitor && <DjSelect value={dj} onChange={onDjChange} />}
      </div>
    </div>
  );
}
