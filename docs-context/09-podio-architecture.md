# 09 — Podio Architecture: What Helm Is Actually Absorbing

> Status: GROUND TRUTH for the inventory, schemas, and vocabularies below — captured first-hand via the Podio REST API on 2026-07-09 (read-only OAuth client, org-admin role), plus the complete GlobiFlow flow inventory (~276 flows, names verbatim) captured the same day via the workflow-automation.podio.com UI under Jack's login. Un-tagged statements trace to those captures and can be relied on; [confirm] tags here mark *mapping inferences built on top of the capture*, not unverified data. Raw record: `sources/podio-architecture.md`. Item counts are live totals on 2026-07-09; item-level data was deliberately not sampled (schema was the goal; item data is PII-adjacent). Supplemented by an item-creation activity probe on 2026-07-11 (creation counts/timestamps only, no item data — raw table: `sources/podio-architecture.md` §8), which resolves the leasing-generation question (§3.6).

## 1. Why this file exists

Podio is the system Helm will absorb and eventually retire (Jack's direction — see `05-data-sync-map.md` §5). Until 2026-07-09 the doc set could only describe Podio by inference: workspace names guessed from the company guide ("Acquisitions & Titles", "Compliance & Licensing") and from Helm's own source labels ("Closing", "Vacant Units", "Rental Billing"). This file replaces that inference with Podio's real shape, captured directly from the API. **Where any earlier file in this set disagrees with this one about Podio, this one wins.**

The headline corrections to the old strawman:

- There is **no "Acquisitions & Titles" workspace**. Buy Closings and Sale Closings are apps in the **Closings** workspace.
- There is **no standalone "Vacant Units" workspace**. Vacant Units is an app in the **Occupancy** workspace.
- There is **no "Rental Billing" workspace and no separate "Compliance & Licensing" workspace**. Rent data (the D20 comparisons) and compliance data (the D17/D18 expirations) live together in **one app** — **Lead Certs & Water Bills** — in the **Rentals Billing & Compliance** workspace.
- **"Handed Off - Rental" is a Podio status** — a value of Renovation.Phase — not a Buildertrend event (per Podio API tour 2026-07-09). **CORRECTION (per Helm codebase read 2026-07-11, supersedes the tour reading): this string does NOT drive Helm's live phase.** `derivePhase()` never matches "Handed Off - Rental" — it fails the `/complete/i` test and is not in the write-off list, so a Handed-Off property falls into the **PH-3 catch-all** unless an AppFolio unit/occupancy rule fires first (`phase.service.ts:1560-1568`). The string only mints a PH-4 card in the *retrospective* journey deriver (`deriveHistoryFromDates`, `/^Handed Off/i`, `:358-373`) and appears in audit rule D9's turnover-exclusion list. So it is the correct *source of the string* but not the live PH-3→PH-4 driver; see `02-property-lifecycle.md` §5 and `11-implementation-status.md` §3.
- **Helm's phase-derivation strings match Vacant Units.Status verbatim** — the Vacant Units app is Helm's PH-5/PH-6 signal source. (Nuance per Helm codebase read 2026-07-11: derivation only regex-matches `/contract\s*executed/i` → PH-7 and buckets every *other* non-null status → PH-6; the full 14-value vocabulary is stored verbatim but not individually read by `derivePhase()`.)
- **The two-leasing-generation question is resolved: the Move Ins & Move Outs workspace is an ARCHIVE, retired ~November 2017.** No item has been created in any of its 8 apps since 2017 (Attempted Notices since 2015); the live leasing surface is **Sched Vacants + Vacant Units** in the Occupancy workspace, and Occupancy's own Applications app has been dead since 2022-05-12 (per Podio API activity probe 2026-07-11 — §3.6).

Everything the retirement roadmap in `05-data-sync-map.md` sequences by "workspace" should now be read against the real app boundaries in §2–§3 below.

## 2. Workspace → app inventory (complete)

One org: **The Dominion Group** (org_id 729102), 15 workspaces, ~65 apps. (A second org, "Podio Workflow Automation User Community," is just the GlobiFlow user community — not operational.) Bold apps are lifecycle-core and detailed in §3.

| Workspace (space_id) | Apps (item counts where captured) | Helm relevance |
|---|---|---|
| **Closings** (2536777) | **Buy Closings** (9068504, 1,139), **Sale Closings** (9068512, 858), HOA/GR/FF Setups (21424026), Weekly Reports (25925305) | PH-1/PH-2 birth records and PH-X dispositions |
| **Pipeline - Construction** (3039231) | **Renovation** (10728781, 2,346) — the workspace's only app | PH-1 prep through PH-3 (the "Handed Off - Rental" phase is the *business* PH-3→PH-4 handoff, but does NOT drive Helm's live phase — see §1 correction and §3.2) |
| **Construction Scheduling** (4205458) | 18 per-trade job apps: Material Deliveries, Demo, Concrete, Frame, HVAC, Plumbing, Electrical, Drywall/Paint, Trim, Refinishing, Roofing (Exterior), Windows, Metal Rails, Landscape, Fencing, Misc, BGE, Insulation | Children of the Renovation item (§3.2) |
| **Construction Operations** (3810697) | Vendor List, Supply Houses, Standards, Utilities | Reference data; peripheral to Helm |
| **Move Ins & Move Outs** (3013036) | Leasebacks (46), Attempted Notices, Upcoming Turnovers (285), **Move Outs** (10684171, 228), **Listings** (10636997, 342), Rental Applications (12649016, 856), Pre-Contract Inspections, **HAP Appointments** (10670450, 263) | The OLDER leasing-app generation (§3.6) |
| **Occupancy** (5720817) | **Sched Vacants** (19831048, 1,254), Applications (19831008, 1,044), **Vacant Units** (19820093, 1,389) | The NEWER leasing-app generation — Helm's PH-5/PH-6/PH-9 signal sources |
| **Rentals Billing & Compliance** (3156684) | **Lead Certs & Water Bills** (11132895, 1,308), Code Violations & Citations, **Lead Paint Compliance** (26654207, 266), Certifications, Tracking # Lead Certificates, Property Registration/Licensing (26964701, 0 items — new/empty) | Rent + compliance master records (D17/D18/D20, half of D11) |
| **Inspections** (3476081) | "DO NOT USE" (12181100), Annuals, Specials, Reinspections, Abatements, FRR Follow-Ups | Annuals is linked from Lead Certs & Water Bills; legacy debris exists |
| **Leasing Leads** (5009484) | Leasing Leads, Old Leads | Pre-application funnel; peripheral |
| **High Water Bills** (3384640) | OLD - High Water Bill, Credit Issued - Research Matchup, Research, Protocol | Billing-dispute workflows; peripheral |
| **Bank Loans** (7438676) | Pipeline, Loan Groups, Line of Credit, Prepay Schedule | Financing-side records; Sale Closings links → Pipeline |
| **Small Claims** (5526331) | Small Claims | Tenant-collections; feeds Sched Vacants move scenarios |
| **TCB Disputes** (4912904) | TCB Disputes, Payment Plans | Peripheral |
| **Virtual Leasing Assistant** (3244872) | Site-Based Project, Rental Applications (11442796) | A THIRD Rental Applications app exists here; peripheral but note the name collision |
| **Employee Network** (2532853) | (no apps) | — |

Full app_id list and field-level detail: `sources/podio-architecture.md` §2–§3.

## 3. The lifecycle-core apps

For each app: what it is, the fields that matter to Helm, the full status vocabularies (these are the strings any Podio-reading derivation logic will actually see), and the mapping to Helm phases and D-rules.

### Phase-mapping summary

