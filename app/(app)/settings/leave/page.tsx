import { ArrowLeft, Lock, Share2, Undo2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { LeaveForm } from "@/components/couple/couple-forms";
import { TendCard } from "@/components/tend-card";
import { getCurrentUser } from "@/lib/auth/session";
import { getMyCouple } from "@/lib/couple";

export const metadata: Metadata = { title: "Leave couple space" };

/** F3: explain first, then confirm. Kind and neutral, no blame. */
export default function LeavePage() {
  return (
    <div className="space-y-5 pt-6 pb-6">
      <Link
        href="/settings"
        className="inline-flex min-h-11 items-center gap-2 font-medium text-muted-foreground"
      >
        <ArrowLeft className="size-5" aria-hidden="true" /> Settings
      </Link>
      <h1 className="text-4xl leading-tight">Leaving your couple space</h1>
      <p className="text-lg text-muted-foreground">
        Here&apos;s exactly what happens, so there are no surprises.
      </p>
      <Suspense fallback={null}>
        <LeaveContent />
      </Suspense>
    </div>
  );
}

async function LeaveContent() {
  const user = await getCurrentUser();
  const couple = await getMyCouple(user.id);
  if (couple.state === "none") redirect("/settings");
  const partner =
    couple.state === "linked" ? couple.partnerName : "your partner";

  return (
    <>
      <TendCard tone="sage" className="flex items-start gap-4">
        <Lock className="mt-1 size-6 shrink-0" aria-hidden="true" />
        <p>
          <strong>Your private things come with you.</strong> Journal entries
          and anything marked private stay yours.
        </p>
      </TendCard>
      <TendCard tone="tender" className="flex items-start gap-4">
        <Share2 className="mt-1 size-6 shrink-0" aria-hidden="true" />
        <p>
          <strong>Shared things stay in the space</strong> with {partner}.
          You&apos;ll stop seeing them straight away.
        </p>
      </TendCard>
      <TendCard tone="gold" className="flex items-start gap-4">
        <Undo2 className="mt-1 size-6 shrink-0" aria-hidden="true" />
        <p>
          <strong>It can&apos;t be undone.</strong> This space won&apos;t take
          anyone new. To be together in Tend again, one of you starts a fresh
          space and invites the other.
        </p>
      </TendCard>
      <LeaveForm />
      <p className="text-sm text-muted-foreground">
        If you&apos;re going through something hard, you don&apos;t have to
        handle it alone. Talking to someone you trust or a counsellor can help.
      </p>
    </>
  );
}
