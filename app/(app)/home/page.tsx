import {
  CalendarDays,
  MessageCircle,
  Settings,
  Sprout,
  UserPlus,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { TendCard } from "@/components/tend-card";
import { TendMark } from "@/components/tend-mark";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Home" };

/** One calm screen, not a dashboard (plan section 7). Cards fill in later phases. */
export default function HomePage() {
  return (
    <div className="space-y-4 pb-6">
      <header className="flex items-center justify-between pt-6">
        <span className="inline-flex items-center gap-2 font-heading text-2xl text-primary">
          <TendMark className="size-8" />
          Tend
        </span>
        <Link
          href="/settings"
          aria-label="Settings"
          className="flex size-11 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
        >
          <Settings className="size-6" aria-hidden="true" />
        </Link>
      </header>

      <Suspense fallback={<h1 className="text-3xl leading-tight">Hello</h1>}>
        <Greeting />
      </Suspense>

      <TendCard className="space-y-3">
        <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <UserPlus className="size-4" aria-hidden="true" /> Just the two of you
        </span>
        <h2 className="text-xl">Your couple space is almost ready</h2>
        <p className="text-muted-foreground">
          Soon you&apos;ll be able to invite your partner with a link or a code
          over WhatsApp.
        </p>
      </TendCard>

      <TendCard tone="tender" className="flex items-start gap-4">
        <MessageCircle
          className="mt-1 size-6 shrink-0 text-primary"
          aria-hidden="true"
        />
        <div className="space-y-1">
          <h2 className="text-lg">Today&apos;s question</h2>
          <p>Your first little question arrives once your partner joins.</p>
        </div>
      </TendCard>

      <TendCard tone="plan" className="flex items-start gap-4">
        <CalendarDays
          className="mt-1 size-6 shrink-0 text-terracotta-deep"
          aria-hidden="true"
        />
        <div className="space-y-1">
          <h2 className="text-lg">Fancy planning something together?</h2>
          <p>Date ideas for every budget are on their way.</p>
        </div>
      </TendCard>

      <TendCard tone="calm" className="flex items-start gap-4">
        <Sprout
          className="mt-1 size-6 shrink-0 text-primary"
          aria-hidden="true"
        />
        <div className="space-y-1">
          <h2 className="text-lg">Your garden</h2>
          <p className="text-muted-foreground">
            Every little moment you share will plant something here.
          </p>
        </div>
      </TendCard>
    </div>
  );
}

async function Greeting() {
  const user = await getCurrentUser();
  return (
    <h1 className="text-3xl leading-tight">
      Hello{user.name ? `, ${user.name}` : ""}
    </h1>
  );
}
