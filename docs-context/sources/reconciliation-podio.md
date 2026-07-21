# Reconciliation — Org Chart × Podio activity (last 120 days)

Source: Podio REST API revision crawl, 2026-03-14 → 2026-07-12 (my own OAuth). Method: for each of the 15 active apps, crawled item revisions of up to the 100 most-recently-edited items and counted in-window revisions per author (GlobiFlow/system actors separated out). **Revision counts = relative work intensity, not absolute** — apps with >100 window-edited items (Lead Certs, Annuals, Reinspections, Vacant Units, Renovation, Sched Vacants, Bank Loans Pipeline) are sampled, so absolute counts undercount but the *ranking* and *who-touches-what* hold. Names normalized via the alias map in `org-charts.md`. Full data: `scratchpad/podio_users_result.json`.

**19 distinct individuals** touched Podio in the window. This is the PODIO dimension only — AppFolio and Buildertrend pending.

## Global roster (by Podio work intensity)

| # | Person | Org role | Podio revs* | Apps | Last active |
|--:|---|---|--:|--:|---|
| 1 | **Craig Cuocci** | DM — Inspections & Maintenance Mgr | 2,383 | 7 | Jul 12 |
| 2 | **Saad ul Hassan** ("Saadi Hassan") | DM — Asst PM (Upwork) | 1,195 | 3 | Jul 10 |
| 3 | **Victoria Robinson** | DP — Transaction Coordinator | 808 | 4 | Jul 9 |
| 4 | **Genesis Cabrera** | DP — Acquisitions Assistant (Upwork) | 732 | 3 | Jul 10 |
| 5 | **Tori Fowlkes** | DM — Field Inspector | 459 | 1 | Jul 8 |
| 6 | **Stephanie Derry** | DM — Property Manager | 389 | 5 | Jul 10 |
| 7 | **Kadijah Punch** | DM — Asst PM | 379 | 3 | Jul 10 |
| 8 | **Christina Williams** | DP — Construction Ops Assistant | 223 | 2 | Jul 10 |
| 9 | **Ashley Ward** | DM — Asst PM | 170 | 5 | Jul 1 |
| 10 | **Mary Cutajar** (`mary@…` — display-name not set) | DM — Field Inspector | 143 | 1 | Jul 10 |
| 11 | **James Stewart** | Dir Field Ops (DM+DP) | 124 | 4 | Jun 16 |
| 12 | **Brian Leibowitz** | DP — Director of Acquisitions | 109 | 3 | Jul 9 |
| 13 | **Jack BeVier** | Partner | 97 | 2 | Jun 17 |
| 14 | **Darren McShane** | DP — Home Buyer | 81 | 2 | Jul 9 |
| 15 | **Pauline Jose** | DM — Administrative Assistant (Upwork) | 73 | 2 | Jul 11 |
| 16 | **Robert O'Sullivan** | DP — Construction Manager | 40 | 2 | Jun 5 |
| 17 | **Kenesha Gray** | DM — Leasing Agent | 18 | 1 | **May 1** (stale) |
| 18 | **"Reception"** (shared login — likely Toni Perry) | DM — Receptionist? | 8 | 2 | Jun 25 |
| 19 | **Aleksey Dekan** | **NOT ON ORG CHART** — unknown | 7 | 1 | Jun 29 |

\* Sampled; relative intensity.

## Who's active in Podio, by function

- **Inspections / compliance (the biggest Podio footprint):** essentially **Craig Cuocci alone** — Annuals, Reinspections, Abatements, Code Violations, Lead Certs & Water Bills, Lead Paint Compliance, plus Vacant Units. Robert O'Sullivan and James Stewart make light Lead-Paint/Lead-Cert touches.
- **Turnover / leasing pipeline (Vacant Units + Sched Vacants):** Saad ul Hassan (dominant), Craig, Stephanie Derry, Kadijah Punch, Tori Fowlkes, Genesis Cabrera, Mary Cutajar, Ashley Ward, Kenesha Gray.
- **Acquisitions / closings / disposition (Buy Closings, Renovation, Sale Closings, Bank Loans Pipeline):** Victoria Robinson (hub), Genesis Cabrera, Christina Williams, Brian Leibowitz, Darren McShane, Jack BeVier, James Stewart.
- **Small Claims / TCB Disputes / Water-bill Research (collections & billing tail):** Ashley Ward, Stephanie Derry, Pauline Jose, "Reception".

