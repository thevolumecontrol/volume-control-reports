"use client";
import React, { useState, useMemo } from "react";
import Modal from "@/uikit/modal/modal";
import Input from "@/uikit/input/input";
import Button from "@/uikit/button/button";
import { useNotification } from "@/providers/notification/notifications";
import { formatDateShort } from "@/utils/date-formatter";
import { isEmail } from "@/utils/validators";
import { createStripeCheckout, adminGetSongReport } from "@/utils/network/api";
import { useAuth } from "@/utils/auth-service";
import IconCheckSimple from "@/uikit/icons/check-simple";
import FileIcon from "@/uikit/icons/file";
import { STATIONS } from "@/common/config";

const REPORT_DAYS = 28;

export default function FullReportModal({ isOpen, onClose, songId, title, artist }) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, authToken } = useAuth();
  const { showNotification } = useNotification();

  const { startDateStr, endDateStr } = useMemo(() => {
    const end = new Date();
    end.setDate(end.getDate() - 1);
    const start = new Date(end);
    start.setDate(end.getDate() - (REPORT_DAYS - 1));
    return {
      startDateStr: formatDateShort(start),
      endDateStr: formatDateShort(end),
    };
  }, []);

  const validateEmail = () => {
    if (!isAuthenticated) {
      if (!email || String(email).trim() === "") {
        setEmailError("Email is required field");
        return false;
      }
      if (!isEmail(email)) {
        setEmailError("Email is invalid");
        return false;
      }
    }
    return true;
  };

  const handleUnauthorizedError = async () => {
    console.log('Unauthorized access, logging out...');
    const { logout } = await import('@/utils/auth-service');
    logout();
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  const handleAdminReport = async () => {
    try {
      const reportData = await adminGetSongReport(songId, authToken);
      showNotification?.("success", "Report generated successfully");
      onClose?.();
    } catch (adminErr) {
      if (adminErr.status === 401 || adminErr.status === 403) {
        await handleUnauthorizedError();
        return;
      }
      throw adminErr;
    }
  };

  const handlePaymentReport = async () => {
    const resp = await createStripeCheckout(
      String(songId ?? ""),
      String(email)
    );

    if (resp?.url && typeof window !== "undefined") {
      window.location.href = resp.url;
      return;
    }

    showNotification?.("success", "Checkout initiated");
    onClose?.();
  };

  const handleError = (err) => {
    console.error("Report generation error:", err);
    const msg =
      (err && (err.message || (err.payload && err.payload.message))) ||
      "There was an error generating the report. Please try again.";
    showNotification?.("error", msg);
  };

  const handleGetReport = async (e) => {
    e?.preventDefault();
    if (!validateEmail()) return;

    setLoading(true);
    try {
      isAuthenticated ? await handleAdminReport() : await handlePaymentReport();
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const renderEmailInput = () => {
    if (isAuthenticated) return null;
    
    return (
      <>
        <Input
          label="Email address"
          type="plain"
          value={email}
          placeholder="Email"
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) setEmailError("");
          }}
          onFocus={() => {
            if (emailError) setEmailError("");
          }}
          required
          disabled={loading}
        />
        {emailError && <div className="text-sm text-red-500">{emailError}</div>}
      </>
    );
  };

  const renderInfoText = () => {
    if (!isAuthenticated) return null;
    
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-gray-800">
          The report will be available in the "Reports" tab.
        </p>
      </div>
    );
  };

  return (
    <Modal
      isOpen={!!isOpen}
      onClose={onClose}
      title={`${title} by ${artist}`}
      size="m"
    >
      <div className="bg-neutral-100 w-full p-4 rounded-xl flex flex-col gap-4">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-row gap-1 items-center">
            <FileIcon size={24} />
            <p className="font-semibold">PDF Report</p>
          </div>
          <p className="text-sm">{`${startDateStr} – ${endDateStr}`}</p>
        </div>
        <div className="divider" />

        <div className="grid grid-cols-2 gap-2">
          {STATIONS.map((station, idx) => (
            <div key={idx} className="flex flex-row gap-1 items-center">
              <div className="size-6 flex items-center justify-center">
                <div className="size-4 rounded-sm flex items-center justify-center cursor-pointer transition-all duration-200 ease-in-out text-white bg-blue-500">
                  <IconCheckSimple size={24} />
                </div>
              </div>
              <span
                className={`text-sm ${
                  station === "+ 13 stations" ? "font-semibold" : ""
                }`}
              >
                {station}
              </span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleGetReport} className="w-full flex flex-col gap-6">
        {renderEmailInput()}
        {renderInfoText()}

        <Button
          type="submit"
          variant="black"
          size="m"
          fullWidth
          onClick={handleGetReport}
          loading={loading}
          disabled={loading}
        >
          {isAuthenticated ? "Get report" : "Get report - $20"}
        </Button>
      </form>
    </Modal>
  );
}
