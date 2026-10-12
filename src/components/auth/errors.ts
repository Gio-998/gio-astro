/** Map a Supabase auth error to one of our friendly message keys. */
export function errKey(e: unknown): string {
  const o = (e ?? {}) as { code?: string; message?: string; status?: number; name?: string };
  const code = o.code ?? ""; const msg = (o.message ?? "").toLowerCase();
  if (code === "otp_expired" || msg.includes("expired")) return msg.includes("invalid") && !msg.includes("expired") ? "invalid_otp" : "otp_expired";
  if (msg.includes("token") && msg.includes("invalid")) return "invalid_otp";
  if (code) return code;
  if (msg.includes("invalid login")) return "invalid_credentials";
  if (msg.includes("not confirmed")) return "email_not_confirmed";
  if (msg.includes("rate limit")) return "over_email_send_rate_limit";
  if (msg.includes("already registered")) return "user_already_exists";
  if (msg.includes("fetch") || o.name === "AuthRetryableFetchError") return "network";
  return "generic";
}
