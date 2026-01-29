"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useState } from "react"
import Squares from "@/component/Squares"
export function PortfolioGallery({
  title = "Browse our Projects",
  archiveButton = {
    text: "Browse gallery",
    href: "/work",
  },
  images: customImages,
  className = "",
  maxHeight = 140,
  spacing = "-space-x-56 md:-space-x-72 lg:-space-x-80",
  onImageClick,
  pauseOnHover = true,
  marqueeRepeat = 4,
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null)

const defaultImages = [
  {
    src: "/pulseMemo.png",
    title: "PulseMemo",
    description: "AI-powered note-taking and organization tool.",
  },
  {
    src: "/trobbits.png",
    title: "Trobbits",
    description: "Blockchain-based decentralized social media platform.",
  },
  {
    src: "/estimatrixx.png",
    title: "Estimatrix",
    description: "AI-powered construction cost estimation and quoting platform.",
  },
  {
    src: "/viemaa.png",
    title: "VIMEA",
    description: "ecommerce platform for baby products with personalized recommendations.",
  },
  {
    src: "/alex.png",
    title: "Alex Vision",
    description: "Real-time computer vision and voice-based inspection system.",
  },
  {
    src: "/stepsc.png",
    title: "StepSC",
    description: "Web based appointment scheduling and management platform.",
  },
]

  const images = customImages || defaultImages
  const splitIndex = Math.ceil(images.length / 2)
  const firstRowImages = images.slice(0, splitIndex)
  const secondRowImages = images.slice(splitIndex)

  return (
    <section
      aria-label={title}
      id="archives"
      className={`min-h-screen flex items-center bg-secondary justify-center bg-secondary"`}
    >
      {/* Content wrapper (matches other sections) */}
      <div className="min-h-[99vh] min-w-[95vw] relative z-0 bg-secondary pointer-events-none">
{/* Header */}
        <div className="relative z-20 text-center mb-10 px-6 pointer-events-auto md:absolute md:top-40 md:inset-x-0 md:mb-24 md:px-0">
            <h2 className="mt-24 md:mt-0 text-4xl md:text-6xl font-bold text-primary mb-8">
                {title}
            </h2>
            <Link
                href={archiveButton.href}
                className="inline-flex items-center gap-3 rounded-full bg-primary px-7 py-3 text-background font-medium transition hover:bg-foreground/90 group"
            >
                <span>{archiveButton.text}</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <div className="text-lg text-center max-w-3xl mx-auto mb-8 md:mb-16 text-primary mt-10">
                Full-stack products, AI apps, and modern platforms built for real businesses.
                <br />
                From MVPs to scale-ups, this is the tech we ship end-to-end.
            </div>
        </div>

        {/* Desktop Gallery */}
        <div className="absolute inset-x-0 bottom-6 z-20 pointer-events-auto">
            <div className="hidden md:block min-w-full relative overflow-hidden h-[420px]">
                <div className={`absolute inset-x-0 -bottom-36 flex items-end justify-center ${spacing}`}>
                    {images.map((image, index) => {
                    const middle = Math.floor(images.length / 2)
                    const distance = Math.abs(index - middle)
                    const baseOffset = maxHeight - distance * 22

                    const isHovered = hoveredIndex === index
                    const isOtherHovered = hoveredIndex !== null && hoveredIndex !== index

                    const yOffset = isHovered ? -160 : isOtherHovered ? -20 : -baseOffset

                    return (
                        <motion.div
                        key={index}
                        className="cursor-pointer"
                        style={{ zIndex: images.length - index }}
                        initial={{
                            opacity: 0,
                            transform: "perspective(5000px) rotateY(-45deg) translateY(240px)",
                        }}
                        animate={{
                            opacity: 1,
                            transform: `perspective(5000px) rotateY(-45deg) translateY(${yOffset}px)`,
                        }}
                        transition={{
                            duration: 0.25,
                            delay: index * 0.06,
                            ease: [0.25, 0.1, 0.25, 1],
                        }}
                        onHoverStart={() => setHoveredIndex(index)}
                        onHoverEnd={() => setHoveredIndex(null)}
                        onClick={() => onImageClick?.(index)}
                        >
                            <div
                                className="relative aspect-video w-72 lg:w-[550px] overflow-hidden rounded-xl
                                        shadow-[0_20px_40px_rgba(0,0,0,0.25)]
                                        transition-transform duration-300 hover:scale-[1.04]"
                                style={{
                                    backgroundImage: `url(${image.src})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            >
                                {/* Dark gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                                {/* Content */}
                                <div className="relative z-10 flex h-full flex-col justify-start p-6">
                                    <h3 className="text-xl lg:text-2xl font-semibold text-white leading-tight">
                                    {image.title}
                                    </h3>
                                    <p className="mt-2 text-sm lg:text-base text-white/80 max-w-[90%]">
                                    {image.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )
                    })}
                </div>
            </div>
        </div>

        {/* Mobile Marquee */}
        <div className="md:hidden pb-8">
          <div className="flex flex-col gap-6 overflow-hidden [--duration:40s]">
            <div className="flex overflow-hidden gap-4">
              {Array(marqueeRepeat)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={`row-1-${i}`}
                    className={`flex shrink-0 gap-4 animate-marquee ${
                      pauseOnHover ? "group-hover:[animation-play-state:paused]" : ""
                    }`}
                  >
                    {firstRowImages.map((image, index) => (
                      <div key={`row-1-${i}-${index}`} className="w-64 shrink-0">
                        <div className="aspect-video overflow-hidden rounded-xl shadow-lg">
                          <img
                            src={image.src}
                            alt={image.alt}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
            </div>
            <div className="flex overflow-hidden gap-4">
              {Array(marqueeRepeat)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={`row-2-${i}`}
                    className={`flex shrink-0 gap-4 animate-marquee ${
                      pauseOnHover ? "group-hover:[animation-play-state:paused]" : ""
                    }`}
                    style={{ animationDirection: "reverse" }}
                  >
                    {secondRowImages.map((image, index) => (
                      <div key={`row-2-${i}-${index}`} className="w-64 shrink-0">
                        <div className="aspect-video overflow-hidden rounded-xl shadow-lg">
                          <img
                            src={image.src}
                            alt={image.alt}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
