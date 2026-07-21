# Helm Codebase Findings — Ground Truth (repo read, 2026-07-11)

Captured by reading the Helm source at `git@bitbucket.org:dominionfinancial/dominion_helm_properties.git` (cloned to `~/Documents/Projects/dominion_helm_properties`), 2026-07-11. NestJS + React monorepo (`apps/backend`, `apps/frontend`, `libs/shared`), raw SQL (no ORM), 4 Postgres schemas (`appfolio.*` / `podio.*` / `buildertrend.*` raw + `hub.*` canonical). This file is SOURCE material for the doc set — verbatim code behavior with file:line citations. **Where the business-context files disagree with this file about what the code does, this file wins on implementation facts.**

## 1. Audit rules — 9, not 7

All in `apps/backend/src/modules/phase/audit/rules/`, registered in `audit.service.ts:24-34`, all enabled (no enable/disable flag; removal from the array is the only "off"). The tour showed 7 firing; **D5 and D9 also exist.**

| Rule | Sev | Exact logic (code) |
|---|---|---|
| D1 | HIGH | `podio_closing.status ILIKE '%closed%'` + closing within 2y + `property.is_active`, NO matching `bt_job` (FK or street/job-name match). `d1-closing-no-bt-job.rule.ts:25-40` |
| **D5** | MED | `podio_renovation.phase IN ('Write Off','Parked','Write-Off','Write off') OR category='Parked'` WHILE `property.is_active=true`. `d5-write-off-still-active.rule.ts:27-35` |
| D7 | MED | AppFolio `occupancy.status='current'` + move_in vs `podio_vacant_unit.status NOT ILIKE '%contract%executed%'`, intake within move_in −180/+30d, DISTINCT ON unit, LIMIT 200. `d7-…:37-57` |
| **D9** | HIGH | `unit_status.code IN ('vacant_unrented','vacant_rented')` + `CURRENT_DATE − date_vacant > 14`, minus 3 NOT-EXISTS turnover exclusions. `d9-vacant-no-turnover.rule.ts:27-57` |
| D11 | LOW | `podio_vacant_unit.type` (label "Owner") vs `podio_property_compliance.owner_name`, case/LLC-suffix normalized, placeholder owners excluded, LIMIT 200. **Podio-internal only — AppFolio owner comparison EXPLICITLY DEFERRED (no parent/child entity-hierarchy table).** `d11-owner-mismatch.rule.ts:5-66` |
| D14 | HIGH | AppFolio `application.approved_at` set, not denied/cancelled, >24h & <90d old, unit not occupied, NO active `podio_vacant_unit`. `d14-…:38-63` |
| D17 | HIGH | `podio_property_compliance.rental_license_expiration_date − CURRENT_DATE < 30`, active props, xref fallback. `d17-license-expired.rule.ts:31-47` |
| D18 | HIGH | `podio_lead_paint_compliance.llf_expiration_date − CURRENT_DATE < 30`, `mde_certificate_number NOT NULL`, DISTINCT ON MDE cert #. `d18-…:35-51` |
| D20 | LOW | AppFolio `unit.market_rent` vs `podio_property_compliance.current_rent`, `ABS(gap) > $50`, **Market-program only**. `d20-rent-drift.rule.ts:33-51` |

**Numbering gaps D2/D3/D4/D6/D8/D10/D12/D13/D15/D16/D19 were NEVER implemented** — no code, comments, or deleted files in git history. (Good news for `10-common-data-map.md`: the D-numbers it proposes to reuse are genuinely free.)

**D20 defects (code):** (a) NO turnover gating — the doc set claimed D20 was turnover-aware; the code has none. It only survives Podio's turnover-clears-rent behavior incidentally, because `fldMoney` returns NULL for an empty field and `current_rent IS NOT NULL` drops the row; if Podio ever set rent to 0 instead of clearing, D20 would false-fire. (b) unit×compliance cross-join fans out on multifamily even though a `unit_id` column exists. (c) no `podio_property_xref` fallback (D11/D17/D18 have it).

**Findings are NOT persisted.** Every `/audit/discrepancies` call re-runs all 9 rules' SQL live; nothing is stored; `detected_at` = request timestamp ("when you asked", not "when it first appeared"). NO dismiss / snooze / resolve / acknowledge, NO age-gating infrastructure, NO finding history. Trend/aging analysis of findings is currently impossible. `audit.service.ts:39-102`, `phase.controller.ts:174-250`.

**D17/D18 are hard-excluded from the Audit Findings page** (`AuditPage.tsx:44,55`) and shown only on the separate Compliance page — so "Audit Findings" under-reports vs `GET /audit/discrepancies`. Stale API doc string says "D1 through D18" though D20 runs (`phase.controller.ts:178`). No T-rules or non-D prefixes exist; the rule id is a free-form string.

