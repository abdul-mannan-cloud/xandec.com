# 01 — Company Overview: Who Dominion Is

> Status: DRAFT strawman — [confirm] items pending Jack's review.

This file explains the business Helm serves: the portfolio, the two operating companies that do the work, the ownership entities that hold the assets, and the people whose workflows Helm models. For what happens to a property over its life, see `02-property-lifecycle.md`. For which software system owns which data, see `03-systems-of-record.md`.

## The portfolio at a glance

- **What:** An integrated real estate business — property management, development, construction, and rental operations — founded in **2002 by Fred Lewis**.
- **Where:** Primarily Maryland. Headquarters at 1029 N Calvert St, Baltimore, MD 21202.
- **Scale:** ~**1,000 residential rental units**, plus active multifamily developments and a captive insurance operation.
- **Structure:** Many distinct legal entities, deliberately. Entities isolate construction liability from rental assets, isolate single assets from each other, and manage tax and insurance requirements. This is not incidental complexity — it is the design, and Helm's data model has to live with it.

Note on counts: Helm's registry today shows 1,073 property records (including 87 sold and 1 archived), against the business description of ~1,000 units. [confirm: How should Helm represent multifamily buildings — one property record per building, or one per unit? And is the ~1,000-unit figure inclusive of the multifamily units?]

## The two operating engines (Helm's confirmed scope)

Jack has confirmed Helm covers **DM and DP** — the rental and construction side of the business. Everything else in this file is context for why those two companies do what they do.

### DM — Dominion Management LLC (property management)

