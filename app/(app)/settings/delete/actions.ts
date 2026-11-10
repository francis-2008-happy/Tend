"use server";

import { createClient } from "@/lib/supabase/server";

export type DeleteState = { error?: string; done?: boolean };

/** Deletes the account at once, after the person types DELETE. */
export async function deleteMyAccount(
  _: DeleteState,
  data: FormData,
): Promise<DeleteState> {
  const typed = String(data.get("confirm") ?? "").trim().toUpperCase();
  if (typed !== "DELETE")
    return { error: "Type DELETE to confirm, so we know it's really you." };

  const supabase = await createClient();
  const { data: status, error } = await supabase.rpc("delete_my_account");
  if (error || status !== "deleted")
    return { error: "Something went wrong. Please try again." };

  // The account is gone; clear the login cookies on this device too.
  await supabase.auth.signOut({ scope: "local" }).catch(() => undefined);
  return { done: true };
}
