"use client";

import React, { useState } from "react";
import Filters from "@/components/table/filters";
import Table from "@/components/table/table";
import PaymentSuccessModal from "@/components/modals/payment-success";

export default function PageWrapper() {
  const [station, setStation] = useState("");
  const [dj, setDj] = useState("");

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between gap-4 border-b border-neutral-200 pb-3">
          <h1 className="text-2xl font-bold text-[#1e4b8e]">Custom Chart Report</h1>
          <p className="text-sm text-neutral-500">Rank · Station · Artist · Title · Spins</p>
        </div>
        <Filters station={station} onStationChange={setStation} dj={dj} onDjChange={setDj} />

        <Table station={station} dj={dj} onStationChange={setStation} />
      </div>
      <PaymentSuccessModal />
    </>
  );
}
