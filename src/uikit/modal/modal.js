"use client";
import { useState, useEffect } from "react";
import CancelIcon from "@/uikit/icons/cancel";

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  return {
    isOpen,
    openModal: () => setIsOpen(true),
    closeModal: () => setIsOpen(false),
  };
};

const Modal = ({ isOpen, onClose, children, title, size = "m" }) => {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      document.body.style.overflow = "hidden";
    } else {
      setIsVisible(false);
      document.body.style.overflow = "";
      const timer = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (mounted) {
      const raf = requestAnimationFrame(() => {
        setIsVisible(true);
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [mounted]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!mounted) return null;

  const showClass = isVisible ? "show" : "";
  const overlayClass = size === "xl" ? "xl" : "";

  return (
    <aside
      className={`modal-overlay ${showClass} ${overlayClass} text-neutral-900`}
    >
      <div className={`modal-backdrop ${showClass}`} onClick={onClose} />
      <div className={`modal-content modal-${size} ${showClass}`}>
        <div className={`flex justify-start ${size === "xl" ? "lg:pt-8" : ""}`}>
          <button
            onClick={onClose}
            className="hover:opacity-70 transition-opacity cursor-pointer"
          >
            <CancelIcon size={24} />
          </button>
        </div>
        {title && <p className="title-m text-center">{title}</p>}
        {children}
      </div>
    </aside>
  );
};

export default Modal;
