import { ArrowRight, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { StartSpaceButton } from "@/components/couple/couple-forms";
import { PageHeader } from "@/components/page-header";
import { FaithPackToggle } from "@/components/settings/faith-pack-toggle";
import { TendCard } from "@/components/tend-card";
import {
  getMyAboutMe,
  getMySettings,
  getPartnerShared,
} from "@/lib/about-me";
import { QUESTIONS, labelsFor } from "@/lib/about-me/options";
import { getCurrentUser } from "@/lib/auth/session";
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
      <Suspense fallback={<TendCard className="h-48" />}>
        <AboutMeSection />
      </Suspense>
      <Suspense fallback={null}>
        <PartnerShared />
      </Suspense>
      <Suspense fallback={<TendCard tone="gold" className="h-32" />}>
        <FaithPack />
      </Suspense>
      <Suspense fallback={null}>
        <YourCouple />
      </Suspense>
      <Link
        href="/settings/privacy"
        className="block rounded-2xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <TendCard tone="terracotta" className="flex items-center gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/20">
            <ShieldCheck className="size-6" aria-hidden="true" />
          </span>
          <div className="flex-1">
            <h2 className="text-lg">Your privacy</h2>
            <p className="opacity-90">
              What Tend keeps, who sees it, download or delete.
            </p>
          </div>
          <ArrowRight className="size-5 shrink-0" aria-hidden="true" />
        </TendCard>
      </Link>
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

async function AboutMeSection() {
  await getCurrentUser();
  const about = await getMyAboutMe();
  const answered = about
    ? QUESTIONS.filter((q) => labelsFor(q.field, about.answers[q.field]).length)
    : [];
  return (
    <TendCard className="overflow-hidden p-0">
      <div className="relative h-32">
        <Image
          src="/photos/walk.webp"
          alt=""
          fill
          sizes="(min-width: 640px) 28rem, 100vw"
          className="object-cover object-[50%_40%]"
        />
      </div>
      <div className="space-y-1 p-5">
        <h2 className="flex items-center gap-2 text-lg">
          <UserRound className="size-5 text-terracotta" aria-hidden="true" />
          About me
        </h2>
        <p className="text-muted-foreground">
          {answered.length
            ? `Your answers are private. You're sharing ${
                about?.shared.length ? "some" : "none"
              } of them with your partner.`
            : "A few easy questions about you, just for you."}
        </p>
        <Link
          href={answered.length ? "/about-me?start=finish" : "/about-me"}
          className={settingsLink}
        >
          {answered.length ? "See and change my answers" : "Answer now"}
        </Link>
      </div>
    </TendCard>
  );
}

async function PartnerShared() {
  await getCurrentUser();
  const partner = await getPartnerShared();
  if (!partner) return null;
  const items = QUESTIONS.map((q) => ({
    q,
    labels: labelsFor(q.field, partner.answers[q.field]),
  })).filter((i) => i.labels.length);
  if (!items.length) return null;
  return (
    <TendCard tone="tender" className="space-y-3">
      <h2 className="text-lg">What {partner.partnerName} shared with you</h2>
      <ul className="space-y-2">
        {items.map(({ q, labels }) => (
          <li key={q.field}>
            <p className="text-sm font-semibold text-muted-foreground">
              {q.title}
            </p>
            <p className="font-heading text-lg">{labels.join(", ")}</p>
          </li>
        ))}
      </ul>
    </TendCard>
  );
}

async function FaithPack() {
  await getCurrentUser();
  const settings = await getMySettings();
  return (
    <TendCard tone="gold" className="space-y-2">
      <h2 className="flex items-center gap-2 text-lg">
        <Sparkles className="size-5 text-milestone" aria-hidden="true" />
        Faith pack
      </h2>
      <p className="text-muted-foreground">
        Optional devotionals and prayers for couples. Your partner chooses
        separately, and neither of you sees the other&apos;s choice.
      </p>
      <FaithPackToggle initial={settings.faithPack} />
    </TendCard>
  );
}

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
