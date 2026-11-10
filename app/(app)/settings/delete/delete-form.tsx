"use client";

import { useActionState, useEffect } from "react";
import { FormField, FormMessage, SubmitButton } from "@/components/form-field";
import { clearDeviceData } from "@/lib/auth/clear-device";
import { type DeleteState, deleteMyAccount } from "./actions";

export function DeleteForm() {
  const [state, action] = useActionState<DeleteState, FormData>(
    deleteMyAccount,
    {},
  );

  useEffect(() => {
    if (!state.done) return;
    // Nothing from this account stays on the phone.
    clearDeviceData().finally(() => window.location.replace("/goodbye"));
  }, [state.done]);

  return (
    <form action={action} className="space-y-4">
      <FormMessage>{state.error}</FormMessage>
      <FormField
        name="confirm"
        label="Type DELETE to confirm"
        autoComplete="off"
        autoCapitalize="characters"
        required
      />
      <SubmitButton pendingText="Deleting…">
        Delete my account for good
      </SubmitButton>
    </form>
  );
}
