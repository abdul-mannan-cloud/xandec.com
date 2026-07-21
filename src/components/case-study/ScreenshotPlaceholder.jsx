import Image from "next/image";
import { cn } from "@/app/utils";

export default function ScreenshotPlaceholder({ title, label, imageSrc, imageAlt, className }) {
  return (
    <figure
      className={cn(
        "flex h-full min-h-[240px] flex-col justify-between overflow-hidden rounded-[24px] border border-primary/10 bg-primary/[0.03] p-4 sm:min-h-[280px]",
        className
      )}
      aria-label={title}
    >
      <div className="flex items-center justify-between gap-4">
        <figcaption className="text-sm font-semibold text-primary">{title}</figcaption>
        <span className="rounded-full border border-primary/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-primary/55">
          {imageSrc ? "Generated concept" : "Image required"}
        </span>
      </div>

      {imageSrc ? (
        <div className="relative mt-4 aspect-[3/2] overflow-hidden rounded-2xl border border-primary/10 bg-primary/[0.03]">
          <Image src={imageSrc} alt={imageAlt} fill sizes="(min-width: 1400px) 1280px, 92vw" className="object-cover" />
        </div>
      ) : (
        <div className="mt-4 flex flex-1 items-center justify-center rounded-2xl border border-dashed border-primary/20 bg-secondary/50 px-5 py-6 text-center">
          <div className="max-w-xs">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary/45">
              Replace with approved image
            </p>
            <p className="mt-3 text-base leading-relaxed text-primary/75">{label}</p>
          </div>
        </div>
      )}
    </figure>
  );
}
