"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Squares from "@/component/Squares";

const cn = (...classes) => classes.filter(Boolean).join(" ");

export const Navbar = ({ navItems, className, ctaLabel = "Book a Call" }) => {
  const [isHero, setIsHero] = useState(true);
  const pathname = usePathname();
  const isAbout = pathname === "/about";
  const resolveHref = (href) => {
    if (!href.startsWith("#")) return href;
    return pathname === "/" ? href : `/${href}`;
  };
  const heroTextClass = isAbout ? "text-primary" : "text-secondary";
  const heroMutedClass = isAbout ? "text-primary/80" : "text-secondary/80";
  const heroUnderlineClass = isAbout ? "bg-primary/80" : "bg-secondary/80";
  const heroCtaClass = isAbout
    ? "border-primary/30 text-primary hover:border-primary hover:bg-primary/10"
    : "border-secondary/30 text-secondary hover:border-secondary hover:bg-secondary/10";

  useEffect(() => {
    const updateNavState = () => {
      const hero = document.getElementById("home");
      const footer = document.getElementById("footer");
      if (!hero) {
        setIsHero(true);
        return;
      }

      const { bottom } = hero.getBoundingClientRect();
      const heroVisible = bottom > 40;
      if (!footer) {
        setIsHero(heroVisible);
        return;
      }

      const footerRect = footer.getBoundingClientRect();
      const footerRevealPoint = window.innerHeight * 0.15;
      const footerVisible =
        footerRect.top <= footerRevealPoint && footerRect.bottom >= footerRevealPoint;
      setIsHero(heroVisible || footerVisible);
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

        {!pathname?.startsWith("/work") ? (
          <Link
            href="/"
            className={cn(
              "tracking-[0.2em]",
              isHero ? heroTextClass : "text-secondary",
              isHero ? "text-xl sm:text-3xl" : "text-lg sm:text-2xl"
            )}
            style={{ fontFamily: "var(--font-anton)" }}
          >
            xandec.
          </Link>
        ) : (
          <div className="h-8 w-[120px] sm:w-[160px]" aria-hidden="true" />
        )}

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
                href={resolveHref(navItem.link)}
                className={cn(
                  "group relative transition-colors",
                  isHero ? heroMutedClass : "text-secondary/80",
                  isHero ? `hover:${heroTextClass}` : "hover:text-secondary"
                )}
              >
                <span>{navItem.name}</span>
                <span
                  className={cn(
                    "pointer-events-none absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100",
                    isHero ? heroUnderlineClass : "bg-secondary/80"
                  )}
                />
              </Link>
            ))}
          </div>

          <Link
            href={resolveHref("#contact")}
            className={cn(
              "rounded-full border px-4 py-2 text-sm sm:text-base font-semibold transition",
              isHero ? heroCtaClass : "border-secondary/30 text-secondary hover:border-secondary hover:bg-secondary/10"
            )}
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
