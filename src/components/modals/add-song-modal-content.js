import Button from "@/uikit/button";

export default function AddSongModalContent({
  selectedPlaylists,
  selectedFile,
  uploading,
  uploadProgress,
  onClose,
  onFileSelect,
  onUpload,
}) {
  // Get unique station IDs for display
  const stationIds = new Set();
  selectedPlaylists.forEach((playlist) => {
    stationIds.add(playlist.stationId);
  });

  return (
    <div className="flex flex-col gap-8">
      <p className=" text-base font-medium mt-4 ">
        You&apos;re going to upload a song to{" "}
        <strong className="text-blue-500"> {stationIds.size} station </strong>
        {stationIds.size > 1 ? "s" : ""} and add it to{" "}
        <strong className="text-blue-500">
          {selectedPlaylists.size} playlist
          {selectedPlaylists.size > 1 ? "s" : ""}{" "}
        </strong>
      </p>

      <div className="mb-6 w-full">
        <label className="block text-lg font-medium mb-2">
          Select Audio File
        </label>
        <div className="border-2 border-dashed border-neutral-400 rounded-xl p-6 w-full cursor-pointer hover:border-neutral-500 transition-colors relative">
          <input
            type="file"
            accept="audio/*"
            onChange={onFileSelect}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <div className="text-center">
            {selectedFile ? (
              <div>
                <p className="text-sm font-medium text-neutral-900">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-neutral-600">
                  ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium text-neutral-700">
                  Click to select audio file
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  Or drag and drop your audio file here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {uploading && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-neutral-700 mb-2">
            Progress:
          </h4>
          <div className="space-y-2">
            {/* Station Upload Progress */}
            {Array.from(stationIds).map((stationId) => (
              <div
                key={stationId}
                className="flex items-center justify-between p-2 bg-neutral-50 rounded"
              >
                <span className="text-sm">Station {stationId} Upload</span>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    uploadProgress[stationId] === "uploaded"
                      ? "bg-green-100 text-green-800"
                      : uploadProgress[stationId] === "error"
                      ? "bg-red-100 text-red-800"
                      : uploadProgress[stationId] === "uploading"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  {uploadProgress[stationId] === "uploaded"
                    ? "Uploaded"
                    : uploadProgress[stationId] === "error"
                    ? "Failed"
                    : uploadProgress[stationId] === "uploading"
                    ? "Uploading..."
                    : "Pending"}
                </span>
              </div>
            ))}

            {/* Playlist Addition Progress */}
            {Array.from(selectedPlaylists.entries()).map(([key, playlist]) => (
              <div
                key={`playlist_${playlist.playlistId}`}
                className="flex items-center justify-between p-2 bg-blue-50 rounded"
              >
                <span className="text-sm">
                  Add to Playlist {playlist.playlistId}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    uploadProgress[`playlist_${playlist.playlistId}`] ===
                    "success"
                      ? "bg-green-100 text-green-800"
                      : uploadProgress[`playlist_${playlist.playlistId}`] ===
                        "error"
                      ? "bg-red-100 text-red-800"
                      : uploadProgress[`playlist_${playlist.playlistId}`] ===
                        "adding"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  {uploadProgress[`playlist_${playlist.playlistId}`] ===
                  "success"
                    ? "Added"
                    : uploadProgress[`playlist_${playlist.playlistId}`] ===
                      "error"
                    ? "Failed"
                    : uploadProgress[`playlist_${playlist.playlistId}`] ===
                      "adding"
                    ? "Adding..."
                    : "Waiting"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <Button type="secondary" onClick={onClose} disabled={uploading}>
          Cancel
        </Button>
        <Button
          type="black"
          onClick={onUpload}
          disabled={!selectedFile || uploading}
        >
          {uploading ? "Uploading..." : "Upload to Stations"}
        </Button>
      </div>
    </div>
  );
}
