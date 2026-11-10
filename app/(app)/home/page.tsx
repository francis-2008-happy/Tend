import { ArrowRight, CalendarDays, Mail, Settings } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AboutMeCard } from "@/components/about-me/about-me-card";
import { CoupleCard } from "@/components/couple/couple-card";
import { GardenStrip } from "@/components/garden-strip";
import { LeafSprig } from "@/components/leaf-sprig";
import { TendCard } from "@/components/tend-card";
import { TendMark } from "@/components/tend-mark";
import { TimeGreeting } from "@/components/time-greeting";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Home" };

/**
 * One calm screen, not a dashboard (plan section 7), following the
 * Higgsfield home mockup. Cards fill with real content in later phases.
 */
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
          className="flex size-11 items-center justify-center rounded-full bg-card text-muted-foreground shadow-soft hover:text-foreground"
        >
          <Settings className="size-5" aria-hidden="true" />
        </Link>
      </header>

      <div className="space-y-1 pt-2 pb-2">
        <Suspense fallback={<TimeGreeting />}>
          <Greeting />
        </Suspense>
        <p className="text-muted-foreground">
          A little space for the two of you.
        </p>
      </div>

      <Suspense fallback={<TendCard tone="gold" className="h-40" />}>
        <CoupleCard />
      </Suspense>

      <Suspense fallback={null}>
        <AboutMeCard />
      </Suspense>

      {/* Today's question: the hero card, as in the mockup */}
      <TendCard className="animate-bloom space-y-4 pr-16">
        <LeafSprig className="absolute -top-3 -right-4 size-28 text-sage" />
        <p className="text-sm font-semibold tracking-wide text-terracotta-deep uppercase">
          Today&apos;s question
        </p>
        <h2 className="font-heading text-2xl leading-snug">
          What small thing made you smile this week?
        </h2>
        <p className="text-muted-foreground">
          A taste of what&apos;s coming. Once your partner joins, you&apos;ll
          each answer privately, then see both answers together.
        </p>
      </TendCard>

      <TendCard
        tone="rose"
        className="animate-bloom flex items-center gap-4 [animation-delay:60ms]"
      >
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/50">
          <Mail className="size-6" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-lg">Love notes land here</h2>
          <p className="opacity-85">
            Little notes from your partner will wait for you on this card.
          </p>
        </div>
      </TendCard>

      <Link
        href="/plan"
        className="animate-bloom block rounded-2xl [animation-delay:120ms] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <TendCard tone="terracotta" className="flex items-center gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/20">
            <CalendarDays className="size-6" aria-hidden="true" />
          </span>
          <div className="flex-1">
            <h2 className="text-lg">Plan your next date</h2>
            <p className="opacity-90">Ideas for every budget, in naira.</p>
          </div>
          <ArrowRight className="size-5 shrink-0" aria-hidden="true" />
        </TendCard>
      </Link>

      <Link
        href="/garden"
        className="animate-bloom block rounded-2xl [animation-delay:240ms] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <TendCard className="space-y-1 p-0">
          <div className="flex items-center justify-between px-5 pt-5">
            <h2 className="text-lg">Your garden is ready to grow</h2>
            <ArrowRight
              className="size-5 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
          </div>
          <GardenStrip className="bg-gradient-to-b from-transparent to-sage-soft" />
        </TendCard>
      </Link>
    </div>
  );
}

async function Greeting() {
  const user = await getCurrentUser();
  return <TimeGreeting name={user.name} />;
}
