import { logRequest, logResponse, logError } from "../utils/logger";
import { getCookie } from "../utils/cookies";

const CACHE = new Map();

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

const DEFAULT_CACHE_TTL = 120 * 60;

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function createApiClient(baseURL) {
  return async function request(endpoint, options = {}) {
    const {
      method = "GET",
      data = null,
      requireAuth = false,
      caching = false,
    } = options;

    const url = `${baseURL}/${endpoint}`;
    const m = method.toUpperCase();

    let cacheTTL = 0;
    if (caching === true) {
      cacheTTL = DEFAULT_CACHE_TTL;
    } else if (typeof caching === "number") {
      cacheTTL = caching;
    }

    const cacheKey = `${m}:${url}`;
    const start = logRequest(m, url);

    if (m === "GET" && cacheTTL > 0) {
      const cached = getCache(cacheKey);
      if (cached !== null) {
        try {
          logResponse(m, url, 200, 0, JSON.stringify(cached));
        } catch (e) {}
        return cached;
      }
    }

    const headers = { Accept: "application/json" };

    if (requireAuth) {
      const authToken = getCookie("auth_token");
      if (authToken) {
        headers.Authorization = `Bearer ${authToken}`;
      }
    }

    if (data) {
      headers["Content-Type"] = "application/json";
    }

    try {
      const res = await fetch(url, {
        method: m,
        headers,
        body: data ? JSON.stringify(data) : null,
      });

      const duration = Date.now() - start;
      const text = await res.text().catch(() => null);

      logResponse(m, url, res.status, duration, text);

      if (!res.ok) {
        let parsed = null;
        try {
          parsed = text ? JSON.parse(text) : null;
        } catch (e) {}

        const serverMessage =
          (parsed && (parsed.message || parsed.error || parsed.msg)) ||
          text ||
          res.statusText ||
          `HTTP ${res.status}`;

        const err = new Error(serverMessage);
        err.status = res.status;
        err.payload = parsed;

        logError(m, url, err, duration, text);
        throw err;
      }

      const parsed = text ? JSON.parse(text) : null;
      if (m === "GET" && cacheTTL > 0 && parsed !== null) {
        setCache(cacheKey, parsed, cacheTTL * 1000);
      }
      return parsed;
    } catch (err) {
      const duration = Date.now() - start;
      if (!err.status) logError(m, url, err, duration, null);
      throw err;
    }
  };
}
