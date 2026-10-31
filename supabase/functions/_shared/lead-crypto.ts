/** Hashing and tokens for the lead functions. Web Crypto only, so it runs the same in Deno and in the tests. */
const bytes = (s: string) => new TextEncoder().encode(s);
const hex = (b: ArrayBuffer) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");

export const sha256 = async (text: string) => hex(await crypto.subtle.digest("SHA-256", bytes(text)));

/**
 * The unit a rate limit counts. IPv4 stays as it is. IPv6 becomes its /64, because one home or phone is handed a whole /64
 * and can pick a new address from it at will. An IPv4 address mapped into IPv6 counts as that IPv4 address.
 */
export function ipBucket(raw: string): string {
  const ip = raw.trim().toLowerCase().replace(/^\[/, "").replace(/\](:\d+)?$/, "").split("%")[0];
  if (!ip.includes(":")) return ip;
  if (/^\d+\.\d+\.\d+\.\d+:\d+$/.test(ip)) return ip.split(":")[0];
  const dotted = /^(?:::|(?:0+:){5})ffff:(\d+\.\d+\.\d+\.\d+)$/.exec(ip);
  if (dotted) return dotted[1];
  const mapped = /^(?:::|(?:0+:){5})ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/.exec(ip);
  if (mapped) { const [a, b] = [parseInt(mapped[1], 16), parseInt(mapped[2], 16)]; return [a >> 8, a & 255, b >> 8, b & 255].join("."); }
  const [head, tail] = ip.split("::");
  const front = head ? head.split(":") : [];
  const back = tail ? tail.split(":") : [];
  const groups = ip.includes("::") ? [...front, ...Array(Math.max(8 - front.length - back.length, 0)).fill("0"), ...back] : front;
  if (groups.length < 4 || groups.slice(0, 4).some((g) => !/^[0-9a-f]{1,4}$/.test(g))) return ip;
  return `${groups.slice(0, 4).map((g) => parseInt(g, 16).toString(16)).join(":")}::/64`;
}

/** A keyed hash of the IP's bucket that changes every UTC day: a plain hash of an IPv4 address can be reversed by trying them all. Each scope gets its own hash. */
export async function hashIp(ip: string, key: string, now = new Date(), scope: "request" | "send" = "request"): Promise<string> {
  const k = await crypto.subtle.importKey("raw", bytes(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return hex(await crypto.subtle.sign("HMAC", k, bytes(`lead-${scope}|${now.toISOString().slice(0, 10)}|${ipBucket(ip)}`)));
}

export function newToken(): string {
  const b = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...b)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
export const isToken = (t: unknown): t is string => typeof t === "string" && /^[A-Za-z0-9_-]{43}$/.test(t);
