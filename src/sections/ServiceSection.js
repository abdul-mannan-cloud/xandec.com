'use client';

import {motion} from 'framer-motion';
import Link from 'next/link';
import {Marquee} from "@/components/UI/marquee";

export default function ServicesSection() {
    // Animation variants
    const containerVariants = {
        hidden: {opacity: 0},
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: {opacity: 0, y: 20},
        visible: {
            opacity: 1,
            y: 0,
            transition: {duration: 0.7, ease: "easeOut"}
        }
    };

    const services = [
        {
            title: "Product Strategy",
            description: "Discovery, roadmaps, and validation to align teams on outcomes."
        },
        {
            title: "UX & UI Design",
            description: "UX research, wireframes, UI systems, and design ops."
        },
        {
            title: "Web & Mobile Apps",
            description: "Modern web builds and mobile apps that scale fast."
        },
        {
            title: "Backend & APIs",
            description: "Scalable services, integrations, and secure APIs."
        },
    ];

    const horizontalServices = [
        {
            title: "Cloud & DevOps",
            description: "Infrastructure, CI/CD, observability, and reliability."
        },
        {
            title: "Data, AI & Automation",
            description: "Pipelines, analytics, applied AI, and workflow automation."
        },
        {
            title: "Ecommerce & CRM",
            description: "Commerce, CRM, and lifecycle flows that convert."
        },
        {
            title: "Legacy Modernization",
            description: "Refactors, migrations, and performance upgrades."
        },
    ];

    const marqueeImages = [
        "/estimatrix.png",
        "/gntc.png",
        "/oxyhelp.png",
        "/pliro.png",
        "/pspc.png",
        "/vimea.png",
        "/weelz.png",
        "/1.jpg"
    ];

    const serviceCards = services.slice(0, 4);
    const accentGradients = [
        "linear-gradient(135deg, rgba(63, 184, 255, 0.22), rgba(63, 184, 255, 0.04))",
        "linear-gradient(135deg, rgba(255, 178, 94, 0.2), rgba(255, 178, 94, 0.04))",
        "linear-gradient(135deg, rgba(110, 231, 183, 0.2), rgba(110, 231, 183, 0.04))",
        "linear-gradient(135deg, rgba(199, 166, 255, 0.22), rgba(199, 166, 255, 0.04))",
        "linear-gradient(135deg, rgba(255, 107, 107, 0.2), rgba(255, 107, 107, 0.04))",
        "linear-gradient(135deg, rgba(72, 202, 228, 0.22), rgba(72, 202, 228, 0.04))",
        "linear-gradient(135deg, rgba(255, 214, 102, 0.2), rgba(255, 214, 102, 0.04))",
        "linear-gradient(135deg, rgba(133, 220, 255, 0.2), rgba(133, 220, 255, 0.04))"
    ];
    const noiseBg =
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='0.16'/%3E%3C/svg%3E\")";

    const horizontalServicesCards = horizontalServices.slice(0, 4);
    const allServices = [...services, ...horizontalServices];
    const techStack = [
        "React",
        "Next.js",
        "Vue",
        "Nuxt",
        "React Native",
        "Flutter",
        "Node.js",
        "Python",
        "Go",
        "AWS",
        "Docker",
        "Kubernetes",
        "Postgres",
        "MongoDB",
        "Stripe",
        "Shopify"
    ];

    return (
        <section id="services" className="bg-secondary pt-12 text-primary relative overflow-hidden sm:h-screen">
            <div className="h-full max-w-[1490px] mx-auto px-6 sm:px-10 py-16">
                <div className="sm:hidden">
                    <div className="max-w-[540px]">
                        <p className="text-xs uppercase tracking-[0.35em] text-primary/70">
                            Services
                        </p>
                        <h2 className="mt-5 text-3xl font-semibold">
                            Full-spectrum tech services for teams that ship fast and scale clean.
                        </h2>
                        <p className="mt-5 text-base text-primary/80 leading-relaxed">
                            We cover the common needs and the tricky edge cases. Bring any problem and
                            we will solve it with the right team, tools, and timelines.
                        </p>
                    </div>

                    <div className="mt-6 overflow-x-auto pb-2">
                        <div className="flex gap-4 snap-x snap-mandatory">
                            {allServices.map((service, index) => (
                                <div
                                    key={`${service.title}-${index}`}
                                    className="group min-w-[240px] max-w-[260px] snap-start rounded-2xl border border-primary/10 p-5"
                                    style={{
                                        backgroundImage: `${accentGradients[index % accentGradients.length]}, ${noiseBg}`
                                    }}
                                >
                                    <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/70">
                                        {service.title}
                                    </div>
                                    <p className="text-xs text-primary/80 leading-relaxed">
                                        {service.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 rounded-2xl border border-primary/10 bg-primary p-6 text-secondary">
                        <div className="text-xs uppercase tracking-[0.3em] text-secondary/70">
                            Bring Any Problem
                        </div>
                        <h3 className="mt-3 text-2xl font-semibold">
                            If it is tech, we can build it.
                        </h3>
                        <p className="mt-4 text-sm text-secondary/80 leading-relaxed">
                            Tell us the challenge and we will map the fastest path to a working solution.
                            Book a call and we will scope, plan, and ship with you.
                        </p>
                        <div className="mt-6">
                            <Link
                                href="/#contact"
                                className="inline-flex items-center justify-center rounded-full bg-secondary px-5 py-2 text-sm font-semibold tracking-wide text-primary transition hover:bg-secondary/90"
                            >
                                Book a Call
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="hidden sm:block">
                    <div className=" flex justify-between pb-4">
                    <div className="lg:col-span-5 max-w-[540px]">
                        <motion.p
                            initial={{opacity: 0, y: 10}}
                            whileInView={{opacity: 1, y: 0}}
                            viewport={{once: true, amount: 0.3}}
                            transition={{duration: 0.6}}
                            className="text-xs uppercase tracking-[0.35em] text-primary/70"
                        >
                            Services
                        </motion.p>
                        <motion.h2
                            initial={{opacity: 0, y: 16}}
                            whileInView={{opacity: 1, y: 0}}
                            viewport={{once: true, amount: 0.3}}
                            transition={{duration: 0.7, delay: 0.1}}
                            className="mt-5 text-3xl sm:text-4xl md:text-5xl font-semibold"
                        >
                            Full-spectrum tech services for teams that ship fast and scale clean.
                        </motion.h2>
                        <motion.p
                            initial={{opacity: 0, y: 12}}
                            whileInView={{opacity: 1, y: 0}}
                            viewport={{once: true, amount: 0.3}}
                            transition={{duration: 0.7, delay: 0.2}}
                            className="mt-5 text-base sm:text-lg text-primary/80 leading-relaxed"
                        >
                            We cover the common needs and the tricky edge cases. Bring any problem and
                            we will solve it with the right team, tools, and timelines.
                        </motion.p>
                    </div>

                    <motion.div
                        className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[700px]"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{once: true, amount: 0.2}}
                    >
                        {serviceCards.map((service, index) => (
                            <motion.div
                                key={index}
                                className="group  rounded-2xl border border-primary/10 p-5 transition duration-300 hover:-translate-y-1 hover:border-primary/25"
                                style={{
                                    backgroundImage: `${accentGradients[index % accentGradients.length]}, ${noiseBg}`
                                }}
                                variants={itemVariants}
                            >
                                <div
                                    className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/70">
                                    {service.title}
                                </div>
                                <p className="text-xs sm:text-sm text-primary/80 leading-relaxed">
                                    {service.description}
                                </p>
                            </motion.div>
                        ))}

                    </motion.div>
                </div>
                <motion.div
                    className="flex gap-4 flex-wrap"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{once: true, amount: 0.2}}
                >
                    {horizontalServicesCards.map((service, index) => (
                        <motion.div
                            key={index}
                            className="group max-w-[340px] min-h-[160px] rounded-2xl border border-primary/10 p-5 transition duration-300 hover:-translate-y-1 hover:border-primary/25"
                            style={{
                                backgroundImage: `${accentGradients[index + serviceCards.length]}, ${noiseBg}`
                            }}
                            variants={itemVariants}
                        >
                            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/70">
                                {service.title}
                            </div>
                            <p className="text-xs sm:text-sm text-primary/80 leading-relaxed">
                                {service.description}
                            </p>
                            {/*<Marquee className="mt-0 sm:mt-0">*/}
                            {/*    <div className="flex  ">*/}
                            {/*        {marqueeImages.map((src) => (*/}
                            {/*                <img*/}
                            {/*                    key={src}*/}
                            {/*                    src={src}*/}
                            {/*                    alt=""*/}
                            {/*                    width={10}*/}
                            {/*                    height={10}*/}
                            {/*                    className={`w-5 opacity-90 h-1"`}*/}
                            {/*                />*/}
                            {/*            )*/}
                            {/*        )}*/}
                            {/*    </div>*/}
                            {/*</Marquee>*/}
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    className="group mt-8 min-h-[10vh] rounded-2xl border border-primary/10 bg-primary p-6 text-secondary transition duration-300 hover:-translate-y-1 hover:border-secondary/40 col-span-full"
                    variants={itemVariants}
                >
                    <div className="text-xs uppercase tracking-[0.3em] text-secondary/70">
                        Bring Any Problem
                    </div>
                    <h3 className="mt-3 text-2xl sm:text-3xl font-semibold">
                        If it is tech, we can build it.
                    </h3>
                    <p className="mt-4 text-sm sm:text-base text-secondary/80 leading-relaxed">
                        Tell us the challenge and we will map the fastest path to a working solution.
                        Book a call and we will scope, plan, and ship with you.
                    </p>
                    <div className="mt-6">
                        <Link
                            href="/#contact"
                            className="inline-flex items-center justify-center rounded-full bg-secondary px-5 py-2 text-sm sm:text-base font-semibold tracking-wide text-primary transition hover:bg-secondary/90"
                        >
                            Book a Call
                        </Link>
                    </div>
                </motion.div>
                </div>
            </div>
        </section>
    );
}
