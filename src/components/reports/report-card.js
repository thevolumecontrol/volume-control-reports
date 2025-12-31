import Button from "@/uikit/button/button";
import FileIcon from "@/uikit/icons/file";
import { formatDateShort, formatDateWithTime } from "@/utils/date-formatter";

export default function ReportCard({ report, onDownload }) {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-4 sm:px-6 sm:py-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 break-words">
            {report?.report_title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600">
            {formatDateShort(report?.report_start_date)} -{" "}
            {formatDateShort(report?.report_end_date)}
          </p>
        </div>
        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 sm:gap-0">
          <div className="text-left sm:text-right flex flex-col sm:items-end">
            <p className="text-xs sm:text-sm text-gray-500">Created</p>
            <p className="text-xs sm:text-sm font-medium text-gray-900">
              {formatDateWithTime(report?.created_at)}
            </p>
          </div>
          <div className="sm:mt-2">
            <Button
              variant="secondary"
              size="m"
              onClick={() => onDownload(report?.report_file?.url)}
            >
              <FileIcon size={14} />
              <span className="hidden sm:inline">Download</span>
              <span className="sm:hidden">PDF</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