| Helm phase (see `02-property-lifecycle.md`) | Podio signal source |
|---|---|
| PH-1 Acquisition / Under contract | **Buy Closings** (Status: Under Contract → Ratified; Contract Date) + the simultaneous **Renovation** item (early Phase values: Trash Out, Design & Scope) |
| PH-2 Closing complete | **Buy Closings** Status = Closed; Closing Date |
| PH-3 Renovation | **Renovation**.Phase (Demo → 30 Day Closeout & Bill — far finer-grained than PH-3; see §3.2) |
| PH-3 → PH-4 handoff (business) | **Renovation**.Phase = **"Handed Off - Rental"** is the *business* handoff marker — but per Helm codebase read 2026-07-11 it does NOT drive the live phase (falls into the PH-3 catch-all; only mints a retrospective PH-4 journey card). Live PH-4 is a last-resort catch-all (`is_active` + units, no earlier rule matched). See §1 correction, `02-property-lifecycle.md` §5. |
| PH-5 / PH-6 / PH-7 | **Vacant Units**.Status (Helm reads these strings verbatim) + the Vacant Units date-field clock chain |
| PH-6 rent negotiation | **Vacant Units** — Rent Appr Date / HAP Contract Receipt Date. (HAP Appointments, the older-gen record, is an archive — no item created since 2017-07, per Podio API activity probe 2026-07-11) |
| PH-8 steady state | No Podio phase signal; **Lead Certs & Water Bills** carries the compliance + rent state (D17/D18/D20) |
| PH-9 Notice | **Sched Vacants** (Move Out Date, Move Scenario, Turn Over Status — including the "parked" decision) |
| PH-10 Vacancy / Turn | **Sched Vacants + Vacant Units** — the turn is worked from Sched Vacants (Move Out Date, Turn Over Status) and Vacant Units (Status = "in turnover", T/O to DP Date). Move Outs is an archive — no item created since 2017-11 (per Podio API activity probe 2026-07-11; §6 item 6 RESOLVED) |
| PH-X Sold / Disposed | **Sale Closings** (Status: Under Contract → Sold), created at Under Contract and mirroring **Renovation**.Phase (On Market → Under Contract → Sold) as a synchronized pair (§3.2, §3.9; per Jack, decision 20 (2026-07-12)). Neither drives live derivation — the Renovation disposition values fall into the PH-3 catch-all; live PH-X fires only on compliance `lifecycle_stage='disposed'` + `is_active=false`. |

### D-rule mapping (real app + field behind each rule — see `06-audit-rules.md`)

| Rule | What it actually compares |
|---|---|
| D1 | Buy Closings closed (Status/Closing Date) vs Buildertrend job existence |
| D7 | AppFolio move-in vs **Vacant Units** item not closed out |
| D11 | Owner-LLC mismatch — presumably **Vacant Units.Owner** vs **Lead Certs & Water Bills.Owner** (the two option lists exist and overlap) [confirm: is D11 reading exactly these two Owner fields?] |
| D14 | AppFolio application approved vs no **Vacant Units** item |
| D17 | **Lead Certs & Water Bills** → Rental License Expiration Date |
| D18 | **Lead Certs & Water Bills** → Lead Cert Date/Expiration (MDE numbers live here too) |
| D20 | **Lead Certs & Water Bills** → Rent / Previous Rent / Current Rent vs the AppFolio lease |

Note what this collapses: the doc set's "Podio Rental Billing" (D20) and "Compliance & Licensing" (D17/D18) were **one app all along** — Lead Certs & Water Bills. Retiring "Rental Billing" and retiring "Compliance & Licensing" (stages 2 and 3 of the strawman roadmap in `05-data-sync-map.md` §5) are the same absorption project.

### 3.1 Buy Closings (app 9068504, "Purchase", 1,139 items) — Closings workspace

The under-contract entry point — the PH-1 birth record of the property spine (see `05-data-sync-map.md` §2). Victoria Robinson's contract-to-close record.

- **Fields that matter to Helm:** Street Address, **Contract Date**, **Date Ratified**, **Closing Date** (clock 1's start/stop events in `04-cycle-time-model.md` exist as real date fields), Price, **EMD** (the earnest-money deposit — the QuickBooks first-touch amount from `05-data-sync-map.md` §2), Closing Costs, Debt on Property, Trustee + Trustee Email, Case Number, Title Company, Agent, Assessed Value plus a full property-tax-appeal workflow (1st/2nd appeal, Tax Court dates). App links → Sale Closings, → Renovation.
- **Status:** Under Contract | Option | Waiting on Ratification | Ratified | Closed | Dead | Sold | Title Hold
- **Type:** Private | Trustee | REO | Builders | Short Sale | OHAAT | NCST — **the acquisition-type attribute already exists as a field.** Jack's trustee-vs-private seller fork (`02-property-lifecycle.md` PH-1/PH-2, clock 2 in `04-cycle-time-model.md`) does not need new data capture; Helm can read Buy Closings.Type as-is (per Podio API tour 2026-07-09).
- **Plan:** Retail | Rental | Wholesale | Turnkey | Lot | Teardown - Retail | Teardown - Rental | Auction — the intended exit strategy, at birth.
- **Purchasing Entity:** Gunpowder Realty, LLC | Dominion Properties, LLC | Dominion Rental Holdings, LLC | Wholesale | Assignment | Emerson Point, LLC — the owner-LLC fact (`05-data-sync-map.md` §3.2) is born here as an option field.
- **Occupancy:** Occupied | Vacant | Leaseback | Lot. **Market:** City | BaltCo | HarfCo | Atlanta | AACo | PGCo | PA | NJ | Howard County | Carroll County | Frederick | Cecil. **Purchase Financing:** Cash | CFG LOC | TBD | Wesbanco | DFS.
- **Helm mapping:** PH-1 entry (Contract Date), PH-1→PH-2 (Status = Closed / Closing Date), D1's Podio side. [confirm: Helm's tour showed a Podio source labeled "Closing" under an "Acquisitions CRM" banner — is that label reading this Buy Closings app?]

### 3.2 Renovation (app 10728781, "Project", 2,346 items) — Pipeline - Construction workspace

The construction hub — one item per project, **auto-created from Buy Closings by GlobiFlow** (Jack; confirmed by the webhook capture AND the named flow "Add new property to construction pipeline" — §4, per GlobiFlow UI tour 2026-07-09). This is the Podio side of the construction double-entry (`05-data-sync-map.md` §3.6).

