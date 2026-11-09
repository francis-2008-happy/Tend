import { z } from "zod";

const email = z
  .string({ error: "Please enter your email." })
  .trim()
  .toLowerCase()
  .min(1, "Please enter your email.")
  .pipe(z.email("That email doesn't look quite right."));

const password = z
  .string({ error: "Please choose a password." })
  .min(8, "Use at least 8 characters.")
  .max(72, "That's a little long. Use 72 characters or fewer.");

export const signUpSchema = z.object({
  name: z
    .string({ error: "What should we call you?" })
    .trim()
    .min(1, "What should we call you?")
    .max(40, "Keep it to 40 characters or fewer."),
  email,
  password,
});

export const logInSchema = z.object({
  email,
  password: z
    .string({ error: "Please enter your password." })
    .min(1, "Please enter your password."),
});

export const emailOnlySchema = z.object({ email });

export const codeSchema = z.object({
  email,
  code: z
    .string({ error: "Enter the 6-digit code from your email." })
    .trim()
    .regex(/^\d{6}$/, "Enter the 6-digit code from your email."),
});

export const newPasswordSchema = z
  .object({ password, confirm: z.string() })
  .refine((v) => v.password === v.confirm, {
    message: "The two passwords don't match.",
    path: ["confirm"],
  });

export type FieldErrors = Partial<Record<string, string>>;

/** First error message for each field, ready to show under the input. */
export function fieldErrorsFrom(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    out[key] ??= issue.message;
  }
  return out;
}

/** Only allow redirects to pages inside Tend (never to another website). */
export function safeNextPath(next: unknown, fallback = "/home") {
  if (typeof next !== "string") return fallback;
  if (!next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\"))
    return fallback;
  return next;
}