## Org-chart people with NO Podio activity in the window

Grouped by whether the absence is **expected** (their system of record is elsewhere) or **notable**:

**Expected — system lives elsewhere:**
- **All of HR/recruiting** (Dominique Lake, Korinn Fox, Jack Knudsen, Serina Cadavero) + Office Admin Mavz Carupo — recruiting tools, not ops apps.
- **All Accounting** (Erv Elswick, Marylou Lamcke, Katherine Neumiller) — QuickBooks/BNA/AppFolio, not Podio.
- **Fred Lewis** (exec).
- **In-house construction crew** (Israel Portillo, Jymmy Duarte, Jose Figueroa, Roland Keller, Jose Mendez, Sergio Perez, Pedro Vasquez) — field labor; Buildertrend/none.

**Notable — role would suggest Podio use, but none seen:**
- **The entire construction PM layer:** Richard Choyce, John Meller, Mathew Snyder, Patrick Stewart — **0 Podio activity.** They work in **Buildertrend**; the Podio Renovation record is kept by Christina Williams + James Stewart, not by the PMs doing the work. (Confirms decision 18: BT is the construction source; Podio Renovation is an admin-kept mirror.)
- **Craig Cuocci's entire maintenance org** — Robert Mara, Brian Kaminski, Juma Putman, Christopher Holliday, Jessica Thomas, Ronald Cooper, Khalil Bryant, Edward Jamison, Tamika Pinder, Oceana Bush, Rita Staten — **0 Podio activity, all 11.** Their work lives in **AppFolio (work orders) + the field**; Craig is the single Podio conduit for the whole maintenance/inspections function.
- **Selim Demirkan** (Acquisitions Assistant, under Brian) — 0 Podio; Genesis Cabrera is the active acquisitions assistant.
- **Toni Perry** (Receptionist) — possibly the shared "Reception" login (8 revs); not attributable to her by name.

## Podio actors NOT on the org charts
- **Aleksey Dekan** (7 revs, Vacant Units, last Jun 29) — not on either chart. [confirm: who is this — current staff missing from the chart, a contractor, or a departed user with a live account?]
- **"Reception"** — a shared/generic Podio login (not a named person). [confirm: whose front-desk account is this?]
- **Rachel Walsh (CMO)** and **Jamie Koehler (ext agent)** — neither appears in the 120-day Podio roster (expected; marketing/external sales aren't in these ops apps).

## SOP-relevant findings (Podio dimension)

1. **Single-point-of-dependency: Craig Cuocci is the entire maintenance/inspections Podio footprint.** His 11-person team touches no Podio; all inspection/compliance record-keeping funnels through him. Both a bus-factor risk and an SOP design fact — the maintenance SOP is really "field work in AppFolio → Craig keys the Podio compliance/inspection records."
2. **Construction PMs don't use Podio — they use Buildertrend.** The Podio Renovation record is maintained by admin staff (Christina Williams, James Stewart). This is the mirror-lag exposure decision 18 predicted, now confirmed by activity: the people doing the work (PMs) and the people keying the Podio mirror (admins) are different, so Podio Renovation lags reality by a handoff.
3. **Offshore/Upwork assistants carry a huge share of Podio data entry** — Saad ul Hassan (1,195), Genesis Cabrera (732), Kadijah Punch (379), Pauline Jose (73). The "gap-filler" Podio keying Jack wants to eliminate is concentrated in assistant roles, not the role owners. Retiring Podio directly reduces their manual burden.
4. **The named Leasing Agent (Kenesha Gray) is barely in Podio and stale (last May 1).** Leasing-funnel Podio work is done by the Asst PMs (Saad, Kadijah, Ashley) instead. Worth confirming whether leasing has effectively shifted off Podio to AppFolio.
5. **Data hygiene:** Mary Cutajar's Podio account shows as a raw email (`mary@thedominiongroup.com`), and a shared "Reception" login blurs attribution — both undermine any per-user audit and should be normalized.
6. **Function → app clustering is clean** and maps to the lifecycle: acquisitions/closings (Victoria+Genesis+Brian+Darren), construction mirror (Christina+James), inspections/compliance (Craig), turnover/leasing (Saad+Stephanie+Kadijah+Tori+Ashley+Mary+Kenesha). This clustering is the natural spine for role-based SOPs and for Helm's role-based alerting.
