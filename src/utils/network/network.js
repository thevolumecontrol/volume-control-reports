import { logRequest, logResponse, logError } from "../logger";

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

/**
 * Base fetch function with logging, error handling and caching
 */
async function baseFetchJson(baseUrl, path, method = "GET", init = {}, opts = {}) {
  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  const m = method.toUpperCase();
  const start = logRequest(m, url, init);

  // opts.cacheTTL is in seconds
  const cacheTTLsec = Number(opts.cacheTTL || 0);
  const cacheKey = `${m}:${url}`;

  // serve from cache for GET when TTL provided
  if (m === "GET" && cacheTTLsec > 0) {
    const cached = getCache(cacheKey);
    if (cached !== null) {
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
      let parsed = null;
      try {
        parsed = text ? JSON.parse(text) : null;
      } catch (e) {
        parsed = null;
      }

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
 * Create fetch function for specific base URL
 */
export function createFetchJson(baseUrl) {
  return function fetchJson(path, method = "GET", init = {}, opts = {}) {
    return baseFetchJson(baseUrl, path, method, init, opts);
  };
}