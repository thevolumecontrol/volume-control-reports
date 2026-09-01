import createApiClient, { API_URL } from "./network";

const ACTIONS_API_KEY = process.env.NEXT_PUBLIC_ACTIONS_API_KEY;
const BASE_URL = `${API_URL.replace(/\/$/, "")}/${ACTIONS_API_KEY}`;

const request = createApiClient(BASE_URL);

export const endpoints = {
  submitRequest: "support/request",
  stripeCheckout: "stripe/checkout",
  queryStations: "stations/query",
  queryDjs: "djs/query",
  querySongs: "songs/query",
};

export async function submitContact(topic, email, message) {
  const params = new URLSearchParams();
  if (topic != null) params.set("topic", String(topic));
  if (email != null) params.set("email", String(email));
  if (message != null) params.set("message", String(message));
  const path = `${endpoints.submitRequest}?${params.toString()}`;
  return request(path, { method: "GET" });
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
  return request(path, { method: "GET" });
}

export async function getStations() {
  const json = await request(endpoints.queryStations, {
    method: "GET",
    caching: true,
  });
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

export async function getDJs() {
  const json = await request(endpoints.queryDjs, {
    method: "GET",
    caching: true,
  });
  const list = Array.isArray(json?.data) ? json.data : [];
  return list
    .map((dj) => {
      if (!dj) return null;
      return {
        label: dj.name ?? String(dj.id ?? ""),
        value: String(dj.id ?? ""),
      };
    })
    .filter(Boolean);
}

export async function getSongs(
  stationId,
  pageId = 1,
  sortBy = null,
  searchInput = null,
  djId = null
) {
  const basePath = endpoints.querySongs;
  const params = new URLSearchParams();
  if (stationId != null && String(stationId).trim() !== "") {
    params.set("station_id", String(stationId));
  }
  if (djId != null && String(djId).trim() !== "") {
    params.set("dj_id", String(djId));
  }
  params.set("page_id", String(pageId));
  if (sortBy) params.set("sortBy", String(sortBy));
  if (searchInput != null && String(searchInput).trim() !== "") {
    params.set("search_input", String(searchInput));
  }
  const pathWithQuery = `${basePath}?${params.toString()}`;

  const json = await request(pathWithQuery, {
    method: "GET",
    caching: 60 * 60,
  });

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
      counts_live_streams: item.counts_live_streams ?? item.count_live_streams ?? 0,
      last_played_at: item.last_played_at ?? null,
      _raw: item,
    };
  });

  return { items, meta };
}
