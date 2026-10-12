"use client";
/**
 * A living, symbolic "energy body": canvas 2D only (no libraries, no GPU requirements).
 * Layers: aura field (blobby, breathing), silhouette, nervous-system light pulses, limbic glow,
 * seven energy centres along the spine, breath ring, orbiting sparks.
 * All inputs ease smoothly toward their targets, so every answer visibly changes the picture.
 * It's a visual metaphor for a reading, not a biometric measurement.
 */
import { useEffect, useRef } from "react";

export interface AuraState {
  /** 2–5 hex colours (from their palette / element). */
  colors: string[];
  /** 0..1: size and speed of the field. */
  energy?: number;
  /** 0..1: how turbulent the outline is (stormy weather → high). */
  turbulence?: number;
  /** Colour of the emotional (limbic) glow. */
  heart?: string;
  /** 0..1 how fast/bright the nerve pulses run. */
  nerves?: number;
  /** 0..1 how brightly the energy centres shine. */
  centres?: number;
  /** Highlight one centre 0 (root) … 6 (crown). */
  focus?: number | null;
  /** 0..1 how much of the body is "lit" (grows as the ritual progresses). */
  presence?: number;
}
export interface AuraProps extends AuraState {
  className?: string;
  /** Show the human silhouette (false → pure orb, good for small badges). */
  body?: boolean;
  /** External breath phase 0..1 (inhale→1, exhale→0). If omitted the aura breathes by itself. */
  breath?: number | null;
  /** Change this number to make the aura collapse and re-form (a "pulse"). */
  pulse?: number;
  /** Second aura for compatibility: two fields that drift together and blend. */
  partner?: AuraState | null;
  /** 0..1 how merged the two fields are. */
  merge?: number;
  label?: string;
  "data-aura"?: boolean;
}

const hexToRgb = (h: string): [number, number, number] => {
  const m = h.replace("#", ""); const n = parseInt(m.length === 3 ? m.split("").map((x) => x + x).join("") : m.slice(0, 6), 16);
  return Number.isFinite(n) ? [(n >> 16) & 255, (n >> 8) & 255, n & 255] : [200, 180, 255];
};
const mix = (a: [number, number, number], b: [number, number, number], t: number): [number, number, number] => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const rgba = (c: number[], a: number) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
const CENTRE_COLORS: [number, number, number][] = [[255, 80, 90], [255, 150, 70], [255, 215, 90], [110, 230, 150], [90, 190, 255], [140, 120, 255], [230, 170, 255]];

type Live = { cols: [number, number, number][]; energy: number; turb: number; heart: [number, number, number]; nerves: number; centres: number; presence: number };
const toLive = (s: AuraState): Live => {
  const cols = (s.colors.length ? s.colors : ["#c9b8ff", "#ffd38a"]).slice(0, 5).map(hexToRgb);
  while (cols.length < 5) cols.push(cols[cols.length % Math.max(1, cols.length)]);
  return { cols, energy: s.energy ?? 0.5, turb: s.turbulence ?? 0.3, heart: hexToRgb(s.heart ?? s.colors[0] ?? "#ffb3c7"), nerves: s.nerves ?? 0.5, centres: s.centres ?? 0.5, presence: s.presence ?? 1 };
};
const ease = (a: Live, b: Live, k: number): Live => ({
  cols: a.cols.map((c, i) => mix(c, b.cols[i], k)), energy: a.energy + (b.energy - a.energy) * k, turb: a.turb + (b.turb - a.turb) * k,
  heart: mix(a.heart, b.heart, k), nerves: a.nerves + (b.nerves - a.nerves) * k, centres: a.centres + (b.centres - a.centres) * k, presence: a.presence + (b.presence - a.presence) * k,
});

