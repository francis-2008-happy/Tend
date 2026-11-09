import { cn } from "@/lib/utils";

const LEAF = "M0 0 C 9 -11, 29 -11, 38 0 C 29 11, 9 11, 0 0 Z";

/** Leaves along the stem: x, y, angle, opacity. */
const LEAVES: [number, number, number, number][] = [
  [104, 14, -60, 0.95],
  [92, 26, -8, 0.8],
  [80, 40, -92, 0.9],
  [66, 56, -14, 0.75],
  [52, 72, -98, 0.85],
  [38, 90, -22, 0.7],
];

/**
 * A decorative botanical sprig for card corners and headers. It takes the
 * current text colour, so `text-sage` or `text-tender` changes its colour.
 */
export function LeafSprig({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      aria-hidden="true"
      className={cn("pointer-events-none size-24", className)}
    >
      <path
        d="M116 4 C 86 30, 52 62, 20 114"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.7"
      />
      {LEAVES.map(([x, y, angle, opacity]) => (
        <path
          key={`${x}-${y}`}
          d={LEAF}
          fill="currentColor"
          opacity={opacity}
          transform={`translate(${x} ${y}) rotate(${angle})`}
        />
      ))}
    </svg>
  );
}
