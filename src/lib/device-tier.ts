/** Device effect tiers for the Living Sky and other GPU moments. Computed once, cached; user can override. */
export type Tier = "full" | "lite" | "off";
const KEY = "horoscop:fx-tier";
const USER_KEY = "horoscop:fx-user";

export const prefersReducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** WebGL available on real hardware? Software rasterisers (SwiftShader, llvmpipe, Basic Render) count as "no":
 *  a full-screen shader on the CPU costs more than it gives, so those devices get the CSS sky. */
function webglOk(): boolean {
  try {
    const c = document.createElement("canvas");
    const gl = (c.getContext("webgl2") || c.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return false;
    const dbg = gl.getExtension("WEBGL_debug_renderer_info");
    const name = String(dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER)).toLowerCase();
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return !/swiftshader|llvmpipe|softpipe|software|basic render/.test(name);
  } catch { return false; }
}

/** Heuristic tier (no GPU probing libs): saveData / tiny memory / no WebGL → off; few cores or small memory → lite. */
export function detectTier(): Tier {
  if (typeof window === "undefined") return "off";
  try {
    const user = localStorage.getItem(USER_KEY) as Tier | null; if (user === "full" || user === "lite" || user === "off") return user;
    const cached = localStorage.getItem(KEY) as Tier | null; if (cached === "full" || cached === "lite" || cached === "off") return cached;
  } catch { /* storage blocked */ }
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  if (nav.connection?.saveData || (nav.deviceMemory != null && nav.deviceMemory <= 2) || !webglOk()) return "off";
  const cores = nav.hardwareConcurrency || 4; const mem = nav.deviceMemory ?? 4;
  return cores >= 6 && mem >= 4 ? "full" : "lite";
}

/** Persist an automatic downgrade (FPS watchdog). */
export function saveTier(t: Tier) { try { localStorage.setItem(KEY, t); } catch { /* ignore */ } }
/** Manual override from settings ("Effects: Full / Lite / Off"); null clears it. */
export function setUserTier(t: Tier | null) { try { if (t) localStorage.setItem(USER_KEY, t); else localStorage.removeItem(USER_KEY); localStorage.removeItem(KEY); } catch { /* ignore */ } window.dispatchEvent(new Event("horoscop:fx")); }
export function userTier(): Tier | null { try { return (localStorage.getItem(USER_KEY) as Tier | null) ?? null; } catch { return null; } }
