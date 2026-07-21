# Buildertrend Internal Users (source, provided by Jack 2026-07-12)

Transcribed from Buildertrend → **Internal Users**. Columns: Name · Role · Company Settings (admin access) · Login (account status) · Auto Access · Email. **Note:** BT's "Login" column is account *status* (ACTIVE / INVITE PENDING), **not** a last-login timestamp — so unlike the AppFolio Users list, this gives no recency signal. Actual construction *activity* must come from the Jobs-per-PM export (still needed).

| Name | BT Role | Company Settings | Login | Auto Access | Email |
|---|---|---|---|---|---|
| Abdul Mannan | **Admin** | ACCESS | ACTIVE | Yes | abdulm@ |
| Ashley Stephenson | Project manager | NO ACCESS | ACTIVE | No | ashleys@ |
| Brennan Ross | Project manager | NO ACCESS | ACTIVE | No | brennan@ |
| Brian Leibowitz | Acquisitions Manager | NO ACCESS | ACTIVE | Yes | brian@ |
| Christina Williams | **Org owner** | ACCESS | ACTIVE | Yes | cwilliams@ |
| Erv Elswick | Accounting | ACCESS | ACTIVE | Yes | erv@ |
| Fred Lewis | Org owner | ACCESS | **INVITE PENDING** | No | fred@ |
| Jack BeVier | Org owner | ACCESS | ACTIVE | Yes | jack@ |
| James Stewart | **Org owner** | ACCESS | ACTIVE | Yes | james@ |
| Jamie Koehler | Project manager | NO ACCESS | **INVITE PENDING** | Yes | jamie@ |
| John Meller | Project manager | NO ACCESS | ACTIVE | No | jmeller@ |
| Mathew Snyder | Project manager | NO ACCESS | ACTIVE | Yes | mathews@ |
| Patrick Stewart | Project manager | NO ACCESS | ACTIVE | Yes | patricks@ |
| Richard Choyce | Project manager | NO ACCESS | ACTIVE | No | richardc@ |
| Robert O'Sullivan | Project manager | NO ACCESS | ACTIVE | Yes | robert@ |
| Victoria Robinson | Acquisitions Manager | NO ACCESS | ACTIVE | Yes | victoria@ |

**16 internal users.** BT permission tiers: Org owner / Admin (Abdul, Christina, Fred, Jack, James) + Accounting (Erv) have Company-Settings ACCESS; the PMs + Acquisitions Managers have NO ACCESS (standard).

## What this confirms
- **The DP construction PM layer lives in Buildertrend, all ACTIVE:** Richard Choyce, John Meller, Mathew Snyder, Patrick Stewart, Robert O'Sullivan (BT role "Project manager"; O'Sullivan is "Construction Manager" on the org chart). These were the people invisible in AppFolio + Podio — resolved: they're BT users.
- **Christina Williams = BT "Org owner"** (top access) *and* the Podio Renovation mirror-keeper — she is the construction-ops backbone across both systems.
- **James Stewart** (Dir Field Ops) and **Jack** = BT Org owners; **Abdul Mannan** (the FDE) = BT Admin — the `abdulm@` account the Helm scraper runs under.
- **Acquisitions in BT:** Brian Leibowitz and Victoria Robinson both have active "Acquisitions Manager" BT accounts — acquisitions people watch construction on properties they've bought.
- **Accounting in BT:** Erv Elswick (Accounting, ACCESS) — pulls BT job-cost data for capitalization/BNA.

## New / off-chart people found
- **Ashley Stephenson & Brennan Ross — DFS employees (Dominion Financial), NOT DP** (per Jack 2026-07-12). Given Buildertrend "Project manager" access as **passive observers** for transparency into DP-for-DFS work — they are not DP construction PMs. Data corroborates: Ashley's last daily log was 2025-05-16 (14 months ago) and she's nominal PM on 4 jobsites; Brennan has zero jobsites/logs. Exclude both from DP construction workload; their BT "PM" role is observer access.
- **Jamie Koehler** — BT "Project manager" account, **INVITE PENDING**. RESOLVED (per Jack 2026-07-12): she's a real-estate agent Dominion works with (sells houses; ex-DM) and her BT access is **passive-observer** access — not an active construction PM. Same category as the Ashley Stephenson / Brennan Ross observer accounts (external/other-party BT visibility). See org-charts.md.
- **Fred Lewis** — BT invite pending (never activated); expected (exec).

## Not BT internal users (expected)
- The **7 in-house construction crew** (Israel Portillo, Jymmy Duarte, Jose Figueroa, Roland Keller, Jose Mendez, Sergio Perez, Pedro Vasquez) — no internal-user logins (field labor; same pattern as maintenance techs in AppFolio — they may appear as schedule assignees, not account holders).
- All DM property/maintenance staff, HR — not in BT (their systems are AppFolio/Podio).
