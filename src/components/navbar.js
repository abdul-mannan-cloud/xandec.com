"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Squares from "@/component/Squares";

const cn = (...classes) => classes.filter(Boolean).join(" ");

export const Navbar = ({ navItems, className, ctaLabel = "Book a Call" }) => {
  const [isHero, setIsHero] = useState(true);

  useEffect(() => {
    const updateNavState = () => {
      const hero = document.getElementById("home");
      if (!hero) {
        setIsHero(true);
        return;
      }

      const { bottom } = hero.getBoundingClientRect();
      setIsHero(bottom > 40);
    };

    updateNavState();
    window.addEventListener("scroll", updateNavState, { passive: true });
    window.addEventListener("resize", updateNavState);

    return () => {
      window.removeEventListener("scroll", updateNavState);
      window.removeEventListener("resize", updateNavState);
    };
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-6 left-0 right-0 z-50 transition-all duration-300",
        className
      )}
    >

      <div
        className={cn(
          "mx-auto flex w-[92vw] items-center justify-between transition-all duration-300",
          !isHero &&
            "w-[92vw] max-w-5xl rounded-full border border-secondary/10 bg-primary px-5 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur"
        )}
      >

        <Link
          href="#home"
          className={cn(
            "text-secondary tracking-[0.2em]",
            isHero ? "text-xl sm:text-3xl" : "text-lg sm:text-2xl"
          )}
          style={{ fontFamily: "var(--font-anton)" }}
        >
          xandec.
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          <div
            className={cn(
              "flex items-center gap-4 sm:gap-6",
              isHero ? "text-base sm:text-lg" : "text-sm sm:text-base"
            )}
          >
            {navItems.map((navItem) => (
              <Link
                key={navItem.name}
                href={navItem.link}
                className="group relative text-secondary/80 transition-colors hover:text-secondary"
              >
                <span>{navItem.name}</span>
                <span className="pointer-events-none absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-0 bg-secondary/80 transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            ))}
          </div>

          <Link
            href="#contact"
            className="rounded-full border border-secondary/30 px-4 py-2 text-sm sm:text-base font-semibold text-secondary transition hover:border-secondary hover:bg-secondary/10"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