- **Fields that matter to Helm:** Address, Proj Mgr, Closing Date, Const Rehab Estimate, Permit Status, Lead Test, per-utility status (Electric/Gas/Water), and **app-link fields to every per-trade Construction Scheduling app** (BGE, Demo, Concrete, Framing, HVAC, Plumbing, Electrical, Roof/Exterior, Windows, Insulation, Drywall/Paint, Trim, Refinishing, Landscape/Arborist, Rails, Fencing, Misc) — the Renovation item is the **parent of per-trade job items** in the Construction Scheduling workspace's 18 apps. Also links → Buy Closings ("Closing Info") and → Lead Certs & Water Bills ("Turnover Lead Status").
- **Phase (43 values — a full property-life pipeline, not just construction):** Asset Preservation | Post - Occupied | Occupant Contacted | Photos | Lock Change | Trash Out | Parked | Design & Scope | In House Drawings | Engineer Drawings | Budget | Pending Budget Approval | Waiting to Close | Waiting to be assigned | Demo | Concrete/DrainTile | Framing | MEP Rough In | Insulation | Drywall | Trim & Paint | MEP Trim & Carpet | QC Finishing | Punchout Needed | Punchout | Final Review Needed | Clean | Staging & Photos | 30 Day Closeout & Bill | **Handed Off - Rental** | On Market | Under Contract | Home Inspection Items | Sold | Rented | Write Off | Permit Application | Site Clearing | Excavation | Warranty | Site Engineering | Dead | No Longer Managed
- **"Handed Off - Rental" is a Renovation.Phase value** (per Podio API tour 2026-07-09) — the string lives in Podio's Renovation app, not Buildertrend. **CORRECTION (per Helm codebase read 2026-07-11):** it does NOT drive Helm's live PH-3→PH-4 transition — `derivePhase()` never matches it, so a Handed-Off property stays in the PH-3 catch-all (`phase.service.ts:1560-1568`); it only produces a PH-4 card in the retrospective journey deriver. It is the correct source of the *business* handoff marker but is not the live derivation driver. See `02-property-lifecycle.md` §5, `04-cycle-time-model.md`, `11-implementation-status.md` §3.
- **On Market / Under Contract / Sold are the disposition arm of the 43-value Phase vocab** (per Jack, decision 20 (2026-07-12)): when a property is to be sold, Renovation.Phase moves **On Market** (listed for sale) → **Under Contract** (contract accepted) → **Sold** (closed). This arm is a **synchronized pair with Sale Closings.Status** (§3.9) — a Sale Closings item is created when the property goes Under Contract, and at close both Renovation.Phase and Sale Closings.Status are set to **Sold** (the disposition analogue of the turnover triad). It is the **PH-X (disposition) arm — distinct from PH-Z (write-off)**: On Market / Under Contract are disposition-IN-PROGRESS states, Sold is terminal (see `02-property-lifecycle.md`). Confirms the breadth of the 43-value vocabulary — the Renovation app spans the ENTIRE property life (acquisition prep → construction → turnover → disposition). **CODE GAP (per Helm codebase read 2026-07-11): none of these three values drives live derivation** — like "Handed Off - Rental" they are absent from the write-off list and fail the `/complete/i` test, so they fall into the **PH-3 catch-all**; Helm's live PH-X fires only on compliance `lifecycle_stage='disposed'` AND `is_active=false` (sourced from the compliance boards' property-status, not from Renovation or Sale Closings). So a property that is On Market / Under Contract / Sold in Renovation is invisible to Helm's live disposition detection unless the separate compliance property-status is also disposed and AppFolio is deactivated. Reading Renovation.Phase (On Market/Under Contract/Sold) and/or Sale Closings.Status is net-new work to make dispositions visible — see `02-property-lifecycle.md` PH-X.
- **Granularity consequence:** Renovation.Phase decomposes Helm's single PH-3 into ~15 real construction stages (Demo → 30 Day Closeout & Bill) plus pre-closing prep stages (Trash Out, Design & Scope — Jack's PH-1 defaults) plus post-handoff marketing/disposition stages. Helm could clock every stage of construction **without any new data capture** — see §5.
- **Proj Mgr:** Robert | James | Christina | Richard | Mathew | Patrick | Parked | John | Alberti (note "Parked" appears even here, as a pseudo-PM). **Category:** 3rd Party - Turnover | BaltCo Affordable | Rental | Retail | Turnkey | Turnover | Auction | Wholesale | New Build - Rental | New Build - Retail | Lot | Parked | DFS REO | Teardown - Rental | Teardown - Retail. **The Renovation app hosts BOTH initial rehabs AND turnovers, distinguished by Category:** Category = **Turnover** (DP) / **3rd Party - Turnover** (3P) marks a *turn* — a managed unit that went vacant and re-entered the construction pipeline via the Sched Vacants DM→DP chain (§3.4), not a first rehab (per Jack, decision 19 (2026-07-12)). "Renovation item" therefore does not imply "initial construction."
- **Permit Status:** No Permits | Building Permit Needed only | MEP Permits needed only | Full Permits Needed (Building & MEP) | Permits Pulled | RI's Passed | Framing & Insulation Passed | Final's Passed | Use & Occupancy Filed | U&O/Building Passed. **Lead Test:** N/A - Retail | N/A - New Rental - post 1978 | New Rental - pre 1978 | Turnover - See Relationship.
- **Helm mapping:** PH-1 prep signals (Trash Out / Design & Scope), PH-3 (the construction stages), the *business* PH-3→PH-4 handoff marker (which does NOT drive the live phase — see the correction above), and the double-entry burden Helm exists to kill. RESOLVED (per Helm codebase read 2026-07-11): derivation reads almost none of the 43-value vocabulary — only the write-off list → PH-Z and `/complete/i` to exit PH-3; every other phase value (including "Handed Off - Rental") buckets to the PH-3 catch-all. The granularity is available in the stored data but is NOT used by derivation today.

### 3.3 Vacant Units (app 19820093, 1,389 items) — Occupancy workspace — **Helm's derivation source**

The leasing-funnel record. **Helm's tour-observed phase strings match this app's Status vocabulary verbatim** ("parked - not turning over", "approved - need inspection", "contract executed") — this app is the PH-5/PH-6 signal source, and it is what D7 and D14 mean by "Podio Vacant Unit" (per Podio API tour 2026-07-09).

- **Status (full vocabulary — the strings Helm sees):** vacant - need to turnover | in turnover | **parked - not turning over** | on market - no apps | on market - pending app | on market - in house - no apps | approved - need RFTA | approved - need to submit mgmt docs | **approved - need inspection** | approved - inspection scheduled | approved - need rent | approved - need contract date | **contract executed** | HOLD- DO NOT MARKET
- **The date-field clock chain** — a ready-made PH-5→PH-7 timeline stored as real date fields: **Date Vacant → T/O to DP Date → Market Start Date → Appr App Date → RFTA Sub Date → Insp Date → Rent Appr Date → Contract Date → HAP Contract Receipt Date**. This is exactly the housing-program sub-clock decomposition `04-cycle-time-model.md` clock 7 asked for (approval → RFTA → inspection → rent approval → contract → HAP receipt) — it already exists as data. [confirm: who keys the Vacant Units date fields, and are they keyed at the moment of the event or back-filled later? (Clock trustworthiness depends on this.)]
- **Program (28+ housing programs — PH-6 is not just "Section 8"):** AA Co S8 | HABC - Balt City | Balt Co S8 | BRHP | Dayspring | Emerge | Empire Homes | GEDCO | Harford Co S8 | Healthcare for the Homeless | HOPWA | Market | MBQ | New Vision House of Hope | PEP | Proj Plase | H-Cam | Proj Based | Continuum of Care | Womens Housing Coat | New Future Subsidy | Rapid Rehousing | HACA | ST Vincent DePaul | MOHS | HABC/BRHP | Howard Co Housing Commission | … Each program can have its own inspection regime — this answers the scope of the housing-program [confirm] in `08-glossary.md`.
- **Inspection Status** tracks voucher-inspection attempts explicitly: Passed 1st | Failed 1st | No Entry 1st | Failed 1st, Passed 2nd | … | Failed 1st, No Entry 2nd, Passed 3rd.
- **Owner** includes third-party/partner owners as first-class options: DP new unit | Dominion Properties | Dominion Financial Services | Fred Lewis IRA | RMN Investments / Fred Lewis | Chesapeake Realty / Jack BeVier | Lime Street Investments / Dan Carpenter | … — one side of the presumed D11 comparison.
- **Helm mapping:** PH-5/PH-6/PH-7 derivation (verbatim Status), D7 (close-out), D14 (creation), half of D11, and the "parked - not turning over" hold state from `02-property-lifecycle.md` §4. Note the *decision* to park is recorded upstream in Sched Vacants (§3.4); Vacant Units carries the parked *state*.

### 3.4 Sched Vacants (app 19831048, 1,254 items) — Occupancy workspace

The notice-phase (PH-9) record: a tenant has given (or triggered) notice and the unit's turn is being pre-planned. This is the app where the notice window's free look-ahead (see `02-property-lifecycle.md` PH-9) is actually worked.

- **Fields that matter to Helm:** tenant, Move Out Date, Key/Lockbox, Lead Cert Type, BGE, Trash, Extermination, and **per-trade pre-turn review fields** (PLUM/HVAC/ELEC/ROOF Recommend + Review) — turn scoping during notice, exactly the PH-9 behavior the phase model hopes for.
- **Status:** Occupied | Vacant.
- **Move Scenario:** Approved 60 Day NTV | Denied 60 Day NTV (Rent Owed) | Denied 60 Day NTV (Small Claims Owed - Need Judgment) | Denied 60 Day NTV (Small Claims Owed - Have Judgment) | Denied 60 Day NTV (Lease Term Not Up) | Program Granted Move (Abatement) | Program Granted Move (No Small Claims Judgment) | Intimidated Witness - Program Granted Move | Voucher Terminated | Eviction | Skip | DM Issue
- **Reason Leaving:** Voucher Reduced | Voucher Increased | Dislikes Location | Lack of Amenities | Maintenance Issues | Unhappy with DM | N/A - Abatement | N/A - Voucher Terminated | N/A - Tenant is Deceased | N/A - Skipped | N/A - Eviction | N/A - DM Issued NTV | Other | VAWA | DM Issued/Rescinded
- **Turn Over Status:** Turn Over to DP | **Not Turning Over - Parked** — **this is where "parked" is decided**: parked = a deliberate decision NOT to hand the unit to DP for turnover (per Podio API tour 2026-07-09). This substantially answers the "is parked a deliberate hold?" question in `02-property-lifecycle.md` §4 — it is a recorded decision with a home field. [confirm: who is authorized to set Turn Over Status = "Not Turning Over - Parked", and what triggers un-parking?]
- **Live turn-engine flows (GlobiFlow UI 2026-07-12, per Jack, decision 19 (2026-07-12)) — the DM→DP turnover, VACANCY-side START of the turn loop:** Sched Vacants is the live turn engine. `Turn Over Status` → "Turn Over to DP" fires the record-creation flows that create the Renovation **turnover** project in Pipeline - Construction — two owner-split variants: **DP** (flow ID 614403, gated `Owner = "Dominion Properties"`, action "Create a new item in Renovation", created Renovation **Category = "Turnover"**) and **3P** (third-party owner, created Renovation **Category = "3rd Party - Turnover"**). Sibling flows: **"turnover email from DM to DP"** sends the GlobiFlow-generated last-tenancy scoping email (`no-reply@automation.podio.com`, "From: Tori Fowlkes" (DM Field Inspector — not Victoria), ~19-person DP+DM distribution) carrying BR/BA, rent, program/tenancy history, and full HVAC/plumbing/electrical/roofing history with vendor + cost per line — the recurring-issue/capex signal Jack described (example saved: `sources/example-turnover-email-dm-to-dp.md`); another sibling creates the Vacant Units record on the "vacant" click. Per Jack, a **Buildertrend job** is also created for the turn. This is the OPPOSITE direction from decision 18's DP→DM completion handoff ("Handed Off - Rental" + AppFolio asset) — two turnover emails, two ends of the same turn loop; never conflate (see `08-glossary.md`). **CODE GAP: Helm does NOT read Sched Vacants** (Helm codebase read 2026-07-11 — zero references to app 19831048), so this entire turn-loop trigger is invisible to Helm today, which is exactly why PH-9/PH-10 don't populate (see `02-property-lifecycle.md` PH-9/PH-10).
- **Helm mapping:** PH-9 signal source (none is wired today — PH-9 showed 0 properties on tour; this app is the obvious feed), and the authoritative "parked" decision record for the hold-state treatment proposed in `04-cycle-time-model.md` §4.5.

