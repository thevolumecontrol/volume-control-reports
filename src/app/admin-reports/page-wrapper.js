"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminQuerySongReports } from "@/network/reports-api";
import { useUser } from "@/providers/user/user-provider";
import { getCookie } from "@/utils/cookies";
import { useNotification } from "@/providers/notification/notifications";
import ReportsHeader from "@/components/reports/reports-header";
import LoadingSpinner from "@/components/reports/loading-spinner";
import EmptyState from "@/components/reports/empty-state";
import ReportsList from "@/components/reports/reports-list";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { isVisitor, setIsVisitor } = useUser();
  const { showNotification } = useNotification();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Don't do anything until component is mounted
    if (!mounted) return;

    // Redirect if visitor (not authenticated)
    if (isVisitor) {
      router.push("/admin-login");
      return;
    }

    // Fetch reports when component mounts
    fetchReports();
  }, [mounted, isVisitor]);

  const handleUnauthorizedError = async () => {
    // Clear auth cookies
    if (typeof document !== "undefined") {
      const expireDate = "Thu, 01 Jan 1970 00:00:00 UTC";
      document.cookie = `auth_token=; expires=${expireDate}; path=/;`;
      document.cookie = `user_email=; expires=${expireDate}; path=/;`;
    }
    setIsVisitor(true);
    router.push("/");
  };

  const fetchReports = async () => {
    const authToken = getCookie("auth_token");
    if (!authToken) return;

    setLoading(true);
    try {
      const reportsData = await adminQuerySongReports();
      setReports(reportsData?.data?.items || []);
    } catch (error) {
      // Handle unauthorized errors
      if (error.status === 401 || error.status === 403) {
        await handleUnauthorizedError();
        return;
      }

      showNotification?.("error", "Failed to load reports. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (url) => {
    if (typeof window !== "undefined") {
      window.open(url, "_blank");
    }
  };

  // Don't render anything until mounted
  if (!mounted) {
    return <LoadingSpinner />;
  }

  if (isVisitor) {
    return null; // Will redirect in useEffect
  }

  if (loading) {
    return <LoadingSpinner message="Loading reports..." />;
  }

  return (
    <div className="h-full flex flex-col py-6 sm:py-8">
      <div className="max-auto mx-auto w-full">
        <ReportsHeader itemCount={reports.length} />

        {reports.length === 0 ? (
          <EmptyState />
        ) : (
          <ReportsList reports={reports} onDownload={handleDownload} />
        )}
      </div>
    </div>
  );
}
