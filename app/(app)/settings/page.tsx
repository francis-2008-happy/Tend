import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { TendCard } from "@/components/tend-card";
import { getCurrentUser } from "@/lib/auth/session";
import { StartSpaceButton } from "@/components/couple/couple-forms";
import { getMyCouple } from "@/lib/couple";
import { LogoutButton } from "./logout-button";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div className="space-y-4 pb-6">
      <PageHeader title="Settings" />
      <TendCard className="space-y-1">
        <h2 className="text-lg">Your account</h2>
        <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
          <AccountEmail />
        </Suspense>
      </TendCard>
      <Suspense fallback={null}>
        <YourCouple />
      </Suspense>
      <TendCard tone="calm" className="space-y-1">
        <h2 className="text-lg">Privacy and more</h2>
        <p className="text-muted-foreground">
          Your privacy dashboard, data export and notification choices are
          coming soon.
        </p>
      </TendCard>
      <LogoutButton />
    </div>
  );
}

async function AccountEmail() {
  const user = await getCurrentUser();
  return (
    <p className="break-all text-muted-foreground">Signed in as {user.email}</p>
  );
}

const settingsLink =
  "inline-flex min-h-11 items-center font-medium text-primary underline underline-offset-4";

async function YourCouple() {
  const user = await getCurrentUser();
  const couple = await getMyCouple(user.id);
  if (couple.state === "none") return null;

  if (couple.state === "ended") {
    return (
      <TendCard tone="gold" className="space-y-3">
        <h2 className="text-lg">Start a fresh couple space</h2>
        <p className="text-muted-foreground">
          Your partner has left your old space. Starting fresh gives you a new,
          empty space to invite someone to. The old shared things are cleared
          for good; your private things stay.
        </p>
        <StartSpaceButton label="Start a fresh space" />
      </TendCard>
    );
  }

  return (
    <TendCard tone="sage" className="space-y-1">
      <h2 className="text-lg">Your couple space</h2>
      <p className="text-muted-foreground">
        {couple.state === "linked"
          ? `Shared with ${couple.partnerName}.`
          : "Waiting for your partner to join."}
      </p>
      <Link href="/settings/leave" className={settingsLink}>
        Leave couple space
      </Link>
    </TendCard>
  );
}
