/** Hashing and tokens for the lead functions. Web Crypto only, so it runs the same in Deno and in the tests. */
const bytes = (s: string) => new TextEncoder().encode(s);
const hex = (b: ArrayBuffer) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");

export const sha256 = async (text: string) => hex(await crypto.subtle.digest("SHA-256", bytes(text)));

/** A keyed hash of the IP that changes every UTC day: a plain hash of an IPv4 address can be reversed by trying them all. */
export async function hashIp(ip: string, key: string, now = new Date()): Promise<string> {
  const k = await crypto.subtle.importKey("raw", bytes(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return hex(await crypto.subtle.sign("HMAC", k, bytes(`lead-rate-limit|${now.toISOString().slice(0, 10)}|${ip}`)));
}

export function newToken(): string {
  const b = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...b)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
export const isToken = (t: unknown): t is string => typeof t === "string" && /^[A-Za-z0-9_-]{43}$/.test(t);