### 3.5 Move Outs (app 10684171, 228 items) — Move Ins & Move Outs workspace — ARCHIVE

**ARCHIVE — retired ~November 2017:** no item has been created here since 2017-11-16 (per Podio API activity probe 2026-07-11). This was the older generation's PH-10 operational record — the unit is vacant and the physical/administrative move-out is being processed. The live PH-10 record is Sched Vacants + Vacant Units (§3.3–§3.4). Schema retained below for the eventual data-migration/archive decision.

- **Fields:** Move Out Date, Turnover Status, BGE status, Trashout Notes, Extermination, Mechanical Review, Grass Cutting, **SDD** (security-deposit disposition) workflow, Collections Status.
- **Turnover Status:** Not Yet Turned Over to DP | Turned Over to DP. **BGE:** open item | On in Dominion's name | Not on in Dominion's name - see notes. **SDD Status:** Not Started | In Process | Completed - No Mailing Address | Completed & Mailed. **Program:** Section 8 | HOPWA | MBQ | Market | Dayspring | PLASE | PEP.
- **Helm mapping:** none live — Move Outs is NOT the live PH-10 record; the turn is worked from Sched Vacants + Vacant Units (per Podio API activity probe 2026-07-11; §6 item 6 RESOLVED). The 228 items are historical data for the migration/archive decision (§3.6).

### 3.6 The two leasing-app generations — RESOLVED: the older generation is an archive

**Two generations of leasing apps coexist in schema — but only one is alive.** The item-creation activity probe resolves what was this doc set's most pressing mapping question: **the Move Ins & Move Outs workspace is an ARCHIVE, retired ~November 2017** — no item has been created in any of its 8 apps since 2017 (Attempted Notices since 2015) — and **the live leasing surface is Sched Vacants + Vacant Units** (36 and 94 new items in the last 90 days respectively; newest items created the week of the probe). Per Podio API activity probe 2026-07-11 (full table: `sources/podio-architecture.md` §8):

| Gen | App | Total | New 90d | Newest item created |
|---|---|---|---|---|
| OLDER | Listings | 342 | 0 | 2017-10-31 |
| OLDER | Rental Applications | 856 | 0 | 2017-11-08 |
| OLDER | Upcoming Turnovers | 285 | 0 | 2017-11-16 |
| OLDER | Move Outs | 228 | 0 | 2017-11-16 |
| OLDER | HAP Appointments | 263 | 0 | 2017-07-10 |
| OLDER | Pre-Contract Inspections | 361 | 0 | 2017-10-31 |
| OLDER | Leasebacks | 46 | 0 | 2017-05-08 |
| OLDER | Attempted Notices | 7 | 0 | 2015-02-26 |
| NEWER | Sched Vacants | 1,256 | 36 | 2026-07-10 |
| NEWER | Applications | 1,044 | 0 | 2022-05-12 |
| NEWER | Vacant Units | 1,390 | 94 | 2026-07-09 |

One newer-generation app is dead too: **Applications died 2022-05-12** — zero items created since (per Podio API activity probe 2026-07-11). Application tracking moved somewhere in mid-2022, most plausibly AppFolio's screening module — which means Occupancy's live surface is two apps, not three, and Applications' 54 flows are presumably dormant. [confirm: did application tracking move to AppFolio in mid-2022 — and is anything still read from the Podio Applications app?]

The schema comparison below is retained for data-archaeology and the eventual migration/archive decision (per Podio API tour 2026-07-09) — do NOT read it as a live keying map:

| Older: Move Ins & Move Outs workspace | Newer: Occupancy workspace | Overlap |
|---|---|---|
| Listings (342) | Vacant Units (1,389) | marketing/funnel state |
| Rental Applications (856) | Applications (1,044) | applications |
| Upcoming Turnovers (285) | Sched Vacants (1,254) | notice tracking |
| Move Outs (228) | — | move-out processing |
| HAP Appointments (263), Leasebacks (46), Pre-Contract Inspections, Attempted Notices | — | no newer counterpart |

