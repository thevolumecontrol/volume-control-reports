const API_URL = "https://xgwc-qwi9-r6ti.n7d.xano.io";
const API_KEY = "api:CzX2YTxi";
const BASE = `${API_URL.replace(/\/$/, "")}/${API_KEY}`;

import { logRequest, logResponse, logError } from "./logger";

export const endpoints = {
  queryStations: "/query_stations",
  // keep base path; page_id and sortBy will be appended as query params by getSongs
  querySongs: (stationId) => `/query_songs/${encodeURIComponent(stationId)}`,
};

// Simple in-memory TTL cache
const CACHE = new Map(); // key -> { ts: number, ttl: number(ms), payload: any }

function getCache(key) {
  const entry = CACHE.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > entry.ttl) {
    CACHE.delete(key);
    return null;
  }
  return entry.payload;
}

function setCache(key, payload, ttlMs) {
  CACHE.set(key, { ts: Date.now(), ttl: ttlMs, payload });
}

async function fetchJson(path, method = "GET", init = {}, opts = {}) {
  const url = `${BASE}${path.startsWith("/") ? path : `/${path}`}`;
  const m = method.toUpperCase();
  // pass init so logger can print request body / query params
  const start = logRequest(m, url, init);

  // opts.cacheTTL is in seconds
  const cacheTTLsec = Number(opts.cacheTTL || 0);
  const cacheKey = `${m}:${url}`;

  // serve from cache for GET when TTL provided
  if (m === "GET" && cacheTTLsec > 0) {
    const cached = getCache(cacheKey);
    if (cached !== null) {
      // log cached response (development only inside logger)
      try {
        logResponse(m, url, 200, 0, JSON.stringify(cached));
      } catch (e) {
        // ignore logging errors
      }
      return cached;
    }
  }

  try {
    const res = await fetch(url, { method: m, headers: { Accept: "application/json" }, ...init });
    const duration = Date.now() - start;
    const text = await res.text().catch(() => null);

    logResponse(m, url, res.status, duration, text);

    if (!res.ok) {
      const err = new Error(`HTTP ${res.status}`);
      logError(m, url, err, duration, text);
      throw err;
    }

    try {
      const parsed = text ? JSON.parse(text) : null;
      // store parsed JSON in cache if applicable
      if (m === "GET" && cacheTTLsec > 0 && parsed !== null) {
        setCache(cacheKey, parsed, cacheTTLsec * 1000);
      }
      return parsed;
    } catch (e) {
      logError(m, url, e, duration, text);
      throw e;
    }
  } catch (err) {
    const duration = Date.now() - start;
    logError(m, url, err, duration, null);
    throw err;
  }
}

/**
 * getStations - cached for 120 minutes (7200 seconds)
 */
export async function getStations() {
  const json = await fetchJson(endpoints.queryStations, "GET", {}, { cacheTTL: 120 * 60 });
  const list = Array.isArray(json?.data) ? json.data : [];
  return list
    .map((s) => {
      if (!s) return null;
      return { label: s.name ?? String(s.id ?? ""), value: String(s.id ?? s.name ?? "") };
    })
    .filter(Boolean);
}

/**
 * getSongs(stationId, pageId, sortBy)
 * - passes page_id and optional sortBy as query parameters to the endpoint
 * - cached for 60 minutes (3600 seconds)
 * - returns { items: [...normalized songs...], meta: { curPage, nextPage, prevPage, pageTotal, itemsTotal } }
 *
 * sortBy allowed values:
 * - playCountDecrease
 * - playCountIncrease
 * - lastPlayedDecrease
 * - lastPlayedIncrease
 */
export async function getSongs(stationId, pageId = 1, sortBy = null) {
  // optional searchInput appended as query param
  const basePath = endpoints.querySongs(stationId);
  const params = new URLSearchParams();
  params.set("page_id", String(pageId));
  if (sortBy) params.set("sortBy", String(sortBy));
  // support fourth param (searchInput)
  const searchInput = arguments.length >= 4 ? arguments[3] : null;
  if (searchInput != null && String(searchInput).trim() !== "") {
    params.set("search_input", String(searchInput));
  }
  const pathWithQuery = `${basePath}?${params.toString()}`;

  const json = await fetchJson(pathWithQuery, "GET", {}, { cacheTTL: 60 * 60 });

  const meta = {
    curPage: json?.data?.curPage ?? pageId,
    nextPage: json?.data?.nextPage ?? null,
    prevPage: json?.data?.prevPage ?? null,
    pageTotal: json?.data?.pageTotal ?? 1,
    itemsTotal: json?.data?.itemsTotal ?? 0,
  };

  const itemsArr = Array.isArray(json?.data?.items) ? json.data.items : [];
  const items = itemsArr.map((item) => {
    const song = item?.song ?? {};
    return {
      title: song.title ?? "",
      artist: song.artist ?? "",
      genre: song.genre ?? "",
      isrc: song.isrc ?? "",
      counts_all_time: item.counts_all_time ?? 0,
      last_played_at: item.last_played_at ?? null, // keep raw value (unix seconds or null)
      _raw: item,
    };
  });

  return { items, meta };
}