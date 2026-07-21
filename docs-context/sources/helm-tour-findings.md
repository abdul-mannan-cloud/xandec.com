# Helm App Tour Findings (2026-07-06, observed live at helm.thedominiongroup.com)

App: "Dominion Helm Properties" (settings modal calls it "Dominion Central"). Custom email/password auth; the sign-in page OBSERVED to include an "Or create a new account" self-registration link and a "Forgot your password?" link. The only role observed was Jack's own ("Admin · Dominion") — other roles unknown. Nav: Dashboard, Properties, Audit Findings, Compliance. FACT: Jack shared his Helm password in the working chat on 2026-07-06, so a rotation recommendation is warranted.

## Dashboard ("Command Center")
- Total Properties: 1,073 (+12% MoM)
- Active Rentals: 870 (81.1% share)
- Avg Lease Time: 62.6d (↓2d), computed from 1,902 "matched leases"
- Compliance score: 94.5% vs target 98%

## Phase model (12 phases, derived per property from multi-source signals)
- PH-1 Acquisition / Under contract (6 properties)
- PH-2 Closing complete → handoff to Construction (0 currently)
- PH-3 Renovation (16)
- PH-4 Ready for leasing (3)
- PH-5 Marketing / Vacancy (8)
- PH-6 Approved applicant → housing-program workflow (61) ← biggest active bucket
- PH-7 Lease activation / Move-in (14)
- PH-8 Active rental (870)
- PH-9 Notice / Pre-vacancy (0 currently)
- PH-10 Vacancy / Turn (0 currently)
- PH-X Sold / Disposed (87)
- PH-Z Archived / Write-off (1)
- UNKNOWN "phase could not be determined" (7)
Counts sum exactly to 1,073.

## Property registry & detail page
- Helm property IDs like #P0551; row shows address, phase chip, status text (e.g. "occupied", "parked - not turning over", "approved - need inspection"), and 3 source-presence dots (Podio/AppFolio/Buildertrend).
- Status↔phase pairings OBSERVED on registry rows: "1 S Kelly Ave" PH-6 + "parked - not turning over"; "10 E Lee St #2002" PH-6 + "parked - not turning over"; "10 Walnut Ave" PH-6 + "approved - need inspection"; PH-8 rows show "occupied". So "parked - not turning over" WAS observed on PH-6 rows (whether it also occurs in other phases was not captured).
- Driver-event strings OBSERVED verbatim on property #2's phase-evidence cards (each card = phase + date + driver): "Acquisition / Under contract · 4/21/2025 · Closed"; "Renovation · 4/21/2025 · Handed Off - Rental"; "Ready for leasing · 4/21/2025 · handed off — rental"; "Closing complete → handoff to Construction · 5/12/2025 · closed"; "Approved applicant → housing-program workflow · 11/14/2025 · contract executed"; "Lease activation / Move-in · 1/19/2026 · contract_signed"; "Active rental · 1/19/2026 · move_in"; Hub snapshot "Active rental · 6/8/2026 · occupied". NOTE: "contract executed" is the observed driver on the PH-6 card (entry into approved-applicant), and "contract_signed" is the observed driver on the PH-7 card (lease execution). Several cards share odd date/driver pairings (three cards dated 4/21/2025; the PH-1 card's driver is "Closed") — the derivation may be retroactive; interpretation should be [confirm]'d with the developer.
- Detail page: "Lifecycle Phase Journey" — swimlane grid, rows = source platforms (Podio "Acquisitions CRM", AppFolio "Property mgmt", Buildertrend "Renovation"), columns = PH-1..PH-Z. Cells hold evidence cards tagged DERIVED with date + driver event (e.g. "contract_signed", "move_in", "closed", "Handed Off - Rental"). Legend: Current phase / Transition (driver) / System of record / No record. A "Hub" SNAPSHOT card holds the resolved current phase.
- Per-source summary cards: Podio (RECORDS 5, CLOSING 1, VACANT UNITS 1), AppFolio (EVIDENCE 3, CURRENT PHASE, LAST SIGNAL date), BuilderTrend (JOBS 1, POS 11, BILLS $42,060 — also mentions bids and owner invoices).
- "Refresh" button per property (re-pulls/re-derives).

## Cross-platform audit (/audit)
423 total findings (= 363 discrepancies + 60 compliance). Severity: 22 HIGH / 6 MEDIUM / 335 LOW; 62 properties affected. "Re-run" button. Rule catalog observed (D-codes imply ~20 rules defined; 5 discrepancy rules currently firing):
- D1 (HIGH, 3): "Closing complete but no BuilderTrend job"
- D7 (MEDIUM, 6): "AppFolio shows tenant moved in but Podio Vacant Unit not closed out"
- D11 (LOW, 200): "Owner LLC mismatch between Podio Vacant Units and Rental Billing"
- D14 (HIGH, 19): "AppFolio application approved but no Podio Vacant Unit entry"
- D20 (LOW, 135): "Rent value disagreement between AppFolio and Podio Rental Billing"

## Compliance (/compliance)
Header: "P0 SPREADSHEET — License & lead-paint compliance" (built to replace a spreadsheet; has Download CSV).
- D17: Rental licenses expired/expiring in 30 days (9)
- D18: Lead-paint certs expired/expiring in 60 days (51)
- 59 properties affected; findings carry cert/license numbers and exact expiry dates. Observed expiry ages on page 1 of 3 ranged from "EXPIRED 2 days ago (2026-07-04)" (a lead-paint cert) to lead-paint cert #748482 at 142 N Curley St "EXPIRED 940 days ago (2023-12-09)" (many multi-hundred-day examples: 118, 162, 227, 250, 252, 268, 273, 290, 302, 377, 383, 443, 646, 666, 694 days), plus not-yet-expired items "expires in 12 days" and "expires in 25 days".

## Podio workspaces referenced by the app
Closing, Vacant Units, Rental Billing (Podio labeled "Acquisitions CRM"). Company doc separately names "Acquisitions & Titles" and "Compliance & Licensing" workspaces.

## Gap analysis vs Jack's 4 stated goals
1. Inventory management — largely BUILT (registry + phase derivation).
2. Workflow management — NOT VISIBLE yet (no tasks, queues, assignments; phases are observed, not driven).
3. Cycle-time violations — NOT VISIBLE yet (avg lease time KPI exists, but no per-phase aging/SLA thresholds or violations).
4. Data movement between systems (kill duplicate entry) — NOT VISIBLE yet (read-only derivation + discrepancy flags; no write-back).

## Other notes
- "1902 matched leases" implies a lease-matching layer between AppFolio leases and Podio Rental Billing.
- Status strings like "parked - not turning over" suggest hold states worth first-class modeling.
- Company portal tech standard (laurence/docs/tech-stack.md): React 19 + Vite + Redux Toolkit + Tailwind/DaisyUI; NestJS 11 + Postgres; OpenAPI-generated SDK; Docker + Bitbucket Pipelines + Traefik.
