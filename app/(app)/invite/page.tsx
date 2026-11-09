import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import {
  RenewInviteButton,
  ShareInvite,
} from "@/components/couple/couple-forms";
import { LeafSprig } from "@/components/leaf-sprig";
import { TendCard } from "@/components/tend-card";
import { getCurrentUser } from "@/lib/auth/session";
import { getMyCouple, getMyLiveInvite } from "@/lib/couple";
import {
  inviteLink,
  inviteMessage,
  spacedCode,
  whatsappShareUrl,
} from "@/lib/couple/invite";
import { siteOrigin } from "@/lib/site";

export const metadata: Metadata = { title: "Invite your partner" };

export default function InvitePage() {
  return (
    <div className="space-y-5 pt-6 pb-6">
      <Link
        href="/home"
        className="inline-flex min-h-11 items-center gap-2 font-medium text-muted-foreground"
      >
        <ArrowLeft className="size-5" aria-hidden="true" /> Home
      </Link>
      <Suspense
        fallback={
          <h1 className="text-4xl leading-tight">Invite your partner</h1>
        }
      >
        <InviteContent />
      </Suspense>
    </div>
  );
}

const untilDate = (iso: string) =>
  new Intl.DateTimeFormat("en-NG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Africa/Lagos",
  }).format(new Date(iso));

async function InviteContent() {
  const user = await getCurrentUser();
  const couple = await getMyCouple(user.id);
  if (couple.state !== "waiting") redirect("/home");

  const invite = await getMyLiveInvite(user.id);
  if (!invite) {
    return (
      <>
        <h1 className="text-4xl leading-tight">Invite your partner</h1>
        <TendCard tone="gold" className="space-y-4">
          <p>
            Your last invite has run out. Make a new one and send it over
            WhatsApp.
          </p>
          <RenewInviteButton label="Make a new invite" variant="default" />
        </TendCard>
      </>
    );
  }

  const link = inviteLink(await siteOrigin(), invite.token);
  const message = inviteMessage(user.name, link, invite.code);

  return (
    <>
      <header className="space-y-2">
        <h1 className="text-4xl leading-tight">Invite your partner</h1>
        <p className="text-lg text-muted-foreground">
          Send this on WhatsApp. When they tap the link, they&apos;ll join you.
        </p>
      </header>

      <TendCard
        tone="terracotta"
        className="animate-bloom space-y-2 py-8 text-center"
      >
        <LeafSprig className="absolute -top-2 -right-3 size-28 text-white/30" />
        <LeafSprig className="absolute -bottom-4 -left-4 size-24 rotate-180 text-white/20" />
        <p className="relative text-sm font-semibold tracking-wide uppercase opacity-90">
          Your invite code
        </p>
        <p
          className="relative font-heading text-6xl tracking-wider"
          aria-label={`Code ${invite.code.split("").join(" ")}`}
        >
          {spacedCode(invite.code)}
        </p>
        <p className="relative opacity-90">
          Works until {untilDate(invite.expires_at)}, one time only.
        </p>
      </TendCard>

      <ShareInvite whatsappUrl={whatsappShareUrl(message)} message={message} />

      <TendCard tone="sage" className="space-y-1">
        <h2 className="text-lg">Already together in the room?</h2>
        <p className="text-muted-foreground">
          Your partner can open Tend, choose &ldquo;I have a code&rdquo; and
          type the 6 digits.
        </p>
      </TendCard>

      <RenewInviteButton />
    </>
  );
}
