# Podio Architecture — Ground Truth (API tour, 2026-07-09)

Captured first-hand via the Podio REST API using Jack's OAuth grant (client `claude-podio-markdown-creator`, read access, org role: admin). This file is SOURCE material for the helm-context doc set — it records what the API returned, verbatim where possible. Item counts are live totals on 2026-07-09.

## 1. Organization

One org: **The Dominion Group** (org_id 729102), 15 workspaces visible. (Second org "Podio Workflow Automation User Community" is just the GlobiFlow user community, not operational.)

## 2. Workspace → app inventory (complete)

| Workspace (space_id) | Apps (app_id, item name) |
|---|---|
| **Closings** (2536777) | **Buy Closings** (9068504, "Purchase"), **Sale Closings** (9068512, "Sale"), HOA/GR/FF Setups (21424026, "Setup"), Weekly Reports (25925305, "Report") |
| **Pipeline - Construction** (3039231) | **Renovation** (10728781, "Project") — the workspace's only app |
| **Construction Operations** (3810697) | Vendor List (13285767), Supply Houses (14628955), Standards (14822531), Utilities (19652132) |
| **Construction Scheduling** (4205458) | 18 per-trade job apps: Material Deliveries (17180113), Demo (15670686), Concrete (15217914), Frame (17892808), HVAC (14972230), Plumbing (14885443), Electrical (14639786), Drywall/Paint (17353902), Trim (14825591), Refinishing (15469646), Roofing (Exterior) (15625253), Windows (15104362), Metal Rails (15103634), Landscape (16731876), Fencing (15669536), Misc (18245636), **BGE** (20357065), Insulation (24131738) |
| **Move Ins & Move Outs** (3013036) | Leasebacks (10686287), Attempted Notices (11365076), Upcoming Turnovers (10683428), **Move Outs** (10684171), **Listings** (10636997), Rental Applications (12649016), Pre-Contract Inspections (10636998), **HAP Appointments** (10670450) |
| **Occupancy** (5720817) | **Sched Vacants** (19831048), Applications (19831008), **Vacant Units** (19820093) |
| **Rentals Billing & Compliance** (3156684) | **Lead Certs & Water Bills** (11132895), Code Violations & Citations (25314008), Lead Paint Compliance (26654207), Certifications (26654193), Tracking # Lead Certificates (25328396), Property Registration/Licensing (26964701, 0 items — new/empty) |
| **Inspections** (3476081) | "DO NOT USE" (12181100), Annuals (13464713), Specials (18099118), Reinspections (13464823), Abatements (13465394), FRR Follow-Ups (25017332) |
| **Leasing Leads** (5009484) | Leasing Leads (17294152), Old Leads (21463364) |
| **High Water Bills** (3384640) | OLD - High Water Bill, Credit Issued - Research Matchup, Research, Protocol |
| **Bank Loans** (7438676) | Pipeline (26545847), Loan Groups (26545848), Line of Credit (26547273), Prepay Schedule (26547307) |
| **Small Claims** (5526331) | Small Claims (19069902) |
| **TCB Disputes** (4912904) | TCB Disputes (16971046), Payment Plans (17161021) |
| **Virtual Leasing Assistant** (3244872) | Site-Based Project (11431219), Rental Applications (11442796) |
| **Employee Network** (2532853) | (no apps) |

**Corrections to earlier doc-set inference:** there is NO "Acquisitions & Titles" workspace and NO standalone "Vacant Units" or "Rental Billing" workspace. Buy Closings is an app in the **Closings** workspace. Vacant Units is an app in the **Occupancy** workspace. Rent/billing + compliance data live together in the **Rentals Billing & Compliance** workspace, chiefly in the Lead Certs & Water Bills app.

## 3. Key apps — fields, counts, vocabularies

