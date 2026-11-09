"use client";

import { useActionState } from "react";
import { FormField, FormMessage, SubmitButton } from "@/components/form-field";
import { type FormState, signUp } from "../actions";

export function SignUpForm() {
  const [state, action] = useActionState<FormState, FormData>(signUp, {});

  return (
    <form action={action} className="space-y-5" noValidate>
      <FormMessage>{state.error}</FormMessage>
      <FormField
        label="Your first name"
        name="name"
        autoComplete="given-name"
        hint="This is what your partner will see."
        error={state.fieldErrors?.name}
        required
      />
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
        autoComplete="new-password"
        hint="At least 8 characters."
        error={state.fieldErrors?.password}
        required
      />
      <SubmitButton pendingText="Creating your account…">
        Create account
      </SubmitButton>
    </form>
  );
}