- **Listings** (Property Status: Not Yet Listed | No Applications | Pending Application | Approved Application, In Inspection Cycle | Leaseback | Site Based | Archived) links → Rental Applications, → Renovation, → Move Outs.
- **Rental Applications vs Applications** share a common shape — App Status (Active | Archived/Closed), Outcome (Pending | Approved | Denied | Canceled/Pulled), Application Type (Program Tenant | Market Tenant), Voucher Size, Background, Home Inspection, Landlord Reference — with Applications adding App Type (Transfer | New App | Leaseback) and Case Search / Income screens. (A third Rental Applications app exists in the Virtual Leasing Assistant workspace.)
- **Upcoming Turnovers** is older-generation notice tracking (60 Day Notice vocabulary, Reason, Program, Current Rent, Voucher Size, Action to Prevent Move, Transfer) overlapping Sched Vacants.
- **HAP Appointments** (263 items) tracks Housing Assistance Payments rent negotiation — PH-6 territory: Need Rent Offer | Reviewing Rent Offer | Negotiating Rent | Approved Rent Offer | Archived; links → Listings.
- **Why this matters (updated):** the two-generation double-keying risk evaporates — there is no active cross-generation duplication; the older generation is data-archaeology, not a live keying surface (per Podio API activity probe 2026-07-11). The older generation's turnover flows are now confirmed **DISABLED**, not merely dormant: **Upcoming Turnovers' flows are ALL disabled** — observed struck-through in the GlobiFlow UI 2026-07-12 (per Jack, decision 19 (2026-07-12)), superseding the earlier "both generations wired" reading for the turnover chain specifically. (Move Outs' structural flows — "Create Rennovation Item on Item Create" [sic], the DM→DP turnover emails, Pipeline-Construction project creation — §4.2, per GlobiFlow UI tour 2026-07-09 — are vestigial regardless: they fire on item events and no item has been created in any Move Ins & Move Outs app since 2017.) Either way they should be retired, not replicated. Absorption planning: the Move Ins & Move Outs workspace needs a data-migration/archive decision, not flow replication. Note the FUNCTIONS the dead apps served still happen — voucher inspections, HAP rent negotiation, leasebacks — but are recorded today in Vacant Units' status/date fields (Insp Date, Rent Appr Date, HAP Contract Receipt Date, Inspection Status) and in Buy Closings.Occupancy = Leaseback (per Podio API activity probe 2026-07-11). Helm replicates the function where it lives now. (The former which-generation-is-live [confirm] is RESOLVED — §6 item 1.)

### 3.7 Lead Certs & Water Bills (app 11132895, 1,308 items) — Rentals Billing & Compliance workspace

**The single rent + compliance master record** (roughly one item per property/unit). This one app is BOTH what the doc set called "Podio Rental Billing" (D20 rent comparisons) AND "Compliance & Licensing" (D17 rental licenses, D18 lead certs) — per Podio API tour 2026-07-09.

- **Compliance fields:** Rental License # + Inspection + License Filing Status 1 (Need Registration | Need Inspection | Inspection Complete | Licensed) + **Rental License Expiration Date** (D17), Cert Type (FRRD | FRRV | LLF | LF | NA Yr Built > 1978 | NA Commercial | SOLD), **Lead Cert Date / Expiration** (D18), MDE Tracking/Certificate numbers.
- **Rent/billing fields:** **Rent / Previous Rent / Current Rent** (D20's Podio side), **Rent Increase Status** (Requested | Increase Received | Rent Confirmed Raised/In Compliance | Increase Denied - See Notes | Increase Not Received) — a whole rent-increase workflow, which bears directly on the `05-data-sync-map.md` §3.3 question of whether D20 "disagreements" are partly definitional (target/updated rent here vs current lease rent in AppFolio) rather than keying errors. Also Water Billable + Quarterly Water Consumption, Program, Lease Anniversary Month.
- **Property Status:** Rented | Turnover | New Unit | Parked | Sold | No longer managed (note "Parked" again — the cross-app hold vocabulary).
- **Owner** options = the entity roster: Dominion Properties LLC, 3rd Party, DFS, Charm City Real Estate, Calvert Street Properties, Red Door Holdings, Dominion Rental Holdings, Gunpowder Realty, plus sub-LLCs (219-237 Park Ave, Allendale Station, Lakeland Vines, Ashburton Woods, Barclay Outlook, Cedmont Narrows, Dolfield Village, Frankford Estates, Greenspring Falls, …) — the other side of the presumed D11 comparison.
- **App links:** → Lead Paint Compliance, → Buy Closings, → Annuals (Inspections workspace), plus a Reference field linking Leasebacks, Renovation, Listings, Pre-Contract Inspections, Move Outs, and HAP Appointments — this app is the closest thing Podio has to a per-unit master index.
- **Helm mapping:** D17, D18, D20, half of D11; PH-8 steady-state compliance; the D20 rent-authority question in `05-data-sync-map.md` §3.3 and `06-audit-rules.md`.

### 3.8 Lead Paint Compliance (app 26654207, 266 items) — Rentals Billing & Compliance workspace

The *active lead-work pipeline* (LeadProbe vendor workflow), distinct from the cert *records* in Lead Certs & Water Bills. **Cert Status:** Initial Review Required | Dominion - Work in Progress | LeadProbe - Initial Review Requested | LeadProbe - In Process | LeadProbe - Required Work Submitted | LeadProbe - Final Review | LeadProbe - Waiting on Lead Certificate | Passed - Need MD Tracking | Complete | Kicked-Back | Upcoming Project | "Send to Maintenance Manager for scope review" | Write Off - Wholesale. Links → Lead Certs & Water Bills, → Buy Closings. Relevant to any future D18 remediation workflow: the fix for an expiring cert runs through this app.

### 3.9 Sale Closings (app 9068512, "Sale", 858 items) — Closings workspace

Dispositions — the PH-X record. **Status:** Under Contract | Sold | Dead. **Type:** Retail | Wholesale | Turnkey | Donation | As-Is on MLS | As-Is Auction. Links → Buy Closings, → Renovation, → Lead Certs & Water Bills, → Pipeline (Bank Loans workspace). **A Sale Closings item is created when a property goes Under Contract for sale** — one per under-contract property, coincident with Renovation.Phase being updated to "Under Contract" (§3.2) — and Sale Closings.Status then tracks Renovation.Phase as a **synchronized pair: Under Contract → Sold**, with both set to **Sold** at close (per Jack, decision 20 (2026-07-12)). This is the disposition record; the expected invariants (Renovation "Under Contract" ⇔ a Sale Closings item exists; Renovation "Sold" ⇔ Sale Closings.Status "Sold") feed the disposition state-consistency candidates in `10-common-data-map.md` §4. The candidate "sold in one system, active in another" rule — **D21, catalogued in `10-common-data-map.md` §4** (its broader write-off analogue is `06-audit-rules.md` §4's candidate #1, the part already shipped as D5) — reads this app's Status = Sold as its trigger, **now confirmed by this pairing as the disposition end-state check** (per Jack, decision 20 (2026-07-12)).

### 3.10 Leasebacks (app 10686287, 46 items) — ARCHIVE

Seller-occupied-after-purchase records: Anticipated Lease Start Date, Rent, Security Deposit, Lead Cert link. ARCHIVE — no item created since 2017-05-08 (per Podio API activity probe 2026-07-11). The lifecycle branch itself is still real and still un-modeled in `02-property-lifecycle.md`'s PH-1→PH-8 pipeline: leasebacks are born at Buy Closings.Occupancy = Leaseback, which is where the function is recorded today.

## 4. The automation layer (GlobiFlow) — the complete flow inventory

Podio carries active automations, not just data — the retirement risk flagged in `05-data-sync-map.md` §5. This section rests on two captures from 2026-07-09: the API webhook check (§4.7) and the **complete GlobiFlow flow inventory, captured via the workflow-automation.podio.com UI under Jack's login** — ~276 flows, names verbatim per app (raw list: `sources/podio-architecture.md` §6). The flows are no longer a black box.

### 4.1 Scale and distribution

**~276 flows org-wide.** The Occupancy workspace alone carries 128 (Vacant Units 67, Applications 54, Sched Vacants 7). Other heavy apps: Lead Certs & Water Bills (21), Buy Closings (20), Reinspections (18), Pre-Contract Inspections (12), Upcoming Turnovers (10), Rental Applications (10), Renovation (9), Move Outs (8), Abatements (7), Annuals (6), Sale Closings (6), Listings (5), Bank Loans Pipeline (3), plus single-digit peripherals. Two flows sit on "Lead Cert Renewal Projects" in a space Jack's own login cannot see ("Not Accessible for your User").

**Activity-adjusted reading (per Podio API activity probe 2026-07-11):** the ~276 include flows attached to dead apps. The ACTIVE estate is roughly **Vacant Units 67 + Sched Vacants 7 + Buy Closings 20 + Lead Certs & Water Bills 21 + the inspection machine 31 (Annuals 6 / Reinspections 18 / Abatements 7) + Renovation 9 + Sale Closings 6 + peripherals**. The flows on the archived Move Ins & Move Outs apps (Upcoming Turnovers 10, Move Outs 8, Rental Applications 10, Pre-Contract Inspections 12, Listings 5, HAP Appointments 2, Leasebacks 2) and on the dead Applications app (54) are VESTIGIAL — they trigger on item events in apps where no item has been created since 2017 (Applications: since 2022). Occupancy's headline 128 therefore overstates its live automation: the active leasing-flow estate is roughly Vacant Units 67 + Sched Vacants 7.

The inventory sorts cleanly into four classes:

### 4.2 Class 1 — structural record-creation chains (the load-bearing automations)

**The turnover loop's Podio record chain is flow-driven end to end — in BOTH app generations:**

- **Newer generation (Occupancy) — LIVE:** the chain fires off `Sched Vacants.Turn Over Status` → "Turn Over to DP" (GlobiFlow UI 2026-07-12, per Jack, decision 19 (2026-07-12)). When "vacant" is clicked in Sched Vacants a flow auto-creates the **Vacant Units** record; separate **DP** (flow ID 614403, gated `Owner = "Dominion Properties"`) and **3P** flows auto-create the **Renovation turnover project** in Pipeline - Construction (created Renovation **Category = "Turnover"** / **"3rd Party - Turnover"** — §3.2, §3.4); another flow auto-creates a **lead-cert renewal task** (feeding the inaccessible Lead Cert Renewal Projects app); the **"turnover email from DM to DP" flow** sends the last-tenancy scoping email (GlobiFlow-generated, ~19-person DP+DM distribution — example: `sources/example-turnover-email-dm-to-dp.md`), with Fred texted on the official turnover; and per Jack a **Buildertrend job** is created for the turn. This is the VACANCY-side DM→DP turnover — the START of the turn loop, opposite the DP→DM completion handoff (decision 18).
- **Older generation (Move Ins & Move Outs) — VESTIGIAL / DISABLED:** the same wiring exists in schema — Upcoming Turnovers' "vacant" click auto-creates a **Move Outs** record and Pipeline-Construction projects (3P and DP variants); Move Outs has "Create Rennovation Item on Item Create" [sic], the DM→DP turnover emails, and "text Fred when official turnover email happens". **CORRECTION (GlobiFlow UI 2026-07-12, per Jack, decision 19 (2026-07-12)): Upcoming Turnovers' flows are ALL disabled — struck-through in the UI, not merely dormant** — superseding the earlier "both pipelines are wired; only the newer fires" reading for the turnover chain. Move Outs' flows are vestigial regardless: they trigger on item events, and no item has been created in any Move Ins & Move Outs app since 2017 (per Podio API activity probe 2026-07-11; §3.6, §6 item 1 RESOLVED). Either way only the newer generation (Occupancy) is the live turn engine. Retire, don't replicate.
- **Acquisition side (Buy Closings, 20 flows):** "Add new property to construction pipeline" — THE confirmed Buy Closings→Renovation auto-creation — plus year-built-gated auto-creation into **Lead Paint Compliance**, creation into **Bank Loans Pipeline**, ratification reminders and closing-date-push flows, and exec notifications (Text Fred New Acquisition / Text Fred with Acquisition Closing; emails to Jake).
- **The inspection machine (31 flows: Annuals 6 / Reinspections 18 / Abatements 7):** failed or no-entry annuals auto-create **reinspections**; reinspections auto-create **24-hour/30-day abatement items** and no-entry escalations; failed reinspections auto-create **abatement chargebacks**. Fully flow-orchestrated.
- **Leasing-funnel creation — VESTIGIAL:** Listings' "Create Inspection on status change" and "Listings to Pre-Contracts Automation"; Pre-Contract Inspections' "Create HAP Appts upon passed inspection status". All three sit on archived apps (no new items since 2017 — per Podio API activity probe 2026-07-11); the functions live in Vacant Units' status/date fields today (§3.6).

These are the flows Helm must replicate one-for-one or consciously retire, per app, before absorption — with the replicate/retire split now empirically drawn: replicate the live apps' chains (Occupancy, Buy Closings, the inspection machine); retire the vestigial chains on the archived apps (per Podio API activity probe 2026-07-11; §4.1).

### 4.2.1 Business rationale per structural flow — STRAWMEN

> Status: strawman rationales drafted 2026-07-09 and presented to Jack for per-row confirmation. Rows marked "per Jack" are confirmed; everything else is inference from the app schemas and lifecycle model. The WHY matters as much as the WHAT: when Helm replaces a flow, it must satisfy the business reason, not just replicate the mechanics.

**A. Acquisition chain (Buy Closings, 20 flows)**

| # | Flow | Strawman business reason |
|---|---|---|
| A1 | Add new property to construction pipeline (→ Renovation item on first save) | Renovation prep must start at contract, not closing — scope/design during the contract period shortens post-close time-to-job-start, and no purchase can fall off the construction team's radar. (Mechanics confirmed per Jack, item 12; reason inferred from items 8–10.) |
| A2 | Year-built-gated auto-creation → Lead Paint Compliance | Maryland lead law applies to pre-1978 rentals; opening the lead-work record at acquisition means compliance starts before any tenant is in play — an expired/absent cert blocks legal leasing. |
| A3 | Auto-creation → Bank Loans Pipeline | Most acquisitions are financed (Purchase Financing: CFG LOC, Wesbanco, DFS…); the loan record must exist from day one so financing tasks track alongside the purchase. |
| A4 | Ratification reminders + closing-date-push flows | Contract-to-close runs on hard calendar deadlines (EMD at risk, trustee-sale court ratification); nudges keep Victoria's pipeline moving — a proto-clock-1. |
| A5 | Text Fred on new acquisition / closing; emails to Jake | Real-time executive visibility on capital deployment. |

**B. Turnover chain — Occupancy generation (Sched Vacants 7 flows)**

| # | Flow | Strawman business reason |
|---|---|---|
| B1 | Vacancy click → auto-create Vacant Units record | The moment a unit is vacant, the leasing-funnel record must exist so marketing/turn tracking starts day one — no gap where nobody is working the vacancy (the flow-side preventer of what D14 audits). |
| B2 | Auto-create Renovation turnover project (separate 3P and DP variants) | A turn is a construction job; auto-creating the DP-side project is the DM→DP baton encoded in software — no vacant unit sits without a work order. The 3P/DP split exists because third-party-owned units bill differently than Dominion-owned ones. |
| B3 | Auto-create lead-cert renewal task (→ Lead Cert Renewal Projects) | Maryland requires a fresh lead cert at tenancy change; spawning the renewal at vacancy puts the cert in motion before re-lease — cert wait must overlap the turn, not follow it. |
| B4 | DM→DP turnover handoff email + text Fred on official turnover | The handoff is an organizational/accounting boundary (DM-expensed turn work begins); the email is the official record of the baton pass, and Fred's text is the exec pulse on vacancy flow. |

**C. Turnover chain — Move Ins & Move Outs generation (Upcoming Turnovers 10, Move Outs 8)**

| # | Flow | Strawman business reason |
|---|---|---|
| C1 | Upcoming Turnovers vacancy click → auto-create Move Outs record + Pipeline-Construction projects (3P/DP) | Same reasons as B1/B2 — this is the older wiring of the same business process. **VESTIGIAL — app archived (nothing has keyed Upcoming Turnovers since 2017, per Podio API activity probe 2026-07-11) AND the flows are now confirmed disabled (struck-through, GlobiFlow UI 2026-07-12, per Jack decision 19); the function lives in the B-row chain; retire, don't replicate.** (Former [confirm] here RESOLVED — §6 item 1.) |
| C2 | Move Outs "Create Rennovation Item on Item Create" + turnover emails + text Fred | Same reasons as B2/B4, older generation. **VESTIGIAL — app archived (per Podio API activity probe 2026-07-11); the function lives in the B-row chain; retire, don't replicate.** |

**D. Inspection machine (Annuals 6, Reinspections 18, Abatements 7)**

| # | Flow | Strawman business reason |
|---|---|---|
| D1 | Failed/no-entry Annual → auto-create Reinspection | Failed annual inspections (program/license) must be re-inspected within regulatory windows; auto-creation guarantees no failure dies without follow-up. |
| D2 | Reinspection → auto-create 24-hour/30-day Abatement items + no-entry escalations | Code violations carry statutory abatement windows (24-hour emergency / 30-day standard); missing them means fines or rent escrow — the flow encodes the legal deadlines. |
| D3 | Failed reinspection → abatement chargeback | When a contractor's incomplete work causes a failed reinspection, the abatement cost is charged back — accountability plus cost recovery. |

**E. Leasing-funnel creation (Listings 5, Pre-Contract Inspections 12)**

| # | Flow | Strawman business reason |
|---|---|---|
| E1 | Listings "Create Inspection on status change" | An approved program-tenant application triggers the voucher inspection cycle; the inspection record must exist the instant the application is approved because inspection wait is the critical path of PH-6 (clock 7). **VESTIGIAL — app archived; the function now lives in Vacant Units' Status / Insp Date / Inspection Status fields (per Podio API activity probe 2026-07-11); retire, don't replicate.** |
| E2 | "Listings to Pre-Contracts Automation" | Same critical-path logic — the pre-contract workflow record spins up when a listing reaches approved-application stage. **VESTIGIAL — app archived; the function now lives in Vacant Units' approved-* Status progression (per Podio API activity probe 2026-07-11); retire, don't replicate.** |
| E3 | Pre-Contract Inspections "Create HAP Appts upon passed inspection status" | For voucher tenants, passing inspection unlocks the next gate — rent negotiation with the housing authority; auto-creating the HAP appointment keeps the funnel moving toward contract. **VESTIGIAL — app archived; the function now lives in Vacant Units' Rent Appr Date / HAP Contract Receipt Date fields (per Podio API activity probe 2026-07-11); retire, don't replicate.** |

**F. Cross-app syncs (Class 4 — the load-bearing ones)**

| # | Flow | Strawman business reason |
|---|---|---|
| F1 | Update Renovation App Closing Date (Buy Closings →) | Construction planning is keyed to actual ownership — the job can't start before close, so the construction record must track closing-date slips automatically. |
| F2 | Update Listings on Approved Applications (Rental Applications →) | Listing state must reflect application state so a unit with a pending/approved app isn't double-marketed. **VESTIGIAL — both apps archived; the function now lives in Vacant Units' on-market/pending-app Status values and AppFolio (per Podio API activity probe 2026-07-11); retire, don't replicate.** |
| F3 | Update Construction Rental Status {Approved Applicant, Inspection Submitted, RFTA Submitted} (Pre-Contract Inspections → Renovation) | The construction/punch-out crew needs leasing state visibility: an approved applicant with a scheduled inspection reprioritizes work — get the unit inspection-ready now. **VESTIGIAL — source app archived; the function now lives in Vacant Units' status/date fields (per Podio API activity probe 2026-07-11); retire, don't replicate.** |
| F4 | Update Pre-Contract, Inventory, Inspection, and Listings on Rented Status (HAP Appointments → four-app fan-out; "Inventory" = Renovation view, per Jack item 15) | "Rented" is the funnel's terminal event — every open workflow record must close/update so no one keeps working a unit that's done. One real-world event fanned to N records: exactly the propagation pattern Helm replaces. **VESTIGIAL — source app archived; the rented terminal event now lives in Vacant Units Status = "contract executed" (per Podio API activity probe 2026-07-11); retire, don't replicate.** |
| F5 | Lead Paint Compliance SYNC (Lead Certs ↔ Lead Paint Compliance) | The cert master record and the active lead-work pipeline must agree so compliance status is readable in one place without chasing the vendor workflow. |
| F6 | Bank Loans add/update from Buy Closings + Lead Certs | Loan collateral records must track underlying property state (acquisition status, compliance) for lender reporting and draw management. |
| F7 | Leasebacks two-way updates (↔ Buy Closings, Construction, Renovation-view) | Leaseback = the seller stays on as tenant; when it ends (vacate/eviction), the purchase record and construction pipeline must learn the unit is now turnable. **VESTIGIAL — Leasebacks app archived; leasebacks are recorded via Buy Closings.Occupancy = Leaseback today (per Podio API activity probe 2026-07-11); retire, don't replicate.** |
| F8 | Turnover = unset water billable, rent, program & anniversary month (Lead Certs) | Rent is renegotiated at every turn (especially voucher rents); clearing stale values prevents anyone — or any report — from relying on the old tenant's rent for a unit whose next rent is unknown. (Direct D20 design consequence, §4.6.) |

### 4.3 Class 2 — per-person hardcoded notifications (~120 of the ~276)

Roughly 120 flows are per-person × per-event notifications: "notify {Kenesha, Lakia, … 13+ staff} when {contract date set, contract signed, inspection set, RFTA submitted}" (Vacant Units) and "notify {17 staff} if app {approved, cancelled, denied}" (Applications). This is Podio's brittle version of a push-alert layer — every staffing change means editing flows one by one. **Helm's role-based alerting replaces this entire class wholesale.** (Side effect: the flow names double as a leasing/ops staff roster — `sources/podio-architecture.md` §6.)

### 4.4 Class 3 — deadline watchdogs (proto-T-rules)

GlobiFlow already runs primitive cycle-time and expiry alerts:

- "notify Leasing and property manager that **RFTA submission is late**" (Vacant Units)
- "**Upcoming LLF Expiration Date** - WIP DM" (Lead Certs & Water Bills) — a proto-D17/D18
- "Email Craig when **inspection is less than 15 days out** and work is not reported completed by contractor" (Reinspections)

The org has already built one-off versions of what Helm's cycle-time engine does uniformly.

### 4.5 Class 4 — cross-app field syncs

Widespread inside Podio, not exceptional: "Update Renovation App Closing Date" (Buy Closings); "Update Listings on Approved Applications" (Rental Applications); "Update Construction Rental Status — {Approved Applicant, Inspection Submitted, RFTA Submitted}" (Pre-Contract Inspections — leasing-funnel status written *back into the construction record*); "Update Pre-Contract, Inventory, Inspection, and Listings on Rented Status" (HAP Appointments — a four-app fan-out); "Lead Paint Compliance SYNC" (Lead Certs); Bank Loans add/update from both Buy Closings and Lead Certs; Leasebacks' two-way updates.

**Nuance the doc set needs:** Podio-*internal* edges are heavily automated; the truly *manual* edges are cross-*platform* (Podio ↔ AppFolio / Buildertrend / QuickBooks). The "manual propagation" burden should be read per-edge — the human cost concentrates exactly where Helm's sync layer sits.

### 4.6 The rent-unset-on-turnover flow (critical for D20)

A Lead Certs & Water Bills flow — "**turnover = unset water billable information, rent, program & anniversary month**" — deliberately **clears** the Podio rent/program fields when a unit enters turnover. An empty or changed Podio rent during turnover is *expected, flow-driven state*, not human error. D20 comparisons must gate on turnover state before flagging a rent mismatch.

### 4.7 Webhook attachment points (API-verified)

GET /hook/app/{id}/ shows **active `item.create` webhooks registered by the "Workflow automation" client (GlobiFlow)** on all three lifecycle-core apps checked, each with a failover-queue twin:

| App | Webhook created | GlobiFlow params |
|---|---|---|
| Buy Closings (9068504) | 2020-11-30 | c=2541&p=16234 |
| Renovation (10728781) | 2021-04-02 | c=2541&p=16235 |
| Vacant Units (19820093) | 2022-05-05 | c=2541&p=142588 |

Consistent with the named flows above (e.g., "Add new property to construction pipeline" — `sources/jack-decisions.md` item 12). The `p=` parameters are GlobiFlow flow/app ids; the flow logic is not exposed via the public API — hence the UI capture.

### 4.8 What remains uncaptured

- **Individual flow LOGIC** (trigger conditions + full action lists) — visible per-flow in the GlobiFlow UI; capture selectively where a flow matters to Helm design. Top candidates: the Sched Vacants / Move Outs record-creation chains, the rent-unset-on-turnover flow, the RFTA-late watchdog (§6 item 8).
- **Flow names for the peripheral apps:** Leasing Leads (1), TCB Disputes (1), the High Water Bills apps (5), Lead Cert Renewal Projects (2 — inaccessible space).
- **Two curiosities, both since resolved by Jack (§6 items 11–12):** "Yardi" in a flow name is the pre-AppFolio PM system (legacy reference), and "Inventory" is a saved View in the Renovation app, not a separate app — "Update Inventory…" flows write Renovation items.

Design consequence (sharpened from `05-data-sync-map.md` §5): every app targeted for absorption must have its attached flows classified against the four classes above and replicated or consciously retired. The per-app checklist now exists.

## 5. What this changes for Helm's design

1. **Vacant Units.Status is the derivation source — treat it as a contract.** Helm's PH-5/PH-6 phase strings are this app's Status options verbatim. That means (a) the 14-value vocabulary in §3.3 is effectively Helm's input schema and any Podio-side vocabulary edit silently breaks derivation; (b) absorption of Vacant Units (stage 1 of the `05-data-sync-map.md` roadmap) must reproduce this vocabulary or map it deliberately.
2. **The PH-5→PH-7 clock chain already exists as data.** The nine Vacant Units date fields (Date Vacant → HAP Contract Receipt Date) are precisely the sub-clock decomposition `04-cycle-time-model.md` clock 7 wanted for the housing-program wait — the biggest carry-day pool in the portfolio (PH-6, 61 properties). Helm can back-compute historical baselines from 1,389 items before asking Jack to confirm any strawman target, subject to the keying-discipline [confirm] in §3.3.
3. **Renovation.Phase decomposes PH-3 for free.** 43 stages spanning the whole property life, with per-trade child jobs in 18 linked apps. Helm could clock every construction stage without new data capture. It also means Podio's construction mirror is *richer* than a mere status copy — the absorption story for the construction double-entry (`05-data-sync-map.md` §3.6) has to preserve this granularity or consciously discard it.
4. **The acquisition-type attribute already exists** (Buy Closings.Type: Private | Trustee | REO | Builders | Short Sale | OHAAT | NCST), as do EMD (the deposit) and Purchasing Entity (the owner LLC). The `02-property-lifecycle.md` PH-2 question "should Helm model acquisition type as a property attribute?" becomes "Helm should *read* the attribute that already exists" — no new capture needed (per Podio API tour 2026-07-09).
5. **The two-generation question is RESOLVED — the older generation is an archive and its automations are vestigial.** No item has been created in any Move Ins & Move Outs app since 2017, so the older flows (§4.2) never fire — dormant because no item events arrive (per Podio API activity probe 2026-07-11); and **Upcoming Turnovers' turnover flows are additionally confirmed disabled** — struck-through in the GlobiFlow UI 2026-07-12 (per Jack, decision 19 (2026-07-12)), superseding the earlier "still-wired" reading for the turnover chain (§4.2). Podio-reading features read the Occupancy generation — specifically Sched Vacants + Vacant Units, since Applications has been dead since 2022-05 — and retirement planning treats the older workspace as a data-migration/archive decision, not a flow-replication surface (§3.6).
6. **One app to absorb, not two.** Rent + compliance = Lead Certs & Water Bills. The retirement roadmap's "Rental Billing" and "Compliance & Licensing" stages collapse into a single absorption with a single owner conversation (Stephanie's team keys it; accounting reads it).
7. **"Parked" is a recorded decision with a home field** (Sched Vacants.Turn Over Status), echoed as state in Renovation (Phase/Proj Mgr/Category), Vacant Units (Status), and Lead Certs (Property Status). The `04-cycle-time-model.md` §4.5 hold-state proposal can anchor on the Sched Vacants field rather than inferring intent from status strings.
8. **PH-6 is 28+ programs, not "Section 8."** Program vocabularies in Vacant Units and Move Outs list HABC, county S8s, BRHP, HOPWA, Dayspring, and two dozen more — each a potential distinct inspection/paperwork regime inside clock 7.
9. **Third-party/partner owners are first-class** in the Owner option lists (Fred Lewis IRA, partner LLCs, "3rd Party") — Helm's registry and D11 handling should expect owners outside the Dominion entity matrix in `01-company-overview.md`.
10. **Legacy debris exists** — an app literally named "DO NOT USE" (Inspections workspace), an "Old Leads" app, an "OLD - High Water Bill" app, and a brand-new empty Property Registration/Licensing app (0 items). Absorption scoping should not assume every app is load-bearing.
11. **Retiring a Podio app means retiring its flows — and flow-replication scope is the LIVE apps only.** The turnover loop's record chain is GlobiFlow-driven end to end (§4.2): vacancy click → leasing record → construction project → lead-cert renewal task → DM→DP handoff email. Each absorption stage in `05-data-sync-map.md` §5 must ship one-for-one replacements for its app's Class-1 flows on day one — for the live apps (Vacant Units, Sched Vacants, Buy Closings, Lead Certs & Water Bills, the inspection machine, Renovation, Sale Closings). The vestigial chains on the archived Move Ins & Move Outs apps and on the dead Applications app get retired, not replicated (per Podio API activity probe 2026-07-11; §4.1). The per-app checklist now exists (§4.1; `sources/podio-architecture.md` §6).
12. **~120 flows collapse into Helm's role-based alerting.** The per-person notification class (§4.3) is nearly half the automation estate and is exactly the layer Helm's alerting replaces wholesale — the largest single simplification win in the retirement, and it removes the staff-change fragility for free.
13. **The T-rule concept is pre-validated by Podio itself.** The deadline watchdogs (§4.4 — RFTA-late, LLF-expiration-upcoming, inspection-15-days-out) are one-off GlobiFlow versions of Helm's cycle-time rules; the org has already voted for this alert class. Helm standardizes scattered per-app flows into uniform machinery.
14. **D20 must be turnover-aware.** The rent-unset-on-turnover flow (§4.6) deliberately clears the Podio rent/program fields when a unit enters turnover — an empty Podio rent on a unit in turnover is expected flow state, not a keying error. D20 (and the rent-authority discussion in `05-data-sync-map.md` §3.3) must check turnover state before flagging.
15. **Recast "manual propagation" per-edge: automated inside Podio, manual across platforms.** Cross-app field sync is widespread within Podio (§4.5), so the double-entry burden mapped in `05-data-sync-map.md` §1 concentrates on the cross-platform edges (Podio ↔ AppFolio/Buildertrend/QuickBooks) — precisely the gap Helm's sync layer fills.

## 6. Open questions ([confirm] rollup)

One question per tag, per the doc-set convention (items 1–7 collect the inline tags above — items 1 and 6 now RESOLVED per Podio API activity probe 2026-07-11; item 8 is the narrowed successor of the answered GlobiFlow-access question; item 9 is resolved; item 10 arises from the §2 inventory; items 11–12 arise from the §4 flow inventory; item 13 arises from the 2026-07-11 activity probe):

1. RESOLVED — per Podio API activity probe 2026-07-11: **the Move Ins & Move Outs workspace is retired — an ARCHIVE, retired ~November 2017.** No item has been created in any of its 8 apps since 2017 (Listings 2017-10-31, Rental Applications 2017-11-08, Upcoming Turnovers 2017-11-16, Move Outs 2017-11-16, HAP Appointments 2017-07-10, Pre-Contract Inspections 2017-10-31, Leasebacks 2017-05-08; Attempted Notices 2015-02-26). The live leasing surface is Sched Vacants (36 new items in 90 days) + Vacant Units (94 new in 90 days) in the Occupancy workspace. The older generation's still-wired flows (§4.2) are vestigial — dormant because no item events arrive. Full table: `sources/podio-architecture.md` §8.
2. [confirm: is Helm's "Closing" source (shown under the "Acquisitions CRM" banner on tour) reading the Buy Closings app?]
3. [confirm: is D11 comparing exactly Vacant Units.Owner vs Lead Certs & Water Bills.Owner?]
4. [confirm: who keys the Vacant Units date fields (Date Vacant → HAP Contract Receipt Date), and at-event or back-filled?]
5. RESOLVED (per Helm codebase read 2026-07-11): derivation reads almost none of the 43-value vocabulary — only the write-off list (`Write Off`/`Parked`/…) → PH-Z and a `/complete/i` test to exit PH-3; every other value, including "Handed Off - Rental", falls into the PH-3 catch-all. The vocabulary is stored verbatim but unused by `derivePhase()`.
6. RESOLVED — per Podio API activity probe 2026-07-11: **Move Outs is NOT the live PH-10 record** — no item created since 2017-11-16. The turn is worked from Sched Vacants + Vacant Units (Status = "in turnover").
7. [confirm: who is authorized to set Sched Vacants.Turn Over Status = "Not Turning Over - Parked", and what triggers un-parking?]
8. RESOLVED, then narrowed — the former question here (who can grant workflow-automation.podio.com UI access?) is answered: access was obtained under Jack's login and the full flow inventory captured, per GlobiFlow UI tour 2026-07-09 (§4). What remains is depth, not access: [confirm: which flows should get full logic capture (trigger conditions + complete action lists) from the GlobiFlow UI next — proposed shortlist: the Sched Vacants and Move Outs record-creation chains, the rent-unset-on-turnover flow, and the RFTA-late watchdog?]
9. RESOLVED — superseded: API webhook enumeration across the remaining ~62 apps is no longer a gating step for the automation map; the UI flow inventory (per GlobiFlow UI tour 2026-07-09) already gives per-app flow counts and names org-wide, a strictly richer map than webhook presence-checks would yield.
10. [confirm: what is the new, empty Property Registration/Licensing app (26964701) being stood up for — does it change the compliance-absorption plan in `05-data-sync-map.md` §5?]
11. RESOLVED — per Jack (2026-07-09): **Yardi was the pre-AppFolio property-management system.** The "Violations in Yardi" flow name is a legacy reference; treat it as rename-or-retire cleanup when that flow is touched.
12. RESOLVED — per Jack (2026-07-09): **"Inventory" is not an app — it is a pre-defined filter set (a saved View) in the Renovation app.** Flows named "Update Inventory…" (Leasebacks, HAP Appointments) update Renovation items surfaced by that view. Consequence: the HAP rented-status fan-out and the Leasebacks updates write to Renovation — the same record Helm reads for the *business* PH-3→PH-4 handoff marker (which, per the §1 correction, does not drive the live phase).
13. The Occupancy **Applications app died 2022-05-12** — zero items created since, and its 54 flows are presumably dormant too (per Podio API activity probe 2026-07-11; §3.6). Application tracking moved somewhere in mid-2022, most plausibly AppFolio's screening module: [confirm: did application tracking move to AppFolio in mid-2022 — and is anything still read from the Podio Applications app?]

Not yet captured (see `sources/podio-architecture.md` §7): field schemas for the non-core workspaces (Construction Scheduling per-trade fields, Inspections apps, Bank Loans), individual GlobiFlow flow logic (capture selectively per item 8 above), flow names for the peripheral apps (Leasing Leads, TCB Disputes, High Water Bills, Lead Cert Renewal Projects — the last in a space Jack's login cannot see), and any item-level data (deliberately skipped).
