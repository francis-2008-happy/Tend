import { z } from "zod";
import type { Accent } from "@/components/accents";

/**
 * The "About me" questions (F4). Each partner answers for themselves;
 * the wording is self-reflection, never a report on the other person.
 * Allowed values match the checks in the database migration.
 */

export type Field =
  | "love_languages"
  | "budget_band"
  | "free_time"
  | "kids"
  | "interests"
  | "surprise_style";

export type Question = {
  field: Field;
  /** many = choose several (up to max); one = a single choice */
  kind: "many" | "one";
  max?: number;
  title: string;
  hint: string;
  /** How the answer reads back to you on the summary. */
  summary: string;
  photo: string;
  photoAlt: string;
  accent: Accent;
  options: { value: string; label: string }[];
};

export const QUESTIONS: Question[] = [
  {
    field: "love_languages",
    kind: "many",
    max: 2,
    title: "What makes you feel most loved?",
    hint: "Pick up to two. There are no wrong answers.",
    summary: "You feel most loved through",
    photo: "/photos/tea.webp",
    photoAlt: "A husband handing his wife a cup of tea in a sunny kitchen",
    accent: "rose",
    options: [
      { value: "words", label: "Kind words" },
      { value: "time", label: "Time together" },
      { value: "gifts", label: "Thoughtful gifts" },
      { value: "acts", label: "Help with things" },
      { value: "touch", label: "A hug or a hand to hold" },
    ],
  },
  {
    field: "budget_band",
    kind: "one",
    title: "What feels comfortable to spend on a date?",
    hint: "For an ordinary date, not a big occasion. Free dates count too.",
    summary: "A comfortable date budget",
    photo: "/photos/planning.webp",
    photoAlt: "A couple planning together at a table with a notebook",
    accent: "terracotta",
    options: [
      { value: "free", label: "Free is perfect" },
      { value: "under_10k", label: "Up to ₦10,000" },
      { value: "10k_30k", label: "₦10,000 to ₦30,000" },
      { value: "30k_75k", label: "₦30,000 to ₦75,000" },
      { value: "over_75k", label: "More than ₦75,000" },
    ],
  },
  {
    field: "free_time",
    kind: "many",
    title: "When do you usually have time for each other?",
    hint: "Choose any that are often true.",
    summary: "Your free time",
    photo: "/photos/sofa.webp",
    photoAlt: "A couple laughing together on a sofa on a lazy afternoon",
    accent: "gold",
    options: [
      { value: "weekday_evenings", label: "Weekday evenings" },
      { value: "weekend_mornings", label: "Weekend mornings" },
      { value: "weekend_afternoons", label: "Weekend afternoons" },
      { value: "weekend_evenings", label: "Weekend evenings" },
    ],
  },
  {
    field: "kids",
    kind: "one",
    title: "Who's at home with you?",
    hint: "So date ideas fit real life.",
    summary: "At home",
    photo: "/photos/family.webp",
    photoAlt: "Parents playing with building blocks with their little girl",
    accent: "sage",
    options: [
      { value: "none", label: "Just the two of us" },
      { value: "little", label: "Little ones" },
      { value: "older", label: "Older kids" },
      { value: "grown", label: "Our kids are grown" },
    ],
  },
  {
    field: "interests",
    kind: "many",
    title: "What do you enjoy?",
    hint: "Choose as many as you like.",
    summary: "You enjoy",
    photo: "/photos/cooking.webp",
    photoAlt: "A couple cooking jollof rice together and laughing",
    accent: "terracotta",
    options: [
      { value: "food", label: "Good food" },
      { value: "music", label: "Music" },
      { value: "outdoors", label: "Being outdoors" },
      { value: "faith", label: "Faith" },
      { value: "films", label: "Films and series" },
      { value: "games", label: "Games" },
      { value: "travel", label: "Travel" },
      { value: "fitness", label: "Staying active" },
      { value: "learning", label: "Learning new things" },
      { value: "creativity", label: "Making things" },
      { value: "reading", label: "Reading" },
      { value: "sport", label: "Watching sport" },
    ],
  },
  {
    field: "surprise_style",
    kind: "one",
    title: "Surprises or plans?",
    hint: "How do you like a date to come together?",
    summary: "Surprises or plans",
    photo: "/photos/surprise.webp",
    photoAlt: "A wife covering her husband's eyes before a rooftop surprise",
    accent: "rose",
    options: [
      { value: "surprises", label: "I love a surprise" },
      { value: "plans", label: "I like to know the plan" },
      { value: "both", label: "A bit of both" },
    ],
  },
];

export const FIELDS = QUESTIONS.map((q) => q.field);

export const questionFor = (field: string) =>
  QUESTIONS.find((q) => q.field === field);

/** Readable labels for stored values, e.g. ["time"] → "Time together". */
export function labelsFor(field: Field, value: string[] | string | null) {
  const q = questionFor(field);
  const values = value == null ? [] : Array.isArray(value) ? value : [value];
  return values
    .map((v) => q?.options.find((o) => o.value === v)?.label)
    .filter((l): l is string => Boolean(l));
}

/** One answer, checked against its question's allowed choices. */
export function parseAnswer(field: string, values: string[]) {
  const q = questionFor(field);
  if (!q) return { ok: false as const };
  const allowed = q.options.map((o) => o.value) as [string, ...string[]];
  const schema = z
    .array(z.enum(allowed))
    .max(q.kind === "one" ? 1 : (q.max ?? allowed.length));
  const parsed = schema.safeParse([...new Set(values)]);
  if (!parsed.success) return { ok: false as const };
  return {
    ok: true as const,
    field: q.field,
    value: q.kind === "one" ? (parsed.data[0] ?? null) : parsed.data,
  };
}

export const sharingSchema = z.array(z.enum(FIELDS as [Field, ...Field[]]));