// Silhouette in a 100×160 box (head at top). Built once.
function silhouette(): Path2D {
  const p = new Path2D();
  p.moveTo(50, 8); p.bezierCurveTo(60, 8, 63, 17, 62, 25); p.bezierCurveTo(61, 33, 57, 38, 56, 41);
  p.bezierCurveTo(66, 43, 75, 46, 78, 54); p.bezierCurveTo(81, 64, 83, 78, 86, 92); p.bezierCurveTo(87, 97, 82, 98, 81, 93);
  p.bezierCurveTo(78, 81, 75, 70, 72, 63); p.bezierCurveTo(70, 76, 70, 86, 68, 96); p.bezierCurveTo(68, 115, 67, 132, 66, 152);
  p.bezierCurveTo(65, 157, 57, 157, 57, 152); p.bezierCurveTo(56, 136, 54, 118, 50, 104); p.bezierCurveTo(46, 118, 44, 136, 43, 152);
  p.bezierCurveTo(43, 157, 35, 157, 34, 152); p.bezierCurveTo(33, 132, 32, 115, 32, 96); p.bezierCurveTo(30, 86, 30, 76, 28, 63);
  p.bezierCurveTo(25, 70, 22, 81, 19, 93); p.bezierCurveTo(18, 98, 13, 97, 14, 92); p.bezierCurveTo(17, 78, 19, 64, 22, 54);
  p.bezierCurveTo(25, 46, 34, 43, 44, 41); p.bezierCurveTo(43, 38, 39, 33, 38, 25); p.bezierCurveTo(37, 17, 40, 8, 50, 8); p.closePath();
  return p;
}
// Nerve paths (polyline points in the same 100×160 box).
const NERVES: [number, number][][] = [
  [[50, 30], [50, 50], [50, 70], [50, 90], [50, 102]],
  [[50, 46], [62, 48], [72, 58], [78, 72], [83, 90]], [[50, 46], [38, 48], [28, 58], [22, 72], [17, 90]],
  [[50, 100], [55, 112], [58, 128], [61, 150]], [[50, 100], [45, 112], [42, 128], [39, 150]],
  [[50, 60], [60, 66], [64, 80]], [[50, 60], [40, 66], [36, 80]],
];
const CENTRES_Y = [101, 92, 80, 64, 47, 30, 16];

