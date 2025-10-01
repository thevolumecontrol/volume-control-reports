// Утилита логирования (только helpers). Ничего не делает в production.
const isDev = process.env.NODE_ENV === "development";

function tryParseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function formatBody(body) {
  if (body == null) return null;
  // FormData
  if (typeof FormData !== "undefined" && body instanceof FormData) {
    const obj = {};
    for (const [k, v] of body.entries()) {
      obj[k] = v;
    }
    return obj;
  }
  // URLSearchParams
  if (typeof URLSearchParams !== "undefined" && body instanceof URLSearchParams) {
    return Object.fromEntries(body.entries());
  }
  // string -> try parse JSON otherwise return as string
  if (typeof body === "string") {
    const parsed = tryParseJson(body);
    return parsed !== null ? parsed : body;
  }
  // objects (including arrays)
  if (typeof body === "object") {
    return body;
  }
  // fallback
  return String(body);
}

/**
 * logRequest(method, url, init?)
 * - logs method + url
 * - logs query params if present
 * - logs request body (parsed) if init.body present
 * returns start timestamp (Date.now()) to be used by caller
 */
export function logRequest(method, url, init = {}) {
  if (!isDev) return Date.now();

  console.info(`[API][REQUEST] ${method} ${url}`);

  // query params
  try {
    const u = new URL(url);
    if (u.search && u.search !== "") {
      const params = Object.fromEntries(u.searchParams.entries());
      console.info(`[API][REQUEST] Query params:\n${JSON.stringify(params, null, 2)}`);
    }
  } catch (e) {
    // ignore if url is relative or invalid for URL()
  }

  // body
  if (init && "body" in init) {
    try {
      const formatted = formatBody(init.body);
      if (formatted == null) {
        console.info("[API][REQUEST] Body: <empty>");
      } else if (typeof formatted === "string") {
        console.info(`[API][REQUEST] Body (text):\n${formatted}`);
      } else {
        console.info(`[API][REQUEST] Body (json):\n${JSON.stringify(formatted, null, 2)}`);
      }
    } catch (e) {
      console.info("[API][REQUEST] Body: <unserializable>", e);
    }
  }

  return Date.now();
}

export function logResponse(method, url, status, durationMs, text) {
  if (!isDev) return;
  console.info(`[API][RESPONSE] ${method} ${url} — status: ${status} — ${durationMs}ms`);
  if (!text) {
    console.info("[API][RESPONSE] Body: <empty>");
    return;
  }
  const parsed = tryParseJson(text);
  if (parsed !== null) {
    console.info(`[API][RESPONSE JSON]:\n${JSON.stringify(parsed, null, 2)}`);
  } else {
    console.info(`[API][RESPONSE TEXT]:\n${text}`);
  }
}

export function logError(method, url, err, durationMs, text) {
  if (!isDev) return;
  console.error(`[API][ERROR] ${method} ${url} — ${durationMs}ms`, err);
  if (text) {
    const parsed = tryParseJson(text);
    if (parsed !== null) {
      console.error(`[API][ERROR] Response JSON:\n${JSON.stringify(parsed, null, 2)}`);
    } else {
      console.error(`[API][ERROR] Response Text:\n${text}`);
    }
  }
}