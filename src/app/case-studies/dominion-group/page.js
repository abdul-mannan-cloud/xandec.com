import Image from "next/image";
import {
  ArrowDown,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  Code2,
  Database,
  FileCheck2,
  House,
  Megaphone,
  MoveRight,
  Network,
  ShieldCheck,
} from "lucide-react";
import ArchitectureDiagram from "@/components/case-study/ArchitectureDiagram";
import CaseStudyReveal from "@/components/case-study/CaseStudyReveal";
import ScreenshotPlaceholder from "@/components/case-study/ScreenshotPlaceholder";
import { FdeArchitectureDiagram, GtmArchitectureDiagram } from "@/components/case-study/DeploymentArchitectureDiagrams";

const financialProducts = [
  {
    index: "01",
    title: "Instant Pricing",
    href: "https://pricing.thedominiongroup.com",
    problem:
      "Pricing a loan required staff to collect deal inputs, check program rules, and calculate terms before a borrower could get an answer.",
    change:
      "A live pricing workflow turns structured deal inputs into an immediate pricing path for borrowers and the team.",
    note: "The workflow organizes property, borrower, loan-purpose, leverage, and pricing inputs before a team member reviews the proposed terms.",
  },
  {
    index: "02",
    title: "Borrower portal",
    href: null,
    problem:
      "Identity checks, mortgage verification, borrower documents, and DSCR loan calculations moved through manual handoffs and disconnected records.",
    change:
      "The borrower portal creates one guided intake and verification surface for the lending workflow.",
    note: "The review path covers borrower identity, entity information, property details, mortgage information, and supporting documents before underwriting review.",
  },
  {
    index: "03",
    title: "Client portal",
    href: "https://clientportal.thedominiongroup.com",
    problem:
      "Legacy portal workflows, including LoanPASS, slowed document exchange and made status harder for clients and staff to follow.",
    change:
      "The client portal gives customers a clearer place to submit information, track progress, and continue the process.",
    note: "The new experience is designed around clear requests, visible progress, and fewer off-platform document and status handoffs.",
  },
  {
    index: "04",
    title: "Platform status",
    href: "https://status.thedominiongroup.com",
    problem:
      "As the number of production portals grew, employees and customers needed one place to confirm whether each service was available and healthy.",
    change:
      "A public status surface monitors the pricing, borrower, and client portals and makes current service health visible without a support request.",
    note: "The status layer turns portal health into a shared operational signal and gives the team a clear place to communicate service availability.",
  },
];

const propertyLifecycle = [
  "Acquisition and closing",
  "Renovation",
  "Ready to lease",
  "Marketing and application",
  "Active rental",
  "Notice and turnover",
];

const employeeRoles = [
  {
    role: "Lending and underwriting",
    icon: CircleDollarSign,
    before: "Manual verification, document review, pricing, and DSCR calculations across several steps.",
    after: "AI-assisted workflows inside pricing, borrower intake, and internal review.",
    note: "AI prepares and structures the work. Lending staff retain responsibility for verification, exceptions, and final decisions.",
  },
  {
    role: "Leasing and property operations",
    icon: House,
    before: "AppFolio held the live leasing workflow while staff and assistants mirrored status into Podio.",
    after: "Helm creates a shared property view and exposes lifecycle exceptions without another manual lookup.",
    note: "A leasing or operations user can review one property record with source evidence and exceptions instead of rebuilding context across platforms.",
  },
  {
    role: "Construction",
    icon: Building2,
    before: "Project managers worked in Buildertrend while administrators maintained a separate Podio renovation mirror.",
    after: "The unified layer connects construction status to the property lifecycle and the handoff back to leasing.",
    note: "Construction status and handoff evidence are normalized so project and property teams can identify missing steps before they become hidden delays.",
  },
  {
    role: "Accounting and compliance",
    icon: FileCheck2,
    before: "Teams cross-checked owner entities, rent, licenses, certificates, invoices, and operational records by hand.",
    after: "Cross-system audit rules surface mismatches and expiring records in one place for review.",
    note: "The system structures supporting records and directs mismatches to a human reviewer rather than making autonomous accounting or compliance decisions.",
  },
];

