import { EvervaultCard } from '@/components/UI/evervault-card';

const teamMembers = [
  {
    name: 'Abdul Mannan',
    title: 'Team Member',
    imageUrl: '/me.png'
  },
  {
    name: 'Khizer Tariq',
    title: 'Team Member',
    imageUrl: '/khizer.png'
  },
  {
    name: 'Zeeshan Ali',
    title: 'Team Member',
    imageUrl: '/zeeshan.png'
  },
  {
    name: 'Muhammad Awais',
    title: 'Team Member',
    imageUrl: '/awais.png'
  }
];

export default function AboutPage() {
  return (
    <section className="min-h-screen bg-secondary text-primary">
      <div className="mx-auto flex min-h-screen w-[98vw] max-w-[1400px] flex-col items-center justify-center px-6 py-12 sm:px-10 md:px-14">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-primary/60">
            About Us
          </p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">
            Meet the team behind Xandec.
          </h1>
          <p className="mt-4 text-base text-primary/70 sm:text-lg">
            Four builders focused on shipping reliable, scalable products.
          </p>
        </div>

        <div className="mt-12 grid w-full place-items-center gap-8 md:grid-cols-2 xl:grid-cols-4">
          <div key={teamMembers[0].name} className="flex items-center justify-center">
              <div className="h-[420px] w-full max-w-[320px]">
                <EvervaultCard
                  className="rounded-3xl"
                  imageUrl={teamMembers[0].imageUrl}
                  title={teamMembers[0].name}
                  subtitle={teamMembers[0].title}
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
                  index={3}
                />
              </div>
            </div>
        </div>
      </div>
    </section>
  );
}
