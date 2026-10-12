"use client";
/**
 * "Your sky today" share card: a personal, dark violet + gold image drawn on <canvas> in the browser.
 * story = 1080×1920 (text kept out of the top 250 / bottom 300 px story UI), square = 1080×1080.
 */
export interface SkyCardData {
  name: string;
  dateLine: string;       // "Monday, 12 October"
  eyebrow: string;        // "Your sky today"
  sunGlyph: string; sunLine: string;   // "♎" "Sun in Libra"
  moonGlyph: string; moonLine: string; // "♏" "Moon in Scorpio"
  moonAngle: number;      // 0..360 phase angle (0 new, 180 full)
  moonSignIndex: number;  // 0..11 for placing the Moon on the wheel
  sunSignIndex: number;
  headline: string;       // the transit line
  body: string;           // what it means
  chips: string[];        // ["Day 7", "64% lit", "The Star"]
  url: string;            // QR target (invite link or site)
  scan: string;
}
export type SkyFormat = "story" | "square";

const VIOLET_TOP = "#2b1a63", VIOLET_MID = "#170f3d", INK = "#0a0720";
const GOLD = "#f3cf7a", GOLD_DEEP = "#c99a3e", CREAM = "#fbf4e6", LILAC = "#d9cdfb";

const cssFont = (v: string, fb: string) => { const f = getComputedStyle(document.documentElement).getPropertyValue(v).trim(); return f ? `${f}, ${fb}` : fb; };
const TXT = "\uFE0E"; // text presentation for zodiac glyphs (never emoji)