### Buy Closings (app 9068504, 1,139 items) — workspace: Closings
The under-contract entry point (PH-1 birth record). Notable fields: Street Address, **Contract Date**, **Closing Date**, **Date Ratified**, Price, **EMD** (earnest money deposit — the QuickBooks first-touch amount), Closing Costs, Debt on Property, Trustee + Trustee Email, Case Number, Title Company, Agent, Assessed Value + a full property-tax-appeal workflow (1st/2nd appeal, Tax Court dates), Photo. App links: → Sale Closings, → Renovation.
- **Status**: Under Contract | Option | Waiting on Ratification | Ratified | Closed | Dead | Sold | Title Hold
- **Type** (= acquisition/seller type — Jack's trustee-vs-private fork is ALREADY a field): Private | Trustee | REO | Builders | Short Sale | OHAAT | NCST
- **Plan**: Retail | Rental | Wholesale | Turnkey | Lot | Teardown - Retail | Teardown - Rental | Auction
- **Purchasing Entity**: Gunpowder Realty, LLC | Dominion Properties, LLC | Dominion Rental Holdings, LLC | Wholesale | Assignment | Emerson Point, LLC
- **Occupancy**: Occupied | Vacant | Leaseback | Lot
- **Market**: City | BaltCo | HarfCo | Atlanta | AACo | PGCo | PA | NJ | Howard County | Carroll County | Frederick | Cecil
- **Purchase Financing**: Cash | CFG LOC | TBD | Wesbanco | DFS

### Renovation (app 10728781, 2,346 items) — workspace: Pipeline - Construction
The construction hub item (one per project; auto-created from Buy Closings via GlobiFlow per Jack). Notable fields: Address, Proj Mgr, Closing Date, Const Rehab Estimate, Permit Status, Lead Test, per-utility status (Electric/Gas/Water), and **app-link fields to every per-trade Construction Scheduling app** (BGE, Demo, Concrete, Framing, HVAC, Plumbing, Electrical, Roof/Exterior, Windows, Insulation, Drywall/Paint, Trim, Refinishing, Landscape/Arborist, Rails, Fencing, Misc) — the Renovation item is the parent of per-trade job items. Also links: → Buy Closings ("Closing Info"), → Lead Certs & Water Bills ("Turnover Lead Status").
- **Proj Mgr**: Robert | James | Christina | Richard | Mathew | Patrick | Parked | John | Alberti
- **Category**: 3rd Party - Turnover | BaltCo Affordable | Rental | Retail | Turnkey | Turnover | Auction | Wholesale | New Build - Rental | New Build - Retail | Lot | Parked | DFS REO | Teardown - Rental | Teardown - Retail
- **Phase** (43 options — a full property-life pipeline, not just construction): Asset Preservation | Post - Occupied | Occupant Contacted | Photos | Lock Change | Trash Out | Parked | Design & Scope | In House Drawings | Engineer Drawings | Budget | Pending Budget Approval | Waiting to Close | Waiting to be assigned | Demo | Concrete/DrainTile | Framing | MEP Rough In | Insulation | Drywall | Trim & Paint | MEP Trim & Carpet | QC Finishing | Punchout Needed | Punchout | Final Review Needed | Clean | Staging & Photos | 30 Day Closeout & Bill | **Handed Off - Rental** | On Market | Under Contract | Home Inspection Items | Sold | Rented | Write Off | Permit Application | Site Clearing | Excavation | Warranty | Site Engineering | Dead | No Longer Managed
  ← **"Handed Off - Rental" is a Renovation.Phase value** — this resolves the doc set's open question about which system that Helm driver string comes from: it is Podio (Renovation app), not Buildertrend.
- **Permit Status**: No Permits | Building Permit Needed only | MEP Permits needed only | Full Permits Needed (Building & MEP) | Permits Pulled | RI's Passed | Framing & Insulation Passed | Final's Passed | Use & Occupancy Filed | U&O/Building Passed
- **Lead Test**: N/A - Retail | N/A - New Rental - post 1978 | New Rental - pre 1978 | Turnover - See Relationship

### Vacant Units (app 19820093, 1,389 items) — workspace: Occupancy
The leasing-funnel record (D7/D14 in Helm read this; Helm's tour status strings match this app's Status vocabulary VERBATIM). The date fields are a ready-made clock timeline for PH-5→PH-7:
**Date Vacant → T/O to DP Date → Market Start Date → Appr App Date → RFTA Sub Date → Insp Date → Rent Appr Date → Contract Date → HAP Contract Receipt Date**, plus Rent, Program, Inspection Status, Intake Date/Violations.
- **Status**: vacant - need to turnover | in turnover | **parked - not turning over** | on market - no apps | on market - pending app | on market - in house - no apps | approved - need RFTA | approved - need to submit mgmt docs | **approved - need inspection** | approved - inspection scheduled | approved - need rent | approved - need contract date | **contract executed** | HOLD- DO NOT MARKET
  (Bolded = strings Helm's tour displayed verbatim → Helm's phase derivation reads this app's Status.)
- **Program** (28+ housing programs, not just Section 8): AA Co S8 | HABC - Balt City | Balt Co S8 | BRHP | Dayspring | Emerge | Empire Homes | GEDCO | Harford Co S8 | Healthcare for the Homeless | HOPWA | Market | MBQ | New Vision House of Hope | PEP | Proj Plase | H-Cam | Proj Based | Continuum of Care | Womens Housing Coat | New Future Subsidy | Rapid Rehousing | HACA | ST Vincent DePaul | MOHS | HABC/BRHP | Howard Co Housing Commission | …
- **Inspection Status** (voucher-inspection attempt tracking): Passed 1st | Failed 1st | No Entry 1st | Failed 1st, Passed 2nd | … | Failed 1st, No Entry 2nd, Passed 3rd
- **Owner** (includes third-party/partner owners): DP new unit | Dominion Properties | Dominion Financial Services | Fred Lewis IRA | RMN Investments / Fred Lewis | Chesapeake Realty / Jack BeVier | Lime Street Investments / Dan Carpenter | … (many partner names)

### Sched Vacants (app 19831048, 1,254 items) — workspace: Occupancy
The NOTICE-phase (PH-9) record: tenant, Move Out Date, Move Scenario, Reason Leaving, per-trade pre-turn review fields (PLUM/HVAC/ELEC/ROOF Recommend + Review), Key/Lockbox, Lead Cert Type, BGE, Trash, Extermination.
- **Status**: Occupied | Vacant
- **Move Scenario**: Approved 60 Day NTV | Denied 60 Day NTV (Rent Owed) | Denied 60 Day NTV (Small Claims Owed - Need Judgment) | Denied 60 Day NTV (Small Claims Owed - Have Judgment) | Denied 60 Day NTV (Lease Term Not Up) | Program Granted Move (Abatement) | Program Granted Move (No Small Claims Judgment) | Intimidated Witness - Program Granted Move | Voucher Terminated | Eviction | Skip | DM Issue
- **Reason Leaving**: Voucher Reduced | Voucher Increased | Dislikes Location | Lack of Amenities | Maintenance Issues | Unhappy with DM | N/A - Abatement | N/A - Voucher Terminated | N/A - Tenant is Deceased | N/A - Skipped | N/A - Eviction | N/A - DM Issued NTV | Other | VAWA | DM Issued/Rescinded
- **Turn Over Status**: Turn Over to DP | **Not Turning Over - Parked** ← the "parked" decision point: parked = deliberately NOT handed to DP for turnover

### Move Outs (app 10684171, 228 items) — workspace: Move Ins & Move Outs
The PH-10 operational record: Move Out Date, Turnover Status, BGE status, Trashout Notes, Extermination, Mechanical Review, Grass Cutting, SDD (security-deposit disposition) workflow, Collections Status.
- **Turnover Status**: Not Yet Turned Over to DP | Turned Over to DP
- **BGE**: open item | On in Dominion's name | Not on in Dominion's name - see notes
- **SDD Status**: Not Started | In Process | Completed - No Mailing Address | Completed & Mailed
- **Program**: Section 8 | HOPWA | MBQ | Market | Dayspring | PLASE | PEP

### Upcoming Turnovers (app 10683428, 285 items) — workspace: Move Ins & Move Outs
Older-generation notice tracking (overlaps Sched Vacants): 60 Day Notice status, Reason, Program, Current Rent, Voucher Size, Action to Prevent Move, Transfer.
- **60 Day Notice**: Approved 60 Day Notice | Denied 60 NTV Rent Balance Due | Denied 60 NTV Small Claims Balance Due | S8 Granted Move - Intimidated Witness | Market Tenant - 60 Day Notice Received | Approved Dominion Transfer | No 60 Day Notice Given | Abatement - Emergency Move Granted | Dominion Management Issued 60 Day Notice | Dominion Management Issued 30 Day Notice | NTV Cancelled - Form Sig…
- **Status**: Occupied | Occupancy Check | Vacant | Notice Cancelled - Form to Stay Signed | Notice Extended Per Form

### Listings (app 10636997, 342 items) — workspace: Move Ins & Move Outs
Marketing record; links → Rental Applications, → Renovation, → Move Outs.
- **Property Status**: Not Yet Listed | No Applications | Pending Application | Approved Application, In Inspection Cycle | Leaseback | Site Based | Archived

### HAP Appointments (app 10670450, 263 items) — workspace: Move Ins & Move Outs
Housing Assistance Payments rent-negotiation tracking (PH-6 territory); links → Listings.
- **Status**: Need Rent Offer | Reviewing Rent Offer | Negotiating Rent | Approved Rent Offer | Archived

### Rental Applications (app 12649016, 856 items) & Applications (app 19831008, 1,044 items)
TWO application apps in different workspaces (Move Ins & Move Outs vs Occupancy) with overlapping fields — older vs newer generation. Applications adds App Type: Transfer | New App | Leaseback and Case Search / Income screens.
- Shared shape: App Status (Active | Archived / Closed), Outcome (Pending | Approved | Denied | Canceled/Pulled), Application Type (Program Tenant | Market Tenant), Voucher Size, Background, Home Inspection, Landlord Reference.

### Lead Certs & Water Bills (app 11132895, 1,308 items) — workspace: Rentals Billing & Compliance
The compliance + rent master record (one per property/unit). This is the app the doc set called "Podio Rental Billing" (D20 rent comparisons) AND "Compliance & Licensing" (D17/D18) — it is ONE app. Fields: Rental License # + Inspection + Filing Status + **Rental License Expiration Date**, Cert Type, **Lead Cert Date/Expiration**, MDE Tracking/Certificate numbers, Water Billable + Quarterly Water Consumption, **Rent / Previous Rent / Current Rent / Rent Increase Status** (Requested | Increase Received | Rent Confirmed Raised/In Compliance | Increase Denied - See Notes | Increase Not Received), Program, Lease Anniversary Month. App links: → Lead Paint Compliance, → Buy Closings, → Annuals, and a Reference field linking Leasebacks, Renovation, Listings, Pre-Contract Inspections, Move Outs, HAP Appointments.
- **Property Status**: Rented | Turnover | New Unit | Parked | Sold | No longer managed
- **License Filing Status 1**: Need Registration | Need Inspection | Inspection Complete | Licensed
- **Cert Type**: FRRD | FRRV | LLF | LF | NA Yr Built > 1978 | NA Commercial | SOLD
- **Owner** options = the entity roster (Dominion Properties LLC, 3rd Party, DFS, Charm City Real Estate, Calvert Street Properties, Red Door Holdings, Dominion Rental Holdings, Gunpowder Realty, + sub-LLCs: 219-237 Park Ave, Allendale Station, Lakeland Vines, Ashburton Woods, Barclay Outlook, Cedmont Narrows, Dolfield Village, Frankford Estates, Greenspring Falls, …)

### Lead Paint Compliance (app 26654207, 266 items)
Active lead-work pipeline (LeadProbe vendor workflow): Cert Status: Initial Review Required | Dominion - Work in Progress | LeadProbe - Initial Review Requested | LeadProbe - In Process | LeadProbe - Required Work Submitted | LeadProbe - Final Review | LeadProbe - Waiting on Lead Certificate | Passed - Need MD Tracking | Complete | Kicked-Back | Upcoming Project | "Send to Maintenance Manager for scope review" | Write Off - Wholesale. Links → Lead Certs & Water Bills, → Buy Closings.

### Sale Closings (app 9068512, 858 items)
Dispositions (PH-X): Status: Under Contract | Sold | Dead; Type: Retail | Wholesale | Turnkey | Donation | As-Is on MLS | As-Is Auction. Links → Buy Closings, → Renovation, → Lead Certs & Water Bills, → Pipeline (Bank Loans).

### Leasebacks (app 10686287, 46 items)
Seller-occupied-after-purchase records: Anticipated Lease Start Date, Rent, Security Deposit, Lead Cert link.

## 4. Cross-cutting observations for the doc set

1. **Helm's phase derivation reads Vacant Units.Status verbatim** — "parked - not turning over", "approved - need inspection", "contract executed" all match tour observations. The Vacant Units app is Helm's PH-5/PH-6 signal source.
2. **The Vacant Units date-field chain is a ready-made housing-program clock catalog** (RFTA submission → inspection → rent approval → contract → HAP receipt) — exactly the PH-6 sub-clocks 04-cycle-time-model.md wanted.
3. **Two generations of leasing apps coexist** (Move Ins & Move Outs = older: Listings/Rental Applications/Upcoming Turnovers/Move Outs; Occupancy = newer: Vacant Units/Applications/Sched Vacants). The tour-time reading of the overlap as a live duplicate-entry risk and mapping question is SUPERSEDED by §8 (per Podio API activity probe 2026-07-11): the older generation is an archive retired ~Nov 2017 — no live cross-generation duplication.
4. **Renovation.Phase is a ~25-stage pipeline** — far finer-grained than Helm's single PH-3; per-trade job apps hang off it. Helm could clock every stage without new data capture.
5. **Buy Closings.Type already encodes the trustee/private fork**; Purchasing Entity encodes the entity; EMD encodes the deposit.
6. **"Parked" is decided at Sched Vacants.Turn Over Status = "Not Turning Over - Parked"** and appears as a status/PM/category value in Renovation, Vacant Units, and Lead Certs — a cross-app hold vocabulary.
7. **Compliance + rent live in ONE app** (Lead Certs & Water Bills) — the doc set's "Rental Billing" and "Compliance & Licensing" workspaces were a single-app reality.
8. **Third-party/partner owners are first-class** in Vacant Units.Owner and Lead Certs.Owner option lists (Fred Lewis IRA, partner LLCs, "3rd Party").
9. Inspections workspace has a "DO NOT USE" app — legacy debris exists; Property Registration/Licensing (26964701) has 0 items — a new app being stood up.
10. Bank Loans workspace (Pipeline/Loan Groups/Line of Credit/Prepay Schedule) — financing-side records referenced by Sale Closings.

## 5. Webhooks (GlobiFlow attachment points — captured)

GET /hook/app/{id}/ shows **active `item.create` webhooks registered by the "Workflow automation" client (GlobiFlow)** on all three core apps checked:
- Buy Closings (9068504): hook → webhooks.workflow-automation.podio.com (…?c=2541&p=16234), created 2020-11-30 (+ failover-queue hook)
- Renovation (10728781): hook → …?c=2541&p=16235, created 2021-04-02 (+ failover)
- Vacant Units (19820093): hook → …?c=2541&p=142588, created 2022-05-05 (+ failover)

So at minimum, GlobiFlows fire on item creation in all three lifecycle-core apps (consistent with Jack's Buy Closings → Renovation auto-creation). The `p=` parameters are GlobiFlow flow/app ids. The full flow logic is NOT exposed via the public API.

## 6. GlobiFlow flow inventory (UI tour, 2026-07-09 — Jack's login, workflow-automation.podio.com)

Flow counts per app (from the flows.php tree, "Expand All"): **~276 flows total.** Bank Loans Pipeline (3); Buy Closings (20); Sale Closings (6); OLD - High Water Bill (1); Credit Issued - Research Matchup (1); Research (3); Annuals (6); Reinspections (18); Abatements (7); Leasing Leads (1); Leasebacks (2); Upcoming Turnovers (10); Move Outs (8); Listings (5); Rental Applications (10); Pre-Contract Inspections (12); HAP Appointments (2); Sched Vacants (7); **Applications (54)**; **Vacant Units (67)**; Renovation (9); Lead Certs & Water Bills (21); TCB Disputes (1); plus "Lead Cert Renewal Projects (2)" in a space Jack's login can't see ("Not Accessible for your User" → Unknown Spaces). The Occupancy workspace alone carries 128 flows.

### Flow names captured (verbatim)

**Buy Closings (20):** Add new property to construction pipeline ← THE Buy Closings→Renovation auto-creation | Add new property to Lead Paint Compliance space if YrBuilt… | Bank Loans - Create new property | Closed Property Construction Alert | Closing Date Incorrect | Closings - Update Lead Paint Compliance of Business Plan changes | New Property Alert - Email Jake | New Property Email | New Purchase - Lead Paint Review | occupied house has ratified | Push Closing Date - Not Yet Ratified | Reminder to Check for Ratification | Request closing docs for review - Victoria | Text Fred New Acquisition | Text Fred with Acquisition Closing | Trustee Sale Under Contract | Upcoming Closing Email | Upcoming closing notification to Jake | Update HOA Spreadsheet | **Update Renovation App Closing Date** ← cross-app FIELD propagation, not just item creation

**Renovation (9):** Bill GC 100% complete | GC billing 50% complete | GC first billing | Locks and Photos | New 3rd Party Mgmt Agrmt | Post Occupied | Puch Out List Needed - Robert | Punchout Due Task to Brian | Turnover Scope & PM

**Vacant Units (67):** ~60 are per-person × per-event notifications — "notify {Brian, Dionne, Jemia, Kenesha, Lakia, Lakisha, LM, Mary Lee, Omar, Rasheah, Ron, Taneek, Will} when {contract date set, contract is signed, inspection is set, RFTA is submitted}" — plus team flows: Notify Aleksey/Rachel when new unit is given to DM (+ "in house no apps" variants, turnover variants, off-market) | notify Brian, Craig & Maint. Team when unit is Leased | Notify Chad when unit is Leased | notify Craig when den is needed / when RFTA is in / when Vacant Unit created with "den needed" | **notify Leasing and property manager that RFTA submission is late** ← a GlobiFlow cycle-time watchdog (primitive T-rule) | notify Leasing Team when inspection date is set by Inspection Dept | notify Rachel when a New Unit is added for the market | notify Rachel when an approved app falls through | Agent Showing List | Available Properties

**Applications (54):** same fan-out pattern — "notify {Brian, Dionne, Edena, Jemia, Kenesha, Kiera, Lakia, Lakisha, Nhandi, Omar, Rasheah, Ron, Taneek, Tereene, Will, Yvonne, Rachel} if app {approved, cancelled, denied}" — plus a screening-review pipeline: "Notify Stephanie & Coy when Erica clicked that {background, case search, home inspection, income, landlord reference} is ready for review" | "Notify Mary C when BG is approved to trigger HI" (background→home-inspection sequencing).

**Sched Vacants (7) — the STRUCTURAL turnover-loop automations:**
1. notify Stephanie D, Tori, Ashley, Kadijah, Saadi & Maint. Team when a unit goes vacant
2. **turnover email from DM to DP** ← the DM→DP baton is a GlobiFlow email
3. **when "vacant" is clicked in Scheduled Vacants, a new record is made in Vacant Units** ← auto-creates the PH-10/leasing record
4. **when 3P unit is turned over to construction, create new project in "pipeline construction"** ← turnover Renovation items are ALSO auto-created (3rd-party variant)
5. **when DP unit is turned over to construction, create new project in "pipeline construction"** (DP variant)
6. when unit goes vacant in "scheduled vacants" a new record is created in "vacant units" (apparent sibling/duplicate of #3)
7. **When unit is turned over to construction, create new task in lead cert projects** ← feeds the inaccessible "Lead Cert Renewal Projects" app

**Move Outs (8):** create 3P Turnover in Pipeline-Construction when house is turned over from DM to DP | **Create Rennovation Item on Item Create** | create Turnover in Pipeline-Construction when house is turned over from DM to DP | email Jazmin when Lakia's review is done | send Danielle an email when Jazmin clicks that she is done with the mechanical review for a turnover | send email when "turned over to DP" is clicked in the "move out" section | send email when house is turned over | **text Fred when official turnover email happens**

**Upcoming Turnovers (10):** 3P HOUSES - when "vacant" is clicked, new project created in Pipeline - Construction | DP HOUSES - same | **create "move out" when "vacant" is clicked** | email Beth/Brandon/Danielle/Lindsey/DM personnel when unit goes vacant | text Fred when house goes vacant | text Lakia to review house when unit goes vacant
← NOTE: the OLDER generation's structural flows are still wired — both generations (Upcoming Turnovers/Move Outs AND Sched Vacants/Vacant Units) auto-create construction projects and downstream records. Both pipelines are wired, but only the newer fires in practice — the tour-time reading that both were live is SUPERSEDED by §8 (per Podio API activity probe 2026-07-11): no item created in any Move Ins & Move Outs app since 2017, so the older chain is vestigial.

**Listings (5):** Approved Tenant Automation | Create Inspection on status change | Listings to Pre-Contracts Automation | New Additions to the Rental List | notify Nhandi when no applications

**Rental Applications (10):** background reports / home inspection / landlord reference in - notify Nikki | Notify Jamie when Nikki clicks app ready for review | Notify Nhandi (cancelled/pulled, pending) | **Pending Applications - From Rental Applications to Listings** | Rental Applications - Update Emails | Text to Lakia on Outcome change | **Update Listings on Approved Applications** ← cross-app status sync

**Pre-Contract Inspections (12):** **Create HAP Appts upon passed inspection status** | Need Inspection Violations - Pre-contracts | Pre Contract (Re-)Inspection Scheduled | Violations to Jazmin | Violations Incomplete | RFTA Submission & Inspection Scheduling Updates for Craig | **Update Construction Rental Status - {Approved Applicant, Inspection Submitted, RFTA Submitted}** ← leasing-funnel status written BACK into the construction record | **Violations in Yardi - Pre-contract inspections** ← per Jack (2026-07-09): Yardi was the pre-AppFolio PM system; legacy reference | Work Order Complete

**HAP Appointments (2):** Scheduled HAP Appointments | **Update Pre-Contract, Inventory, Inspection, and Listings on Rented Status** ← four-app fan-out sync on rented

**Leasebacks (2):** Update Buy Closings, Construction, and Inventory when Tenant Chose to Vacate or Eviction Executed | Update Inventory to Rented on Signed & Collected Money (per Jack, 2026-07-09: "Inventory" is a pre-defined filter set / saved View in the **Renovation app**, not a separate app — these flows update Renovation items)

**Lead Certs & Water Bills (21):** BANK LOANS - Add New Property to Pipeline / Update property status | LeadProbe review workflow emails (DP Lead Inspector Initial/Final Review, Email if kickback, SM Review LeadProbe Report, Lead Work Report Submitted, Tech pics taken - Dorian, Send findings to Dorian) | Lead Paint Compliance SYNC ← cross-app sync to the Lead Paint Compliance app | New Unit - Initial Lead Inspection | Rental License workflow (need inspection → Inspection Completed → Tenant Info form → Notify Katherine that a property has been licensed) | Notify when tracking number is needed | **turnover = unset water billable information, rent, program & anniversary month** ← automation CLEARS the Podio rent/program fields on turnover (critical for D20 semantics: an empty/stale Podio rent may be flow-cleared state, not human error) | **Upcoming LLF Expiration Date - WIP DM** ← expiry watchdog (proto-D17/D18) | Update grass cutting list

**Sale Closings (6):** Alert Construction of Sales Contract | BANK LOANS - Update property status | MD Sold Property | Sale Closing Date Incorrect | Staging Removal Reminder | Update Solds from Sale Closings

**Annuals (6):** Create Reinspection of 24 Hour / 30 Day Violations | Create Reinspection when Annual = No Entry | escalation emails (Danielle, Jazmin, Kurt) on fails/no-entry

**Reinspections (18):** auto-create 24 Hour / 30 Day Abatement items | Create Abatement on No Entry (1st and 2nd) | **create abatement chargebacks when a reinspection fails** | **Email Craig when inspection is less than 15 days out and work is not reported completed by contractor** ← deadline watchdog | escalation emails (Craig, Stephanie, Danielle, Jamie) | "when list is uploaded to Reinspections, an email goes to VA to create a work order" ← VA = the Virtual Leasing Assistant loop

**Abatements (7):** re-to-lift-abatement scheduling/pass/fail escalation emails (Craig, Danielle, Jamie, Jazmin, Kurt)

**Bank Loans Pipeline (3):** Populate Multi-Family Data Fields | Refinance Complete - Update related fields | Appraisal Status

Not captured (peripheral, counts only): Leasing Leads (1), TCB Disputes (1), High Water Bills apps (5), Lead Cert Renewal Projects (2 — space not visible to Jack's login).

### Observations

- **The turnover loop's Podio record chain is GlobiFlow-driven end to end** — wired in BOTH generations: Sched Vacants/Upcoming Turnovers vacancy → Vacant Units/Move Outs record → Renovation turnover project (3P and DP variants) → lead-cert renewal task → DM→DP handoff email (+ Fred texted). The newer chain's steps are load-bearing and Helm must replace them one-for-one; the older chain is vestigial (app archive retired ~Nov 2017 — §8, per Podio API activity probe 2026-07-11) and should be retired, not replicated.
- **Roughly 120 of the ~276 flows are per-person hardcoded notifications** ("notify Kenesha when RFTA is submitted") — Podio's brittle version of Helm's push-alert layer; staff changes require flow edits. Helm's role-based alerting replaces this class wholesale.
- **Deadline watchdogs already exist** (RFTA-late, LLF-expiration-upcoming, inspection-15-days-out) — proto-T-rules; Helm's cycle-time engine replaces them with uniform machinery.
- **Cross-app field sync is widespread, not exceptional**: Update Renovation App Closing Date; Update Listings on Approved Applications; Update Construction Rental Status ×3; HAP rented-status four-app fan-out; Lead Paint Compliance SYNC; Bank Loans add/update ×2 sources; Leasebacks two-way updates. The doc set's "manual propagation" framing needs per-edge nuance — many Podio-internal edges are automated; the MANUAL edges are the cross-PLATFORM ones (Podio ↔ AppFolio/Buildertrend/QuickBooks), which is exactly the gap Helm fills.
- **The rent-unset-on-turnover flow** (Lead Certs & Water Bills) means D20 comparisons must treat empty Podio rent during turnover as expected state.
- The inspection→reinspection→abatement→chargeback machine is fully flow-orchestrated (31 flows across Annuals/Reinspections/Abatements).
- Flow names double as a staff roster: leasing/ops staff appearing in flows include Aleksey, Rachel, Brian, Craig, Chad, Dionne, Edena, Erica, Coy, Jemia, Kenesha, Kiera, Lakia, Lakisha, Mary Lee, Mary C, Nhandi, Nikki, Omar, Rasheah, Ron, Taneek, Tereene, Will, Yvonne, Stephanie, Jazmin, Danielle, Kurt, Jamie, Dorian, Katherine, Beth, Brandon, Lindsey, Tori, Ashley, Kadijah, Saadi, Robert + Fred (texted on acquisitions, closings, and turnovers) and Jake (emailed on new properties/closings).

## 7. Not yet captured

- Individual flow LOGIC (trigger conditions + full action lists) — each flow's detail page in the GlobiFlow UI; capture selectively when a flow matters to Helm design (top candidates: the Sched Vacants/Move Outs record-creation chains, the rent-unset flow, the RFTA-late watchdog).
- Flow names for Leasing Leads (1), TCB Disputes (1), High Water Bills (5), Lead Cert Renewal Projects (2, inaccessible space).
- Webhook enumeration for the remaining ~62 apps via API.
- Item-level samples (deliberately skipped — schema was the goal; item data is PII-adjacent).
- Apps in non-core workspaces (Construction Scheduling per-trade fields, Inspections apps, Bank Loans fields) — schemas fetched only for the 15 lifecycle-critical apps listed above.

## 8. Item-creation activity probe (2026-07-11)

Method: Podio filter API, filtering each leasing-generation app on `created_on` date ranges — total item count, items created in the last 90 days, items created in the last 30 days, and the newest item's created-on timestamp. Counts and timestamps only; NO item data was retrieved. Totals are as of 2026-07-11 (two days newer than the §2–§3 counts, hence small deltas on the live apps).

| Gen | App | Total | 90d | 30d | Newest created |
|---|---|---|---|---|---|
| OLDER | Listings | 342 | 0 | 0 | 2017-10-31 |
| OLDER | Rental Applications | 856 | 0 | 0 | 2017-11-08 |
| OLDER | Upcoming Turnovers | 285 | 0 | 0 | 2017-11-16 |
| OLDER | Move Outs | 228 | 0 | 0 | 2017-11-16 |
| OLDER | HAP Appointments | 263 | 0 | 0 | 2017-07-10 |
| OLDER | Pre-Contract Inspections | 361 | 0 | 0 | 2017-10-31 |
| OLDER | Leasebacks | 46 | 0 | 0 | 2017-05-08 |
| OLDER | Attempted Notices | 7 | 0 | 0 | 2015-02-26 |
| NEWER | Sched Vacants | 1,256 | 36 | 13 | 2026-07-10 |
| NEWER | Applications | 1,044 | 0 | 0 | 2022-05-12 |
| NEWER | Vacant Units | 1,390 | 94 | 21 | 2026-07-09 |

Reading:

- **The Move Ins & Move Outs workspace is an ARCHIVE, retired ~November 2017** — no item created in any of its 8 apps since 2017 (Attempted Notices since 2015). Its structural flows (§6) are VESTIGIAL — wired but dormant, since flows fire on item events and no new items arrive; they should be retired, not replicated.
- **The live leasing surface is Sched Vacants + Vacant Units** (Occupancy): 36 and 94 new items in 90 days respectively, newest items created the week of the probe.
- **Applications (Occupancy) died 2022-05-12** — zero items created since; its 54 flows are presumably dormant too. The active leasing-flow estate is roughly Vacant Units 67 + Sched Vacants 7, not Occupancy's headline 128.