## 2. Phase derivation — the real behavior

Live engine: `apps/backend/src/modules/phase/phase.service.ts` (a divergent DEAD copy at `src/lib/phase.service.ts` is imported by nothing). `gatherAllFacts()` builds one facts row per property from hub; `derivePhase()` is a **first-match-wins priority list**, real order:

`PH-Z → PH-X → PH-9 → PH-8 → PH-7 → PH-6 → PH-5 → PH-3 → PH-2 → PH-1 → PH-4 → UNKNOWN`

(Note PH-4 is evaluated LAST as a near-catch-all: `is_active AND total_units>0`. The type-header comment claiming `…PH-5→PH-4→PH-3→PH-2→PH-1` does NOT match the code.)

**Major correction — "Handed Off - Rental" does NOT drive the live phase.** `derivePhase()` never matches it. A property whose `renovation.phase='Handed Off - Rental'` fails the `/complete/i` test and falls into the **PH-3 catch-all** unless an AppFolio unit/occupancy rule fires first. "Handed Off - Rental" is honored only by (a) the property-detail **history/journey** deriver (`deriveHistoryFromDates`, regex `/^Handed Off/i` → a PH-4 journey card) and (b) D9's exclusion list. So the doc-set claim that it is "the Podio-side driver of the PH-3→PH-4 transition" is true only for the retrospective journey, NOT the current-phase number.

**Renovation's 43-value vocabulary is ingested verbatim but derivation reads almost none of it.** Only the exact write-off list `['Write Off','Parked','Write-Off','Write off']` → PH-Z, and `/complete/i` to exit PH-3. Everything else buckets to PH-3. So "Helm could clock every construction stage" (09 finding) is data-available but NOT implemented — derivation is far coarser than the vocabulary.

**PH-10 is unreachable — no code path returns it.** It exists only in the type union, `PHASE_NAMES`, and a UI swimlane column. Its count is structurally zero forever. **PH-9 IS wired** (fires on `unit_status.code IN ('notice_unrented','notice_rented')`) but is masked in practice: (a) `sync_unit`'s STATUS_PRIORITY dedupe discards a notice rent_roll row when any 'current' row exists for the unit; (b) `sync_case_podio` runs after `sync_unit` and overwrites unit_status from the Vacant Units board (which has essentially no 'notice' states). So both notice phases rarely surface.

