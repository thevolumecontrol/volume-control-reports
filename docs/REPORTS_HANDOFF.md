# Reports wiring handoff (restored)

Documented from the live Cloudflare + Xano setup that was wired on **2026-08-25** in this project. Local copies of this folder were lost when the sandbox reset; the production wiring is still in Cloudflare and Xano.

## What was wired Aug 25

```
AzuraCast nowplaying / history
        |
        v
Xano workspace 2 "Volume Control Reporting"
  api:CzX2YTxi   Actions   (stations/query, songs/query, stripe, support)
  api:dTYn0fDP   Auth
  api:HDAusNyO   Reports admin (private)
  api:uploads    Music uploads (added later)
        |
        v
Cloudflare Pages  volume-control-feed
  https://volume-control-feed.pages.dev
  created 2026-08-25 18:17 UTC
  last deploy 2026-08-25 21:55 UTC  (c4e13cfd)
        |
        v
Cloudflare Pages  volume-control-reports
  https://reports.thevolumecontrol.com
  GitHub: thevolumecontrol/volume-control-reports @ main
  last successful deploy 2026-08-25 18:19 UTC  (14f60a44)
  NEXT_PUBLIC_API_URL = https://volume-control-feed.pages.dev
```

## Env on volume-control-reports (production)

| Variable | Value |
|---|---|
| NEXT_PUBLIC_API_URL | https://volume-control-feed.pages.dev |
| NEXT_PUBLIC_ACTIONS_API_KEY | api:CzX2YTxi |
| NEXT_PUBLIC_AUTH_API_KEY | api:dTYn0fDP |
| NEXT_PUBLIC_REPORTS_API_KEY | api:HDAusNyO |
| NPM_CONFIG_LEGACY_PEER_DEPS | true |

Build: `npx @cloudflare/next-on-pages@1`  
Output: `.vercel/output/static`  
Account: `d7e4112972f0109df51b97a214b52c57` (Digitaldopetv@gmail.com)

## Frontend song call (baked into the Aug 25 JS)

`GET {API_URL}/{ACTIONS_API_KEY}/songs/query?page_id=1&sortBy=playCountDecrease`

Working today:

```
https://volume-control-feed.pages.dev/api:CzX2YTxi/songs/query?page_id=1&sortBy=playCountDecrease
https://xgwc-qwi9-r6ti.n7d.xano.io/api:CzX2YTxi/songs/query?page_id=1&sortBy=playCountDecrease
```

`sortBy` must be one of:

- playCountDecrease
- playCountIncrease
- lastPlayedDecrease
- lastPlayedIncrease

Empty `sortBy` returns `Unable to locate sort param`.

## Station list

`GET .../api:CzX2YTxi/stations/query` — 27 rows.

## What broke after it was working

1. VPS agent swarm (`~/volumecontrol-agents`) received **Shutdown** on **2026-08-23 03:03**. No cron. Port 8080 died. That is the process that writes live plays.
2. Restarted **2026-08-30 ~01:25 EDT**: orchestrator + dashboard. 25 stations updating. Cron added (`start_agents.sh` every 5 min if dead).
3. Xano per-station `last_played_at` still looks frozen at **May 26** on filtered queries. Unfiltered `songs/query` still returns play totals.
4. `api:azuracast-reports` stays 404 (unpublished May). Reports UI uses **CzX2YTxi**, not that group.

## Do not do

- Do not replace thevolumecontrol.com with the May 2025 `app.zip` prototype.
- Do not change NEXT_PUBLIC_* without a new Pages build (values are compiled into JS).
- Do not call songs/query without `sortBy=playCountDecrease`.

## VPS

- Host: vps35593.dreamhostps.com
- User: dh_4dtxks
- Agents: `/home/dh_4dtxks/volumecontrol-agents`
- Start: `bash /home/dh_4dtxks/volumecontrol-agents/start_agents.sh`
- Live JSON: http://vps35593.dreamhostps.com:8080/api/now_playing
