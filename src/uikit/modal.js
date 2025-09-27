"use client";
import { useState, useEffect } from "react";
import CancelIcon from "./icons/cancel";
import "@/styles/modal.css";

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

      // Use setTimeout for more reliable timing
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 10); // Small delay to ensure DOM is ready

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      document.body.style.overflow = "";

      const timer = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

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

  return (
    <aside className={`modal-overlay ${showClass}`}>
      <div className={`modal-backdrop ${showClass}`} onClick={onClose} />
      <div className={`modal-content modal-${size} ${showClass}`}>
        <div className="modal-header ">
          {title && <p className="title-s font-medium">{title}</p>}
          <button
            onClick={onClose}
            className="cursor-pointer hover:opacity-70 transition-opacity"
          >
            <CancelIcon size={24} />
          </button>
        </div>

        <div className="p-5">{children}</div>
      </div>
    </aside>
  );
};

export default Modal;
