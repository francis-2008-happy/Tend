/**
 * Turns Supabase Auth errors into warm, plain-language messages.
 * Messages never reveal whether an email has an account (privacy).
 */
export function friendlyAuthError(
  error: { code?: string; message?: string } | null,
) {
  switch (error?.code) {
    case "invalid_credentials":
      return "That email and password don't match. Try again, or use an email code.";
    case "email_not_confirmed":
      return "Please confirm your email first. The link is in your inbox.";
    case "over_email_send_rate_limit":
    case "over_request_rate_limit":
      return "Lots of requests just now. Please wait a minute and try again.";
    case "otp_expired":
      return "That code has expired or was already used. Ask for a new one.";
    case "weak_password":
      return "Please choose a stronger password: at least 8 characters.";
    case "same_password":
      return "That's your current password. Choose a new one.";
    default:
      return "Something didn't work on our side. Please try again.";
  }
}
