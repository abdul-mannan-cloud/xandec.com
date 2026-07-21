# 00 — README: The Helm Business-Context Doc Set

> Status: DRAFT strawman — [confirm] items pending Jack's review.

## What this is

Top-down business context for the developer building **Helm**, Dominion Group's internal
real-estate operations app (live at helm.thedominiongroup.com). These docs explain the
business the app serves — the entities, the property lifecycle, the systems staff key data
into today, and why the audit rules exist — so that what gets built matches operational
reality. They describe and inform; they do not redesign the app. Anything prescriptive is
explicitly labeled as a **proposal**.

Sources: Dominion's Master Operational & Accounting Resource Guide, a live tour of Helm as
built (2026-07-06), a first-hand Podio API architecture tour (2026-07-09, captured in
sources/podio-architecture.md — authoritative for all Podio structure), a full read of the
Helm source code (2026-07-11, captured in sources/helm-codebase-findings.md — authoritative
for what the code actually does), and Jack BeVier's direct decisions. Where those conflict,
Jack's decisions win; where the code contradicts a documented claim, the codebase read wins on
implementation facts and 11-implementation-status.md records the reconciliation.

## The [confirm] convention

Facts we could not verify are written as a best-guess strawman and tagged inline:
`[confirm: <question for Jack>]`. Rules of engagement:

- A [confirm]'d fact is a **placeholder, not a fact**. Do not build hard logic (audit
  thresholds, phase transitions, sync rules) on top of one until Jack confirms it.
- Un-tagged statements trace to the four sources above and can be relied on.
- As Jack answers, tags get resolved in place and the Status line updated.

## Reading order

| # | File | What it covers |
|---|------|----------------|
| 1 | 01-company-overview.md | Who Dominion is: entities, roles, what DM/DP/DI do |
| 2 | 02-property-lifecycle.md | The canonical PH-1..PH-Z phase model, in business terms |
| 3 | 03-systems-of-record.md | AppFolio / Buildertrend / Podio (+ BNA, QuickBooks→Sage): what lives where, integration access |
| 4 | 04-cycle-time-model.md | The uniform day-cost philosophy; clocks and violations |
| 5 | 05-data-sync-map.md | Where data is born, where it must flow, the double-entry burden, Podio retirement roadmap |
| 6 | 06-audit-rules.md | The D-rule catalog: rationale, severity, owners, playbooks |
| 7 | 07-users-roles.md | Personas and what each needs from Helm |
| 8 | 08-glossary.md | House terminology and abbreviations |
| 9 | 09-podio-architecture.md | The real Podio architecture (15 workspaces, ~65 apps, field schemas, GlobiFlow webhooks) per API tour 2026-07-09 |
| 10 | 10-common-data-map.md | Cross-system overlap matrix + candidate discrepancy rules, grounded in the codebase (per code read 2026-07-11) |
| 11 | 11-implementation-status.md | What's actually built vs. documented, known gaps, and the security posture (per code read 2026-07-11) |

Read 01–03 for orientation; 04–06 are the operational core; 07–10 are reference; 11 is the
developer's build-state + gaps + security reconciliation against the code.

## What Helm is

**Scope (confirmed by Jack):** DM (Dominion Management) and DP (Dominion Properties) — the
rental and construction side, ~1,000 units. DFS (Dominion Financial Services, the lending
business) is out of scope.

Helm has four goals. Where each stands today:

1. **Inventory management** — *largely built.* A unified property registry (1,073
   properties) with a per-property lifecycle phase (PH-1..PH-Z) derived from signals across
   Podio, AppFolio, and Buildertrend. See 02-property-lifecycle.md.
2. **Workflow management** — *ahead.* Today Helm observes phases; it does not yet drive
   work (no tasks, queues, or assignments). See 07-users-roles.md for who would work them.
3. **Cycle-time violation detection** — *ahead, philosophy defined.* Jack's rule: every day
   a property isn't rented costs the same — one day of rent, or one day of carry plus
   opportunity cost of capital. No phase clock outranks another; clocks exist to locate
   where days accumulate. See 04-cycle-time-model.md.
4. **Cross-system data movement (kill duplicate entry)** — *ahead, with a defined
   end-state.* Staff currently double-key status updates into Podio alongside Buildertrend
   (construction) and AppFolio (turnover/leasing). Jack's decision: Helm should become the
   middleware that eventually **retires Podio completely** — new features should not deepen
   Podio dependency. See 05-data-sync-map.md.

## Tech-stack note

A company portal tech standard exists: React 19 + Vite + Redux Toolkit front end; NestJS 11
+ Postgres back end; OpenAPI-generated SDK; Docker + Bitbucket Pipelines + Traefik.

**Conformance (per Helm codebase read 2026-07-11):** Helm largely conforms — the React 19 /
Vite / Redux Toolkit front end and the NestJS 11 + Postgres back end are all confirmed, running
in a single container behind Traefik. But three divergences from the standard (and from the
app's own in-repo README) show up in the code: data access is hand-written **raw SQL, not an
ORM** (the shared `entities` module is an empty `export {}`, so the app README's "TypeORM
entities" claim is false); auth is **session-based, not JWT**; and there is **no RBAC** — the
app README claims both JWT authentication and role-based access control, and both are false in
code. See 11-implementation-status.md (§2 stack, §6 security) for the full reconciliation.
[confirm: should the code be pulled back toward the portal standard (an ORM, plus the README's
stated JWT + RBAC), or is the current raw-SQL + session-auth divergence accepted for Helm?]
