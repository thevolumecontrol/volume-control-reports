import createApiClient, { API_URL } from "./network";

const REPORTS_API_KEY = process.env.NEXT_PUBLIC_REPORTS_API_KEY;

const BASE_URL = `${API_URL.replace(/\/$/, "")}/${REPORTS_API_KEY}`;

const request = createApiClient(BASE_URL);

export const endpoints = {
  adminGetSongReport: "admin/get_song_report",
  adminQuerySongReports: "admin/query_song_reports",
  adminGetDjReport: "admin/get_dj_report",
};

export async function adminGetSongReport(songId) {
  if (!songId) {
    throw new Error("songId is required");
  }

  const params = new URLSearchParams();
  params.set("song_id", String(songId));

  const path = `${endpoints.adminGetSongReport}?${params.toString()}`;

  return request(path, {
    requireAuth: true,
    method: "GET",
  });
}

export async function adminQuerySongReports() {
  return request(endpoints.adminQuerySongReports, {
    requireAuth: true,
    method: "GET",
  });
}

export async function adminGetDjReport(djId) {
  if (!djId) {
    throw new Error("djId is required");
  }

  const params = new URLSearchParams();
  params.set("dj_id", String(djId));

  const path = `${endpoints.adminGetDjReport}?${params.toString()}`;

  return request(path, {
    requireAuth: true,
    method: "GET",
  });
}
