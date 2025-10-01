// Утилита логирования (только helpers). Ничего не делает в production.
const isDev = process.env.NODE_ENV === "development";

function tryParseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export function logRequest(method, url) {
  if (!isDev) return Date.now();
  console.info(`[API][REQUEST] ${method} ${url}`);
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