function rng(seed: number) { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; }; }
function seedOf(t: string) { let h = 2166136261; for (let i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const out: string[] = []; let line = "";
  for (const w of text.split(/\s+/).filter(Boolean)) { const t = line ? `${line} ${w}` : w; if (ctx.measureText(t).width > maxW && line) { out.push(line); line = w; } else line = t; }
  if (line) out.push(line); return out;
}
function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
const goldGrad = (ctx: CanvasRenderingContext2D, x0: number, x1: number) => { const g = ctx.createLinearGradient(x0, 0, x1, 0); g.addColorStop(0, GOLD_DEEP); g.addColorStop(0.5, "#ffe3a3"); g.addColorStop(1, GOLD_DEEP); return g; };

async function qr(text: string, px: number): Promise<HTMLCanvasElement | null> {
  try {
    const { default: qrcode } = await import("qrcode-generator");
    const q = qrcode(0, "M"); q.addData(text); q.make();
    const n = q.getModuleCount(); const cell = Math.max(2, Math.floor(px / (n + 2))); const size = cell * (n + 2);
    const c = document.createElement("canvas"); c.width = c.height = size; const x = c.getContext("2d")!;
    x.fillStyle = CREAM; x.fillRect(0, 0, size, size); x.fillStyle = "#1a1240";
    for (let r = 0; r < n; r++) for (let k = 0; k < n; k++) if (q.isDark(r, k)) x.fillRect((k + 1) * cell, (r + 1) * cell, cell, cell);
    return c;
  } catch { return null; }
}

function background(ctx: CanvasRenderingContext2D, W: number, H: number, seed: number) {
  const bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, VIOLET_TOP); bg.addColorStop(0.55, VIOLET_MID); bg.addColorStop(1, INK);
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  const r = rng(seed);
  for (const [cx, cy, rad, col] of [[W * 0.2, H * 0.18, W * 0.7, "rgba(139,108,240,.32)"], [W * 0.9, H * 0.45, W * 0.6, "rgba(214,120,200,.16)"], [W * 0.5, H * 0.95, W * 0.8, "rgba(243,207,122,.10)"]] as const) {
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad); g.addColorStop(0, col); g.addColorStop(1, "rgba(0,0,0,0)"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }
  for (let i = 0; i < (W * H) / 5200; i++) {
    const x = r() * W, y = r() * H, s = r() < 0.06 ? 2.4 : r() * 1.4 + 0.4;
    ctx.fillStyle = r() < 0.18 ? `rgba(255,227,163,${0.5 + r() * 0.5})` : `rgba(255,255,255,${0.25 + r() * 0.6})`;
    ctx.beginPath(); ctx.arc(x, y, s, 0, 7); ctx.fill();
    if (s > 2) { ctx.strokeStyle = "rgba(255,240,210,.35)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x - 9, y); ctx.lineTo(x + 9, y); ctx.moveTo(x, y - 9); ctx.lineTo(x, y + 9); ctx.stroke(); }
  }
}

function moonDisc(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, angle: number) {
  ctx.save();
  const glow = ctx.createRadialGradient(x, y, r * 0.6, x, y, r * 2.4); glow.addColorStop(0, "rgba(255,240,205,.35)"); glow.addColorStop(1, "rgba(255,240,205,0)");
  ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(x, y, r * 2.4, 0, 7); ctx.fill();
  ctx.fillStyle = "#463b86"; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.strokeStyle = "rgba(255,241,207,.6)"; ctx.lineWidth = 2; ctx.stroke();
  // lit part: half disc + terminator ellipse
  const a = ((angle % 360) + 360) % 360; const waxing = a < 180; const k = Math.cos((a * Math.PI) / 180); // 1 new, -1 full
  ctx.fillStyle = "#fff1cf"; ctx.beginPath();
  ctx.arc(x, y, r, -Math.PI / 2, Math.PI / 2, !waxing);
  ctx.ellipse(x, y, Math.abs(k) * r, r, 0, Math.PI / 2, -Math.PI / 2, k > 0 ? waxing : !waxing);
  ctx.fill();
  ctx.restore();
}

function wheel(ctx: CanvasRenderingContext2D, cx: number, cy: number, R: number, d: SkyCardData, kin: string) {
  ctx.save();
  // halo
  const halo = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 1.25); halo.addColorStop(0, "rgba(139,108,240,.38)"); halo.addColorStop(1, "rgba(139,108,240,0)");
  ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(cx, cy, R * 1.25, 0, 7); ctx.fill();
  ctx.strokeStyle = goldGrad(ctx, cx - R, cx + R); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
  ctx.lineWidth = 1.5; ctx.globalAlpha = 0.6; ctx.beginPath(); ctx.arc(cx, cy, R * 0.8, 0, 7); ctx.stroke(); ctx.globalAlpha = 1;
  // 12 segments, ticks, small glyph dots
  for (let i = 0; i < 12; i++) {
    const t = (-90 + i * 30) * (Math.PI / 180);
    ctx.strokeStyle = "rgba(243,207,122,.55)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(cx + Math.cos(t) * R * 0.8, cy + Math.sin(t) * R * 0.8); ctx.lineTo(cx + Math.cos(t) * R, cy + Math.sin(t) * R); ctx.stroke();
    for (let m = 1; m < 6; m++) { const u = t + (m * 5 * Math.PI) / 180; ctx.beginPath(); ctx.moveTo(cx + Math.cos(u) * R * 0.95, cy + Math.sin(u) * R * 0.95); ctx.lineTo(cx + Math.cos(u) * R, cy + Math.sin(u) * R); ctx.lineWidth = 1; ctx.stroke(); }
  }
  // the sun sign segment glows
  const s0 = (-90 + d.sunSignIndex * 30) * (Math.PI / 180);
  ctx.fillStyle = "rgba(243,207,122,.16)"; ctx.beginPath(); ctx.arc(cx, cy, R, s0, s0 + Math.PI / 6); ctx.arc(cx, cy, R * 0.8, s0 + Math.PI / 6, s0, true); ctx.closePath(); ctx.fill();
  // sun glyph in the centre
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(243,207,122,.7)"; ctx.shadowBlur = R * 0.25;
  ctx.fillStyle = goldGrad(ctx, cx - R * 0.4, cx + R * 0.4); ctx.font = `400 ${Math.round(R * 0.78)}px ${kin}`;
  ctx.fillText(d.sunGlyph + TXT, cx, cy + R * 0.04);
  ctx.shadowBlur = 0;
  // the moon sits on the wheel at today's moon sign
  const mt = (-90 + d.moonSignIndex * 30 + 15) * (Math.PI / 180);
  moonDisc(ctx, cx + Math.cos(mt) * R * 0.9, cy + Math.sin(mt) * R * 0.9, R * 0.1, d.moonAngle);
  ctx.restore();
}

