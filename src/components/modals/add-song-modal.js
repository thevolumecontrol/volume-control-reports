import { useState, useEffect } from "react";
import Modal from "@/uikit/modal";
import { useNotification } from "@/providers/notifications";
import AddSongModalContent from "./add-song-modal-content";

export default function AddSongModal({ isOpen, onClose, selectedPlaylists }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const { showNotification } = useNotification();

  useEffect(() => {
    if (isOpen) {
      setSelectedFile(null);
      setUploadProgress({});
    }
  }, [isOpen]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type (audio files)
      if (!file.type.startsWith("audio/")) {
        showNotification("error", "Please select an audio file");
        return;
      }
      setSelectedFile(file);
    }
  };

  const uploadFileToStation = async (stationId, file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      `/api/azuracast/upload?station_id=${stationId}`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(
        `Upload failed for station ${stationId}: ${response.status}`
      );
    }

    return response.json();
  };

  const addFileToPlaylist = async (stationId, playlistId, filePath) => {
    // Create M3U playlist content with the uploaded file
    const m3uContent = `#EXTM3U\n${filePath}`;

    // Create a blob from the M3U content
    const m3uBlob = new Blob([m3uContent], { type: "audio/x-mpegurl" });

    // Create FormData for the import
    const formData = new FormData();
    formData.append("playlist_file", m3uBlob, "temp.m3u");

    const response = await fetch(
      `/api/azuracast/playlist-import?station_id=${stationId}&playlist_id=${playlistId}`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Import to playlist failed: ${response.status} - ${errorText}`
      );
      throw new Error(
        `Failed to import file to playlist ${playlistId}: ${response.status}`
      );
    }

    return response.json();
  };

  const handleUploadToStations = async () => {
    if (!selectedFile) return;

    setUploading(true);

    // Get unique station IDs from selected playlists
    const stationIds = new Set();
    selectedPlaylists.forEach((playlist) => {
      stationIds.add(playlist.stationId);
    });

    const stationArray = Array.from(stationIds);
    const uploadedFiles = {}; // Store uploaded file IDs per station
    let successCount = 0;
    let errorCount = 0;

    try {
      // Step 1: Upload to each station
      for (const stationId of stationArray) {
        try {
          setUploadProgress((prev) => ({
            ...prev,
            [stationId]: "uploading",
          }));

          const uploadResult = await uploadFileToStation(
            stationId,
            selectedFile
          );
          uploadedFiles[stationId] = {
            id: uploadResult.id || uploadResult.file_id,
            path:
              uploadResult.path || uploadResult.filename || selectedFile.name,
          };

          setUploadProgress((prev) => ({
            ...prev,
            [stationId]: "uploaded",
          }));

          successCount++;
        } catch (error) {
          console.error(`Upload to station ${stationId} failed:`, error);

          setUploadProgress((prev) => ({
            ...prev,
            [stationId]: "error",
          }));

          errorCount++;
        }
      }

      // Step 2: Add uploaded files to playlists using M3U import
      if (successCount > 0) {
        for (const [key, playlist] of selectedPlaylists) {
          const { stationId, playlistId } = playlist;
          const fileInfo = uploadedFiles[stationId];

          if (fileInfo) {
            try {
              setUploadProgress((prev) => ({
                ...prev,
                [`playlist_${playlistId}`]: "adding",
              }));

              await addFileToPlaylist(stationId, playlistId, fileInfo.path);

              setUploadProgress((prev) => ({
                ...prev,
                [`playlist_${playlistId}`]: "success",
              }));
            } catch (error) {
              console.error(
                `Failed to add file to playlist ${playlistId}:`,
                error
              );

              setUploadProgress((prev) => ({
                ...prev,
                [`playlist_${playlistId}`]: "error",
              }));
            }
          }
        }
      }

      // Show results
      if (successCount > 0 && errorCount === 0) {
        showNotification(
          "success",
          `File uploaded to ${successCount} station${
            successCount > 1 ? "s" : ""
          } and added to playlists successfully`
        );
      } else if (successCount > 0 && errorCount > 0) {
        showNotification(
          "info",
          `File uploaded to ${successCount} station${
            successCount > 1 ? "s" : ""
          }, ${errorCount} failed`
        );
      } else {
        showNotification("error", "Upload failed to all stations");
      }

      if (successCount > 0) {
        setTimeout(() => onClose(), 2000); // Close after showing results
      }
    } catch (error) {
      showNotification("error", "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // Get unique station IDs for display
  const stationIds = new Set();
  selectedPlaylists.forEach((playlist) => {
    stationIds.add(playlist.stationId);
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Song to Stations"
      size="m"
    >
      <AddSongModalContent
        selectedPlaylists={selectedPlaylists}
        selectedFile={selectedFile}
        uploading={uploading}
        uploadProgress={uploadProgress}
        onClose={onClose}
        onFileSelect={handleFileSelect}
        onUpload={handleUploadToStations}
      />
    </Modal>
  );
}
