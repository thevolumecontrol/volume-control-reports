export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="h-full flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-gray-500 rounded-full animate-spin mb-4"></div>
        <p className="text-sm sm:text-base text-gray-600">{message}</p>
      </div>
    </div>
  );
}