export function Aura({ className = "", body = true, breath = null, pulse = 0, partner = null, merge = 0, label, "data-aura": dataAura, ...state }: AuraProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const target = useRef<{ a: Live; b: Live | null; breath: number | null; merge: number; focus: number | null }>({ a: toLive(state), b: partner ? toLive(partner) : null, breath, merge, focus: state.focus ?? null });
  const pulseAt = useRef(-1e9);
  const lastPulse = useRef(pulse);
  const redraw = useRef<() => void>(() => {});
  useEffect(() => {
    target.current = { a: toLive(state), b: partner ? toLive(partner) : null, breath, merge, focus: state.focus ?? null };
    if (pulse !== lastPulse.current) { lastPulse.current = pulse; pulseAt.current = performance.now(); }
    redraw.current();
  });

  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext("2d"); if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sil = silhouette();
    let live = target.current.a, liveB = target.current.b, mergeL = target.current.merge, breathL = 0.5;
    let W = 0, H = 0, dpr = 1, raf = 0, visible = true, last = performance.now();
    const sparks = Array.from({ length: 34 }, (_, i) => ({ a: Math.random() * Math.PI * 2, r: 0.55 + Math.random() * 0.5, s: (0.15 + Math.random() * 0.35) * (i % 2 ? 1 : -1), z: Math.random() }));
    const resize = () => {
      const r = cv.getBoundingClientRect(); dpr = Math.min(2, window.devicePixelRatio || 1);
      W = Math.max(1, r.width); H = Math.max(1, r.height); cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduce) frame(performance.now());
    };
    const field = (cx: number, cy: number, R: number, L: Live, t: number, br: number, squash: number) => {
      ctx.globalCompositeOperation = "lighter";
      for (let layer = 0; layer < 4; layer++) {
        const c = L.cols[layer % 5]; const rr = R * (1.05 - layer * 0.16) * (0.92 + br * 0.16);
        ctx.beginPath();
        const N = 64;
        for (let i = 0; i <= N; i++) {
          const th = (i / N) * Math.PI * 2;
          const wob = Math.sin(th * 3 + t * (0.6 + L.energy) + layer) * 0.05 + Math.sin(th * 5 - t * (0.9 + L.energy) * 1.3 + layer * 2) * 0.035 * (0.5 + L.turb * 2) + Math.sin(th * 9 + t * 2.2) * 0.02 * L.turb * 2;
          const r = rr * (1 + wob);
          const x = cx + Math.cos(th) * r * (0.82 + squash * 0.1), y = cy + Math.sin(th) * r * (1.08 - squash * 0.1);
          if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y);
        }
        const g = ctx.createRadialGradient(cx, cy, rr * 0.05, cx, cy, rr * 1.08);
        g.addColorStop(0, rgba(c, 0.16 + 0.08 * L.presence)); g.addColorStop(0.55, rgba(c, 0.10 + 0.06 * L.energy)); g.addColorStop(1, rgba(c, 0));
        ctx.fillStyle = g; ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    };
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const T = target.current; const k = reduce ? 1 : 1 - Math.pow(0.04, dt); // ~1s ease
      live = ease(live, T.a, k);
      if (T.b) liveB = liveB ? ease(liveB, T.b, k) : T.b; else liveB = null;
      mergeL += (T.merge - mergeL) * k;
      const t = reduce ? 1.2 : now / 1000;
      const auto = 0.5 + 0.5 * Math.sin(t * (Math.PI * 2) / 8); // 8 s breath when idle
      breathL += ((T.breath ?? auto) - breathL) * (reduce ? 1 : Math.min(1, dt * 4));
      // pulse: collapse then re-form over 1.4 s
      const pt = (now - pulseAt.current) / 1400; const collapse = pt >= 0 && pt < 1 && !reduce ? Math.sin(pt * Math.PI) * (pt < 0.35 ? 1 : 0.85) : 0;
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2; const base = Math.min(W, H * 0.75) * 0.5;
      const R = base * (0.62 + live.energy * 0.32) * (1 - collapse * 0.62);
      if (liveB) {
        const sep = base * 0.62 * (1 - mergeL);
        field(cx - sep, cy, R * 0.85, live, t, breathL, 0);
        field(cx + sep, cy, R * 0.85, liveB, t + 3, 1 - breathL * 0.6, 0);
        if (mergeL > 0.3) { const blend = ease(live, liveB, 0.5); field(cx, cy, R * (0.5 + mergeL * 0.5), blend, t + 1.5, breathL, 1); }
      } else field(cx, cy, R, live, t, breathL, body ? 0.6 : 0);

      // breath ring
      const ringR = base * (0.38 + breathL * 0.5);
      ctx.beginPath(); ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
      ctx.strokeStyle = rgba(mix(live.cols[1], [255, 255, 255], 0.5), 0.12 + 0.18 * breathL); ctx.lineWidth = 1.2; ctx.stroke();

      if (body && !liveB) {
        const s = (H * 0.72) / 160; const ox = cx - 50 * s, oy = cy - 82 * s;
        ctx.save(); ctx.translate(ox, oy); ctx.scale(s, s);
        // body fill + rim light
        const bg = ctx.createLinearGradient(0, 0, 0, 160); bg.addColorStop(0, "rgba(30,22,70,.78)"); bg.addColorStop(1, "rgba(18,12,48,.62)");
        ctx.fillStyle = bg; ctx.fill(sil);
        ctx.shadowColor = rgba(live.cols[0], 0.9); ctx.shadowBlur = 14 / s * (0.6 + live.presence);
        ctx.strokeStyle = rgba(mix(live.cols[0], [255, 255, 255], 0.4), 0.35 + 0.4 * live.presence); ctx.lineWidth = 0.9; ctx.stroke(sil);
        ctx.shadowBlur = 0;
        ctx.save(); ctx.clip(sil);
        // limbic / emotional glow (head + heart)
        const hg = ctx.createRadialGradient(50, 26, 0, 50, 26, 22); hg.addColorStop(0, rgba(live.heart, 0.55 * live.presence)); hg.addColorStop(1, rgba(live.heart, 0));
        ctx.fillStyle = hg; ctx.fillRect(0, 0, 100, 60);
        const hh = ctx.createRadialGradient(50, 64, 0, 50, 64, 26); hh.addColorStop(0, rgba(live.heart, (0.35 + 0.25 * breathL) * live.presence)); hh.addColorStop(1, rgba(live.heart, 0));
        ctx.fillStyle = hh; ctx.fillRect(0, 30, 100, 70);
        // nerves: faint paths + travelling pulses
        ctx.lineCap = "round";
        for (let n = 0; n < NERVES.length; n++) {
          const pts = NERVES[n];
          ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
          ctx.strokeStyle = rgba(mix(live.cols[2], [255, 255, 255], 0.6), 0.10 + 0.12 * live.nerves * live.presence); ctx.lineWidth = 0.6; ctx.stroke();
          const speed = 0.25 + live.nerves * 0.9; const ph = ((t * speed + n * 0.37) % 1 + 1) % 1;
          const seg = ph * (pts.length - 1); const i0 = Math.floor(seg), f = seg - i0; const a = pts[i0], b2 = pts[Math.min(pts.length - 1, i0 + 1)];
          const px = a[0] + (b2[0] - a[0]) * f, py = a[1] + (b2[1] - a[1]) * f;
          const pg = ctx.createRadialGradient(px, py, 0, px, py, 4); pg.addColorStop(0, rgba([255, 255, 255], 0.9 * live.presence * (0.4 + live.nerves))); pg.addColorStop(1, "rgba(255,255,255,0)");
          ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
        // energy centres along the spine
        CENTRES_Y.forEach((y, i) => {
          const c = mix(CENTRE_COLORS[i], live.cols[i % 5], 0.35); const foc = T.focus === i ? 1 : 0;
          const pr = 2.2 + live.centres * 1.8 + foc * 2 + Math.sin(t * 2 + i) * 0.5 * live.centres;
          const g = ctx.createRadialGradient(50, y, 0, 50, y, pr * 3); g.addColorStop(0, rgba([255, 255, 255], 0.85 * live.presence)); g.addColorStop(0.25, rgba(c, (0.55 + 0.4 * live.centres) * live.presence)); g.addColorStop(1, rgba(c, 0));
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(50, y, pr * 3, 0, Math.PI * 2); ctx.fill();
        });
        ctx.restore();
      }
      // sparks
      for (const sp of sparks) {
        if (!reduce) sp.a += sp.s * dt * (0.4 + live.energy);
        const rr = R * sp.r * (1 + collapse * -0.4); const x = cx + Math.cos(sp.a) * rr, y = cy + Math.sin(sp.a) * rr * 1.15;
        ctx.fillStyle = rgba(mix(live.cols[(sp.z * 5) | 0], [255, 255, 255], 0.5), 0.25 + 0.5 * sp.z * live.presence);
        ctx.beginPath(); ctx.arc(x, y, 0.6 + sp.z * 1.4, 0, Math.PI * 2); ctx.fill();
      }
      if (!reduce && visible) raf = requestAnimationFrame(frame);
    };
    redraw.current = () => { if (reduce) frame(performance.now()); };
    const ro = new ResizeObserver(resize); ro.observe(cv); resize();
    const io = new IntersectionObserver(([e]) => { const was = visible; visible = e.isIntersecting && !document.hidden; if (visible && !was && !reduce) { last = performance.now(); raf = requestAnimationFrame(frame); } });
    io.observe(cv);
    const vis = () => { const was = visible; visible = !document.hidden; if (visible && !was && !reduce) { last = performance.now(); raf = requestAnimationFrame(frame); } };
    document.addEventListener("visibilitychange", vis);
    if (!reduce) raf = requestAnimationFrame(frame); else frame(performance.now());
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); document.removeEventListener("visibilitychange", vis); };
  }, [body]);
  return <canvas ref={ref} className={className} role="img" aria-label={label} data-aura={dataAura ? "" : undefined} />;
}

