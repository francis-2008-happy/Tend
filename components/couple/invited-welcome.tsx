import Link from "next/link";
import { GardenStrip } from "@/components/garden-strip";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** For a partner who tapped an invite before having an account. */
export function InvitedWelcome({ next }: { next: string }) {
  const q = `?next=${encodeURIComponent(next)}`;
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-tender px-6 pt-8 text-on-accent shadow-soft">
        <p className="text-sm font-semibold tracking-wide uppercase">
          You&apos;ve been invited
        </p>
        <h1 className="mt-2 text-4xl leading-tight">
          Your partner saved you a seat
        </h1>
        <p className="mt-3 opacity-90">
          Tend is a little space for the two of you: date ideas, small daily
          moments and a garden that grows as you do.
        </p>
        <GardenStrip className="mt-2 -mb-1" fadeEdges />
      </div>
      <p className="text-muted-foreground">
        First, make your own account. It only takes a minute, then you&apos;ll
        join your partner straight away.
      </p>
      <div className="space-y-3">
        <Link
          href={`/signup${q}`}
          className={cn(buttonVariants({ size: "lg" }))}
        >
          Create my account
        </Link>
        <Link
          href={`/login${q}`}
          className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
        >
          I already have an account
        </Link>
      </div>
    </div>
  );
}
