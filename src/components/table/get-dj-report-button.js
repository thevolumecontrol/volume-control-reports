"use client";
import React, { useState } from "react";
import Button from "@/uikit/button/button";
import { useNotification } from "@/providers/notification/notifications";
import { adminGetDjReport } from "@/network/reports-api";

export default function GetDjReportButton({ djId, disabled = false }) {
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

  const handleGetReport = async () => {
    if (!djId) return;

    setLoading(true);
    try {
      await adminGetDjReport(djId);
      showNotification(
        "success",
        <>
          Report is ready! You can download it from the{" "}
          <a href="/admin-reports" className="underline font-semibold">
            Reports
          </a>{" "}
          section.
        </>
      );
    } catch (e) {
      console.error("Get DJ report error:", e);
      showNotification("error", "Failed to generate report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="black"
      size="m"
      onClick={handleGetReport}
      loading={loading}
      disabled={disabled || !djId || loading}
    >
      Get DJ report
    </Button>
  );
}
