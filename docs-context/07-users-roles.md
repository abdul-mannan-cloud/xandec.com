# 07 — Users & Roles

> Status: DRAFT strawman — [confirm] items pending Jack's review.

Who will actually use Helm, what slice of the property lifecycle each person owns, which parts of the app they need, and what should be pushed to them versus pulled on demand. Phase numbers (PH-1..PH-Z) refer to the canonical lifecycle in `02-property-lifecycle.md`. Audit rule IDs (D1, D7, D11, D14, D17, D18, D20) refer to the catalog in `06-audit-rules.md`. Which system each persona keys data into is covered in `03-systems-of-record.md`.

A recurring theme below: what looked on the tour like a role — "Admin · Dominion" — is not one. Per Helm codebase read 2026-07-11 (findings §6) it is a hardcoded UI string rendered for every user, next to hardcoded "Abdul" / abdulm@thedominiongroup.com fallbacks; there is no role enforcement anywhere in the code (see the access-model section). The per-persona surfaces, alerts, and access tiers in this doc are a target model, not the current state — none of it is enforced today.

**What the push-alert layer replaces.** Podio already has a push-alert layer today, and it is the single largest class of automation in the org: roughly 120 of the ~276 GlobiFlow flows are per-person hardcoded notifications — one flow per person per event (per GlobiFlow UI tour 2026-07-09, `sources/podio-architecture.md` §6). On Vacant Units alone, 4 events × 13 staff ("notify Kenesha when RFTA is submitted", "notify Omar when contract is signed", …); Applications carries a parallel 17-name fan-out per application outcome (approved/cancelled/denied). Because the recipient is baked into each flow, staff churn today means editing flows one by one. This flow class is the concrete thing Helm's role-based push alerting replaces wholesale: the per-persona "Push (alerts)" sections below describe subscriptions attached to roles, not names.

---

## Persona summary

| Persona | Org | Lifecycle ownership | Primary Helm surfaces | Main audit/compliance interest |
|---|---|---|---|---|
| James Stewart | DP + DM | Oversight of PH-2 → PH-3 and the handoff into PH-4; PH-9 → PH-10 oversight; field ops portfolio-wide | Dashboard, property detail, audit queue | D1; construction-phase aging |
| Project Managers | DP | PH-3 (their jobs) | Property detail (their jobs), audit queue (scoped) | D1 |
| Craig Cuocci | DM | PH-9 (joint with Stephanie) → PH-10 (turns); inspections/maintenance during PH-8 | Property registry (turn queue view), property detail | D7 (notified; resolver per `06-audit-rules.md`); days-in-turn |
| Stephanie Derry | DM | PH-4 → PH-7 (leasing funnel); PH-8 revenue side; PH-9 (joint with Craig); compliance across all phases | Compliance queue, audit queue, property detail | D14, D7 (default resolver per `06-audit-rules.md`), D17, D18 |
| Victoria Robinson | DP | PH-1 → PH-2 (contract-to-close); PH-X (dispositions) | Property registry (pipeline view), audit queue | D11 (consulted; resolver per `06-audit-rules.md`); missing-closing-data findings |
| Brian Leibowitz | DP | PH-1 (sourcing/under contract) | Dashboard, property registry | Cycle-time feedback on acquisitions |
| Accounting (Staff Accountants + Controller) | Shared | Downstream consumers at PH-2, PH-4, PH-8, PH-X | Property detail, compliance queue (read), exports | D11 (default resolver per `06-audit-rules.md`), D20; cost/basis data quality |
| Executives (Jack BeVier, Fred Lewis) | All | Whole lifecycle, portfolio level | Dashboard | Carry-days rollups; HIGH-severity finding aging |

---

## 1. James Stewart — Director of Field Operations

**Role.** Oversees all Project Managers within DP and directs the overarching field operations for DM. He is the single person who spans both companies' field work, and the primary operational point of contact for the Controller — he validates the handoffs between construction and management and ensures project timelines align with budget forecasting.

**Lifecycle ownership.** James is the accountable owner for the construction span (PH-2 closing handoff → PH-3 renovation) and owns the handoff INTO PH-4 (ready for leasing) — PH-4 itself is Stephanie's (see §4). He also shares oversight of the turn span (PH-9 → PH-10, executed by Craig's crews) since DP manages turnovers. In practice he is the escalation point for *any* property whose phase clock is running long, in any physical-work phase.

