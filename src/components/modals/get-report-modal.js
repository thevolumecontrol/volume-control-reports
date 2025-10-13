"use client";
import React, { useState, useMemo } from "react";
import Modal from "@/uikit/modal/modal";
import Input from "@/uikit/input/input";
import Button from "@/uikit/button/button";
import { useNotification } from "@/providers/notification/notifications";
import { formatDateShort } from "@/utils/date-formatter";
import { isEmail } from "@/utils/validators";
import { createStripeCheckout } from "@/utils/network/api";
import IconCheckSimple from "@/uikit/icons/check-simple";
import FileIcon from "@/uikit/icons/file";

const REPORT_DAYS = 28;

const STATIONS = [
  "Digital Dope Radio",
  "Atlanta 285 FM",
  "Blessed FM",
  "Charlotte 77 FM",
  "Chicago 94 FM",
  "DMV 495 FM",
  "Dallas 35 FM",
  "+ 13 stations",
];

export default function FullReportModal({
  isOpen,
  onClose,
  songId,
  title,
  artist,
}) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

  const { startDateStr, endDateStr } = useMemo(() => {
    // end on yesterday so the 28-day window ends yesterday
    const end = new Date();
    end.setDate(end.getDate() - 1); // yesterday
    const start = new Date(end);
    start.setDate(end.getDate() - (REPORT_DAYS - 1)); // inclusive 28 days ending yesterday
    return {
      startDateStr: formatDateShort(start),
      endDateStr: formatDateShort(end),
    };
  }, []);

  const handleGetReport = async (e) => {
    e?.preventDefault();

    if (!email || String(email).trim() === "") {
      setEmailError("Email is requiered field");
      return;
    }
    if (!isEmail(email)) {
      setEmailError("Email is invalid");
      return;
    }

    setLoading(true);
    try {
      const resp = await createStripeCheckout(
        String(songId ?? ""),
        String(email)
      );

      if (resp?.url && typeof window !== "undefined") {
        window.location.href = resp.url;
        return;
      }

      // fallback: if server didn't return a redirect URL, show success notification and close
      showNotification?.("success", "Checkout initiated");
      onClose?.();
    } catch (err) {
      console.error("createStripeCheckout error:", err);
      const msg =
        (err && (err.message || (err.payload && err.payload.message))) ||
        "There was an error creating checkout. Please try again.";
      showNotification?.("error", msg);
    } finally {
      setLoading(false);
    }
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

        <Button
          type="submit"
          variant="black"
          size="m"
          fullWidth
          onClick={handleGetReport}
          loading={loading}
          disabled={loading}
        >
          Get report - $20
        </Button>
      </form>
    </Modal>
  );
}
