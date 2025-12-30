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
        <Filters station={station} onStationChange={setStation} dj={dj} onDjChange={setDj} />

        {<Table station={station} dj={dj} />}
      </div>
      <PaymentSuccessModal />
    </>
  );
}
