import "server-only";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";

export type MyCouple =
  | { state: "none" }
  | { state: "waiting"; coupleId: string }
  | { state: "linked"; coupleId: string; partnerName: string }
  | { state: "ended"; coupleId: string };

/**
 * The signed-in person's couple space, read as them, so the database's
 * privacy rules decide what comes back.
 */
export async function getMyCouple(userId: string): Promise<MyCouple> {
  await connection();
  const supabase = await createClient();

  const { data: mine } = await supabase
    .from("couple_members")
    .select("couple_id, couples(ended_at)")
    .eq("user_id", userId)
    .maybeSingle();
  if (!mine) return { state: "none" };

  const coupleId = mine.couple_id;
  if (mine.couples?.ended_at) return { state: "ended", coupleId };

  const { data: partner } = await supabase
    .from("couple_members")
    .select("user_id")
    .eq("couple_id", coupleId)
    .neq("user_id", userId)
    .maybeSingle();
  if (!partner) return { state: "waiting", coupleId };

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", partner.user_id)
    .maybeSingle();
  return {
    state: "linked",
    coupleId,
    partnerName: profile?.display_name || "your partner",
  };
}

/** The live invite this person made, if any (only the inviter can read it). */
export async function getMyLiveInvite(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("invites")
    .select("code, token, expires_at")
    .eq("created_by", userId)
    .is("used_at", null)
    .is("cancelled_at", null)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data;
}
