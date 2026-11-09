import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const tones = {
  plain: "bg-card text-card-foreground",
  plan: "bg-terracotta-soft text-foreground", // dates and plans
  tender: "bg-tender-soft text-foreground", // notes and emotional moments
  calm: "bg-muted text-foreground",
} as const;

/** Rounded, softly shadowed card used across Tend (plan section 7). */
export function TendCard({
  tone = "plain",
  className,
  ...props
}: ComponentProps<"section"> & { tone?: keyof typeof tones }) {
  return (
    <section
      className={cn("rounded-2xl p-5 shadow-soft", tones[tone], className)}
      {...props}
    />
  );
}
