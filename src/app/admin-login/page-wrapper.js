"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminQuerySongReports } from "@/utils/network/api";
import { useAuth } from "@/utils/auth-service";
import { useNotification } from "@/providers/notification/notifications";
import { formatDateShort, formatDateWithTime } from "@/utils/date-formatter";
import Button from "@/uikit/button/button";
import FileIcon from "@/uikit/icons/file";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const router = useRouter();

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const response = await adminQuerySongReports();
        setReports(response);
      } catch (error) {
        showNotification("error", "Failed to fetch reports. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleDownload = (reportId) => {
    // Logic to handle report download
  };

  const formatTimestamp = (timestamp) => {
    return formatDateWithTime(timestamp);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Song Reports</h2>
          {loading ? (
            <p className="text-gray-500">Loading reports...</p>
          ) : reports.length === 0 ? (
            <p className="text-gray-500">No reports found.</p>
          ) : (
            <div>
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="bg-gray-50 rounded-lg p-4 mb-4 border-l-4 border-blue-500"
                >
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {report.song.title} by {report.song.artist}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {formatDateShort(report.report_start_date)} -{" "}
                        {formatDateShort(report.report_end_date)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right flex flex-col items-end">
                        <p className="text-sm text-gray-500">Created</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDateWithTime(report.created_at)}
                        </p>
                        <div className="mt-2">
                          <Button
                            onClick={() => handleDownload(report.id)}
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-2"
                          >
                            <FileIcon className="w-4 h-4" />
                            Download Report
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}