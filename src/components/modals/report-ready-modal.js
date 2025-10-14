"use client";
import React from "react";
import Modal from "@/uikit/modal/modal";
import Button from "@/uikit/button/button";
import FileIcon from "@/uikit/icons/file";

export default function ReportReadyModal({ isOpen, onClose, downloadUrl }) {
  const handleDownload = () => {
    if (downloadUrl && typeof window !== "undefined") {
      window.open(downloadUrl, '_blank');
    }
  };

  return (
    <Modal
      isOpen={!!isOpen}
      onClose={onClose}
      title="Your report is ready"
      size="m"
    >
      <div className="w-full flex flex-col gap-6 text-center">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-600">
            You can download it or view it in the Reports section
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            variant="secondary"
            size="m"
            fullWidth
            onClick={handleDownload}
            className="flex items-center justify-center gap-2"
            disabled={!downloadUrl}
          >
            <FileIcon size={16} />
            Download
          </Button>
          
          <Button
            variant="black"
            size="m"
            fullWidth
            onClick={onClose}
          >
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}