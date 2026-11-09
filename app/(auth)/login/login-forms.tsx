"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useState } from "react";
import { FormField, FormMessage, SubmitButton } from "@/components/form-field";
import { Button } from "@/components/ui/button";
import {
  type FormState,
  logIn,
  sendSignInCode,
  verifySignInCode,
} from "../actions";

/**
 * Codes need Tend's own email template, which needs a custom email sender
 * (see supabase/config.toml). Until then the email only has a sign-in link.
 */
const CODES_ENABLED = process.env.NEXT_PUBLIC_EMAIL_CODES_ENABLED === "true";

/** Password login, or an emailed sign-in link / code (codes work inside the installed app). */
export function LoginForms() {
  const params = useSearchParams();
  const next = params.get("next") ?? "/home";
  const linkExpired = params.get("link") === "expired";
  const [mode, setMode] = useState<"password" | "code">("password");

  return (
    <div className="space-y-6">
      {linkExpired ? (
        <FormMessage>
          That link has expired or was already used. Please log in again.
        </FormMessage>
      ) : null}
      {mode === "password" ? (
        <PasswordForm next={next} />
      ) : (
        <CodeForms next={next} />
      )}
      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={() => setMode(mode === "password" ? "code" : "password")}
      >
        {mode === "password"
          ? CODES_ENABLED
            ? "Email me a sign-in code instead"
            : "Email me a sign-in link instead"
          : "Use my password instead"}
      </Button>
    </div>
  );
}

function PasswordForm({ next }: { next: string }) {
  const [state, action] = useActionState<FormState, FormData>(logIn, {});
  return (
    <form action={action} className="space-y-5" noValidate>
      <FormMessage>{state.error}</FormMessage>
      <input type="hidden" name="next" value={next} />
      <FormField
        label="Email"
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        error={state.fieldErrors?.email}
        required
      />
      <FormField
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        error={state.fieldErrors?.password}
        required
      />
      <SubmitButton pendingText="Logging in…">Log in</SubmitButton>
      <p className="text-center">
        <Link
          href="/forgot-password"
          className="inline-flex min-h-11 items-center font-medium text-primary underline underline-offset-4"
        >
          Forgot your password?
        </Link>
      </p>
    </form>
  );
}

function CodeForms({ next }: { next: string }) {
  const [sendState, send] = useActionState<FormState, FormData>(
    sendSignInCode,
    {},
  );
  const [verifyState, verify] = useActionState<FormState, FormData>(
    verifySignInCode,
    {},
  );
  const sentTo = verifyState.sentTo ?? sendState.sentTo;

  if (!sentTo) {
    return (
      <form action={send} className="space-y-5" noValidate>
        <FormMessage>{sendState.error}</FormMessage>
        <input type="hidden" name="next" value={next} />
        <FormField
          label="Email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          hint={
            CODES_ENABLED
              ? "We'll email you a 6-digit code and a sign-in link."
              : "We'll email you a link that logs you straight in."
          }
          error={sendState.fieldErrors?.email}
          required
        />
        <SubmitButton pendingText="Sending…">
          {CODES_ENABLED ? "Email me a code" : "Email me a link"}
        </SubmitButton>
      </form>
    );
  }

  if (!CODES_ENABLED) {
    return (
      <div className="space-y-3" aria-live="polite">
        <FormMessage>{sendState.error}</FormMessage>
        <p>
          If <strong>{sentTo}</strong> has a Tend account, a sign-in link is on
          its way. Open the email on this phone and tap the link.
        </p>
      </div>
    );
  }

  return (
    <form action={verify} className="space-y-5" noValidate>
      <FormMessage>{verifyState.error}</FormMessage>
      <p>
        If <strong>{sentTo}</strong> has a Tend account, a code is on its way.
        Type it here, or tap the link in the email.
      </p>
      <input type="hidden" name="next" value={next} />
      <input type="hidden" name="email" value={sentTo} />
      <FormField
        label="6-digit code"
        name="code"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="\d{6}"
        maxLength={6}
        error={verifyState.fieldErrors?.code}
        required
      />
      <SubmitButton pendingText="Checking…">Log in</SubmitButton>
    </form>
  );
}
