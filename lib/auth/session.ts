import "server-only";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";

export type CurrentUser = { id: string; email: string; name: string };

/**
 * The signed-in user, checked with Supabase on every call.
 * Sends signed-out visitors to the login screen.
 * Must be called inside a <Suspense> boundary (Cache Components).
 */
export async function getCurrentUser(): Promise<CurrentUser> {
  const user = await getSignedInUser();
  if (!user) redirect("/login");
  return user;
}

/** Like getCurrentUser, but returns null for signed-out visitors. */
export async function getSignedInUser(): Promise<CurrentUser | null> {
  // Always per request: Supabase checks token expiry against the clock,
  // which Next must never bake into a prerendered page.
  await connection();
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;

  const meta = data.user.user_metadata as { display_name?: unknown };
  const name = typeof meta.display_name === "string" ? meta.display_name : "";
  return { id: data.user.id, email: data.user.email ?? "", name };
}
