"use client";

import { useActionState } from "react";
import { FormField, FormMessage, SubmitButton } from "@/components/form-field";
import { type FormState, setNewPassword } from "../actions";

export default function ResetPasswordPage() {
  const [state, action] = useActionState<FormState, FormData>(
    setNewPassword,
    {},
  );

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl">Choose a new password</h1>
        <p className="text-muted-foreground">
          Something you&apos;ll remember, at least 8 characters.
        </p>
      </header>
      <form action={action} className="space-y-5" noValidate>
        <FormMessage>{state.error}</FormMessage>
        <FormField
          label="New password"
          name="password"
          type="password"
          autoComplete="new-password"
          error={state.fieldErrors?.password}
          required
        />
        <FormField
          label="Type it once more"
          name="confirm"
          type="password"
          autoComplete="new-password"
          error={state.fieldErrors?.confirm}
          required
        />
        <SubmitButton pendingText="Saving…">Save new password</SubmitButton>
      </form>
    </div>
  );
}
