export default function ReportsHeader({ itemCount }) {
  return (
    <div className="flex items-center justify-between mb-4 sm:mb-6">
      <h1 className="text-xl sm:text-2xl font-semibold">Song reports</h1>
      {itemCount > 0 && (
        <p className="text-sm sm:text-base text-gray-500">
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </p>
      )}
    </div>
  );
}