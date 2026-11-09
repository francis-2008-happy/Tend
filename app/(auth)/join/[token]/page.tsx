import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { JoinLinkForm } from "@/components/couple/couple-forms";
import { InvitedWelcome } from "@/components/couple/invited-welcome";
import { GardenStrip } from "@/components/garden-strip";
import { FormMessage } from "@/components/form-field";
import { buttonVariants } from "@/components/ui/button";
import { getSignedInUser } from "@/lib/auth/session";
import { getMyCouple } from "@/lib/couple";
import { isInviteToken, redeemMessage } from "@/lib/couple/invite";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Join your partner" };

export default function JoinWithLinkPage({
  params,
}: PageProps<"/join/[token]">) {
  return (
    <Suspense fallback={<h1 className="text-3xl">Join your partner</h1>}>
      <JoinWithLink params={params} />
    </Suspense>
  );
}

function Problem({ message }: { message: string }) {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl leading-tight">Let&apos;s try that again</h1>
      <FormMessage>{message}</FormMessage>
      <div className="space-y-3">
        <Link href="/join" className={cn(buttonVariants({ size: "lg" }))}>
          I have a code
        </Link>
        <Link
          href="/home"
          className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}

async function JoinWithLink({
  params,
}: Pick<PageProps<"/join/[token]">, "params">) {
  const { token } = await params;
  const user = await getSignedInUser();
  if (!user) return <InvitedWelcome next={`/join/${token}`} />;
  if (!isInviteToken(token))
    return <Problem message={redeemMessage("not_found")} />;

  const couple = await getMyCouple(user.id);
  if (couple.state === "linked" || couple.state === "waiting")
    return <Problem message={redeemMessage("already_linked")} />;

  const supabase = await createClient();
  const { data } = await supabase.rpc("invite_preview", { link_token: token });
  const preview = data?.[0];
  if (preview?.status !== "ok")
    return (
      <Problem
        message={redeemMessage(
          preview?.status === "not_found" ? "not_found" : "expired",
        )}
      />
    );

  const name = preview.inviter_name ?? "";
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-sage-soft px-6 pt-8 shadow-soft">
        <p className="text-sm font-semibold tracking-wide text-terracotta-deep uppercase">
          An invite for you
        </p>
        <h1 className="mt-2 text-4xl leading-tight">
          {name ? `Join ${name} on Tend` : "Join your partner on Tend"}
        </h1>
        <p className="mt-3 text-muted-foreground">
          You&apos;ll share a space for plans, memories and your garden. Your
          private things always stay private.
        </p>
        <GardenStrip className="mt-2 -mb-1" />
      </div>
      <JoinLinkForm token={token} inviterName={name} />
    </div>
  );
}