const results = [
  { value: "2", label: "Business lines", prompt: "Financial services and property operations" },
  { value: "10+", label: "Portals unified", prompt: "Customer and internal operating surfaces" },
  { value: "5+", label: "Customer surfaces", prompt: "Pricing, borrower, client, status, and supporting experiences" },
  { value: "1,000+", label: "Units managed", prompt: "Residential rental portfolio" },
];

export const metadata = {
  title: "The Dominion Group AI deployment case study | Xandec",
  description:
    "How Xandec deployed AI across The Dominion Group's financial services and property operations.",
  alternates: {
    canonical: "https://xandec.com/case-studies/dominion-group",
  },
  openGraph: {
    title: "The Dominion Group AI deployment case study | Xandec",
    description:
      "A company-wide AI deployment across financial services and property operations.",
    url: "https://xandec.com/case-studies/dominion-group",
    images: [
      {
        url: "/case-studies/dominion-group/opengraph-image",
        width: 1200,
        height: 630,
        alt: "The Dominion Group AI deployment case study",
      },
    ],
  },
};

function Eyebrow({ children, dark = false }) {
  return (
    <p className={`text-xs font-semibold uppercase tracking-[0.28em] ${dark ? "text-secondary/65" : "text-primary/60"}`}>
      {children}
    </p>
  );
}

