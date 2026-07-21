# 11 — Implementation Status: What's Built vs. Documented

> Status: CODE-GROUNDED — every claim here traces to the Helm source read on 2026-07-11
> (`sources/helm-codebase-findings.md`, with file:line). This is the one file in the set that
> describes the code as it *is*, not the business as it *should* run. [confirm] tags here are
> **developer/Jack questions about intent**, not unverified facts. Where this file and a
> business-context file (00–10) disagree, the disagreement is the point: 00–10 are the target,
> this file is the current state.

## 1. Purpose

Files 00–10 describe how the business operates and how Helm is *intended* to serve it —
the lifecycle, the systems of record, the audit rules, the personas. They were written from
the app tour, the Podio API tour, and Jack's decisions, **never from the code**. This file is
the companion that records what is **actually implemented** today, so a developer can tell at a
glance what exists, what is aspirational, and what is quietly broken.

Rule of thumb for reading the set: **00–10 = intended operation; 11 = current implementation.**
When a business-context file says Helm "does" something, check here before relying on it — several
capabilities the docs describe (write-back, RBAC, findings persistence, cycle-time rules, KPI
trends) are not built. See `sources/helm-codebase-findings.md` for the raw file:line evidence
behind every line below.

## 2. Stack reality

Per Helm codebase read 2026-07-11. Confirms most of the company portal tech standard
(00-README.md §Tech-stack), with three corrections the README gets wrong.

- **Backend:** NestJS 11, one process. All data access is **hand-written SQL over a `pg` pool
  — there is no ORM and no migrations in the repo.** `libs/shared/src/entities/index.ts` is an
  empty `export {}`; the README's "TypeORM entities" claim is false. The schema is created by an
  **external Python project (`hub_sync`)** plus a Buildertrend SQL script; the app itself only
  creates `hub.pipeline_state`, `hub.session`, `hub.users`.
- **Database:** Postgres, four schemas — `appfolio.*` / `podio.*` / `buildertrend.*` (raw) +
  `hub.*` (canonical spine).
- **Frontend:** React 19 + Vite + Redux Toolkit, served as a built SPA by the same NestJS process.
- **Auth:** **session-based** (`express-session` + Postgres store), **NOT JWT.** The README's
  "JWT authentication" and "RBAC" claims are both false (`auth/strategies` + `auth/decorators`
  are empty placeholders). See §6.
- **Deploy:** single container at `helm.thedominiongroup.com` (VM `136.116.160.238`), a git
  submodule of `dfs-vm-dockers`, behind **Traefik**; the app listens on `$PORT` (default 8080,
  `main.ts:97`) mapped to the container's **:3017** in the deploy config
  (`bitbucket-pipelines.yml:17`). Built + pushed via Bitbucket Pipelines.
- **Scheduler:** **passive — no in-repo cron.** An external cron must `POST /scheduler/tick`
  every minute; the incremental pipeline fires at 02:00 UTC and the phase snapshot at 03:00 UTC
  (catch-up-if-missed). **If the external cron is lost on a redeploy, ingestion silently stops**
  with no alert.

## 3. What's built (the inventory-management goal)

This is goal #1 from 00-README.md, and it is the one that is largely real. Each item works, with
the caveats noted.

- **Property registry / spine.** `hub.property` (AppFolio-sourced) is the canonical spine; its
  serial PK is the cross-system join key. The **"#P0551" ids are display formatting** of that PK
  (zero-padded to 4 digits) — **not a separate registry table** and not a matched cross-system id.
  "1,073 total" = count of `hub.property` with non-null `street1`; rows with `street1 IS NULL` are
  silently excluded everywhere. See 02-property-lifecycle.md, 08-glossary.md.
- **12-phase derivation.** `apps/backend/src/modules/phase/phase.service.ts`, a first-match-wins
  priority list (`PH-Z→PH-X→PH-9→PH-8→PH-7→PH-6→PH-5→PH-3→PH-2→PH-1→PH-4→UNKNOWN`). Works, with
  three structural caveats the swimlane UI hides:
  - **PH-10 is unreachable** — no code path returns it; its count is structurally zero forever
    (it exists only in the type union, `PHASE_NAMES`, and a UI column).
  - **PH-9 is wired but masked** — it fires on notice `unit_status`, but `sync_unit`'s status
    dedupe and `sync_case_podio`'s overwrite mean notice states rarely survive to derivation.
  - **"Handed Off - Rental" does NOT drive the live phase** — a Handed-Off property lands in the
    PH-3 catch-all; the string only produces a PH-4 card in the retrospective journey. (See
    02-property-lifecycle.md §5, which now supersedes the earlier Podio-API-tour "resolved" note.)
  - Renovation's 43-value vocabulary is ingested verbatim but derivation reads almost none of it
    (write-off list → PH-Z, `/complete/i` to exit PH-3; everything else → PH-3). The granularity
    is in the data, not in the derivation.
