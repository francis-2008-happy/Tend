import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { TendCard } from "@/components/tend-card";
import { getCurrentUser } from "@/lib/auth/session";
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
