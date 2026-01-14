import Squares from "@/component/Squares";
import {LayoutTextFlip} from "@/components/UI/layout-text-flip";
import {Marquee} from "@/components/UI/marquee";


export default function HeroSection() {
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

    return (
        <section
            id="home"
            className="min-h-screen flex items-center justify-center bg-secondary"
        >
            <div className="">

            </div>
            <div className="bg-primary min-h-[99vh] w-[98vw] rounded-[70px] relative overflow-hidden">
                <Squares
                    speed={0.3}
                    squareSize={100}
                    direction='diagonal' // up, down, left, right, diagonal
                    borderColor='rgba(230, 230, 221, 0.1)'
                    hoverFillColor='#071b2d'
                    className='min-h-[99vh] min-w-[95vw] relative z-0'
                />

                <div className="absolute inset-0 z-20 flex items-center justify-center px-6 mb-20 sm:px-10">
                    <div className="max-w-3xl text-center -translate-y-4 sm:-translate-y-6">
                        <div className="flex flex-col items-center gap-3 text-secondary">
                            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                                <LayoutTextFlip
                                    text="Engineering Team That Drives"
                                    words={[
                                        "Real Business Outcomes",
                                        "Reliable Systems at Scale",
                                        "Measurable Product Velocity",
                                        "Operational Clarity"
                                    ]}
                                    duration={3000}
                                />
                            </div>
                        </div>
                        <p className="text-secondary/80 mt-5 text-base sm:text-lg md:text-xl leading-relaxed">
                            We partner with companies to design, build, and ship systems that perform in the real world.
                        </p>
                        <div className="mt-8 flex justify-center">
                            <a
                                href="/#contact"
                                className="bg-secondary text-primary px-6 py-3 rounded-full text-sm sm:text-base font-semibold tracking-wide hover:bg-secondary/90 transition"
                            >
                                Start Your Project
                            </a>
                        </div>
                    </div>
                </div>

                <div className="absolute inset-x-0 bottom-6 z-10">
                    <div className="mb-4 text-center text-[10px] sm:text-xs uppercase tracking-[0.25em] text-secondary/70">
                        These are some of the global clients that we are working with
                    </div>
                    <Marquee className="mt-0 sm:mt-0">
                        <div className="flex w-screen items-center justify-between gap-12 px-12">
                            {marqueeImages.map((src) => (
                                src.includes("pliro") ?
                                    <img
                                        key={src}
                                        src={src}
                                        alt=""
                                        width={320}
                                        height={120}
                                        className={`w-auto object-contain opacity-90 h-20"`}
                                    /> : (
                                        src.includes("1.jpg") ?
                                            <img
                                                key={src}
                                                src={src}
                                                alt=""
                                                width={320}
                                                height={120}
                                                className={`w-auto object-contain opacity-90 h-16`}
                                            /> :
                                            <img
                                                key={src}
                                                src={src}
                                                alt=""
                                                width={320}
                                                height={120}
                                                className={`w-auto object-contain opacity-90 h-20`}
                                            />
                                    )

                            ))}
                        </div>
                    </Marquee>
                </div>

            </div>

        </section>
    );
}
