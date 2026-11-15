"use client";

import React, { useEffect, useState, useCallback } from "react";
import { getSongs, getDJs } from "@/network/actions-api";

const REFRESH_MS = 30 * 60 * 1000;

function isHipHopRnB(genre = "") {
  const g = genre.toLowerCase();
  return g.includes("hip-hop") || g.includes("hip hop") || g.includes("rap") || g.includes("r&b") || g.includes("rnb") || g.includes("trap");
}

function isSouthernSoul(genre = "") {
  const g = genre.toLowerCase();
  return g.includes("southern soul") || (g.includes("soul") && !g.includes("r&b"));
}

function mergeDjName(name = "") {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

export default function ReportsDashboard() {
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [topSongs, setTopSongs] = useState([]);
  const [topDjs, setTopDjs] = useState([]);
  const [hipHop, setHipHop] = useState([]);
  const [soul, setSoul] = useState([]);
  const [recentDjs, setRecentDjs] = useState([]);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const djs = await getDJs();
      const songMap = new Map();
      const djTotals = [];
      const recent = [];

      await Promise.all(
        (djs || []).map(async (dj) => {
          try {
            const { items } = await getSongs("", 1, "lastPlayedDecrease", null, dj.value);
            let liveTotal = 0;
            let latest = 0;
            for (const it of items || []) {
              const live = Number(it.counts_live_streams || 0);
              if (live <= 0) continue;
              liveTotal += live;
              const ts = Number(it.last_played_at || 0);
              if (ts > latest) latest = ts;
              const key = `${(it.title || "").toLowerCase()}|${(it.artist || "").toLowerCase()}`;
              const prev = songMap.get(key) || {
                title: it.title || "Untitled",
                artist: it.artist || "",
                genre: it.genre || "",
                live: 0,
                djs: new Set(),
              };
              prev.live += live;
              prev.djs.add(dj.label);
              if (!prev.genre && it.genre) prev.genre = it.genre;
              songMap.set(key, prev);
            }
            if (liveTotal > 0) {
              djTotals.push({ name: dj.label, live: liveTotal, latest });
              if (latest) recent.push({ name: dj.label, latest, live: liveTotal });
            }
          } catch {
            /* skip one DJ if the feed errors */
          }
        })
      );

      const songs = [...songMap.values()]
        .map((s) => ({ ...s, djs: [...s.djs] }))
        .sort((a, b) => b.live - a.live);

      setTopSongs(songs.slice(0, 3));
      setTopDjs(
        djTotals
          .sort((a, b) => b.live - a.live)
          .slice(0, 2)
      );
      setRecentDjs(
        recent
          .sort((a, b) => b.latest - a.latest)
          .slice(0, 6)
      );
      setHipHop(songs.filter((s) => isHipHopRnB(s.genre)).slice(0, 5));
      setSoul(songs.filter((s) => isSouthernSoul(s.genre)).slice(0, 5));
      setUpdatedAt(new Date());
    } catch (e) {
      setError(e?.message || "Could not load live stats");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, REFRESH_MS);
    return () => clearInterval(id);
  }, [load]);

  const maxSong = topSongs[0]?.live || 1;

  return (
    <section className="mb-6 rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#1e4b8e]">Live desk</p>
          <h2 className="text-lg font-bold text-neutral-900">DJ streamer snapshot</h2>
        </div>
        <p className="text-xs text-neutral-500">
          {loading ? "Refreshing…" : updatedAt ? `Updated ${updatedAt.toLocaleTimeString()}` : ""}
          {" · refreshes every 30 min"}
        </p>
      </div>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">Top 3 live songs</p>
          {topSongs.length === 0 && <p className="text-sm text-neutral-500">No live spins yet.</p>}
          {topSongs.map((s) => (
            <div key={`${s.title}-${s.artist}`} className="mb-2">
              <div className="flex justify-between text-sm">
                <span className="truncate font-medium">{s.title}</span>
                <span className="ml-2 shrink-0 text-neutral-500">{s.live}</span>
              </div>
              <p className="truncate text-xs text-neutral-500">{s.artist}</p>
              <div className="mt-1 h-2 rounded-full bg-neutral-200">
                <div className="h-2 rounded-full bg-[#1e4b8e]" style={{ width: `${Math.max(8, (s.live / maxSong) * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">Top 2 live DJs</p>
          {topDjs.length === 0 && <p className="text-sm text-neutral-500">No live DJs yet.</p>}
          {topDjs.map((d, i) => (
            <div key={d.name} className="mb-2 flex items-center justify-between rounded-lg bg-white px-3 py-2">
              <span className="text-sm font-semibold">{i + 1}. {d.name}</span>
              <span className="text-sm text-[#1e4b8e]">{d.live} live spins</span>
            </div>
          ))}
          <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">Went live recently</p>
          {recentDjs.map((d) => (
            <p key={d.name} className="truncate text-sm text-neutral-700">
              {d.name}
              <span className="text-neutral-400"> · {d.live} spins</span>
            </p>
          ))}
        </div>

        <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">Charting by genre</p>
          <p className="text-xs font-semibold text-neutral-700">Hip-Hop / R&B</p>
          {hipHop.slice(0, 3).map((s, i) => (
            <p key={`hh-${s.title}`} className="truncate text-sm">{i + 1}. {s.title} <span className="text-neutral-400">({s.live})</span></p>
          ))}
          {!hipHop.length && <p className="text-sm text-neutral-500">No genre tags yet.</p>}
          <p className="mt-3 text-xs font-semibold text-neutral-700">Southern Soul</p>
          {soul.slice(0, 3).map((s, i) => (
            <p key={`ss-${s.title}`} className="truncate text-sm">{i + 1}. {s.title} <span className="text-neutral-400">({s.live})</span></p>
          ))}
          {!soul.length && <p className="text-sm text-neutral-500">No southern soul live tags yet.</p>}
        </div>
      </div>
    </section>
  );
}
