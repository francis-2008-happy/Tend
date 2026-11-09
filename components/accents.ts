import type { CardTone } from "@/components/tend-card";

/**
 * The palette colours that give each part of Tend its own feel, so screens
 * don't all look the same green (plan section 7 colours, nothing new).
 */
export const ACCENTS = {
  rose: {
    card: "tender",
    chip: "bg-tender text-on-accent",
    text: "text-tender",
  },
  terracotta: {
    card: "plan",
    chip: "bg-terracotta-strong text-white",
    text: "text-terracotta",
  },
  gold: {
    card: "gold",
    chip: "bg-milestone text-on-accent",
    text: "text-milestone",
  },
  sage: {
    card: "sage",
    chip: "bg-primary text-primary-foreground",
    text: "text-sage",
  },
} as const satisfies Record<
  string,
  { card: CardTone; chip: string; text: string }
>;

export type Accent = keyof typeof ACCENTS;
