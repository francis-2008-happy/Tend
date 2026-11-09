import { z } from "zod";

/** What the database's redeem_invite() can answer. */
export type RedeemStatus =
  | "joined"
  | "not_found"
  | "expired"
  | "full"
  | "already_linked"
  | "own_invite"
  | "too_many_attempts"
  | "signed_out";

/** Kind words for every way joining can go. */
export const REDEEM_MESSAGES: Record<
  Exclude<RedeemStatus, "joined">,
  string
> = {
  not_found:
    "We couldn't find that code. Check the 6 digits with your partner.",
  expired:
    "This invite has expired or was already used. Ask your partner to make a new one.",
  full: "That couple space already has two people in it.",
  already_linked:
    "You're already in a couple space. To join a different one, leave yours first in Settings.",
  own_invite:
    "That's your own invite. Send it to your partner so they can join you.",
  too_many_attempts:
    "That's a lot of tries. Please wait an hour, then try again.",
  signed_out: "Please log in first.",
};

export function redeemMessage(status: string) {
  return (
    REDEEM_MESSAGES[status as keyof typeof REDEEM_MESSAGES] ??
    "Something went wrong. Please try again."
  );
}

export const joinCodeSchema = z.object({
  code: z
    .string({ error: "Enter the 6-digit code from your partner." })
    .transform((v) => v.replace(/\s+/g, ""))
    .pipe(
      z.string().regex(/^\d{6}$/, "Enter the 6-digit code from your partner."),
    ),
});

/** Link tokens are 64 letters and numbers; anything else is not ours. */
export const isInviteToken = (token: string) => /^[0-9a-f]{64}$/.test(token);

export const inviteLink = (origin: string, token: string) =>
  `${origin}/join/${token}`;

/** Shows "123 456" so the code is easy to read out. */
export const spacedCode = (code: string) =>
  `${code.slice(0, 3)} ${code.slice(3)}`;

/** The fixed, warm message sent through WhatsApp. No private content. */
export function inviteMessage(inviterName: string, link: string, code: string) {
  const from = inviterName ? `${inviterName} would` : "I'd";
  return [
    `${from} love you to join our space on Tend, a little app for the two of us.`,
    "",
    `Tap to join: ${link}`,
    `Or use the code ${spacedCode(code)} in the app.`,
  ].join("\n");
}

export const whatsappShareUrl = (text: string) =>
  `https://wa.me/?text=${encodeURIComponent(text)}`;
