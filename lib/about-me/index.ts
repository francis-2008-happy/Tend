import "server-only";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Field } from "./options";

export type AboutMe = {
  answers: Record<Field, string[] | string | null>;
  shared: Field[];
  completed: boolean;
};

/** Your own answers, or null if you haven't opened "About me" yet. */
export async function getMyAboutMe(): Promise<AboutMe | null> {
  await connection();
  const supabase = await createClient();
  const { data } = await supabase.from("about_me").select("*").maybeSingle();
  if (!data) return null;
  return {
    answers: {
      love_languages: data.love_languages,
      budget_band: data.budget_band,
      free_time: data.free_time,
      kids: data.kids,
      interests: data.interests,
      surprise_style: data.surprise_style,
    },
    shared: data.shared_fields as Field[],
    completed: data.completed_at !== null,
  };
}

/** Only what your partner chose to show you (the database decides). */
export async function getPartnerShared() {
  await connection();
  const supabase = await createClient();
  const { data } = await supabase.rpc("partner_about_me");
  const row = data?.[0];
  if (!row) return null;
  const { partner_name, ...answers } = row;
  return {
    partnerName: partner_name || "Your partner",
    answers: answers as Record<Field, string[] | string | null>,
  };
}

export async function getMySettings() {
  await connection();
  const supabase = await createClient();
  const { data } = await supabase
    .from("my_settings")
    .select("faith_pack")
    .maybeSingle();
  return { faithPack: data?.faith_pack ?? false };
}
