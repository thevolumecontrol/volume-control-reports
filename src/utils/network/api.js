import { createFetchJson } from "./network";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://xgwc-qwi9-r6ti.n7d.xano.io";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "api:CzX2YTxi";
const AUTH_API_KEY = process.env.NEXT_PUBLIC_AUTH_API_KEY || "api:dTYn0fDP";
const BASE = `${API_URL.replace(/\/$/, "")}/${API_KEY}`;
const AUTH_BASE = `${API_URL.replace(/\/$/, "")}/${AUTH_API_KEY}`;

// Create fetch functions for different bases
const fetchJson = createFetchJson(BASE);
const authFetchJson = createFetchJson(AUTH_BASE);

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
};

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
      last_played_at: item.last_played_at ?? null,
      _raw: item,
    };
  });

  return { items, meta };
}

/**
 * submitContact - sends simple contact request (query params)
 * topic, email, message -> encoded into query string
 */
export async function submitContact(topic, email, message) {
  const params = new URLSearchParams();
  if (topic != null) params.set("topic", String(topic));
  if (email != null) params.set("email", String(email));
  if (message != null) params.set("message", String(message));
  const path = `${endpoints.submitRequest}?${params.toString()}`;
  // use fetchJson (will log requests) — GET with query params as requested
  return fetchJson(path, "GET", {}, { cacheTTL: 0 });
}

/**
 * createStripeCheckout - request a stripe checkout session (GET with query params)
 * - song_id: string
 * - customer_email: string
 * - cancel_url: string (defaults to origin + "/")
 * - success_url: string (defaults to origin + pathname + "#success")
 *
 * Returns parsed JSON from the API.
 */
export async function createStripeCheckout(song_id, customer_email, cancel_url = null, success_url = null) {
  // derive defaults in browser-safe way
  if ((cancel_url == null || success_url == null) && typeof window !== "undefined") {
    const origin = window.location.origin;
    const pathname = window.location.pathname || "/";
    if (cancel_url == null) cancel_url = `${origin}/`;
    if (success_url == null) success_url = `${origin}${pathname}#success`;
  }

  const params = new URLSearchParams();
  if (song_id != null) params.set("song_id", String(song_id));
  if (customer_email != null) params.set("customer_email", String(customer_email));
  if (cancel_url != null) params.set("cancel_url", String(cancel_url));
  if (success_url != null) params.set("success_url", String(success_url));

  const path = `${endpoints.stripeCheckout}?${params.toString()}`;
  return fetchJson(path, "GET", {}, { cacheTTL: 0 });
}

/**
 * authLogin - authenticate user with email and password
 * - email: string
 * - password: string
 *
 * Returns parsed JSON from the API (likely contains auth token).
 */
export async function authLogin(email, password) {
  const body = {
    email: String(email || ""),
    password: String(password || "")
  };

  return authFetchJson(endpoints.authLogin, "POST", {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body)
  }, { cacheTTL: 0 });
}