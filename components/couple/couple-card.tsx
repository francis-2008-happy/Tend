import { Sprout, UserPlus, Users } from "lucide-react";
import Link from "next/link";
import { StartSpaceButton } from "@/components/couple/couple-forms";
import { TendCard } from "@/components/tend-card";
import { buttonVariants } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/session";
import { getMyCouple } from "@/lib/couple";
import { cn } from "@/lib/utils";

const chip =
  "flex size-12 shrink-0 items-center justify-center rounded-full shadow-soft";
const textLink =
  "inline-flex min-h-11 items-center font-medium text-primary underline underline-offset-4";

/** Home's couple card: start, waiting, together, or on your own again. */
export async function CoupleCard() {
  const user = await getCurrentUser();
  const couple = await getMyCouple(user.id);

  if (couple.state === "linked") {
    return (
      <TendCard tone="sage" className="flex items-center gap-4">
        <span className={cn(chip, "bg-primary text-primary-foreground")}>
          <Users className="size-6" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-lg">You and {couple.partnerName}</h2>
          <p className="text-muted-foreground">
            Your couple space is ready. Everything you share appears for both of
            you.
          </p>
        </div>
      </TendCard>
    );
  }

  if (couple.state === "waiting") {
    return (
      <TendCard tone="gold" className="space-y-4">
        <div className="flex items-start gap-4">
          <span className={cn(chip, "bg-milestone text-on-accent")}>
            <UserPlus className="size-6" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-lg">Your space is ready for two</h2>
            <p className="text-muted-foreground">
              Send your invite on WhatsApp whenever you&apos;re ready.
            </p>
          </div>
        </div>
        <Link href="/invite" className={cn(buttonVariants({ size: "lg" }))}>
          See my invite
        </Link>
      </TendCard>
    );
  }

  if (couple.state === "ended") {
    return (
      <TendCard tone="calm" className="flex items-start gap-4">
        <span className={cn(chip, "bg-card text-primary")}>
          <Sprout className="size-6" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-lg">It&apos;s just you here for now</h2>
          <p className="text-muted-foreground">
            You can start a fresh couple space from Settings whenever you like.
          </p>
          <Link href="/settings" className={textLink}>
            Go to Settings
          </Link>
        </div>
      </TendCard>
    );
  }

  return (
    <TendCard tone="gold" className="space-y-4">
      <div className="flex items-start gap-4">
        <span className={cn(chip, "bg-milestone text-on-accent")}>
          <UserPlus className="size-6" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-lg">Start your couple space</h2>
          <p className="text-muted-foreground">
            Create your space, then invite your partner over WhatsApp.
          </p>
        </div>
      </div>
      <StartSpaceButton />
      <p className="text-center">
        <Link href="/join" className={textLink}>
          My partner sent me a code
        </Link>
      </p>
    </TendCard>
  );
}
