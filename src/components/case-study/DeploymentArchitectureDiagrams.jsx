import {
  ArrowDown,
  ArrowRight,
  Bot,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  Database,
  FileSearch,
  House,
  Layers3,
  Megaphone,
  Network,
  PhoneCall,
  ShieldCheck,
  Users,
  Wrench,
} from "lucide-react";

function Connector({ label }) {
  return (
    <div className="flex items-center justify-center gap-2 py-2 text-secondary/40 lg:flex-col lg:px-2 lg:py-0">
      <ArrowDown className="h-4 w-4 lg:hidden" aria-hidden="true" />
      <ArrowRight className="hidden h-4 w-4 lg:block" aria-hidden="true" />
      {label ? <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">{label}</span> : null}
    </div>
  );
}

function Node({ icon: Icon, eyebrow, title, body, accent = false }) {
  return (
    <div className={`h-full rounded-2xl border p-4 ${accent ? "border-accent/30 bg-accent/10" : "border-secondary/15 bg-secondary/[0.045]"}`}>
      <Icon className={`h-5 w-5 ${accent ? "text-accent" : "text-secondary/55"}`} aria-hidden="true" />
      <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-secondary/45">{eyebrow}</p>
      <h4 className="mt-2 text-sm font-semibold text-secondary">{title}</h4>
      <p className="mt-2 text-xs leading-5 text-secondary/60">{body}</p>
    </div>
  );
}

export function FdeArchitectureDiagram() {
  const teams = [
    { icon: CircleDollarSign, label: "Lending" },
    { icon: House, label: "Leasing" },
    { icon: Building2, label: "Property" },
    { icon: Wrench, label: "Construction" },
    { icon: FileSearch, label: "Accounting" },
  ];

  return (
    <figure className="mt-8 overflow-hidden rounded-[24px] border border-secondary/15 bg-primary/35">
      <figcaption className="flex flex-wrap items-center justify-between gap-3 border-b border-secondary/15 px-5 py-4">
        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary/55">FDE deployment architecture</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">Embedded delivery loop</span>
      </figcaption>

      <div className="p-4 sm:p-6">
        <div className="rounded-2xl border border-secondary/15 bg-secondary/[0.035] p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-secondary/45">Embedded business functions</p>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
            {teams.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 rounded-xl border border-secondary/10 px-3 py-3">
                <Icon className="h-4 w-4 shrink-0 text-secondary/50" aria-hidden="true" />
                <span className="text-xs font-medium text-secondary/70">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center py-3 text-secondary/40">
          <ArrowDown className="h-4 w-4" aria-hidden="true" />
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em]">Observe decisions, data, and exceptions</span>
        </div>

        <div className="grid items-stretch lg:grid-cols-[1fr_auto_1.15fr_auto_1fr]">
          <Node icon={Users} eyebrow="01 Map" title="Operating context" body="Roles, ownership, handoffs, approval boundaries, and daily workflows." />
          <Connector label="model" />
          <Node icon={Database} eyebrow="02 Foundation" title="HubSync + PostgreSQL + Claude" body="Normalize system records and structure operational text into shared context." accent />
          <Connector label="build" />
          <Node icon={Layers3} eyebrow="03 Surfaces" title="Portals, Helm, and automation" body="Deploy production tools into the workflows employees already own." />
        </div>

        <div className="flex flex-col items-center py-3 text-secondary/40">
          <ArrowDown className="h-4 w-4" aria-hidden="true" />
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em]">Deploy, review, train, improve</span>
        </div>

        <div className="grid gap-3 rounded-2xl border border-accent/25 bg-accent/[0.07] p-4 sm:grid-cols-[auto_1fr_auto] sm:items-center">
          <Bot className="h-6 w-6 text-accent" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-secondary">AI inside employee workflows</p>
            <p className="mt-1 text-xs leading-5 text-secondary/60">Employees use structured context, AI assistance, and visible exceptions with human decision ownership preserved.</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-secondary/65">
            <CheckCircle2 className="h-4 w-4 text-accent" aria-hidden="true" />
            Transfer capability
          </div>
        </div>
      </div>
    </figure>
  );
}

export function GtmArchitectureDiagram() {
  return (
    <figure className="mt-8 overflow-hidden rounded-[24px] border border-secondary/15 bg-primary/35">
      <figcaption className="flex flex-wrap items-center justify-between gap-3 border-b border-secondary/15 px-5 py-4">
        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary/55">GTM lead waterfall architecture</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">Source to leasing team</span>
      </figcaption>

      <div className="p-4 sm:p-6">
        <div className="grid gap-2 sm:grid-cols-3">
          <Node icon={Building2} eyebrow="Source 01" title="CoStar" body="Commercial property and market lead universe." />
          <Node icon={FileSearch} eyebrow="Source 02" title="DataTree" body="Property, ownership, and public-record context." />
          <Node icon={Bot} eyebrow="Source 03" title="Claude research" body="Generate and expand target candidates from defined criteria." />
        </div>

        <div className="flex flex-col items-center py-3 text-secondary/40">
          <ArrowDown className="h-4 w-4" aria-hidden="true" />
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em]">Enter waterfall</span>
        </div>

        <div className="grid items-stretch lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
          <Node icon={FileSearch} eyebrow="01 Research" title="Perplexity" body="Verify company, property, and market context against current sources." />
          <Connector />
          <Node icon={Network} eyebrow="02 Extract" title="Apify + APIs" body="Collect websites, contact data, and supporting public evidence." accent />
          <Connector />
          <Node icon={ShieldCheck} eyebrow="03 Resolve" title="Clean and deduplicate" body="Normalize records, remove weak matches, and resolve duplicate entities." />
          <Connector />
          <Node icon={Megaphone} eyebrow="04 Qualify" title="Score and route" body="Apply leasing criteria and send qualified records to the correct motion." />
        </div>

        <div className="flex flex-col items-center py-3 text-secondary/40">
          <ArrowDown className="h-4 w-4" aria-hidden="true" />
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em]">Activate qualified lead</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Node icon={Users} eyebrow="Destination" title="Leasing team" body="Review qualified accounts with source evidence attached." />
          <Node icon={PhoneCall} eyebrow="Communication" title="Twilio + RingCentral" body="Support structured calling, messaging, and follow-up workflows." />
          <Node icon={Network} eyebrow="Learning loop" title="Disposition feedback" body="Return outcomes to targeting and scoring criteria for the next run." accent />
        </div>
      </div>
    </figure>
  );
}