- **Audit engine — 9 rules, not 7.** `apps/backend/src/modules/phase/audit/rules/`, registered in
  `audit.service.ts:24-34`. D1, D5, D7, D9, D11, D14, D17, D18, D20 — the tour showed 7 firing;
  **D5 and D9 also exist.** Findings are **ephemeral**: every `/audit/discrepancies` call re-runs
  all 9 rules' SQL live, stores nothing, and stamps `detected_at` = request time
  (`audit.service.ts:39-102`). See 06-audit-rules.md for the full catalog + §4/§5 below.
- **Compliance page.** Client-side compliance score `(total − distinct props with a D17/D18
  finding) / total × 100`; D17/D18 are shown here and **hard-excluded from the Audit Findings page**
  (`AuditPage.tsx:44,55`). Score is structurally inflated (see §5).
- **Avg Lease Time KPI (62.6d / 1,902 leases).** Real live query — `move_in_date −
  COALESCE(vacant_unit.marketing_start_date, intake_date)`, all-time, 0–365d outlier filter, per
  (occupancy, tenant) so co-tenants double-count. See 04-cycle-time-model.md.
- **Nightly phase snapshot.** `hub.property_phase_history` (open/close intervals, `days_in_phase`)
  populated by the 03:00 job. A ready substrate for cycle-time analytics — but nothing aggregates it
  yet (§4).
- **Embedded Gemini LangChain SQL agent** (`modules/agent`) — answers NL questions over the hub
  schema (SELECT/WITH-only guard) — and an **`/mcp` endpoint.** Both are powerful and both have auth
  gaps (§6).

## 4. What's NOT built (documented but aspirational)

These are described in 00–07 as goals or proposals. None exist in code today. Do not build hard
logic assuming they do.

