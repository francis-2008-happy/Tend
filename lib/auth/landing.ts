import { createClient } from "@/lib/supabase/server";

/**
 * Where to go right after signing in. The very first time, Home hands over
 * to "About me" (once, skippable), so go there directly.
 */
export async function landingAfterSignIn(next: string) {
  if (next !== "/home") return next;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("about_me")
    .select("user_id")
    .maybeSingle();
  return !error && !data ? "/about-me" : next;
}
