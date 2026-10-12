import { describe, it, expect } from "vitest";
import { auraState } from "@/lib/aura";
import { errKey } from "@/components/auth/errors";

describe("aura mapping", () => {
  it("answers change the aura", () => {
    const calm = auraState({ answers: { energy: 1, weather: "sunny", body: "grounded", intention: "peace" } });
    const storm = auraState({ answers: { energy: 5, weather: "stormy", body: "buzzing", intention: "love" } });
    expect(storm.energy!).toBeGreaterThan(calm.energy!); expect(storm.turbulence!).toBeGreaterThan(calm.turbulence!);
    expect(storm.heart).not.toBe(calm.heart); expect(storm.focus).toBe(3); expect(calm.focus).toBe(6);
  });
  it("uses the palette when known", () => { expect(auraState({ palette: ["#111111", "#222222", "#333333", "#444444", "#555555"] }).colors[0]).toBe("#111111"); });
});
describe("auth error mapping", () => {
  it("maps Supabase errors to friendly keys", () => {
    expect(errKey({ message: "Database error saving new user", status: 500 })).toBe("invite_only");
    expect(errKey({ code: "otp_expired", message: "Token has expired or is invalid" })).toBe("otp_expired");
    expect(errKey({ code: "invalid_credentials" })).toBe("invalid_credentials");
    expect(errKey({ message: "Email rate limit exceeded" })).toBe("over_email_send_rate_limit");
  });
});