**Sched Vacants is confirmed unread.** Zero references to Sched Vacants or app 19831048 anywhere in the repo. The only Occupancy tables projected to hub are `vacant_units` and `applications`. The raw org-wide crawl MAY land Sched Vacants in a `podio.items__*` table if the DB manifest allows it, but no sync/projection/phase rule reads it — so it cannot influence PH-9/PH-10 today. (This is why the PH-9 "notice" look-ahead the phase model hopes for isn't populated.)

**Provenance mislabel:** code comments/evidence attribute `lifecycle_stage='disposed'` (the PH-X input) to "AppFolio lifecycle," but it is actually written by `sync_compliance` from the **Podio** compliance boards' `property-status` field. AppFolio supplies only `is_active` (visibility) and management dates.

**UNKNOWN:** falls through all 11 rules — in practice an inactive AppFolio property with zero units, no Podio overlays, no management_start_date. Properties with `street1 IS NULL` are silently excluded from all lists/counts/snapshots.

**"Driver" strings** are `sub_state` literals minted by the deriver (e.g. `contract_executed`, `move_in`, `closed`, `occupied`, `closed_no_bt`, `ready_no_activity`) plus pass-through raw source statuses — there is no formal event system. The tour-observed evidence-card strings ("Closed", "Handed Off - Rental", "contract executed", "contract_signed", "move_in", "occupied") come from these two sources (live sub_state + history deriver).

## 3. Ingestion & scheduling — the real mechanics

- **Podio:** REST API, OAuth2 **password grant** (`PODIO_USERNAME`/`PASSWORD`/`CLIENT_ID`/`SECRET`), **org-wide crawl** (enumerate every space→app→items), NOT app-by-app by hardcoded id. App→table routing is a **DB manifest** (`podio.podio_app WHERE has_items_export=true`); unmanifested apps are fetched then silently skipped at load. **No webhooks — pure pull.** (Reconcile with `09` §4.7: the `item.create` webhooks seen via the API tour are real but belong to **GlobiFlow**, Podio-side automation — Helm's *ingestion* does not use them.) Incremental filter `last_edit_on >= last_run`, 400-fallback to unfiltered. 21 `items__*` source tables are hardcoded in the projections.
- **AppFolio:** Reports API v2, HTTP Basic auth, catalog of **118 report endpoints**, TRUNCATE-and-reload per report. No modified-since filter → incremental re-fetches from `last_run − 3 months`, so raw `appfolio.*` tables keep only ~3 months of history; long-term history survives only in `hub.*` projections.
- **Buildertrend:** **NOT manual downloads.** Headless **Playwright scrapers** (`apps/backend/scrapers/buildertrend/`) log into the BT web portal with `BT_EMAIL`/`BT_PASSWORD` and click through to download CSV/XLSX. 5 specs run sequentially; the bids scraper (`example.spec.js`) takes ~6 hours (one XLSX per ~1000 jobs). Files land in `BT_OUTPUT_DIR`; SheetJS parses → `buildertrend.*` → `hub.bt_*`. (Jack's "manual downloads triggerable by a workflow" was the intended model; the implementation is browser automation. Functionally: credential-based, delayed, no API — matches Jack's tolerance.)
- **No QuickBooks / BNA integration** anywhere. The only three sources are AppFolio, Podio, Buildertrend. BNA/QuickBooks remain external downstream consumers Helm does not touch.
- **Everything is READ-ONLY inbound.** No write-back to any platform (Podio POSTs are only OAuth + the read-query `/item/app/{id}/filter/`; AppFolio only report reads; BT only navigates/downloads). All writes go to internal Postgres. **This matters for the Podio-retirement roadmap (`05` §5): the write-back Stages 2–3 depend on does not exist yet.** Remediation is manual by design (rules literally instruct a human).
- **Scheduler is passive:** no in-repo cron. An external cron must POST `/scheduler/tick` every minute; jobs fire the incremental pipeline at 02:00 UTC and the phase snapshot at 03:00 UTC (catch-up-if-missed). If the external cron is lost on redeploy, ingestion silently stops. Combined Podio crawl (1–4h) + BT bids scrape (~6h) means the "02:00 incremental" can run most of a working day.
- **Vocabulary fragility:** all status vocabularies are hardcoded in TS/SQL, no config table. A Podio status/field rename silently degrades phases and audit findings (no error) — the multi-spelling `['Write Off','Write-Off','Write off']` list suggests they've been bitten once.

## 4. Data model & matching

- **No ORM, no migrations in the repo** — `libs/shared/src/entities/index.ts` is an empty `export {}` (README's "TypeORM entities" is wrong). Schema is created by an external Python project (`hub_sync`) + a Buildertrend SQL script; the app only creates `hub.pipeline_state`, `hub.session`, `hub.users`. All data access is hand-written SQL via a `pg` pool.
- **"#P0551"-style ids are NOT a registry** — they are `hub.property.id` (serial PK) zero-padded to 4 digits, purely frontend display. There is no separate registry table; `hub.property` IS the spine and its PK is the cross-system join key.
- **Matching** is deterministic exact-key-after-normalization with ambiguity-drop — **NO confidence scoring**. AppFolio numeric ids are canonical; `hub.podio_property_xref` is a **set-once-and-frozen** link registry (born from a production incident where "a single normalization bug wiped property_id every night"); FK preservation via COALESCE + a 25%-max stale-delete guard. There are **4 divergent address normalizers** in the repo. A Maryland-only city list is hardcoded in the Podio matcher. `cluster_key` and one `bt_job.podio_renovation_id` path are populated by EXTERNAL tooling (a "Gemini matcher"), not this repo.
- **Owner LLC:** canonical `hub.owner`/`hub.party` (company sniffed by keyword) + plain-text Podio shadows (`vacant_unit.type`, `property_compliance.owner_name`, `lead_paint.property_owner`, `mde_owner_tracking.registered_owner`). **No entity-hierarchy / alias table** — confirms the D11 defer and the D12 prerequisite in `10`.
- **Multifamily:** one `hub.property` per building, one `hub.unit` per unit; phase + audit are **property-level** (unit facts aggregated), so a multifamily building gets one phase and property-vs-unit rules (D20) fan out.
- **Source-presence dots:** AppFolio dot is ALWAYS on (hub.property is AppFolio-sourced → no information). Podio dot lights only from `closing`/`renovation`/`vacant_unit` — a property known to Podio only via compliance/inspection/water-bill boards shows NO Podio dot (under-reports). Buildertrend dot from `bt_job`.
- Misc: `is_affordable_housing`/`is_student_housing` hardcoded false every sync; BIGINT globally coerced to JS Number (unsafe >2^53); an embedded **Gemini-2.5-flash LangChain SQL agent** (`modules/agent`) answers NL questions over the hub schema (SELECT/WITH-only guard).

## 5. KPIs & dashboard

- **Avg Lease Time (62.6d):** `days = AppFolio occupancy.move_in_date − COALESCE(vacant_unit.marketing_start_date, intake_date)` (most-recent such Podio date ≤ move-in). Population = **every** `hub.occupancy` row with a move_in (any status), **ALL-TIME, no window**, outlier filter `0–365 days`. "1,902 matched leases" = surviving row count — but rows are per (occupancy, tenant), so **co-tenants double-count**; the `property_id` fallback lets one unit borrow another unit's marketing date. "Matched" = an inner LATERAL join to a qualifying Vacant Unit record; unmatched occupancies silently drop. The "↓ 2d" trend is a **hardcoded string**.
- **Compliance score (94.5% vs "Target 98%"):** client-side. `(totalProperties − distinct props with a D17/D18 finding) / totalProperties × 100`. Denominator = **sum of ALL phase counts incl. PH-X/PH-Z/UNKNOWN**, which can never trigger D17/D18 → structurally **inflated**. "Target 98%" is a hardcoded string; D18 card copy says "60 days" but the rule is 30.
- **All dashboard trend chips are hardcoded decorations** ("↑ 12% Increased from last month", "↓ 2d", etc.) — no month-over-month computation exists.
- **Counts:** "1,073 total" = count of `hub.property` with non-null `street1`; derived **live on every request, no server-side cache** (`/audit/discrepancies` re-runs all 9 rules per dashboard load). The nightly `hub.property_phase_history` snapshot is NOT read by the dashboard.
- **Cycle-time infra that exists:** the lease-time KPI; `days_in_phase` from snapshot intervals; the nightly phase-history table (a ready substrate for future per-phase analytics, nothing aggregates it yet); per-rule time windows (D9's 14d, D17/D18's 30d). `hub.cases.is_stale`/`days_in_stage` are **dead write-once columns** (always false/0) — stage-aging was scaffolded, never built.

## 6. Auth & security posture — SERIOUS

- **Session-based** (`express-session` + Postgres store), NOT JWT. `README` claims "JWT authentication" and "Role-based access control (RBAC)" — **both false**; `auth/strategies` and `auth/decorators` are empty placeholders.
- **Open self-registration:** `POST /auth/signup` has no guard, no invite, no email verification, **no domain restriction**, no password policy (1-char passwords pass). Anyone reachable can create an account and is immediately given a session.
- **Privilege self-assignment:** `SignUpDto` accepts an optional client-supplied `roles: string[]` written verbatim to `hub.users.roles` — a self-registering stranger can self-assign any role. (Moot today only because nothing reads roles.)
- **No RBAC at all:** the `roles` column is never read for access control. Authorization is binary (session OR `Authorization: Bearer <SYNC_SECRET>`), applied to only 5 controllers (pipeline, ingest, scheduler, agent, sync) — so any self-registered user can trigger full ingests and query the LangChain SQL agent over the whole DB.
- **The entire PhaseController is intentionally unauthenticated** ("AuthGuard intentionally omitted for public read-only endpoints") — all property/phase/enrichment/audit data, CSV exports, AND a **mutating** `POST /phase/snapshot`. The `/mcp` endpoint's guard is commented-claimed but not wired.
- **AuthGuard FAILS OPEN** if `SYNC_SECRET` is unset (returns true). `SYNC_SECRET` is **dual-use** — HTTP bearer token AND the session-signing secret — so the cron token can forge session cookies. `build-env.sh` silently substitutes the `.env.example` placeholder if the Bitbucket variable is missing at deploy.
- **Plaintext Buildertrend credentials committed** in every Playwright spec (`abdulm@thedominiongroup.com` / a real password, 6 files). **Rotate and strip.**
- Public Swagger at `/docs`; `enableCors({origin:true, credentials:true})`. No user-action audit log of any kind (the "audit" feature is the D-rule engine, unrelated).
- **Deploy:** one container at `helm.thedominiongroup.com` (VM `136.116.160.238`), git submodule of `dfs-vm-dockers`, behind Traefik, NestJS serves the built SPA on `:3017`. Deploy SSH step does a broad `sudo chown -R` of the checkout — the pattern flagged in the bmorelicense outage memory. The repo's `docker-compose.yml` is stale/broken (references missing Dockerfiles, default `postgres` password, wrong ports) — not the prod path. Prod `CMD` pipes through `scripts/log-forwarder.cjs`, which is absent from this repo (must come from the parent submodule or the container is broken).

"Admin · Dominion" (observed on tour) is a **hardcoded UI string** shown to every user, next to hardcoded fallbacks "Abdul" / `abdulm@thedominiongroup.com`. The Update Password form just `alert()`s success with no API call; "Forgot your password?" is a dead link. No password change/reset exists server-side.
