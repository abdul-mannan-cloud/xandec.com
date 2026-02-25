import { EvervaultCard } from '@/components/UI/evervault-card';

const teamMembers = [
  {
    name: 'Abdul Mannan',
    title: 'Core Leader',
    description: 'Technical lead with a geek-grade obsession for new stacks, systems, and shipping clean architecture.',
    imageUrl: '/me.png'
  },
  {
    name: 'Khizer Tariq',
    title: 'Core Leader',
    description: 'Operations and delivery anchor who keeps teams consistent, aligned, and moving without friction.',
    imageUrl: '/khizer.png'
  },
  {
    name: 'Zeeshan Ali',
    title: 'Core Leader',
    description: 'Versatile builder who bridges design, dev, and product with a jack-of-all-trades edge.',
    imageUrl: '/zeeshan.png'
  },
  {
    name: 'Muhammad Awais',
    title: 'Core Leader',
    description: 'Problem-solver and growth driver who can sell the vision and close with confidence.',
    imageUrl: '/awais.png'
  }
];

const philosophyPoints = [
  {
    title: 'Outcome First',
    description:
      'We start with measurable business goals, then align product, architecture, and execution around them.'
  },
  {
    title: 'Speed With Discipline',
    description:
      'Fast delivery only matters when it is stable. We pair rapid execution with strong engineering standards.'
  },
  {
    title: 'Long-Term Thinking',
    description:
      'We build systems teams can confidently scale, maintain, and evolve as their business grows.'
  }
];

const differentiators = [
  {
    title: 'Product + Engineering in One Motion',
    description:
      'Strategy, UX, and implementation work together as one stream, reducing handoff friction and delays.'
  },
  {
    title: 'AI + Full-Stack Capability',
    description:
      'From customer-facing apps to backend intelligence, we deliver complete platforms, not fragmented parts.'
  },
  {
    title: 'Operational Clarity',
    description:
      'Clear scope, transparent updates, and ownership at every step keep projects predictable and efficient.'
  },
  {
    title: 'Built for Production Reality',
    description:
      'Security, performance, observability, and maintainability are built in from day one.'
  }
];

const leadershipPillars = [
  {
    title: 'Strategic Direction',
    description: 'Long-horizon product judgment that keeps every build tied to commercial outcomes.'
  },
  {
    title: 'Technical Authority',
    description: 'Deep engineering leadership across architecture, platform reliability, and AI-driven systems.'
  },
  {
    title: 'Delivery Excellence',
    description: 'Execution rhythm that translates priorities into steady releases without quality debt.'
  },
  {
    title: 'Growth Partnership',
    description: 'A client-first operating model focused on momentum, transparency, and measurable progress.'
  }
];

export default function AboutPage() {
  return (
    <section className="min-h-screen bg-secondary text-primary mt-10">
      <div className="mx-auto w-[98vw] max-w-[1400px] px-6 py-12 sm:px-10 sm:py-16 md:px-14">
        <div className="rounded-[28px] border border-primary/10 bg-primary p-7 text-secondary sm:rounded-[36px] sm:p-10 md:p-12">
          <p className="text-xs uppercase tracking-[0.35em] text-secondary/70">About Xandec</p>
          <h1 className="mt-5 max-w-4xl text-3xl font-semibold leading-tight sm:text-5xl">
            Vision-led software engineering for teams building serious products.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-secondary/80 sm:text-lg">
            We exist to help ambitious companies turn complex ideas into dependable products that drive business
            momentum. Our approach combines product thinking, engineering depth, and AI capability to ship with speed
            and confidence.
          </p>
        </div>

        <div className="mt-10">
          <p className="text-xs uppercase tracking-[0.35em] text-primary/60">Our Philosophy</p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {philosophyPoints.map((point) => (
              <article
                key={point.title}
                className="rounded-2xl border border-primary/10 bg-primary/[0.04] p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/20"
              >
                <h2 className="text-lg font-semibold">{point.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-primary/75 sm:text-base">{point.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-10 rounded-[24px] border border-primary/10 bg-gradient-to-br from-primary/[0.04] via-transparent to-primary/[0.08] p-6 sm:p-8 md:p-10">
          <p className="text-xs uppercase tracking-[0.35em] text-primary/60">What Sets Us Apart</p>
          <h2 className="mt-4 max-w-3xl text-2xl font-semibold leading-tight sm:text-3xl">
            A focused engineering partner built for outcomes, not just output.
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {differentiators.map((item) => (
              <article key={item.title} className="rounded-xl border border-primary/10 bg-secondary/50 p-5">
                <h3 className="text-base font-semibold sm:text-lg">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-primary/75 sm:text-base">{item.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="relative mt-10 overflow-hidden rounded-[28px] border border-primary/15 bg-primary p-6 text-secondary shadow-[0_20px_60px_rgba(7,27,45,0.25)] sm:p-8 md:p-10">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-warm/20 blur-3xl" />

          <div className="relative z-10">
            <p className="text-xs uppercase tracking-[0.35em] text-secondary/70">Who We Are</p>
            <h2 className="mt-4 max-w-4xl text-2xl font-semibold leading-tight sm:text-3xl md:text-4xl">
              Four visionary leadership pillars backed by a high-performance team built to redefine modern software delivery.
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-secondary/80 sm:text-base">
              We are structured as a leadership-first agency with a strong execution bench. That combination gives clients
              senior-level thinking, faster decisions, and production-ready delivery from day one.
            </p>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {leadershipPillars.map((pillar) => (
                <article key={pillar.title} className="rounded-2xl border border-secondary/15 bg-secondary/5 p-5">
                  <h3 className="text-base font-semibold sm:text-lg">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-secondary/80 sm:text-base">{pillar.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* Team section retained intentionally, hidden per request.
        <div className="mt-12 grid w-full place-items-center gap-8 md:grid-cols-2 xl:grid-cols-4">
          <div key={teamMembers[0].name} className="flex items-center justify-center">
            <div className="h-[420px] w-full max-w-[320px]">
              <EvervaultCard
                className="rounded-3xl"
                imageUrl={teamMembers[0].imageUrl}
                title={teamMembers[0].name}
                subtitle={teamMembers[0].title}
                description={teamMembers[0].description}
                index={0}
              />
            </div>
          </div>
          <div key={teamMembers[1].name} className="flex items-center justify-center">
            <div className="h-[420px] w-full max-w-[320px]">
              <EvervaultCard
                className="rounded-3xl"
                imageUrl={teamMembers[1].imageUrl}
                title={teamMembers[1].name}
                subtitle={teamMembers[1].title}
                description={teamMembers[1].description}
                index={1}
              />
            </div>
          </div>
          <div key={teamMembers[2].name} className="flex items-center justify-center">
            <div className="h-[420px] w-full max-w-[320px]">
              <EvervaultCard
                className="rounded-3xl"
                imageUrl={teamMembers[2].imageUrl}
                title={teamMembers[2].name}
                subtitle={teamMembers[2].title}
                description={teamMembers[2].description}
                index={2}
              />
            </div>
          </div>
          <div key={teamMembers[3].name} className="flex items-center justify-center">
            <div className="h-[420px] w-full max-w-[320px]">
              <EvervaultCard
                className="rounded-3xl"
                imageUrl={teamMembers[3].imageUrl}
                title={teamMembers[3].name}
                subtitle={teamMembers[3].title}
                description={teamMembers[3].description}
                index={3}
              />
            </div>
          </div>
        </div>
        */}

      </div>
    </section>
  );
}