export async function renderSkyCard(d: SkyCardData, format: SkyFormat): Promise<HTMLCanvasElement> {
  const story = format === "story"; const W = 1080, H = story ? 1920 : 1080;
  const c = document.createElement("canvas"); c.width = W; c.height = H; const ctx = c.getContext("2d")!;
  const serif = cssFont("--font-cormorant", "Georgia, serif"), kin = cssFont("--font-unbounded", "system-ui, sans-serif"), sans = cssFont("--font-inter", "system-ui, sans-serif");
  try { await Promise.all([document.fonts.load(`600 90px ${serif}`, d.name + d.headline), document.fonts.load(`italic 500 48px ${serif}`, d.headline), document.fonts.load(`500 28px ${kin}`, d.eyebrow), document.fonts.load(`400 36px ${sans}`, d.body)]); } catch { /* fallbacks */ }
  background(ctx, W, H, seedOf(d.name + d.dateLine));
  const lc = ctx as CanvasRenderingContext2D & { letterSpacing?: string };

  // gold frame
  const inset = story ? 48 : 36; ctx.strokeStyle = "rgba(243,207,122,.45)"; ctx.lineWidth = 2; rr(ctx, inset, inset, W - inset * 2, H - inset * 2, 44); ctx.stroke();

  ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
  const top = story ? 250 : 96;
  // wordmark + date
  ctx.fillStyle = GOLD; ctx.font = `500 ${story ? 26 : 22}px ${kin}`; lc.letterSpacing = "8px";
  ctx.fillText("HOROSCOP", W / 2, top); lc.letterSpacing = "3px";
  ctx.fillStyle = LILAC; ctx.font = `400 ${story ? 26 : 22}px ${sans}`; ctx.fillText(d.dateLine.toUpperCase(), W / 2, top + (story ? 46 : 38)); lc.letterSpacing = "0px";

  if (story) {
    wheel(ctx, W / 2, top + 270, 180, d, kin);
    let y = top + 550;
    ctx.fillStyle = GOLD; ctx.font = `500 26px ${kin}`; lc.letterSpacing = "6px"; ctx.fillText(d.eyebrow.toUpperCase(), W / 2, y); lc.letterSpacing = "0px";
    y += 92; ctx.fillStyle = CREAM; ctx.font = `600 ${d.name.length > 14 ? 84 : 104}px ${serif}`; ctx.fillText(d.name, W / 2, y);
    y += 58; ctx.fillStyle = LILAC; ctx.font = `400 32px ${sans}`; ctx.fillText(`${d.sunGlyph}${TXT} ${d.sunLine}   ·   ${d.moonGlyph}${TXT} ${d.moonLine}`, W / 2, y);
    y += 70; chipsRow(ctx, d.chips, W / 2, y, 28, sans);
    // divider
    y += 76; ctx.strokeStyle = goldGrad(ctx, W / 2 - 160, W / 2 + 160); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(W / 2 - 160, y); ctx.lineTo(W / 2 + 160, y); ctx.stroke();
    ctx.fillStyle = GOLD; ctx.beginPath(); ctx.moveTo(W / 2, y - 9); ctx.lineTo(W / 2 + 9, y); ctx.lineTo(W / 2, y + 9); ctx.lineTo(W / 2 - 9, y); ctx.fill();
    const footY = H - 300 - 150;
    y += 90; ctx.fillStyle = CREAM; ctx.font = `italic 500 60px ${serif}`;
    for (const l of wrap(ctx, d.headline, W - 220).slice(0, 2)) { ctx.fillText(l, W / 2, y); y += 70; }
    y += 10; ctx.fillStyle = "#e9e2ff"; ctx.font = `400 34px ${sans}`;
    // whole sentences only, as many as fit above the footer
    let lines: string[] = [];
    for (const sent of d.body.match(/[^.!?]+[.!?]*/g) ?? []) { const next = wrap(ctx, [...lines, sent.trim()].join(" "), W - 240); if (y + next.length * 48 > footY - 40) break; lines = [lines.join(" "), sent.trim()].filter(Boolean); }
    for (const l of wrap(ctx, lines.join(" "), W - 240)) { ctx.fillText(l, W / 2, y); y += 48; }
    await footer(ctx, d, W, footY, 150, serif, sans);
  } else {
    // square: wheel left, text right
    wheel(ctx, 300, 470, 190, d, kin);
    ctx.textAlign = "left"; const x = 560, maxW = W - x - 90; let y = 330;
    ctx.fillStyle = GOLD; ctx.font = `500 22px ${kin}`; lc.letterSpacing = "5px"; ctx.fillText(d.eyebrow.toUpperCase(), x, y); lc.letterSpacing = "0px";
    y += 84; ctx.fillStyle = CREAM; ctx.font = `600 ${d.name.length > 10 ? 64 : 80}px ${serif}`; ctx.fillText(d.name, x, y);
    y += 50; ctx.fillStyle = LILAC; ctx.font = `400 27px ${sans}`; ctx.fillText(`${d.sunGlyph}${TXT} ${d.sunLine}`, x, y); y += 40; ctx.fillText(`${d.moonGlyph}${TXT} ${d.moonLine}`, x, y);
    y += 70; ctx.fillStyle = CREAM; ctx.font = `italic 500 44px ${serif}`;
    for (const l of wrap(ctx, d.headline, maxW).slice(0, 4)) { ctx.fillText(l, x, y); y += 52; }
    ctx.textAlign = "center";
    chipsRow(ctx, d.chips, W / 2, 800, 26, sans);
    await footer(ctx, d, W, H - 36 - 190, 150, serif, sans);
  }
  return c;
}

