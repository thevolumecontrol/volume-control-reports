"use client";
import { useEffect, useRef, useState } from "react";

export default function Dropdown({
  toggleContent,
  dropdownSize = "m",
  dropdownOrientation = "bottom",
  horizontalPosition = "left",
  children,
  onClose,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sizeStyles = {
    s: "w-[200px]",
    m: "w-[260px]",
    l: "w-[360px]",
    xl: "w-[510px]",
    auto: "w-full",
  };

  const orientationStyles = {
    bottom: "top-full mt-4",
    top: "bottom-full mb-4",
    left: "right-full mr-3",
    right: "left-full ml-3",
  };

  const horizontalStyles = {
    left: "left-0",
    right: "right-0",
    top: "top-0",
  };

  const closeDropdown = () => {
    setIsOpen(false);
    onClose?.();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        {toggleContent}
      </div>

      {isOpen && (
        <div
          className={`dropdown-list ${sizeStyles[dropdownSize]} ${orientationStyles[dropdownOrientation]} ${horizontalStyles[horizontalPosition]}`}
        >
          <div className="dropdown-scroll">
            {typeof children === "function"
              ? children(closeDropdown)
              : children}
          </div>
        </div>
      )}
    </div>
  );
}
