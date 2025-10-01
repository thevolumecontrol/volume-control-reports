const API_URL = "https://xgwc-qwi9-r6ti.n7d.xano.io";
const API_KEY = "api:CzX2YTxi";
const BASE = `${API_URL.replace(/\/$/, "")}/${API_KEY}`;

import { logRequest, logResponse, logError } from "./logger";

export const endpoints = {
  queryStations: "/query_stations",
  querySongs: (stationId) => `/query_songs/${encodeURIComponent(stationId)}`,
};

async function fetchJson(path, method = "GET", init = {}) {
  const url = `${BASE}${path.startsWith("/") ? path : `/${path}`}`;
  const m = method.toUpperCase();
  const start = logRequest(m, url);

  try {
    const res = await fetch(url, { method: m, headers: { Accept: "application/json" }, ...init });
    const duration = Date.now() - start;
    const text = await res.text().catch(() => null);

    // log response always (dev only inside logger)
    logResponse(m, url, res.status, duration, text);

    if (!res.ok) {
      const err = new Error(`HTTP ${res.status}`);
      logError(m, url, err, duration, text);
      throw err;
    }

    try {
      return text ? JSON.parse(text) : null;
    } catch (e) {
      logError(m, url, e, duration, text);
      throw e;
    }
  } catch (err) {
    const duration = Date.now() - start;
    // try to capture response text if available (fetch errors usually won't have it)
    logError(m, url, err, duration, null);
    throw err;
  }
}

export async function getStations() {
  const json = await fetchJson(endpoints.queryStations, "GET");
  const list = Array.isArray(json?.data) ? json.data : [];
  return list
    .map((s) => {
      if (!s) return null;
      return { label: s.name ?? String(s.id ?? ""), value: String(s.id ?? s.name ?? "") };
    })
    .filter(Boolean);
}

export async function getSongs(stationId) {
  const json = await fetchJson(endpoints.querySongs(stationId), "GET");
  const items = Array.isArray(json?.data?.items) ? json.data.items : [];
  return items.map((item) => {
    const song = item?.song ?? {};
    return {
      title: song.title ?? "",
      artist: song.artist ?? "",
      genre: song.genre ?? "",
      isrc: song.isrc ?? "",
      counts_all_time: item.counts_all_time ?? 0,
      last_played_at: item.last_played_at ?? 0,
      _raw: item,
    };
  });
}