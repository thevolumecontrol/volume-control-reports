"use client";

import React, { useState } from "react";
import StationSelect from "@/components/table/station-select";
import Table from "@/components/table/table";
import PaymentSuccessModal from "@/components/modals/payment-success";

export default function PageWrapper() {
  const [station, setStation] = useState("");

  return (
    <>
      <div className="flex flex-col gap-4">
        <StationSelect value={station} onChange={setStation} />

        {station && <Table station={station} />}
      </div>
      <PaymentSuccessModal />
    </>
  );
}
