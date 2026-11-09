"use server";

import { redirect } from "next/navigation";
import { fieldErrorsFrom } from "@/lib/auth/schemas";
import {
  isInviteToken,
  joinCodeSchema,
  redeemMessage,
} from "@/lib/couple/invite";
import { createClient } from "@/lib/supabase/server";
import type { FormState } from "../../(auth)/actions";

/*
 * Couple actions. Every permission check happens in the database functions
 * (supabase/migrations/*_couples_and_privacy.sql); these only translate the
 * answer into kind words or the next screen.
 */

const TRY_AGAIN = "Something went wrong. Please try again.";

/** Creates the couple space and its first invite, then shows the invite. */
export async function startCoupleSpace(): Promise<FormState> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_couple");
  if (error) return { error: TRY_AGAIN };
  if (data !== "created" && data !== "already_linked")
    return { error: TRY_AGAIN };
  const invite = await supabase.rpc("create_invite");
  if (invite.error) return { error: TRY_AGAIN };
  redirect("/invite");
}

/** Replaces the current invite with a fresh code and link. */
export async function renewInvite(): Promise<FormState> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_invite");
  if (error) return { error: TRY_AGAIN };
  if (data?.[0]?.status === "full") redirect("/home");
  if (data?.[0]?.status !== "created") return { error: TRY_AGAIN };
  redirect("/invite");
}

async function redeem(codeOrToken: string): Promise<FormState> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("redeem_invite", {
    code_or_token: codeOrToken,
  });
  if (error) return { error: TRY_AGAIN };
  if (data === "joined") redirect("/home");
  return { error: redeemMessage(data) };
}

export async function joinWithCode(
  _: FormState,
  form: FormData,
): Promise<FormState> {
  const parsed = joinCodeSchema.safeParse({ code: form.get("code") ?? "" });
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error) };
  return redeem(parsed.data.code);
}

export async function joinWithLink(
  _: FormState,
  form: FormData,
): Promise<FormState> {
  const token = String(form.get("token") ?? "");
  if (!isInviteToken(token)) return { error: redeemMessage("not_found") };
  return redeem(token);
}

/** Leaves the couple space. Private things stay with the person leaving. */
export async function leaveCoupleSpace(
  _: FormState,
  form: FormData,
): Promise<FormState> {
  if (form.get("confirm") !== "yes")
    return { error: "Tick the box to confirm you've read what happens." };
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("leave_couple");
  if (error || (data !== "left" && data !== "not_linked"))
    return { error: TRY_AGAIN };
  redirect("/home");
}
