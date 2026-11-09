import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Card colours. Soft tints for quiet cards, solids for the one or two things
 * on a screen that should catch the eye. Contrast: docs/decisions/0001.
 */
const tones = {
  plain: "bg-card text-card-foreground",
  plan: "bg-terracotta-soft text-foreground", // dates and plans
  tender: "bg-tender-soft text-foreground", // notes and emotional moments
  gold: "bg-milestone-soft text-foreground", // milestones and invitations
  sage: "bg-sage-soft text-foreground", // garden and growth
  calm: "bg-muted text-foreground",
  // Solids
  rose: "bg-tender text-on-accent",
  honey: "bg-milestone text-on-accent",
  terracotta: "bg-terracotta-strong text-white",
} as const;

export type CardTone = keyof typeof tones;

/** Rounded, softly shadowed card used across Tend (plan section 7). */
export function TendCard({
  tone = "plain",
  className,
  ...props
}: ComponentProps<"section"> & { tone?: CardTone }) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-2xl p-5 shadow-soft",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