/** Soft ambient drone, generated live with WebAudio (no files). Off until the user turns it on. */
export class Ambient {
  private ctx: AudioContext | null = null; private gain: GainNode | null = null; private nodes: AudioScheduledSourceNode[] = [];
  start(rootHz = 110) {
    if (this.ctx) return;
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext; if (!AC) return;
    const ctx = new AC(); this.ctx = ctx;
    const master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination); this.gain = master;
    const filter = ctx.createBiquadFilter(); filter.type = "lowpass"; filter.frequency.value = 900; filter.Q.value = 0.6; filter.connect(master);
    [1, 1.5, 2, 2.997].forEach((m, i) => {
      const o = ctx.createOscillator(); o.type = i % 2 ? "sine" : "triangle"; o.frequency.value = rootHz * m; o.detune.value = (i - 1.5) * 4;
      const g = ctx.createGain(); g.gain.value = [0.22, 0.12, 0.08, 0.05][i];
      const lfo = ctx.createOscillator(); lfo.frequency.value = 0.05 + i * 0.03; const lg = ctx.createGain(); lg.gain.value = g.gain.value * 0.6; lfo.connect(lg); lg.connect(g.gain);
      o.connect(g); g.connect(filter); o.start(); lfo.start(); this.nodes.push(o, lfo);
    });
    master.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 2.5);
  }
  setRoot(rootHz: number) { if (!this.ctx) return; let k = 0; const ms = [1, 1.5, 2, 2.997]; this.nodes.forEach((n, i) => { if (i % 2 === 0 && n instanceof OscillatorNode) n.frequency.linearRampToValueAtTime(rootHz * ms[k++], this.ctx!.currentTime + 1.5); }); }
  stop() {
    const ctx = this.ctx; if (!ctx || !this.gain) return;
    this.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
    setTimeout(() => { this.nodes.forEach((n) => { try { n.stop(); } catch {} }); ctx.close(); }, 900);
    this.ctx = null; this.nodes = []; this.gain = null;
  }
}