- MD LLC, has payroll. Manages ~**1,000 units**: ~950 partner-owned (the entities below) and ~50 third-party turnkey rentals dating from 2009–2011. No other third-party management.
- **DM is the cash hub.** All tenant rental income across the entire portfolio deposits into DM's accounts. DM pays all day-to-day property-level operating expenses (repairs, maintenance, turn costs) from centralized operational accounts, then distributes Net Operating Income monthly to the owner entities under formal, arm's-length Property Management Agreements.
- Business target: roughly breakeven by fee design; goal is to stay slightly profitable.
- [confirm: Are the ~50 third-party turnkey units in Helm's scope, and do they need distinct handling (external owners, no internal owner-LLC rollup)?]

### DP — Dominion Properties LLC (development, construction, flips)

- MD LLC, has payroll. Real estate development, construction management, and house flipping. Buys, renovates, and sells to homeowners; acts as **General Contractor for all sister entities**.
- DP performs initial renovations before a property is placed in service (tracked in Buildertrend, costs capitalized), then hands the property to DM for leasing. When a unit goes vacant, DP manages the turnover using 6 in-house punch-out contractors (typically expensed under DM, not capitalized).
- DP subcontracts labor but buys most materials directly from suppliers to eliminate markup; subs supply materials only where that is standard (electricians' wire, HVAC air handlers).
- Business target: consistently slightly cash flow positive.

The DP→DM handoff (renovation complete → ready to lease) and the DM→DP handoff (vacancy → turnover) are the two seams where properties cross company boundaries. These correspond to phase transitions in Helm's lifecycle model (see `02-property-lifecycle.md`) and are where several audit rules already fire (see `06-audit-rules.md`).

## The ownership entity landscape (who holds title)

Every property is owned by one of these entities, not by DM or DP. The portfolio groups into archetypes:

| Short name | Entity | Structure | Holds | Status |
|---|---|---|---|---|
| CC | Charm City Real Estate LLC | DE parent with multiple wholly owned **title-holding sub-LLCs**; consolidated tax return | Longest-held SFR portfolio | **Mature / static** — no new purchases; pay down debt, maximize NOI |
| RD | Red Door Holdings LLC | Same as CC | Same | Same |
| CS | Calvert Street Properties LLC | Same as CC | Same | Same |
| DRH | Dominion Rental Holdings LLC | DE LLC, **holds title directly** (no sub-LLCs) | SFRs | **Stabilized / full** — no new purchases |
| Gunpowder | Gunpowder Realty LLC | Same as DRH | SFRs | Same |
| EP | Emerson Point LLC | DE LLC, holds title directly | Newly acquired SFRs | **Growth** — the active entity for all new rental acquisitions; runs cash-flow negative until incoming properties stabilize |
| Park | 219-237 Park Ave LLC | DE LLC | 45-unit multifamily building | Construction finished; **leasing up** |
| Woodson | 901-903 Woodson Ave LLC | DE LLC owned by 3 Delaware LLCs as Tenants in Common | 20-unit building | Fire rebuild complete; leasing up |
| Park Heights | 6001 Park Heights Ave LLC | DE LLC owned by 3 TIC Delaware LLCs | 28-unit building | Major CapEx complete; leasing up |
| Howard | 400 N Howard LLC | DE LLC | 14-unit building | **Under construction**; carries local CHAP and federal historic tax credits, so construction cost categorization is unusually sensitive |
| DI | Dominion Insurance Inc | DE C-Corp | — (captive 831(b) insurer, not a property owner) | Insures internal risks (deductibles, lead paint, business interruption); bills each asset-owning entity annually |

Practical takeaways for the developer:

- **New acquisitions go into EP.** A property entering PH-1 today should be expected to land in EP. A new acquisition recorded against CC/RD/CS/DRH/Gunpowder would contradict stated strategy — plausibly worth an audit rule someday, but that is a proposal, not a current rule.
- **CC/RD/CS have two entity layers** (parent → title-holding sub-LLC). "Owner LLC" for a property in those portfolios means the sub-LLC; reporting and cash roll up to the parent.
- [confirm: Are the four multifamily assets (Park, Woodson, Park Heights, Howard) in Helm's scope now, later, or never? DM manages them and DP builds them, but Helm's tour data looks SFR-shaped.]

Entity ownership splits, capital accounts, and preferred-return mechanics exist but are **sensitive** and deliberately omitted here; treat entity/ownership data in Helm as sensitive by default.

## Why entities matter to Helm

It is tempting to treat "owner LLC" as a cosmetic label on a property record. It is not:

1. **Every property belongs to exactly one owner LLC**, and that assignment drives where its money goes, whose insurance covers it, whose tax return it lands on, and which strategy bucket (static / stabilized / growth) it belongs to.
2. **Ownership rolls up.** Sub-LLC → parent entity → portfolio archetype. Helm should be able to answer "show me everything in CC" as easily as "show me this sub-LLC."
3. **Sub-LLCs have no bank accounts.** Their cash clears entirely through DM, with NOI distributed to the *parent* entity's bank account. Parent entities pay their own property taxes, insurance, and external debt service from those accounts. So a wrong owner-LLC assignment silently misroutes real money.
4. **Owner-LLC accuracy is already Helm's single largest audit category.** Rule D11 ("Owner LLC mismatch between Podio Vacant Units and Rental Billing") accounts for 200 of the 423 current findings (see `06-audit-rules.md`). The business consequence of a mismatch is item 3 above — that is why the rule exists.

## Key people (operational roles)

These are the department heads whose workflows generate the data Helm ingests. Personas and what each needs *from* Helm are in `07-users-roles.md`; this table is just who they are.

| Person | Title | Side | Operational role |
|---|---|---|---|
| James Stewart | Director of Field Operations | Shared (DP + DM) | Oversees all DP Project Managers and directs DM field operations. Validates the high-level construction↔management handoffs — the human owner of the PH-2/PH-3→PH-4 and vacancy→turn seams. |
| Brian Leibowitz | Acquisitions Director | DP | Sources and secures new assets — the origin of every PH-1 property. |
| Victoria Robinson | Transaction Coordinator | DP | Contract-to-close logistics for all acquisitions and dispositions. Populates the Podio Buy Closings app with settlement statements, deeds, and closing docs — the birthplace of a property record today (see `03-systems-of-record.md` §4). |
| Project Managers | (report to James Stewart) | DP | Run individual job sites, subcontracted labor, and material tracking in Buildertrend; approve sub invoices against open scopes. |
| Craig Cuocci | Director of DM Maintenance & Inspections | DM | Field maintenance crews, property inspectors, and the 6 in-house turnover contractors. Commands the physical unit turn when a property goes vacant. |
| Stephanie Derry | Director of DM Leasing & Compliance | DM | Tenant leasing pipelines, tenant AR, and regulatory compliance — MDE lead-paint certs, Section 8/voucher processing, annual rental licensing. Her compliance domain is what Helm's `/compliance` page (rules D17/D18) already serves. |

(An internal accounting team — Controller and staff accountants — consumes the operational data downstream in QuickBooks/BNA, migrating to Sage in 2026. They are context for `03-systems-of-record.md`, not primary Helm users; detail omitted here.)

## Out of scope: the lending side

**Dominion Financial Services (DFS), Magen Capital Group, and DFS3** are lending-side entities (DFS3 holds RTL loans purchased from DFS, as an investment subsidiary of DI). They appear in company documents for corporate context only. **Jack has confirmed they are out of Helm's scope.** If a data source mentions them, that is a signal the record belongs to the lending business, not to Helm.
