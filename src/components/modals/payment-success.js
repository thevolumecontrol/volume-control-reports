"use client";
import React, { useEffect, useState, useRef } from "react";
import Modal from "@/uikit/modal/modal";
import Button from "@/uikit/button/button";
import { useNotification } from "@/providers/notification/notifications";

export const PAYMENT_SUCCESS_HASH = "#success";

export function buildPaymentSuccessUrl(base) {
  if (base) return `${base.replace(/#.*$/, "")}${PAYMENT_SUCCESS_HASH}`;
  if (typeof window === "undefined") return PAYMENT_SUCCESS_HASH;
  return `${window.location.origin}${window.location.pathname}${PAYMENT_SUCCESS_HASH}`;
}

export default function PaymentSuccessModal() {
  const [isOpen, setIsOpen] = useState(false);
  const notifShownRef = useRef(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    // show/hide based on current hash
    const checkHash = () => {
      const isHashOpen = window.location.hash === PAYMENT_SUCCESS_HASH;
      setIsOpen(isHashOpen);
      if (isHashOpen) {
        // show notification once per open
        if (!notifShownRef.current) {
          showNotification?.("success", "Payment succeed");
          notifShownRef.current = true;
        }
      } else {
        notifShownRef.current = false;
      }
    };

    checkHash();
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, [showNotification]);

  const close = () => {
    // remove hash without reloading
    try {
      const url = window.location.href.replace(/#.*$/, "");
      window.history.replaceState(null, "", url);
    } catch (e) {
      // fallback
      window.location.hash = "";
    }
    setIsOpen(false);
    notifShownRef.current = false;
  };

  return (
    // match full-report-modal sizing / typography
    <Modal
      isOpen={isOpen}
      onClose={close}
      title="Thank you for your payment!"
      size="m"
    >
      <div className="flex flex-col gap-4">
        <div className="text-sm text-neutral-700">
          The report will be sent to your email address.
          <br />
          If you encounter any issues with the report, you can contact us using
          the form in the lower right corner of the screen.
        </div>

        <div className="w-full">
          <Button variant="black" size="m" fullWidth onClick={close}>
            Got it
          </Button>
        </div>
      </div>
    </Modal>
  );
}
