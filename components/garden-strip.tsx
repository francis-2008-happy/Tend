import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * A small garden scene: rolling hills with flowers, a tree and a butterfly
 * (Higgsfield garden art in public/garden). Decorative only.
 */
export function GardenStrip({
  className,
  priority = false,
  fadeEdges = false,
}: {
  className?: string;
  priority?: boolean;
  /** Soften the hills' sides when the strip sits on the page, not in a card. */
  fadeEdges?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("relative h-36 w-full overflow-hidden", className)}
    >
      <svg
        viewBox="0 0 400 120"
        preserveAspectRatio="none"
        className={cn(
          "absolute inset-x-0 bottom-0 h-16 w-full",
          fadeEdges &&
            "[mask-image:linear-gradient(to_right,transparent,black_18%,black_82%,transparent)]",
        )}
      >
        <path
          d="M0 60 C 70 30, 140 40, 210 58 C 280 76, 340 40, 400 50 L400 120 L0 120 Z"
          fill="var(--sage)"
          opacity="0.35"
        />
        <path
          d="M0 82 C 90 62, 170 70, 240 84 C 310 98, 360 78, 400 80 L400 120 L0 120 Z"
          fill="var(--sage)"
          opacity="0.6"
        />
      </svg>
      <Image
        src="/garden/flower.svg"
        alt=""
        width={64}
        height={64}
        priority={priority}
        className="absolute bottom-4 left-[8%]"
      />
      <Image
        src="/garden/flower.svg"
        alt=""
        width={44}
        height={44}
        priority={priority}
        className="absolute bottom-3 left-[26%]"
      />
      <Image
        src="/garden/tree.svg"
        alt=""
        width={120}
        height={120}
        priority={priority}
        className="absolute bottom-2 left-1/2 -translate-x-1/2"
      />
      <Image
        src="/garden/flower.svg"
        alt=""
        width={52}
        height={52}
        priority={priority}
        className="absolute right-[12%] bottom-3"
      />
      <Image
        src="/garden/butterfly.svg"
        alt=""
        width={40}
        height={40}
        priority={priority}
        className="absolute top-2 right-[22%] -rotate-12"
      />
    </div>
  );
}
