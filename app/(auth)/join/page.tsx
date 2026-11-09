import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { JoinCodeForm } from "@/components/couple/couple-forms";
import { InvitedWelcome } from "@/components/couple/invited-welcome";
import { getSignedInUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Join your partner" };

export default function JoinWithCodePage() {
  return (
    <Suspense fallback={<h1 className="text-3xl">Join your partner</h1>}>
      <JoinWithCode />
    </Suspense>
  );
}

async function JoinWithCode() {
  const user = await getSignedInUser();
  if (!user) return <InvitedWelcome next="/join" />;

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-4xl leading-tight">Join your partner</h1>
        <p className="text-lg text-muted-foreground">
          Type the 6-digit code your partner sent you.
        </p>
      </header>
      <JoinCodeForm />
      <p className="text-center">
        <Link
          href="/home"
          className="inline-flex min-h-11 items-center font-medium text-primary underline underline-offset-4"
        >
          Not now
        </Link>
      </p>
    </div>
  );
}
