import {
  ArrowLeft,
  Download,
  Lock,
  type LucideIcon,
  Mail,
  NotebookPen,
  Send,
  Share2,
  UserRound,
  UsersRound,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { type CardTone, TendCard } from "@/components/tend-card";
import { getMyAboutMe } from "@/lib/about-me";
import { getCurrentUser } from "@/lib/auth/session";
import { getMyCouple } from "@/lib/couple";

export const metadata: Metadata = { title: "Your privacy" };

/** F8: what Tend keeps, who sees each part, download and delete. */
export default function PrivacyPage() {
  return (
    <div className="space-y-5 pt-6 pb-6">
      <Link
        href="/settings"
        className="inline-flex min-h-11 items-center gap-2 font-medium text-muted-foreground"
      >
        <ArrowLeft className="size-5" aria-hidden="true" /> Settings
      </Link>
      <h1 className="text-4xl leading-tight">Your privacy</h1>
      <p className="text-lg text-muted-foreground">
        Everything Tend keeps about you, and exactly who can see it.
      </p>
      <Suspense fallback={<TendCard className="h-64" />}>
        <WhatWeKeep />
      </Suspense>

      <TendCard tone="sage" className="space-y-3">
        <h2 className="text-xl">Download my data</h2>
        <p>
          One file with everything Tend holds about you. It never includes your
          partner&apos;s private things.
        </p>
        <a
          href="/settings/privacy/export"
          download
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 font-medium text-primary-foreground shadow-soft"
        >
          <Download className="size-5" aria-hidden="true" />
          Download my data
        </a>
      </TendCard>

      <TendCard className="space-y-2">
        <h2 className="text-xl">Delete my account</h2>
        <p className="text-muted-foreground">
          Removes your account and everything of yours, straight away.
        </p>
        <Link
          href="/settings/delete"
          className="inline-flex min-h-11 items-center font-medium text-destructive underline underline-offset-4"
        >
          Delete my account
        </Link>
      </TendCard>

      <p className="text-sm text-muted-foreground">
        Tend never shows when you&apos;re online or what you do in the app, and
        nothing private becomes shared unless you choose it.
      </p>
    </div>
  );
}

async function WhatWeKeep() {
  const user = await getCurrentUser();
  const [about, couple] = await Promise.all([
    getMyAboutMe(),
    getMyCouple(user.id),
  ]);
  const partner =
    couple.state === "linked" ? couple.partnerName : "your partner";
  const sharedCount = about?.shared.length ?? 0;

  const rows: {
    icon: LucideIcon;
    what: string;
    who: string;
    tone: CardTone;
  }[] = [
    { icon: Mail, what: "Your email", who: "Only you", tone: "plain" },
    {
      icon: UserRound,
      what: "Your name",
      who: `You and ${partner}`,
      tone: "tender",
    },
    {
      icon: Lock,
      what: "Your About me answers",
      who: sharedCount
        ? `Only you, plus the ${sharedCount === 1 ? "answer" : "answers"} you chose to show ${partner}`
        : "Only you",
      tone: "plain",
    },
    {
      icon: NotebookPen,
      what: "Your private entries",
      who: "Only you",
      tone: "plain",
    },
    {
      icon: Share2,
      what: "Shared things in your couple space",
      who: "You both",
      tone: "gold",
    },
    {
      icon: Send,
      what: "Invites you made",
      who: "Only you",
      tone: "plain",
    },
    {
      icon: UsersRound,
      what: "Your settings, like the faith pack",
      who: "Only you",
      tone: "plain",
    },
  ];

  return (
    <ul className="space-y-2.5">
      {rows.map(({ icon: Icon, what, who, tone }) => (
        <li key={what}>
          <TendCard tone={tone} className="flex items-center gap-4 p-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-medium">{what}</p>
              <p className="text-sm text-muted-foreground">Seen by: {who}</p>
            </div>
          </TendCard>
        </li>
      ))}
    </ul>
  );
}
