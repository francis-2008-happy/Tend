"use client";

import { Check, Copy, Send } from "lucide-react";
import { useActionState, useState } from "react";
import { FormField, FormMessage, SubmitButton } from "@/components/form-field";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { FormState } from "../../app/(auth)/actions";
import {
  joinWithCode,
  joinWithLink,
  leaveCoupleSpace,
  renewInvite,
  startCoupleSpace,
} from "../../app/(app)/couple/actions";

/** One-button forms: start a space, or make a fresh invite. */
export function StartSpaceButton({ label = "Create our couple space" }) {
  const [state, action] = useActionState<FormState, FormData>(
    startCoupleSpace,
    {},
  );
  return (
    <form action={action} className="space-y-3">
      <FormMessage>{state.error}</FormMessage>
      <SubmitButton pendingText="Getting it ready…">{label}</SubmitButton>
    </form>
  );
}

export function RenewInviteButton({
  label = "Make a new code",
  variant = "outline",
}: {
  label?: string;
  variant?: "default" | "outline";
}) {
  const [state, action] = useActionState<FormState, FormData>(renewInvite, {});
  return (
    <form action={action} className="space-y-3">
      <FormMessage>{state.error}</FormMessage>
      <SubmitButton pendingText="Making a new one…" variant={variant}>
        {label}
      </SubmitButton>
    </form>
  );
}

/** Send the invite through WhatsApp, or copy it for anywhere else. */
export function ShareInvite({
  whatsappUrl,
  message,
}: {
  whatsappUrl: string;
  message: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="space-y-3">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(buttonVariants({ size: "lg" }), "gap-2")}
      >
        <Send aria-hidden="true" />
        Share on WhatsApp
      </a>
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="gap-2"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(message);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
          } catch {
            setCopied(false);
          }
        }}
      >
        {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
        <span aria-live="polite">
          {copied ? "Copied" : "Copy the invite message"}
        </span>
      </Button>
    </div>
  );
}

export function JoinCodeForm() {
  const [state, action] = useActionState<FormState, FormData>(joinWithCode, {});
  return (
    <form action={action} className="space-y-5" noValidate>
      <FormMessage>{state.error}</FormMessage>
      <FormField
        label="6-digit code"
        name="code"
        inputMode="numeric"
        autoComplete="off"
        maxLength={7}
        className="[&_input]:h-16 [&_input]:text-center [&_input]:font-heading [&_input]:text-3xl [&_input]:tracking-[0.3em]"
        error={state.fieldErrors?.code}
        required
      />
      <SubmitButton pendingText="Joining…">Join my partner</SubmitButton>
    </form>
  );
}

export function JoinLinkForm({
  token,
  inviterName,
}: {
  token: string;
  inviterName: string;
}) {
  const [state, action] = useActionState<FormState, FormData>(joinWithLink, {});
  return (
    <form action={action} className="space-y-3">
      <FormMessage>{state.error}</FormMessage>
      <input type="hidden" name="token" value={token} />
      <SubmitButton pendingText="Joining…">
        {inviterName ? `Join ${inviterName}` : "Join my partner"}
      </SubmitButton>
    </form>
  );
}

export function LeaveForm() {
  const [state, action] = useActionState<FormState, FormData>(
    leaveCoupleSpace,
    {},
  );
  return (
    <form action={action} className="space-y-5">
      <FormMessage>{state.error}</FormMessage>
      <label className="flex min-h-11 items-start gap-3">
        <input
          type="checkbox"
          name="confirm"
          value="yes"
          className="mt-1 size-5 shrink-0 accent-[var(--terracotta-strong)]"
        />
        <span>I&apos;ve read what happens and I want to leave.</span>
      </label>
      <SubmitButton pendingText="Leaving…">Leave our couple space</SubmitButton>
    </form>
  );
}