**Helm surfaces.**
- **Dashboard** — his default view: phase distribution, properties stuck in PH-2/PH-3/PH-10, cycle-time trend.
- **Property detail** — the Lifecycle Phase Journey swimlane is essentially a picture of the handoffs he is responsible for; the per-source cards (Buildertrend jobs/POs/bills) let him verify a job exists and is moving without opening Buildertrend.
- **Audit queue** — HIGH-severity discrepancies, especially D1 ("closing complete but no Buildertrend job"), which is a broken handoff into his domain.

**Push (alerts).** New D1 findings; any property whose PH-2 dwell exceeds the handoff threshold (see `04-cycle-time-model.md`); PH-3 jobs aging past budgeted duration [confirm: does James want per-property alerts, or a daily digest of exceptions only?].

**Pull (reports).** Portfolio phase distribution; per-PM cycle-time comparison (days in PH-3 by PM); carry-days breakdown by phase for the construction span.

**Strawman access.** Ops Lead — full read portfolio-wide; can acknowledge/resolve audit findings; can trigger per-property Refresh and audit Re-run.

## 2. Project Managers (DP, report to James Stewart)

**Role.** Manage individual job sites, subcontracted labor, and material-drop compliance, all tracked in Buildertrend. They approve subcontractor field invoices and verify jobs correspond to open scopes — the operational validation gate before the Friday ACH labor/supplier runs.

**Lifecycle ownership.** PH-3, for their assigned jobs. Per Jack's decisions, while a property is in construction, staff must today update **both** Podio and Buildertrend with project statuses — PMs (or someone on their behalf) carry part of that double-entry burden (see `05-data-sync-map.md`).

**Helm surfaces.** Deliberately small. PMs live in Buildertrend; Helm derives from their data rather than asking them to work in a second (third) tool. What they plausibly need:
- **Property detail** for their assigned jobs — mainly to see what Helm/Podio/AppFolio believe about a property they're working on.
- **Audit queue, scoped to their jobs** — a D1 finding is directly actionable by a PM (create the missing Buildertrend job).

[confirm: should PMs get Helm logins at all in v1, or should their findings route through James?]

**Push (alerts).** D1 findings on properties assigned to them; a property entering PH-2 (closing complete — a job should be created).

**Pull (reports).** Their active job list with Helm's derived phase alongside Buildertrend status.

**Strawman access.** Field — read scoped to assigned properties; can acknowledge findings on those properties; no portfolio views.

## 3. Craig Cuocci — Director of DM Maintenance & Inspections

**Role.** Oversees DM's field maintenance crews, property inspectors, and the 6 in-house punch-out/turnover contractors. Craig commands the physical transition of a unit when it goes vacant to get it rent-ready again. His cost tracking also drives the opex-vs-capitalize routing decision the Staff Accountants make on turnover bills (DM opex vs. DP capitalized).

**Lifecycle ownership.** PH-9 (notice/pre-vacancy) jointly with Stephanie — strawman: Craig owns turn prep, Stephanie owns the re-marketing decisions [confirm: PH-9 owner — Stephanie, Craig, or explicitly joint?] — and PH-10 (vacancy/turn — executing it), plus ongoing maintenance and inspections during PH-8. Under Jack's cycle-time philosophy, every day a unit sits in PH-10 is a day of lost rent, and Craig's queue is where a large share of avoidable carry-days will surface.

**Helm surfaces.**
- **Property registry filtered to PH-9/PH-10** — his turn queue. Note the tour found statuses like "parked - not turning over"; Craig is the natural owner of those hold states [confirm: who decides a unit is "parked", and should parked units be excluded from turn-aging clocks?].
- **Property detail** — to see notice dates, turn start, and whether AppFolio/Podio agree the unit is vacant.