function chipsRow(ctx: CanvasRenderingContext2D, chips: string[], cx: number, y: number, fs: number, sans: string) {
  ctx.font = `500 ${fs}px ${sans}`; const padX = fs * 0.9, h = fs * 2.1, gap = 18;
  const ws = chips.map((t) => ctx.measureText(t).width + padX * 2); const total = ws.reduce((a, b) => a + b, 0) + gap * (chips.length - 1);
  let x = cx - total / 2; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  chips.forEach((t, i) => {
    rr(ctx, x, y - h / 2, ws[i], h, h / 2); ctx.fillStyle = "rgba(243,207,122,.10)"; ctx.fill(); ctx.strokeStyle = "rgba(243,207,122,.55)"; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = GOLD; ctx.fillText(t, x + ws[i] / 2, y + 1); x += ws[i] + gap;
  });
  ctx.textBaseline = "alphabetic";
}

async function footer(ctx: CanvasRenderingContext2D, d: SkyCardData, W: number, y: number, qs: number, serif: string, sans: string) {
  const code = await qr(d.url, qs); const x0 = 110;
  ctx.textAlign = "left";
  if (code) { rr(ctx, x0, y, qs, qs, 16); ctx.save(); ctx.clip(); ctx.drawImage(code, x0, y, qs, qs); ctx.restore(); }
  const tx = code ? x0 + qs + 40 : x0;
  ctx.fillStyle = goldGrad(ctx, tx, tx + 300); ctx.font = `600 ${qs >= 150 ? 58 : 50}px ${serif}`; ctx.fillText("horoscop.si", tx, y + qs * 0.48);
  ctx.fillStyle = LILAC; ctx.font = `400 ${qs >= 150 ? 30 : 26}px ${sans}`; ctx.fillText(d.scan, tx, y + qs * 0.8);
  ctx.textAlign = "center";
}

export const canvasBlob = (c: HTMLCanvasElement) => new Promise<Blob>((res) => c.toBlob((b) => res(b!), "image/png"));
