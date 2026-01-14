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
    imageUrl: '/me.png'
  },
  {
    name: 'Zeeshan Ali',
    title: 'Team Member',
    imageUrl: '/me.png'
  },
  {
    name: 'Muhammad Awais',
    title: 'Team Member',
    imageUrl: '/me.png'
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
          {teamMembers.map((member) => (
            <div key={member.name} className="flex items-center justify-center">
              <div className="h-[420px] w-full max-w-[320px]">
                <EvervaultCard
                  className="rounded-3xl"
                  imageUrl={member.imageUrl}
                  title={member.name}
                  subtitle={member.title}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
