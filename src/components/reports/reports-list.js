import ReportCard from "./report-card";

export default function ReportsList({ reports, onDownload }) {
  return (
    <div className="space-y-3 sm:space-y-4">
      {reports.map((report) => (
        <ReportCard
          key={report.id}
          report={report}
          onDownload={onDownload}
        />
      ))}
    </div>
  );
}