function ChapterHeading({ number, eyebrow, title, body, dark = false }) {
  return (
    <div className={`grid gap-6 lg:grid-cols-[180px_minmax(0,1fr)] ${dark ? "text-secondary" : "text-primary"}`}>
      <div className="flex items-center gap-3 lg:items-start">
        <span className={`font-mono text-sm ${dark ? "text-accent" : "text-primary/45"}`}>{number}</span>
        <span className={`h-px flex-1 lg:mt-2 ${dark ? "bg-secondary/20" : "bg-primary/15"}`} />
      </div>
      <div>
        <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
        <h2 className="mt-4 max-w-4xl text-3xl font-semibold leading-[1.08] tracking-[-0.035em] sm:text-4xl lg:text-5xl">
          {title}
        </h2>
        {body ? (
          <p className={`mt-6 max-w-[70ch] text-base leading-8 sm:text-lg ${dark ? "text-secondary/75" : "text-primary/72"}`}>
            {body}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function FieldNote({ children, dark = false }) {
  return (
    <p className={`rounded-xl border border-dashed px-4 py-3 text-sm leading-6 ${dark ? "border-secondary/25 bg-secondary/[0.05] text-secondary/70" : "border-primary/20 bg-primary/[0.035] text-primary/70"}`}>
      {children}
    </p>
  );
}

export default function DominionGroupCaseStudyPage() {
  return (
    <main className="overflow-hidden bg-secondary text-primary">
      <section className="relative min-h-[92svh] overflow-hidden bg-primary text-secondary">
        <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(230,230,221,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(230,230,221,0.055)_1px,transparent_1px)] [background-size:64px_64px]" />
        <div className="absolute -right-36 top-24 h-[440px] w-[440px] rounded-full border border-accent/20 sm:h-[620px] sm:w-[620px]" />
        <div className="absolute -right-16 top-44 h-[280px] w-[280px] rounded-full border border-warm/20 sm:h-[420px] sm:w-[420px]" />

        <div className="relative mx-auto flex min-h-[92svh] w-[92vw] max-w-[1400px] flex-col justify-between pb-8 pt-32 sm:pt-36">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
            <CaseStudyReveal>
              <div className="flex items-center gap-5">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[24px] border border-secondary/15 bg-secondary/5 sm:h-28 sm:w-28">
                  <Image src="/dominion.png" alt="The Dominion Group logo" fill sizes="(min-width: 640px) 112px, 96px" className="object-cover" priority />
                </div>
                <div>
                  <Eyebrow dark>Reference case study</Eyebrow>
                  <p className="mt-1 text-sm text-secondary/75">The Dominion Group</p>
                </div>
              </div>

              <h1 className="mt-10 max-w-5xl text-[clamp(3rem,8vw,7.5rem)] font-semibold leading-[0.92] tracking-[-0.065em]">
                Building an AI-enabled company.
              </h1>
              <p className="mt-8 max-w-[68ch] text-lg leading-8 text-secondary/75 sm:text-xl">
                Xandec worked across The Dominion Group, from financial services to property operations, to turn AI from a leadership priority into production systems and employee workflows.
              </p>
            </CaseStudyReveal>

            <CaseStudyReveal delay={80} className="border-l border-secondary/15 pl-6 lg:mt-20">
              <Eyebrow dark>Deployment scope</Eyebrow>
              <div className="mt-5 space-y-5">
                <div>
                  <p className="text-2xl font-semibold">2</p>
                  <p className="mt-1 text-sm text-secondary/65">Business lines</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold">10+</p>
                  <p className="mt-1 text-sm text-secondary/65">Portals unified</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold">1,000+</p>
                  <p className="mt-1 text-sm text-secondary/65">Units managed, supplied figure</p>
                </div>
                <FieldNote dark>Portfolio figure supplied for this case study. Final publication should reconcile units managed with the broader Helm property registry.</FieldNote>
              </div>
            </CaseStudyReveal>
          </div>

          <a href="#starting-point" className="mt-16 inline-flex min-h-11 w-fit items-center gap-3 text-sm font-medium text-secondary/70 transition-colors duration-200 hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
            Follow the deployment
            <ArrowDown className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </section>

      <section id="starting-point" className="mx-auto w-[92vw] max-w-[1400px] py-24 sm:py-32 lg:py-40">
        <CaseStudyReveal>
          <ChapterHeading
            number="01"
            eyebrow="The starting point"
            title="The goal was bigger than fixing one workflow."
            body="The Dominion Group wanted to become an AI-enabled operating company. That meant finding where work slowed down across both business lines, building reliable data foundations, shipping useful systems, and teaching people how to use AI inside the work they already owned."
          />
        </CaseStudyReveal>

        <div className="mt-16 grid gap-px overflow-hidden rounded-[32px] border border-primary/10 bg-primary/10 lg:grid-cols-2">
          <CaseStudyReveal className="bg-secondary p-6 sm:p-10" delay={40}>
            <CircleDollarSign className="h-7 w-7 text-primary/65" aria-hidden="true" />
            <div className="mt-8"><Eyebrow>Dominion Financial Services</Eyebrow></div>
            <h3 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">Manual lending operations slowed decisions.</h3>
            <p className="mt-5 max-w-[62ch] text-base leading-7 text-primary/70">
              Staff verified borrowers, reviewed mortgage information, collected documents, calculated DSCR loans, priced deals, and moved cases through portal workflows with too many manual steps.
            </p>
            <p className="mt-4 max-w-[62ch] text-base leading-7 text-primary/70">
              The issue was not one missing screen. It was the cumulative delay created by repeated checks, handoffs, and systems that did not give borrowers or staff a clear path through the process.
            </p>
          </CaseStudyReveal>

          <CaseStudyReveal className="bg-secondary p-6 sm:p-10" delay={80}>
            <House className="h-7 w-7 text-primary/65" aria-hidden="true" />
            <div className="mt-8"><Eyebrow>Dominion property operations</Eyebrow></div>
            <h3 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">The property lifecycle crossed systems and teams.</h3>
            <p className="mt-5 max-w-[62ch] text-base leading-7 text-primary/70">
              AppFolio ran day-to-day property management. Buildertrend ran construction. Podio held acquisition, renovation, leasing, and compliance records. QuickBooks supported accounting. Teams maintained mirrors and reconciled handoffs by hand.
            </p>
            <p className="mt-4 max-w-[62ch] text-base leading-7 text-primary/70">
              Every property moved through acquisition, renovation, leasing, active rental, and turnover. A missing or stale record could hide delay, create duplicate entry, or route a decision using the wrong owner or status.
            </p>
          </CaseStudyReveal>
        </div>
      </section>

      <section className="bg-primary text-secondary">
        <div className="mx-auto w-[92vw] max-w-[1400px] py-24 sm:py-32 lg:py-40">
          <CaseStudyReveal>
            <ChapterHeading
              number="02"
              eyebrow="Business line one: financial services"
              title="We rebuilt the path from borrower interest to a workable loan."
              body="The financial services work focused on the places where manual verification, calculations, document movement, and limited portal experiences added friction. Each product removed a specific part of that burden while preserving human review where it mattered."
              dark
            />
          </CaseStudyReveal>

          <div className="mt-16 divide-y divide-secondary/15 border-y border-secondary/15">
            {financialProducts.map((product, index) => (
              <CaseStudyReveal key={product.title} delay={index * 45}>
                <article className="grid gap-8 py-10 lg:grid-cols-[110px_0.75fr_1.25fr] lg:gap-12 lg:py-14">
                  <p className="font-mono text-sm text-accent">{product.index}</p>
                  <div>
                    <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">{product.title}</h3>
                    {product.href ? (
                      <a href={product.href} target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-secondary underline decoration-secondary/30 underline-offset-4 transition-colors duration-200 hover:decoration-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                        View live surface <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      </a>
                    ) : null}
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary/50">Operational problem</p>
                      <p className="mt-3 text-base leading-7 text-secondary/75">{product.problem}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary/50">What changed</p>
                      <p className="mt-3 text-base leading-7 text-secondary/75">{product.change}</p>
                      <div className="mt-5"><FieldNote dark>{product.note}</FieldNote></div>
                    </div>
                  </div>
                </article>
              </CaseStudyReveal>
            ))}
          </div>

          <CaseStudyReveal className="mt-16">
            <ScreenshotPlaceholder
              title="Financial services product suite"
              imageSrc="/case-studies/dominion-group/financial-product-suite.png"
              imageAlt="Concept composite of Instant Pricing, borrower portal, client portal, and system status interfaces"
              className="border-secondary/15 bg-secondary/[0.04] [&_figcaption]:text-secondary [&_span]:border-secondary/20 [&_span]:text-secondary/60"
            />
          </CaseStudyReveal>
        </div>
      </section>

      <section className="mx-auto w-[92vw] max-w-[1400px] py-24 sm:py-32 lg:py-40">
        <CaseStudyReveal>
          <ChapterHeading
            number="03"
            eyebrow="Business line two: property operations"
            title="We modeled the business before we automated it."
            body="Property operations were not a linear software problem. A property crosses legal entities, departments, and systems from contract through renovation, leasing, active rental, and turnover. We documented that lifecycle, the people responsible for each transition, and the source of truth at each stage."
          />
        </CaseStudyReveal>

        <CaseStudyReveal className="mt-16 rounded-[32px] border border-primary/10 bg-primary p-6 text-secondary sm:p-10 lg:p-12">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <Eyebrow dark>The operating principle</Eyebrow>
              <blockquote className="mt-5 text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
                Every day a property is owned but not rented carries a cost.
              </blockquote>
              <p className="mt-5 max-w-[56ch] text-base leading-7 text-secondary/70">
                Helm uses one lifecycle model to show where those days accumulate. Phase clocks locate delay. Cross-system rules expose the records that make the lifecycle unreliable.
              </p>
            </div>
            <ol className="grid gap-3 sm:grid-cols-2">
              {propertyLifecycle.map((phase, index) => (
                <li key={phase} className="flex items-center gap-3 rounded-xl border border-secondary/15 bg-secondary/[0.04] px-4 py-3 text-sm text-secondary/80">
                  <span className="font-mono text-xs text-accent">{String(index + 1).padStart(2, "0")}</span>
                  {phase}
                </li>
              ))}
            </ol>
          </div>
        </CaseStudyReveal>
      </section>

      <section className="border-y border-primary/10 bg-primary/[0.035]">
        <div className="mx-auto w-[92vw] max-w-[1400px] py-24 sm:py-32 lg:py-40">
          <CaseStudyReveal>
            <ChapterHeading
              number="04"
              eyebrow="The foundation: Helm"
              title="Four operating systems became one property-level view."
              body="Helm consolidates the signals needed to understand a property across its lifecycle. PostgreSQL provides the shared data foundation. The pipeline reconciles identifiers, derives lifecycle phases, and applies audit rules across operational records. Claude supports extraction and classification where the source material is unstructured."
            />
          </CaseStudyReveal>

          <CaseStudyReveal className="mt-16">
            <ArchitectureDiagram />
          </CaseStudyReveal>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { icon: Database, title: "Unified registry", text: "One property spine across systems, owners, units, jobs, and lifecycle evidence." },
              { icon: Network, title: "Lifecycle intelligence", text: "A phase model locates every property and exposes stalled or incomplete handoffs." },
              { icon: ShieldCheck, title: "Audit layer", text: "Rules flag owner, status, rent, licensing, certificate, and turnover discrepancies for review." },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <CaseStudyReveal key={item.title} delay={index * 40} className="rounded-2xl border border-primary/10 bg-secondary p-6">
                  <Icon className="h-6 w-6 text-primary/60" aria-hidden="true" />
                  <h3 className="mt-5 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-3 text-base leading-7 text-primary/70">{item.text}</p>
                </CaseStudyReveal>
              );
            })}
          </div>

          <CaseStudyReveal className="mt-8">
            <ScreenshotPlaceholder
              title="Helm operating view"
              imageSrc="/case-studies/dominion-group/helm-operating-view.png"
              imageAlt="Concept dashboard for Helm showing a property registry, lifecycle phases, connected sources, and audit findings"
            />
          </CaseStudyReveal>
        </div>
      </section>

      <section className="mx-auto w-[92vw] max-w-[1400px] py-24 sm:py-32 lg:py-40">
        <CaseStudyReveal>
          <ChapterHeading
            number="05"
            eyebrow="AI in the hands of employees"
            title="The deployment changed individual work, role by role."
            body="Production systems created leverage at the company level. Adoption required a second layer: putting AI into the daily work of the people who price loans, review documents, lease units, run construction, reconcile records, and manage compliance."
          />
        </CaseStudyReveal>

        <div className="mt-16 grid gap-4 lg:grid-cols-2">
          {employeeRoles.map((item, index) => {
            const Icon = item.icon;
            return (
              <CaseStudyReveal key={item.role} delay={index * 40}>
                <article className="h-full rounded-[28px] border border-primary/10 bg-secondary p-6 sm:p-8">
                  <div className="flex items-center justify-between gap-4">
                    <Icon className="h-7 w-7 text-primary/60" aria-hidden="true" />
                    <span className="font-mono text-xs text-primary/40">{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="mt-8 text-2xl font-semibold tracking-tight">{item.role}</h3>
                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/45">Before</p>
                      <p className="mt-3 text-base leading-7 text-primary/70">{item.before}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/45">With the deployment</p>
                      <p className="mt-3 text-base leading-7 text-primary/70">{item.after}</p>
                    </div>
                  </div>
                  <div className="mt-6"><FieldNote>{item.note}</FieldNote></div>
                </article>
              </CaseStudyReveal>
            );
          })}
        </div>
      </section>

      <div className="bg-primary text-secondary">
        <div className="mx-auto w-[92vw] max-w-[1400px] py-24 sm:py-32 lg:py-40">
          <CaseStudyReveal>
            <ChapterHeading
              number="06"
              eyebrow="Forward deployed engineering and GTM"
              title="We worked inside the company, then built systems for operations and growth."
              body="This engagement combined two kinds of deployment. Forward deployed engineering embedded technical builders inside the organization to understand and improve how work moved. The GTM track applied the same systems approach to finding, enriching, and qualifying new leads."
              dark
            />
          </CaseStudyReveal>

          <div className="mt-16 space-y-12">
            <CaseStudyReveal as="section" className="flex min-h-dvh flex-col justify-center rounded-[30px] border border-secondary/15 bg-secondary/[0.055] p-6 sm:p-9 lg:p-14">
              <div className="flex items-start justify-between gap-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-secondary/15 bg-secondary/[0.06]">
                  <Code2 className="h-6 w-6 text-accent" aria-hidden="true" />
                </div>
                <span className="font-mono text-xs text-secondary/40">FDE</span>
              </div>
              <div className="mt-8"><Eyebrow dark>Forward deployed engineering</Eyebrow></div>
              <h3 className="mt-5 text-3xl font-semibold leading-tight tracking-tight">
                Engineers embedded across the operating company.
              </h3>
              <p className="mt-5 max-w-[62ch] text-base leading-7 text-secondary/72">
                As forward deployed engineers, we did more than take software requirements. We worked alongside lending, leasing, construction, property operations, and accounting to understand the decisions, handoffs, records, and exceptions that shaped daily work.
              </p>

              <div className="mt-8 space-y-5">
                {[
                  ["Map", "Documented business lines, roles, systems of record, and property lifecycle handoffs."],
                  ["Build", "Connected fragmented data and shipped production tools around real employee workflows."],
                  ["Deploy", "Put AI into the work itself, with domain owners involved in testing and review."],
                  ["Train", "Developed the playbook for training FDEs and enabling employees to continue using AI effectively."],
                ].map(([label, text]) => (
                  <div key={label} className="grid grid-cols-[76px_1fr] gap-4 border-t border-secondary/15 pt-5">
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">{label}</p>
                    <p className="text-sm leading-6 text-secondary/70">{text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <FieldNote dark>A representative FDE workflow connected property source data, lifecycle evidence, and audit exceptions so operations staff could investigate a property without rebuilding its history by hand.</FieldNote>
              </div>
              <FdeArchitectureDiagram />
            </CaseStudyReveal>

            <CaseStudyReveal as="section" delay={60} className="flex min-h-dvh flex-col justify-center rounded-[30px] border border-accent/25 bg-accent/[0.07] p-6 sm:p-9 lg:p-14">
              <div className="flex items-start justify-between gap-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-accent/25 bg-accent/10">
                  <Megaphone className="h-6 w-6 text-accent" aria-hidden="true" />
                </div>
                <span className="font-mono text-xs text-secondary/40">GTM</span>
              </div>
              <div className="mt-8"><Eyebrow dark>Go-to-market engineering</Eyebrow></div>
              <h3 className="mt-5 text-3xl font-semibold leading-tight tracking-tight">
                A lead waterfall built for the leasing motion.
              </h3>
              <p className="mt-5 max-w-[62ch] text-base leading-7 text-secondary/72">
                For the leasing GTM workflow, we built a waterfall model that sources potential leads from CoStar, then passes each record through multiple research, extraction, and enrichment services before it reaches the team.
              </p>

              <GtmArchitectureDiagram />
              <div className="mt-8">
                <FieldNote dark>CoStar provides the starting universe. Claude and Perplexity support research and qualification. Apify and additional public-record and contact-enrichment services collect and normalize the evidence used to clean each lead.</FieldNote>
              </div>
            </CaseStudyReveal>
          </div>

          <CaseStudyReveal className="mt-8 border-t border-secondary/20 pt-8">
            <div className="grid gap-6 lg:grid-cols-[180px_1fr]">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent">The model</p>
              <p className="max-w-[72ch] text-xl leading-8 text-secondary/78">
                The same delivery discipline connected both tracks: understand the operating context, build against real constraints, deploy with the people doing the work, and leave behind a capability that can be repeated.
              </p>
            </div>
          </CaseStudyReveal>
        </div>
      </div>

      <section className="mx-auto w-[92vw] max-w-[1400px] py-24 sm:py-32 lg:py-40">
        <div className="grid gap-20 lg:grid-cols-2">
          <CaseStudyReveal>
            <ChapterHeading number="08" eyebrow="Why Claude" title="A practical choice for the work." />
            <ul className="mt-10 space-y-6 lg:pl-[180px]">
              {[
                "Claude handled messy operational text more reliably than the alternatives benchmarked for the deployment.",
                "Anthropic's safety and enterprise posture mattered because workflows touched tenant and borrower financial records.",
                "Token-cost optimization kept extraction and classification economically viable at portfolio scale.",
              ].map((item) => (
                <li key={item} className="flex gap-4 border-t border-primary/10 pt-5 text-base leading-7 text-primary/72">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary/55" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </CaseStudyReveal>

          <CaseStudyReveal delay={60}>
            <ChapterHeading number="09" eyebrow="Technical stack" title="Systems connected around the work." />
            <div className="mt-10 space-y-7 lg:pl-[180px]">
              {[
                { label: "AI and data", items: ["Claude", "PostgreSQL", "FastAPI", "Perplexity"] },
                { label: "Products", items: ["Helm", "HubSync", "Instant Pricing", "LoanPASS"] },
                { label: "Business systems", items: ["AppFolio", "Podio", "Buildertrend", "QuickBooks", "Sage"] },
                { label: "GTM and communications", items: ["CoStar", "DataTree", "Apify", "Twilio", "RingCentral"] },
                { label: "Engineering", items: ["React", "Next.js", "NestJS", "Vite", "Redux Toolkit", "Playwright", "Docker", "Traefik"] },
              ].map((group) => (
                <div key={group.label} className="border-t border-primary/10 pt-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/45">{group.label}</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {group.items.map((item) => (
                      <span key={item} className="rounded-full border border-primary/15 px-4 py-2 text-sm font-medium">{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-7 lg:pl-[180px]"><FieldNote>Helm is the property operations product. HubSync is the synchronization and normalization layer supporting its shared property view. LoanPASS remains part of the financial-services system landscape while the newer pricing and portal surfaces improve the borrower and client experience around it.</FieldNote></div>
          </CaseStudyReveal>
        </div>
      </section>

      <section className="border-y border-primary/10 bg-primary/[0.035]">
        <div className="mx-auto w-[92vw] max-w-[1400px] py-24 sm:py-32 lg:py-40">
          <CaseStudyReveal>
            <ChapterHeading
              number="10"
              eyebrow="Deployment scale"
              title="A program spanning systems, products, and business lines."
              body="These figures describe the documented scope of the deployment. Performance outcomes such as hours saved, conversion lift, and cycle-time reduction should be added only after Dominion validates the measurement."
            />
          </CaseStudyReveal>

          <div className="mt-16 grid gap-px overflow-hidden rounded-[28px] border border-primary/10 bg-primary/10 sm:grid-cols-2 xl:grid-cols-4">
            {results.map((result) => (
              <article key={result.label} className="bg-secondary p-6 sm:p-8">
                <p className="font-mono text-4xl font-semibold tracking-tight">{result.value}</p>
                <h3 className="mt-7 text-sm font-semibold uppercase tracking-[0.22em]">{result.label}</h3>
                <p className="mt-3 text-sm leading-6 text-primary/60">{result.prompt}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-[92vw] max-w-[1400px] py-20 sm:py-24">
        <CaseStudyReveal className="relative overflow-hidden rounded-[32px] bg-primary p-7 text-secondary sm:p-10 lg:p-14">
          <div className="absolute right-0 top-0 h-56 w-56 rounded-full border border-accent/20 translate-x-1/3 -translate-y-1/3" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <Eyebrow dark>Build the next deployment</Eyebrow>
              <h2 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                Start with the company, then build the AI around its work.
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="/#contact" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-secondary px-5 py-3 text-sm font-semibold text-primary transition-colors duration-200 hover:bg-secondary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                Contact Xandec <MoveRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a href="https://work.xandec.com" className="inline-flex min-h-11 items-center rounded-full border border-secondary/25 px-5 py-3 text-sm font-semibold text-secondary transition-colors duration-200 hover:bg-secondary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                View more work
              </a>
            </div>
          </div>
        </CaseStudyReveal>
      </section>
    </main>
  );
}
