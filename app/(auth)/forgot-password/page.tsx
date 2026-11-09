"use client";

import Link from "next/link";
import { useActionState } from "react";
import { FormField, FormMessage, SubmitButton } from "@/components/form-field";
import { type FormState, sendPasswordReset } from "../actions";

export default function ForgotPasswordPage() {
  const [state, action] = useActionState<FormState, FormData>(
    sendPasswordReset,
    {},
  );

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl">Reset your password</h1>
        <p className="text-muted-foreground">
          It happens to everyone. We&apos;ll email you a link to choose a new
          one.
        </p>
      </header>
      <form action={action} className="space-y-5" noValidate>
        <FormMessage>{state.error}</FormMessage>
        <FormField
          label="Email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          error={state.fieldErrors?.email}
          required
        />
        <SubmitButton pendingText="Sending…">Send reset link</SubmitButton>
      </form>
      <p className="text-center">
        <Link
          href="/login"
          className="inline-flex min-h-11 items-center font-medium text-primary underline underline-offset-4"
        >
          Back to log in
        </Link>
      </p>
    </div>
  );
}
