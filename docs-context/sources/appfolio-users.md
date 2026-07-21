# AppFolio Users — roster + role + last login (source, provided by Jack 2026-07-12)

Transcribed from two screenshots of AppFolio **Settings → Users**, sorted by Last Login desc. 34 accounts visible (list may continue below Ronald Cooper — [confirm if more]). "Role" = AppFolio permission group (NOT job title — see mismatches flagged in `reconciliation-matrix.md`). Roles expanded from truncated cells.

| Name | Email handle | AppFolio role | Last login | 2FA req | 2FA active |
|---|---|---|---|---|---|
| Joshua Lensch | joshualensch42@gmail (personal) | Maintenance Tech | **Account Not Activated** | No | No |
| Cameron Chamberlain | cameron@ | Marketing Manager | **Activated, Pending Signature** | Yes | No |
| Brian Kaminski | bkaminski@ | Maintenance Tech | **Account Not Activated** | No | No |
| Jack BeVier | jack@ | System Administrator | 07/12/2026 09:xx | Yes | Yes |
| Craig Cuocci | craigc@ | Inspections & Compliance | 07/12/2026 08:xx | Yes | Yes |
| Oceana Bush | oceana@ | Maintenance Manager | 07/12/2026 08:xx | Yes | Yes |
| Tamika Pinder | tamika@ | Maintenance Manager | 07/11/2026 12:xx | Yes | Yes |
| Katherine Neumiller | katherine@ | Accountant | 07/11/2026 08:xx | Yes | Yes |
| Pauline Jose | pauline@ | Assistant Property Manager | 07/10/2026 08:xx | Yes | Yes |
| Kenesha Gray | kenesha@ | Lead Property Manager | 07/10/2026 05:xx | Yes | Yes |
| Kadijah Punch | kadijahp@ | Lead Property Manager | 07/10/2026 04:xx | Yes | Yes |
| Ashley Ward | ashleyw@ | Lead Property Manager | 07/10/2026 04:xx | Yes | Yes |
| Erv Elswick | erv@ | President | 07/10/2026 03:xx | Yes | Yes |
| Saad Hassan | saadh@ | Lead Property Manager | 07/10/2026 03:xx | Yes | Yes |
| Stephanie Derry | stephanied@ | Lead Property Manager | 07/10/2026 02:xx | Yes | Yes |
| Rita Staten | rita@ | Assistant Property Manager | 07/10/2026 01:xx | Yes | Yes |
| Elizabeth Elly | elizabethe@ | Marketing Manager | 07/10/2026 01:xx | Yes | Yes |
| Mary Cutajar | mary@ | Assistant Property Manager | 07/10/2026 11:xx | Yes | Yes |
| Jessica Thomas | jessica@ | Maintenance Tech | 07/10/2026 10:xx | **No** | Yes |
| Toni Perry | **reception@** | Assistant Property Manager | 07/10/2026 07:xx | Yes | Yes |
| James Stewart | james@ | Maintenance Manager | 07/09/2026 05:xx | Yes | Yes |
| Aleksey Dekan | aleksey@ | Marketing Manager | 07/09/2026 03:xx | Yes | Yes |
| Tori Fowlkes | tori@ | Assistant Property Manager | 07/09/2026 11:xx | Yes | Yes |
| Marylou Lamcke | maryloul@ | President | 07/07/2026 02:xx | Yes | Yes |
| Genesis Cabrera | genesisc@ | Leasing Agent | 07/06/2026 11:xx | Yes | Yes |
| Victoria Robinson | victoria@ | Assistant Property Manager | 07/06/2026 11:xx | Yes | Yes |
| Rachel Walsh | rachelw@ | President | 06/29/2026 09:xx | Yes | Yes |
| Robert Mara | rmara@ | Maintenance Coordinator | 06/23/2026 04:xx | Yes | Yes |
| Christina Williams | cwilliams@ | **Accountant** | 06/22/2026 02:xx | Yes | Yes |
| Abdul Mannan | abdulm@ | President | 06/11/2026 10:xx | Yes | Yes |
| Christopher Holliday | christopherh@ | Maintenance Tech | 05/22/2026 10:xx | **No** | **No** |
| Edward Jamison | edwardj@ | Maintenance Tech | 05/11/2026 11:xx | **No** | **No** |
| Khalil Bryant | khalilb@ | Maintenance Tech | 05/04/2026 03:xx | **No** | **No** |
| Ronald Cooper | ronaldc@ | Maintenance Tech | 03/19/2026 11:xx | **No** | **No** |

## Identity resolutions this list confirms
- **"Reception" Podio login = Toni Perry** (reception@thedominiongroup.com; AppFolio Asst Property Manager). Resolves the shared-account ambiguity.
- **Aleksey Dekan = Marketing Manager** (aleksey@). This is the off-chart Podio actor — he's **Marketing, not operations**; his 7 Vacant Units Podio revs are anomalous for a marketing role. [confirm: why is marketing editing Vacant Units — data cleanup, or does he wear an ops hat?]
- **Abdul Mannan = the Forward Deployed Engineer who built Helm** (confirmed by Jack 2026-07-12) — the developer, not an ops employee. His `abdulm@thedominiongroup.com` account is the one whose credentials are **hardcoded in the Helm Buildertrend scrapers** (see `11-implementation-status.md` §6) and the "Abdul" fallback display name in Helm's UI; his President-level AppFolio access is build/integration access. So the whole developer-facing doc set (00–11 and every "ask the developer" [confirm]) is effectively written for Abdul. Security note reframed: the committed creds are the FDE's own login used as the scraper service account — still needs a **dedicated Buildertrend service account + env secret + rotation + history purge**, but it's a build-hygiene fix, not an unknown-account incident.

## Off-chart AppFolio accounts (people not on either org chart)
- **Marketing team:** Rachel Walsh (President/CMO), Cameron Chamberlain (Marketing Manager, onboarding pending), Elizabeth Elly (Marketing Manager), Aleksey Dekan (Marketing Manager). Marketing is entirely absent from the provided org charts.
- **Abdul Mannan** (President) — see above.
- **Joshua Lensch** (Maintenance Tech, personal gmail, not activated) — new/pending hire not yet on the chart.