**Push (alerts).** A unit entering PH-9 (notice given → turn should be scheduled); D7 findings ("tenant moved in but Podio Vacant Unit not closed out") — per the canonical owner map in `06-audit-rules.md`, Stephanie is the default resolver (Podio Vacant Unit close-out is a leasing-records task) and Craig is notified, since the close-out is the administrative tail of his turn process (resolver question [confirm]'d in 06); a turn exceeding the PH-10 day threshold.

**Pull (reports).** Days-in-turn per unit and average; turn throughput per in-house contractor [confirm: does Craig want per-contractor cycle metrics in Helm, or is that tracked elsewhere?].

**Strawman access.** Department Lead — full read; edit/resolve within PH-8..PH-10 findings; no admin.

## 4. Stephanie Derry — Director of DM Leasing & Compliance

**Role.** Manages all tenant leasing pipelines, tenant AR, and municipal/state regulatory compliance: MDE lead-paint certs, Section 8/voucher processing, and annual rental licensing. Her team drives the revenue side of AppFolio (rent rolls, security-deposit escrow), and her team's Podio compliance records — the Lead Certs & Water Bills app in the Rentals Billing & Compliance workspace (see `09-podio-architecture.md`) — are what Staff Accountants cross-reference to approve municipal licensing invoices.

**Lifecycle ownership.** The leasing funnel: PH-4 (ready for leasing — Stephanie owns the phase; James owns the handoff into it) → PH-5 (marketing/vacancy) → PH-6 (approved applicant / housing-program workflow) → PH-7 (lease activation/move-in), the revenue side of PH-8, and joint ownership of PH-9 with Craig — she takes the re-marketing decisions, he takes turn prep (shared [confirm] in §3). PH-6 is currently the biggest active non-PH-8 bucket in Helm (61 properties on tour day), and its housing-program (Section 8/voucher) processing is squarely Stephanie's domain — she is the likely primary owner of the PH-6 queue and of compliance rules D17/D18 [confirm: is Stephanie the primary owner of the PH-6 housing-program queue and the resolver of D17/D18 findings?].

**Helm surfaces.**
- **Compliance queue** — this page was explicitly built to replace her P0 spreadsheet (license & lead-paint tracking, with CSV download). She is its primary user, likely daily.
- **Audit queue** — D14 ("application approved but no Podio Vacant Unit entry") and D7 both originate in her team's double-entry between AppFolio and Podio. Per the canonical owner map in `06-audit-rules.md`, she is the strawman default resolver for D7 (Craig notified).
- **Property detail** — leasing status vs. what Podio believes.

**Push (alerts).** D17 (rental license expiring ≤30 days) and D18 (lead-paint cert expiring ≤60 days) — these have hard regulatory deadlines and are the clearest push case in the app; new D14 findings; properties newly entering PH-6 (voucher clock starts).

**Pull (reports).** The compliance CSV (already built); leasing-funnel aging (days in PH-5/PH-6/PH-7 per property); expirations look-ahead beyond the alert windows.

**Strawman access.** Department Lead — full read; edit/resolve compliance findings and PH-4..PH-9 discrepancies.

## 5. Victoria Robinson — Transaction Coordinator

**Role.** Manages contract-to-close logistics for all acquisitions and dispositions. Populates the Podio Buy Closings app (see `03-systems-of-record.md` §4) and provides the accounting team with final settlement statements (ALTA/HUD-1s), deeds, and closing-cost breakdowns so initial asset basis can be logged in BNA.

**Lifecycle ownership.** PH-1 (under contract) → PH-2 (closing complete), and the disposition side into PH-X. She is the person who *creates* a property's record-of-birth data — address, owner LLC, closing date, settlement figures — which everything downstream (Helm registry, BNA basis, AppFolio owner accounts) depends on. Since she keys the Podio acquisitions records, she is also the natural fixer for owner-LLC data errors at the source.

**Helm surfaces.**
- **Property registry filtered to PH-1/PH-2** — her closing pipeline.
- **Audit queue** — D11 ("Owner LLC mismatch between Podio Vacant Units and Rental Billing", 200 findings on tour day) is the single biggest finding bucket. Per the canonical owner map in `06-audit-rules.md`, accounting/Controller is the default resolver (owner-LLC is an entity/ledger question) with Victoria consulted for deed/settlement records — she keys the source data (resolver question [confirm]'d in 06).
- **Property detail** — to confirm a closing propagated (Podio closing record present, Helm phase advanced to PH-2).

**Push (alerts).** A closed property that has not advanced out of PH-2 (handoff stall — also James's D1 territory); new D11 findings on properties she recently closed.

**Pull (reports).** Closing pipeline with expected close dates; recently-closed list with settlement-doc checklist status.

**Strawman access.** Department Lead — full read; edit/resolve PH-1/PH-2 and owner-LLC findings.

## 6. Brian Leibowitz — Acquisitions Director

**Role.** Sources and secures new real estate assets for the portfolio. New rental acquisitions currently flow into Emerson Point (see `01-company-overview.md`).

**Lifecycle ownership.** PH-1 origination — everything before and up to contract. Once under contract, day-to-day ownership passes to Victoria.

**Helm surfaces.** Light-touch, mostly read:
- **Dashboard / registry** — count and status of properties under contract.
- **Pull-side cycle-time data** — the most valuable thing Helm can give acquisitions is the feedback loop: the acquisition-pass clock (contract → first rent), with carry days accruing from closing onward per `04-cycle-time-model.md` §2, which prices the true carry cost into future offers. See `04-cycle-time-model.md`.

**Push (alerts).** Minimal. Possibly a digest when a property he sourced closes or first rents [confirm: does Brian want any alerts, or read-only access?].

**Pull (reports).** Acquisition-cohort cycle times (contract → rented) and carry-day totals per acquisition.

**Strawman access.** Viewer+ — full read, no edit.

## 7. Accounting Team — Staff Accountants & Controller

**Role.** Downstream consumers of nearly everything above. The Controller establishes cost basis in BNA from Victoria's settlement statements; Staff Accountants validate municipal invoices against Stephanie's compliance records, cross-reference material invoices against Buildertrend job logs, and coordinate with Craig's tracking to route turnover bills as DM opex vs. DP capitalized. Ledgers live in QuickBooks Desktop today, migrating to Sage in 2026 (see `03-systems-of-record.md`).

**Lifecycle ownership.** None directly — they consume phase-transition events:
- **PH-2** (closing complete): settlement statement → basis entry in BNA.
- **PH-4** (renovation complete, placed in service): capitalized DP costs finalize; property added to BNA depreciation.
- **PH-8** turn bills: opex/capitalize routing.
- **PH-X** (sold/disposed): basis retirement and gain/loss support.

**Helm surfaces.**
- **Property detail** — one place to see a property's cost signals (Buildertrend bills/POs) next to its phase and owner LLC, instead of stitching Podio + Buildertrend manually.
- **Compliance queue (read)** — to verify a license/cert is current before approving a municipal invoice, replacing the Podio cross-reference.
- **Audit queue** — D11 (owner-LLC mismatch) directly threatens correct owner-entity booking; D20 (rent value disagreement) muddies the revenue side. Per the canonical owner map in `06-audit-rules.md`, accounting/Controller is the strawman default resolver for D11, with Victoria consulted for deed/settlement records.
- **Exports** — CSV-level pulls for reconciliation working papers.

**Push (alerts).** Phase-transition events with accounting consequences: property reached PH-2 (basis work begins), PH-4 (place in service / start depreciation), PH-X (disposal). D11 findings on entities they are actively reconciling.

**Pull (reports).** Per-property cost rollups; owner-LLC-by-property listing; compliance status snapshots at invoice-approval time.

**Strawman access.** Finance — full read + export; resolve D11 (default resolver per the canonical owner map in `06-audit-rules.md`, Victoria consulted); other operational findings flag-only (they report discrepancies, operators fix them). Per-rule resolver questions are [confirm]'d rule-by-rule in `06-audit-rules.md`.

## 8. Executives — Jack BeVier & Fred Lewis

**Role.** Owners (see `01-company-overview.md` for the ownership structure). Consumers of portfolio-level truth, not per-property detail.

**Lifecycle ownership.** All of it, at rollup level. Jack's stated master metric: days-not-rented (carry days) per property across the whole lifecycle — every day matters and matters the same (see `04-cycle-time-model.md`).

**Helm surfaces.**
- **Dashboard** — the existing Command Center KPIs (total properties, active rentals, avg lease time, compliance score) are already executive-shaped.
- What is missing for this persona (per the tour gap analysis) is the **carry-days rollup**: total carry days by phase, by entity, and trend — the number that prices the whole operation's friction.

**Push (alerts).** A periodic digest, not per-event noise: carry-days trend, HIGH-severity findings aging beyond N days, compliance score vs. the 98% target [confirm: digest cadence — weekly? and delivery channel — email, Slack, or in-app only?]. Note there is a live executive-alert precedent for this persona: Fred already receives SMS texts from GlobiFlow today on acquisitions, closings, and turnovers ("Text Fred New Acquisition", "Text Fred with Acquisition Closing", "text Fred when house goes vacant", "text Fred when official turnover email happens") — per GlobiFlow UI tour 2026-07-09, `sources/podio-architecture.md` §6. Helm's Fred-facing push design should account for (and eventually absorb) that existing SMS channel.

**Pull (reports).** Everything above on demand; entity-level splits (e.g., Emerson Point growth cohort vs. mature CC/RD/CS portfolios).

**Strawman access.** Admin (Jack — also the de facto product owner) / Viewer (Fred) [confirm: does Fred want a login, or does a pushed digest suffice?].

---

## Access model — current state and strawman

**Current state (per Helm codebase read 2026-07-11):** there is NO role-based access control. A `roles: string[]` column exists on `hub.users`, but it is client-supplied at signup and never read for any access decision (findings §6) — so the tour-era "the app has a user-roles concept" read was cosmetic; the concept exists as an unused column only. "Admin · Dominion" is a hardcoded UI string shown to every user, not a role Jack holds. Authorization in code is binary: an authenticated session (or a `SYNC_SECRET` bearer token) gets in, and even that guard is applied to only 5 controllers — the entire phase/audit/compliance read surface is unauthenticated (see the Authentication & authorization section below). So every capability described above is, in code, undifferentiated open access. The tiering below is therefore a target model, none of which is enforced today. [confirm: role/permission model — is the tiering below roughly right, and which tier does each named person land in?]

Note too that the "resolve / acknowledge finding" capabilities these tiers grant do not exist in code yet: findings are recomputed live on every read and never persisted — there is no dismiss/resolve/acknowledge state to gate (per Helm codebase read 2026-07-11; see `06-audit-rules.md` and `11-implementation-status.md`).

Strawman tiers (target model — NONE of this is enforced in code today, per Helm codebase read 2026-07-11):

| Tier | Capabilities | Strawman assignees |
|---|---|---|
| Admin | Everything + user management, rule config | Jack, developer |
| Ops Lead | Full read; resolve any finding; trigger refresh/re-run | James |
| Department Lead | Full read; resolve findings in own domain | Craig, Stephanie, Victoria |
| Finance | Full read + export; resolve rules where accounting is the default owner per `06-audit-rules.md` (e.g., D11); flag others | Controller, Staff Accountants |
| Field | Read + acknowledge, scoped to assigned properties | PMs (if given logins) |
| Viewer | Read-only | Brian, Fred |

## Authentication & authorization — code reality

Per Helm codebase read 2026-07-11 (findings §6), the auth picture is materially worse than the tour suggested. This section summarizes what the code actually does; the full security-finding list, severity ranking, and remediation live in `11-implementation-status.md` §6 (not duplicated here).

- **Session, not JWT.** Auth is `express-session` + a Postgres session store. The README's advertised "JWT authentication" and "Role-based access control (RBAC)" are **both false** — `auth/strategies` and `auth/decorators` are empty placeholders.
- **Open self-registration.** `POST /auth/signup` has no guard, no invite, no email verification, **no domain restriction**, and no password policy (1-character passwords pass). Anyone who can reach the host can create an account and immediately gets a session. This confirms and sharpens the tour observation of the "Or create a new account" link.
- **Self-assigned roles.** The signup DTO accepts an optional client-supplied `roles: string[]` written verbatim to `hub.users.roles` — a self-registering stranger can self-assign "Admin". Moot today only because nothing reads roles (no RBAC).
- **Most of the app is unauthenticated.** The entire PhaseController (all property/phase/enrichment/audit/compliance reads, CSV exports, AND a **mutating** `POST /phase/snapshot`) is intentionally public; the `/mcp` endpoint's guard is claimed in a comment but not wired. The session/bearer guard protects only 5 controllers (pipeline, ingest, scheduler, agent, sync) — so any self-registered user can trigger full ingests and query the embedded LangChain SQL agent over the whole database.
- **AuthGuard fails open** when `SYNC_SECRET` is unset (returns true), and `SYNC_SECRET` is **dual-use** — both the HTTP bearer token and the session-signing secret — so the cron token can forge session cookies.
- **Committed plaintext Buildertrend credentials** (`abdulm@thedominiongroup.com` + a real password) sit in 6 Playwright spec files.
- Public Swagger at `/docs`; `enableCors({origin:true, credentials:true})`; **no user-action audit log** of any kind (the "audit" feature is the D-rule engine, unrelated).
- The Update Password form only `alert()`s success with no API call, and "Forgot your password?" is a dead link — there is no password change/reset server-side (this supersedes any read of those controls as working).

**Action items for Jack** (full remediation + severity ranking in `11-implementation-status.md` §6):
1. Rotate the committed Buildertrend password (`abdulm@thedominiongroup.com`) and strip it from the Playwright specs, and rotate the Helm password shared in chat during the tour — both should be treated as compromised, independent of who had access.
2. Decide the registration policy. [confirm: should account creation be open, restricted to @thedominiongroup.com addresses, or admin-invite only? — today it is fully open, with self-assignable roles and no password policy.]
