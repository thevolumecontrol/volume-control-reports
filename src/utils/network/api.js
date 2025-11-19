import { createFetchJson } from "./network";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const BASE = `${API_URL.replace(/\/$/, "")}/${process.env.NEXT_PUBLIC_API_KEY}`;
const AUTH_BASE = `${API_URL.replace(/\/$/, "")}/${
  process.env.NEXT_PUBLIC_AUTH_API_KEY
}`;
const ADMIN_BASE = `${API_URL.replace(/\/$/, "")}/${
  process.env.NEXT_PUBLIC_ADMIN_API_KEY
}`;

const fetchJson = createFetchJson(BASE);
const authFetchJson = createFetchJson(AUTH_BASE);
const adminFetchJson = createFetchJson(ADMIN_BASE);

export const endpoints = {
  queryStations: "/query_stations",
  // keep base path; page_id and sortBy will be appended as query params by getSongs
  querySongs: (stationId) => `/query_songs/${encodeURIComponent(stationId)}`,
  // new: submit contact request
  submitRequest: "/submit_request",
  // stripe checkout endpoint
  stripeCheckout: "/stripe/checkout",
  // auth login endpoint
  authLogin: "/auth/login",
  adminGetSongReport: "/admin/get_song_report",
  adminQuerySongReports: "/admin/query_song_reports",
};

export async function getStations() {
  const json = await fetchJson(
    endpoints.queryStations,
    "GET",
    {},
    { cacheTTL: 120 * 60 }
  );
  const list = Array.isArray(json?.data) ? json.data : [];
  return list
    .map((s) => {
      if (!s) return null;
      return {
        label: s.name ?? String(s.id ?? ""),
        value: String(s.id ?? s.name ?? ""),
      };
    })
    .filter(Boolean);
}

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
      last_played_at: item.last_played_at ?? null,
      _raw: item,
    };
  });

  return { items, meta };
}

export async function submitContact(topic, email, message) {
  const params = new URLSearchParams();
  if (topic != null) params.set("topic", String(topic));
  if (email != null) params.set("email", String(email));
  if (message != null) params.set("message", String(message));
  const path = `${endpoints.submitRequest}?${params.toString()}`;
  return fetchJson(path, "GET", {}, { cacheTTL: 0 });
}

export async function createStripeCheckout(
  song_id,
  customer_email,
  cancel_url = null,
  success_url = null
) {
  if (
    (cancel_url == null || success_url == null) &&
    typeof window !== "undefined"
  ) {
    const origin = window.location.origin;
    const pathname = window.location.pathname || "/";
    if (cancel_url == null) cancel_url = `${origin}/`;
    if (success_url == null) success_url = `${origin}${pathname}#success`;
  }

  const params = new URLSearchParams();
  if (song_id != null) params.set("song_id", String(song_id));
  if (customer_email != null)
    params.set("customer_email", String(customer_email));
  if (cancel_url != null) params.set("cancel_url", String(cancel_url));
  if (success_url != null) params.set("success_url", String(success_url));

  const path = `${endpoints.stripeCheckout}?${params.toString()}`;
  return adminFetchJson(path, "GET", {}, { cacheTTL: 0 });
}

export async function authLogin(email, password) {
  const body = {
    email: String(email || ""),
    password: String(password || ""),
  };

  return authFetchJson(
    endpoints.authLogin,
    "POST",
    {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
    { cacheTTL: 0 }
  );
}

export async function adminGetSongReport(songId, authToken) {
  if (!songId) {
    throw new Error("songId is required");
  }

  const params = new URLSearchParams();
  params.set("song_id", String(songId));

  const path = `${endpoints.adminGetSongReport}?${params.toString()}`;

  return adminFetchJson(
    path,
    "GET",
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    },
    { cacheTTL: 0 }
  );
}

/**
 * adminQuerySongReports - get list of song reports for admin
 * - authToken: string (Bearer token)
 *
 * Returns parsed JSON from the API (list of reports).
 */
export async function adminQuerySongReports(authToken) {
  const path = endpoints.adminQuerySongReports;

  return adminFetchJson(
    path,
    "GET",
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    },
    { cacheTTL: 0 }
  );
}