- **Workflow / task management** (goal #2). Helm observes phases; there are no tasks, queues,
  assignments, or work-routing. See 07-users-roles.md.
- **Cycle-time / T-rules & aging** (goal #3, 04-cycle-time-model.md). No T-rule namespace, no aging
  buckets, no per-phase aggregation. The `hub.property_phase_history` substrate exists but nothing
  reads it for analytics; `hub.cases.is_stale` / `days_in_stage` are **dead write-once columns**
  (always false/0) — stage-aging was scaffolded, never built.
- **Findings persistence / dismiss / snooze / resolve / acknowledge / history / age-gating.**
  None of it exists — findings are recomputed live every read (§3). **Trend or aging analysis of
  findings is impossible today.** The "423 findings"-style figures are point-in-time query results,
  not a stored backlog.
- **Write-back to any platform.** **Everything is read-only inbound.** No write path to Podio,
  AppFolio, or Buildertrend exists (Podio calls are OAuth + read-query only; AppFolio is report
  reads; BT only navigates/downloads). **This is the hard prerequisite the Podio-retirement roadmap
  (05-data-sync-map.md §5, goal #4) depends on and does not have.**
- **RBAC.** The README claims it; the `roles` column is never read for access control (§6).
- **Month-over-month KPI trends.** Every dashboard trend chip ("↑ 12% from last month", "↓ 2d") is
  a **hardcoded decoration** — no period-over-period computation exists. "Target 98%" on the
  compliance card is likewise a hardcoded string.

## 5. Known defects & dead code

Confirmed by the codebase read; carry-overs into feature work.

- **D20 rent-drift is under-gated.** (a) **No turnover gating in code** — the doc set's "D20 is
  turnover-aware" was wrong; it only survives Podio's turnover-clears-rent behavior incidentally
  (empty field → NULL → `current_rent IS NOT NULL` drops the row). If Podio ever set rent to 0
  instead of clearing, D20 would false-fire. (b) **Multifamily cross-join** fans out on multi-unit
  properties despite a `unit_id` column being available. (c) No `podio_property_xref` fallback
  (D11/D17/D18 have one). `d20-rent-drift.rule.ts:33-51`. See 06-audit-rules.md.
- **PH-10 unreachable / PH-9 masked** — structural, not a data gap (§3).
- **Dead phase engine.** `src/lib/phase.service.ts` is a divergent copy imported by nothing; the
  live engine is `modules/phase/phase.service.ts`. The dead copy's header comment even lists a
  *different* priority order — a trap for anyone who edits the wrong file.
- **Dead stage-aging columns.** `hub.cases.is_stale` / `days_in_stage` (§4).
- **Four divergent address normalizers** in the repo (a normalization bug once "wiped property_id
  every night" — the reason `hub.podio_property_xref` is set-once-and-frozen). A **Maryland-only
  city list** is hardcoded in the Podio matcher, so out-of-state matching degrades silently.
- **Hardcoded flags.** `is_affordable_housing` / `is_student_housing` are written `false` on every
  sync.
- **Externally-populated fields.** `cluster_key` and one `bt_job.podio_renovation_id` path are
  populated by an **external "Gemini matcher," not this repo** — they will be empty if that tooling
  isn't run.
- **No server-side cache.** The dashboard derives everything live per request —
  `/audit/discrepancies` re-runs all 9 rules on every dashboard load (O(rules × property scan)).
  The nightly snapshot is not used to serve the dashboard.
- **BIGINT → JS Number coercion** globally (unsafe above 2^53).
- **Compliance score inflated** — denominator = sum of ALL phase counts incl. PH-X/PH-Z/UNKNOWN,
  which can never trigger D17/D18. D18 card copy says "60 days" but the rule is **30**
  (`d18-…:35-51`). Stale API doc string says "D1 through D18" though D20 runs (`phase.controller.ts:178`).
- **Vocabulary fragility.** All status vocabularies are hardcoded in TS/SQL — a Podio field/status
  rename **silently degrades** phases and findings with no error (the multi-spelling
  `['Write Off','Write-Off','Write off']` list shows they've been bitten once).

## 6. Security posture — surfaced to Jack 2026-07-11, needs action

**This is the section that needs a decision.** The full auth/security reality lives here; 07-users-roles.md
summarizes it and points here. Ranked by severity + exploitability, each with a one-line remediation.
All per Helm codebase read 2026-07-11.

1. **[CRITICAL — rotate today] Plaintext Buildertrend credentials committed to git.** A real
   password for `abdulm@thedominiongroup.com` is hardcoded in the Buildertrend Playwright specs
   (6 spec files under `apps/backend/scrapers/buildertrend/`) and is in git history. Context (per Jack
   2026-07-12): `abdulm@` is **Abdul Mannan, the Forward Deployed Engineer who built Helm** — i.e. the
   scraper runs under the *developer's own* Buildertrend + `thedominiongroup.com` login, which also has
   President-level AppFolio access. So this is a build-hygiene lapse, not an unknown-account breach —
   but it's still CRITICAL because a personal, broadly-privileged credential sits in git history.
   → *Stand up a **dedicated, least-privilege Buildertrend service account** for the scraper (not the
   FDE's personal login); move creds to `BT_EMAIL`/`BT_PASSWORD` env (the intended mechanism); rotate
   Abdul's exposed password; strip from specs and purge from git history.*
2. **[HIGH] Entire PhaseController is intentionally unauthenticated** — "AuthGuard intentionally
   omitted for public read-only endpoints" (`phase.controller.ts:16`). This exposes all
   property/phase/enrichment/audit data and CSV exports **and a mutating `POST /phase/snapshot`**
   (`phase.controller.ts:159`) to any anonymous caller. The `/mcp` guard is comment-claimed but not
   wired.
   → *Add `AuthGuard` to the controller (at minimum the mutating snapshot + bulk-data/CSV routes);
   wire the `/mcp` guard.*
3. **[HIGH] AuthGuard fails open.** If `SYNC_SECRET` is unset, `canActivate` returns `true`
   (`auth.guard.ts:24-27`). `build-env.sh` silently substitutes the `.env.example` placeholder if the
   Bitbucket variable is missing at deploy — so a config slip disables auth on the 5 guarded
   controllers.
   → *Fail closed when the secret is unset; fail the build if the secret equals the placeholder.*
4. **[HIGH] SYNC_SECRET is dual-use** — it is both the HTTP bearer token for crons **and** the
   session-signing secret. A holder of the cron token can forge session cookies.
   → *Split into two independent secrets.*
5. **[HIGH] Open self-registration + privilege self-assignment.** `POST /auth/signup` has no guard,
   invite, email verification, **domain restriction, or password policy** (1-char passwords pass).
   `signUp()` accepts a client-supplied `roles: string[]` and writes it verbatim to `hub.users.roles`
   (`auth.service.ts:47-53`) — a stranger can self-assign any role. Anyone reachable gets a session
   and can then hit the 5 guarded controllers, **including triggering full ingests and querying the
   Gemini SQL agent over the entire DB.**
   → *Gate signup (invite or domain allowlist), drop `roles` from the DTO, add a password policy.*
6. **[HIGH] No RBAC despite the README's claim.** The `roles` column is never read; authorization is
   binary (valid session OR `Bearer <SYNC_SECRET>`). So every self-registered user is effectively an
   admin over the 5 guarded controllers.
   → *Implement role checks, or restrict ingest/agent/sync to service tokens only.*
7. **[MEDIUM] Public Swagger + permissive CORS.** `/docs` is unauthenticated (`main.ts:95`);
   `enableCors({ origin: true, credentials: true })` reflects any origin (`main.ts:41-42`).
   → *Gate `/docs` in prod; pin CORS to an origin allowlist.*
8. **[MEDIUM] No user-action audit log.** The only "audit" feature is the D-rule engine (unrelated);
   there is no record of who signed in, triggered an ingest, or ran the SQL agent.
   → *Log authn + mutating/sensitive requests.*
9. **[LOW / misleading UI] Fake account controls.** "Admin · Dominion" is a hardcoded string shown to
   every user (next to hardcoded "Abdul" / `abdulm@thedominiongroup.com` fallbacks). The Update
   Password form only `alert()`s success with no API call; "Forgot your password?" is a dead link;
   there is no server-side password change/reset.
   → *Build real account management or remove the controls that imply it exists.*

**Deploy hygiene (separate from app auth):**

- **Broad `sudo chown -R` on the deploy checkout** — including `sudo chown -R bitbucket-pipeline .`
  (`bitbucket-pipelines.yml:51-56`). This is the exact pattern behind the bmorelicense deploy outage
  (see MEMORY "Infra change → deploy audit"): any chmod/ownership change on a deploy-touched path
  needs a same-commit pipeline audit.
- **Stale `docker-compose.yml`** — references missing Dockerfiles, a default `postgres` password, and
  wrong ports. It is **not the prod path** (prod is the `dfs-vm-dockers` submodule), but it is a
  footgun for anyone who runs it.
- **Absent `scripts/log-forwarder.cjs`** — the prod `CMD` pipes through it, but it is not in this
  repo. It must come from the parent submodule or the container is broken.

## 7. [confirm] rollup

Developer + Jack questions raised by the reconciliation. One question each.

1. [confirm: is **read-only-inbound** intentional for this phase — i.e. is the Podio-retirement
   write-back (05-data-sync-map.md §5, goal #4) deliberately deferred, or was it assumed already
   partly built?]
2. [confirm: is the **security posture in §6 known and accepted as interim**, or should any item be
   treated as a stop-ship? (The BT credential rotation in §6.1 is urgent regardless.)]
3. [confirm: **who owns rotating the Buildertrend credentials** and purging them from git history —
   and can the `abdulm@` scraper account be scoped down / dedicated?]
4. [confirm: should Helm's **public read-only PhaseController stay public** (a deliberate product
   choice for an internal-network app), or be moved behind auth? This decides whether §6.2 is a bug
   or a config.]
5. [confirm: is the **passive external-cron scheduler** (§2 — ingestion stops silently if the cron is
   lost on redeploy) acceptable, or should the container run its own cron / emit a heartbeat alert?]
6. [confirm: should the **hardcoded KPI trend chips** (§4) be removed until real month-over-month
   computation exists, since they currently display invented numbers to users?]

---

*Cross-references: 00-README.md (doc-set map + tech-stack note), 02-property-lifecycle.md
(phase derivation), 03-systems-of-record.md (ingestion mechanics), 04-cycle-time-model.md
(KPIs + unbuilt T-rules), 05-data-sync-map.md (write-back prerequisite), 06-audit-rules.md
(9-rule catalog), 07-users-roles.md (auth summary → this file for detail),
10-common-data-map.md (candidate rules). Raw evidence: `sources/helm-codebase-findings.md`.*
