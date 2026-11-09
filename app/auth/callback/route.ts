import type { EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { safeNextPath } from "@/lib/auth/schemas";
import { createClient } from "@/lib/supabase/server";

const FLOWS = ["signup", "signin", "reset"] as const;

/**
 * Finishes links from Tend emails (confirm sign-up, sign-in link, reset
 * password). Handles both link styles Supabase can send.
 *
 * A `code` only arrives after Supabase has already checked the link. If we
 * then can't finish, the link was opened somewhere other than where it was
 * requested (on iPhone, email links open in Safari, not the installed app),
 * so we say that instead of calling it expired.
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const next = safeNextPath(url.searchParams.get("next"));
  const flowParam = url.searchParams.get("flow");
  const flow = FLOWS.find((f) => f === flowParam) ?? "signin";
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;

  const supabase = await createClient();
  let result: "ok" | "elsewhere" | "expired" = "expired";

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    result = error ? "elsewhere" : "ok";
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });
    result = error ? "expired" : "ok";
  }

  const target = url.clone();
  target.search = "";
  if (result === "ok") {
    target.pathname = next;
  } else if (result === "elsewhere" && flow === "reset") {
    target.pathname = "/forgot-password";
    target.searchParams.set("link", "elsewhere");
  } else {
    target.pathname = "/login";
    target.searchParams.set("link", result);
    target.searchParams.set("flow", flow);
    // Keep where they were going (e.g. a partner's invite) for after login.
    if (next !== "/home") target.searchParams.set("next", next);
  }
  return NextResponse.redirect(target);
}
