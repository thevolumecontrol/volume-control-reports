"use client";
import React, { useState, useMemo } from "react";
import Modal from "@/uikit/modal/modal";
import Input from "@/uikit/input/input";
import Button from "@/uikit/button/button";
import { useNotification } from "@/providers/notification/notifications";
import { formatDateShort } from "@/utils/date-formatter";
import { isEmail } from "@/utils/validators";
import { createStripeCheckout } from "@/utils/api";

const REPORT_DAYS = 28;

export default function FullReportModal({
  isOpen,
  onClose,
  songId,
  title,
  artist,
}) {
  const [email, setEmail] = useState("");
  // emailError holds error message or empty string
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

  const isEmailValid = (value) => {
    // use centralized validator
    return isEmail(value);
  };

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
      // call checkout creation endpoint with song id and customer email
      const resp = await createStripeCheckout(
        String(songId ?? ""),
        String(email)
      );

      // robust redirect detection:
      // - accept string response
      // - check common properties (url, checkout_url, session_url, redirect_url)
      // - handle strange case when server returns an object where the URL is the object key
      const redirectUrl = (() => {
        if (!resp) return null;
        if (typeof resp === "string") return resp;
        if (typeof resp === "object") {
          const candidates = [
            resp.url,
            resp.checkout_url,
            resp.session_url,
            resp.redirect_url,
            resp.redirectUrl,
            resp.redirect,
          ];
          for (const c of candidates) if (c) return c;

          const keys = Object.keys(resp || {});
          if (keys.length === 1) {
            const k = keys[0];
            // example: { "https://checkout.stripe.com/....": "" }
            if (typeof k === "string" && /^https?:\/\//.test(k)) return k;
            const v = resp[k];
            if (typeof v === "string" && /^https?:\/\//.test(v)) return v;
          }
        }
        return null;
      })();

      if (redirectUrl && typeof window !== "undefined") {
        let finalUrl = redirectUrl;
        try {
          finalUrl = decodeURIComponent(String(redirectUrl));
        } catch (e) {
          finalUrl = String(redirectUrl);
        }
        window.location.href = finalUrl;
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
      title="Full song report"
      size="m"
    >
      <div className="flex flex-col gap-4">
        <div className="text-xl text-neutral-700">
          <div className="font-medium">
            {title || songId} {artist ? ` — ${artist}` : ""}
          </div>
          <div className="text-sm text-neutral-500 mt-1">
            Report period: {REPORT_DAYS} days
          </div>
          <div className="text-sm text-neutral-500">{`Report dates: ${startDateStr} – ${endDateStr}`}</div>
        </div>

        <div className="text-xs text-neutral-600">
          The report will be emailed to you in PDF format.
          <br />
          You can also download it from the website after payment.
        </div>

        <form onSubmit={handleGetReport} className="w-full flex flex-col gap-3">
          <Input
            label="Enter email to receive the report"
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

          {/* inline error line (instead of notification) */}
          {emailError && (
            <div className="text-sm text-red-500">{emailError}</div>
          )}

          <Button
            type="submit"
            variant="black"
            size="m"
            fullWidth
            onClick={handleGetReport}
            loading={loading}
            disabled={loading}
          >
            Get report
          </Button>
        </form>
      </div>
    </Modal>
  );
}
