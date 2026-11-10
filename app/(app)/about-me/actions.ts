"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { parseAnswer, sharingSchema } from "@/lib/about-me/options";
import type { TablesInsert } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";

/*
 * About me and personal settings. The database only lets you touch your
 * own row (row level security), so these just check the answers' shape.
 */

type Result = { ok: true } | { ok: false; error: string };
const TRY_AGAIN = "That didn't save. Please try again.";

async function me() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return { supabase, userId: data.user?.id };
}

/** Saves one answer as you go, so leaving halfway keeps your progress. */
export async function saveAnswer(
  field: string,
  values: string[],
): Promise<Result> {
  const answer = parseAnswer(field, values);
  if (!answer.ok) return { ok: false, error: TRY_AGAIN };
  const { supabase, userId } = await me();
  if (!userId) redirect("/login");
  const row = {
    user_id: userId,
    [answer.field]: answer.value,
    updated_at: new Date().toISOString(),
  } as TablesInsert<"about_me">;
  const { error } = await supabase.from("about_me").upsert(row);
  return error ? { ok: false, error: TRY_AGAIN } : { ok: true };
}

/** Which answers your partner may see. Nothing is shared unless listed. */
export async function saveSharing(fields: string[]): Promise<Result> {
  const parsed = sharingSchema.safeParse([...new Set(fields)]);
  if (!parsed.success) return { ok: false, error: TRY_AGAIN };
  const { supabase, userId } = await me();
  if (!userId) redirect("/login");
  const now = new Date().toISOString();
  const { error } = await supabase.from("about_me").upsert({
    user_id: userId,
    shared_fields: parsed.data,
    completed_at: now,
    updated_at: now,
  });
  if (error) return { ok: false, error: TRY_AGAIN };
  revalidatePath("/settings");
  return { ok: true };
}

/** "I'll do this later": remember they've seen it, so it doesn't pop up again. */
export async function aboutMeLater() {
  const { supabase, userId } = await me();
  if (!userId) redirect("/login");
  await supabase
    .from("about_me")
    .upsert({ user_id: userId }, { ignoreDuplicates: true });
  redirect("/home");
}

export async function setFaithPack(on: boolean): Promise<Result> {
  const { supabase, userId } = await me();
  if (!userId) redirect("/login");
  const { error } = await supabase.from("my_settings").upsert({
    user_id: userId,
    faith_pack: on === true,
    updated_at: new Date().toISOString(),
  });
  return error ? { ok: false, error: TRY_AGAIN } : { ok: true };
}
