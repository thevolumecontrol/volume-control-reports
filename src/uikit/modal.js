"use client";
import React, { useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import "@/styles/modal.css";

/**
 * module-scoped counter tracks how many modals currently requested "no-scroll"
 * so nested modals won't accidentally restore body overflow too early.
 */
let openModalCount = 0;
const prevOverflowStore = { value: "" };

/**
 * useModal helper (keeps API same)
 */
export const useModal = () => {
  const open = (setOpen) => setOpen(true);
  const close = (setOpen) => setOpen(false);
  return { open, close };
};

/**
 * Modal — рендерится в портале в document.body и занимает весь экран.
 * Закрывается по клику на бэкдроп и по Escape. Блокирует скролл страницы.
 */
const Modal = ({ isOpen, onClose, children, title, size = "m" }) => {
  const handleKey = useCallback(
    (e) => {
      if (e.key === "Escape") onClose?.();
    },
    [onClose]
  );

  const prevOverflowRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    document.addEventListener("keydown", handleKey);

    // store previous overflow only when this is the first modal
    if (openModalCount === 0) {
      prevOverflowStore.value = document.body.style.overflow || "";
    }
    openModalCount = openModalCount + 1;
    prevOverflowRef.current = prevOverflowStore.value;

    // lock scroll
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      // decrement count and restore only when no modals remain
      openModalCount = Math.max(0, openModalCount - 1);
      if (openModalCount === 0) {
        document.body.style.overflow = prevOverflowRef.current || "";
      }
    };
  }, [isOpen, handleKey]);

  if (!isOpen) return null;

  const sizeClass =
    size === "s" ? "max-w-sm" : size === "l" ? "max-w-xl" : "max-w-md";

  const modalContent = (
    <aside
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      aria-hidden={!isOpen}
    >
      {/* backdrop */}
      <div
        className="fixed inset-0 backdrop-blur-sm"
        onClick={onClose}
        style={{ backgroundColor: "rgba(0,0,0,0.12)" }}
      />

      {/* dialog */}
      <div
        role="dialog"
        aria-modal="true"
        className={`relative z-10 w-full ${sizeClass} mx-4`}
        style={{ maxHeight: "90vh" }}
      >
        <div className="bg-white rounded-md shadow-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3">
            {title ? (
              <h3
                className="text-lg font-semibold text-neutral-800"
                style={{ fontSize: "1.125rem" }}
              >
                {title}
              </h3>
            ) : (
              <div />
            )}
            <button
              onClick={onClose}
              aria-label="Close"
              className="ml-3 rounded-md p-1 hover:bg-neutral-100 transition"
            >
              ✕
            </button>
          </div>

          <div className="p-4 overflow-auto" style={{ maxHeight: "calc(90vh - 80px)" }}>
            {children}
          </div>
        </div>
      </div>
    </aside>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;
