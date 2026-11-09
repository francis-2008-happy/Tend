"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { friendlyAuthError } from "@/lib/auth/messages";
import {
  codeSchema,
  emailOnlySchema,
  type FieldErrors,
  fieldErrorsFrom,
  logInSchema,
  newPasswordSchema,
  safeNextPath,
  signUpSchema,
} from "@/lib/auth/schemas";
import { createClient } from "@/lib/supabase/server";

export type FormState = {
  error?: string;
  fieldErrors?: FieldErrors;
  /** Set after an email was sent, so the form can show the next step. */
  sentTo?: string;
};

const form = (data: FormData) => Object.fromEntries(data.entries());

/** The address the visitor is using, for links inside emails. */
async function siteOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  if (host) return `${proto}://${host}`;
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

const callbackUrl = async (next: string) =>
  `${await siteOrigin()}/auth/callback?next=${encodeURIComponent(next)}`;

export async function signUp(_: FormState, data: FormData): Promise<FormState> {
  const parsed = signUpSchema.safeParse(form(data));
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error) };

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { display_name: parsed.data.name },
      emailRedirectTo: await callbackUrl("/home"),
    },
  });
  // An existing email gets the same reply as a new one (privacy).
  if (error && error.code !== "user_already_exists")
    return { error: friendlyAuthError(error) };

  redirect(
    `/check-email?for=signup&email=${encodeURIComponent(parsed.data.email)}`,
  );
}

export async function logIn(_: FormState, data: FormData): Promise<FormState> {
  const parsed = logInSchema.safeParse(form(data));
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error) };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: friendlyAuthError(error) };

  redirect(safeNextPath(data.get("next")));
}

/** Emails a sign-in link and a 6-digit code (existing accounts only). */
export async function sendSignInCode(
  _: FormState,
  data: FormData,
): Promise<FormState> {
  const parsed = emailOnlySchema.safeParse(form(data));
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error) };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: await callbackUrl(safeNextPath(data.get("next"))),
    },
  });
  // Only rate limits are reported. "No such account" looks exactly like
  // success, so nobody can use this screen to check who has an account.
  if (error?.code?.startsWith("over_"))
    return { error: friendlyAuthError(error) };
  return { sentTo: parsed.data.email };
}

export async function verifySignInCode(
  _: FormState,
  data: FormData,
): Promise<FormState> {
  const parsed = codeSchema.safeParse(form(data));
  if (!parsed.success) {
    return {
      sentTo: String(data.get("email") ?? ""),
      fieldErrors: fieldErrorsFrom(parsed.error),
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    email: parsed.data.email,
    token: parsed.data.code,
    type: "email",
  });
  if (error) {
    return {
      sentTo: parsed.data.email,
      error:
        error.code === "otp_expired" || error.status === 403
          ? "That code didn't work. Check it, or ask for a new one."
          : friendlyAuthError(error),
    };
  }

  redirect(safeNextPath(data.get("next")));
}

export async function sendPasswordReset(
  _: FormState,
  data: FormData,
): Promise<FormState> {
  const parsed = emailOnlySchema.safeParse(form(data));
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error) };

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(
    parsed.data.email,
    {
      redirectTo: await callbackUrl("/reset-password"),
    },
  );
  if (error?.code?.startsWith("over_"))
    return { error: friendlyAuthError(error) };

  redirect(
    `/check-email?for=reset&email=${encodeURIComponent(parsed.data.email)}`,
  );
}

export async function setNewPassword(
  _: FormState,
  data: FormData,
): Promise<FormState> {
  const parsed = newPasswordSchema.safeParse(form(data));
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error) };

  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) {
    return { error: "This reset link has expired. Please ask for a new one." };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });
  if (error) return { error: friendlyAuthError(error) };

  redirect("/home");
}

/** Ends the session on the server. The browser then clears local data. */
export async function logOut() {
  const supabase = await createClient();
  await supabase.auth.signOut({ scope: "local" });
}
