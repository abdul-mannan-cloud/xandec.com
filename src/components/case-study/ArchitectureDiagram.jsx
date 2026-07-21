import { ArrowDown, Database, ScanText } from "lucide-react";

const sources = [
  { name: "AppFolio", role: "Property management" },
  { name: "Podio", role: "Acquisition and compliance" },
  { name: "Buildertrend", role: "Construction" },
  { name: "QuickBooks", role: "Accounting context" },
];

const outputs = [
  "Property registry",
  "Lifecycle phases",
  "Cross-system audit",
  "Role-based workflows",
];

export default function ArchitectureDiagram() {
  return (
    <figure className="overflow-hidden rounded-[32px] border border-primary/10 bg-secondary">
      <figcaption className="border-b border-primary/10 px-6 py-5 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/55">
          Property operations architecture
        </p>
        <p className="mt-2 max-w-[68ch] text-sm leading-6 text-primary/65">
          Operational sources stay accountable for their part of the lifecycle. Helm creates the shared view across them.
        </p>
      </figcaption>

      <div className="p-5 sm:p-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {sources.map((source, index) => (
            <div key={source.name} className="rounded-2xl border border-primary/10 bg-primary/[0.03] p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-xs text-primary/40">S{index + 1}</span>
                <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-primary">{source.name}</h3>
              <p className="mt-1 text-sm leading-6 text-primary/60">{source.role}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center py-5 text-primary/45">
          <ArrowDown className="h-5 w-5" aria-hidden="true" />
          <span className="mt-2 text-[11px] font-semibold uppercase tracking-[0.25em]">Ingest and reconcile</span>
        </div>

        <div className="grid overflow-hidden rounded-[26px] bg-primary text-secondary lg:grid-cols-[0.8fr_1.2fr]">
          <div className="border-b border-secondary/15 p-6 lg:border-b-0 lg:border-r lg:p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-secondary/15 bg-secondary/[0.05]">
              <Database className="h-5 w-5 text-accent" aria-hidden="true" />
            </div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.28em] text-secondary/55">Shared foundation</p>
            <h3 className="mt-3 text-2xl font-semibold">PostgreSQL property spine</h3>
            <p className="mt-3 max-w-[52ch] text-sm leading-6 text-secondary/70">
              Normalized properties, units, owners, jobs, source evidence, and lifecycle snapshots.
            </p>
          </div>

          <div className="p-6 lg:p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-secondary/15 bg-secondary/[0.05]">
              <ScanText className="h-5 w-5 text-warm" aria-hidden="true" />
            </div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.28em] text-secondary/55">Claude-assisted pipeline</p>
            <h3 className="mt-3 text-2xl font-semibold">Structure what rules cannot read</h3>
            <p className="mt-3 max-w-[60ch] text-sm leading-6 text-secondary/70">
              Extraction and classification for maintenance notes, scopes, invoices, and other operational text that arrives without a reliable schema.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center py-5 text-primary/45">
          <ArrowDown className="h-5 w-5" aria-hidden="true" />
          <span className="mt-2 text-[11px] font-semibold uppercase tracking-[0.25em]">Resolve into operating views</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {outputs.map((output, index) => (
            <div key={output} className="flex min-h-20 items-center gap-3 rounded-2xl border border-primary/10 px-4 py-3">
              <span className="font-mono text-xs text-primary/40">O{index + 1}</span>
              <span className="text-sm font-semibold text-primary">{output}</span>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}
