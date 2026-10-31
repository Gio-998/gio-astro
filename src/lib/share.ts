"use client";
/**
 * Client-side share cards (PNG via <canvas>), no server, no cost.
 * Default: 1080×1920 story format (TikTok / Instagram / Telegram stories) with the Living Sky as background,
 * a QR code + short link, and text kept inside the story safe zone (top 250px, bottom 340px are covered by app UI).
 * "post" variant: 1080×1350.
 */
export interface CardSpec {
  eyebrow: string;
  title: string;
  subtitle?: string;
  big?: string; // e.g. a score or a number
  lines: string[];
  palette: string[];
  footer?: string;
  /** Optional live canvas (e.g. their aura) drawn as the hero art. */
  image?: () => HTMLCanvasElement | null;
  /** Optional SVG markup (e.g. moon, emblem, card) drawn as the hero art. */
  svg?: () => string | null;
  /** Where the QR code points (defaults to the site home for the current language). */
  url?: string;
  /** Caption under the QR code. */
  scan?: string;
  format?: "story" | "post";
}

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://horoscop.si").replace(/\/$/, "");

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const words = text.split(/\s+/).filter(Boolean); const out: string[] = []; let line = "";
  for (const w of words) { const t = line ? `${line} ${w}` : w; if (ctx.measureText(t).width > maxW && line) { out.push(line); line = w; } else line = t; }
  if (line) out.push(line);
  return out;
}
const cssFont = (v: string, fb: string) => { const f = typeof window !== "undefined" ? getComputedStyle(document.documentElement).getPropertyValue(v).trim() : ""; return f ? `${f}, ${fb}` : fb; };

async function svgImage(markup: string, size: number): Promise<HTMLImageElement | null> {
  try {
    let s = markup.includes("xmlns=") ? markup : markup.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
    // line-art uses the page's shared gradients and sprite (components/art/SvgDefs): inline them so the standalone image paints
    const defs = document.querySelector("svg[aria-hidden] > defs #em-g")?.parentElement?.outerHTML;
    if (defs && /url\(#|<use\b/.test(s)) s = s.replace(/(<svg[^>]*>)/, `$1${defs}`);
    s = s.replace(/<svg([^>]*?)\sclass="[^"]*"/, "<svg$1").replace("<svg", `<svg width="${size}" height="${size}"`);
    const img = new Image(); img.decoding = "async";
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(s);
    await img.decode(); return img;
  } catch { return null; }
}

async function qrCanvas(text: string, px: number): Promise<HTMLCanvasElement | null> {
  try {
    const { default: qrcode } = await import("qrcode-generator");
    const q = qrcode(0, "M"); q.addData(text); q.make();
    const n = q.getModuleCount(); const cell = Math.floor(px / (n + 2)); const size = cell * (n + 2);
    const c = document.createElement("canvas"); c.width = c.height = size; const x = c.getContext("2d")!;
    x.fillStyle = "#fffaf0"; x.fillRect(0, 0, size, size); x.fillStyle = "#1c1645";
    for (let r = 0; r < n; r++) for (let k = 0; k < n; k++) if (q.isDark(r, k)) x.fillRect((k + 1) * cell, (r + 1) * cell, cell, cell);
    return c;
  } catch { return null; }
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}

export async function renderCard(spec: CardSpec): Promise<Blob> {
  const story = spec.format !== "post";
  const W = 1080, H = story ? 1920 : 1350;
  const SAFE_T = story ? 250 : 70, SAFE_B = story ? H - 340 : H - 60;
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const ctx = c.getContext("2d")!;
  const serif = cssFont("--font-cormorant", "Georgia, serif"), kin = cssFont("--font-unbounded", "system-ui, sans-serif"), sans = cssFont("--font-inter", "system-ui, sans-serif");
  try { await Promise.all([document.fonts.load(`600 84px ${serif}`, spec.title), document.fonts.load(`700 150px ${kin}`, spec.big || "1"), document.fonts.load(`400 36px ${sans}`, spec.lines.join(" ") || "a")]); } catch { /* use fallbacks */ }

  // 1) Living Sky background (same shader as the app), else a matching gradient
  let sky: HTMLCanvasElement | null = null;
  try { const { renderSkyStill } = await import("@/components/sky/engine"); sky = renderSkyStill(W, H, spec.palette.length >= 3 ? [spec.palette[0], spec.palette[2], spec.palette[1]] : spec.palette, spec.title.length * 31 + (spec.big?.length ?? 0)); } catch { /* no WebGL */ }
  if (sky) ctx.drawImage(sky, 0, 0, W, H);
  else {
    const bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#1b1541"); bg.addColorStop(1, "#0c0a21"); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    spec.palette.slice(0, 4).forEach((col, i) => { const g = ctx.createRadialGradient(200 + i * 230, 420 + (i % 2) * 380, 10, 200 + i * 230, 420 + (i % 2) * 380, 520); g.addColorStop(0, col + "88"); g.addColorStop(1, col + "00"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); });
  }
  // legibility veil behind the text block
  const veil = ctx.createLinearGradient(0, H * 0.3, 0, H); veil.addColorStop(0, "rgba(10,8,30,0)"); veil.addColorStop(0.45, "rgba(10,8,30,.55)"); veil.addColorStop(1, "rgba(10,8,30,.82)");
  ctx.fillStyle = veil; ctx.fillRect(0, 0, W, H);

  // 2) hero art (aura canvas or SVG), centred in the upper half
  const artBox = story ? { y: SAFE_T + 20, h: 560 } : { y: 60, h: 420 };
  const img = spec.image?.();
  const noArt = !img && !spec.svg;
  if (noArt && spec.big) { // a big number / score becomes the hero art
    ctx.save(); ctx.textAlign = "center"; ctx.font = `700 ${spec.big.length > 2 ? 300 : 460}px ${kin}`;
    const g = ctx.createLinearGradient(W / 2 - 260, 0, W / 2 + 260, 0); g.addColorStop(0, "#5ee6d0"); g.addColorStop(0.35, "#c9b8ff"); g.addColorStop(0.7, "#ff8fc7"); g.addColorStop(1, "#ffc861");
    ctx.fillStyle = g; ctx.shadowColor = "rgba(255,143,199,.45)"; ctx.shadowBlur = 80; ctx.fillText(spec.big, W / 2, artBox.y + artBox.h * 0.82); ctx.restore();
  }
  if (img && img.width > 0) { const s = Math.min(760 / img.width, artBox.h / img.height); const w = img.width * s, h = img.height * s; ctx.globalCompositeOperation = "lighter"; ctx.drawImage(img, (W - w) / 2, artBox.y + (artBox.h - h) / 2, w, h); ctx.globalCompositeOperation = "source-over"; }
  else {
    const markup = spec.svg?.();
    const art = markup ? await svgImage(markup, artBox.h) : null;
    if (art) { ctx.save(); ctx.shadowColor = "rgba(255,200,97,.45)"; ctx.shadowBlur = 60; ctx.drawImage(art, (W - artBox.h) / 2, artBox.y, artBox.h, artBox.h); ctx.restore(); }
  }

  // 3) text block
  ctx.textAlign = "center";
  let y = artBox.y + artBox.h + (story ? 90 : 70);
  ctx.fillStyle = "#ffc861"; ctx.font = `500 27px ${kin}`;
  const lc = ctx as CanvasRenderingContext2D & { letterSpacing?: string }; lc.letterSpacing = "5px";
  for (const l of wrap(ctx, spec.eyebrow.toUpperCase(), W - 220).slice(0, 2)) { ctx.fillText(l, W / 2, y); y += 44; }
  lc.letterSpacing = "0px";
  y += 56;
  ctx.fillStyle = "#fbf6ef"; ctx.font = `600 ${spec.title.length > 28 ? 76 : 92}px ${serif}`;
  for (const l of wrap(ctx, spec.title, W - 150).slice(0, 3)) { ctx.fillText(l, W / 2, y); y += spec.title.length > 28 ? 84 : 98; }
  if (spec.subtitle) { ctx.font = `italic 500 46px ${serif}`; ctx.fillStyle = "#e6dcff"; for (const l of wrap(ctx, spec.subtitle, W - 180).slice(0, 2)) { ctx.fillText(l, W / 2, y + 6); y += 58; } y += 14; }
  if (spec.big && !noArt) {
    ctx.font = `700 ${spec.big.length > 3 ? 150 : 210}px ${kin}`;
    const g = ctx.createLinearGradient(W / 2 - 220, 0, W / 2 + 220, 0); g.addColorStop(0, "#5ee6d0"); g.addColorStop(0.35, "#c9b8ff"); g.addColorStop(0.7, "#ff8fc7"); g.addColorStop(1, "#ffc861");
    ctx.fillStyle = g; ctx.fillText(spec.big, W / 2, y + (spec.big.length > 3 ? 150 : 200)); y += spec.big.length > 3 ? 200 : 250;
  }
  ctx.font = `400 38px ${sans}`; ctx.fillStyle = "#efe9ff"; y += 20;
  const qrTop = story ? SAFE_B - 250 : SAFE_B - 170;
  for (const line of spec.lines) {
    const ls = wrap(ctx, line, W - 200);
    if (y + ls.length * 54 > qrTop - 40) break;
    for (const l of ls) { ctx.fillText(l, W / 2, y); y += 54; }
    y += 12;
  }

  // 4) QR + short link (inside the safe zone so story UI never covers it)
  const lang = typeof document !== "undefined" ? document.documentElement.lang || "en" : "en";
  const url = spec.url || `${SITE}/${lang}/?ref=story`;
  const qrSize = story ? 220 : 150;
  const qr = await qrCanvas(url, qrSize);
  const palH = 14, palW = 90;
  if (qr) {
    const panelW = W - 160, panelH = qrSize + 40, px = 80, py = qrTop;
    ctx.save(); roundRect(ctx, px, py, panelW, panelH, 36); ctx.fillStyle = "rgba(20,16,52,.62)"; ctx.fill(); ctx.strokeStyle = "rgba(255,255,255,.18)"; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
    ctx.save(); roundRect(ctx, px + 20, py + 20, qrSize, qrSize, 18); ctx.clip(); ctx.drawImage(qr, px + 20, py + 20, qrSize, qrSize); ctx.restore();
    ctx.textAlign = "left"; const tx = px + qrSize + 56;
    ctx.fillStyle = "#ffc861"; ctx.font = `600 50px ${serif}`; ctx.fillText(spec.footer || "horoscop.si", tx, py + 82);
    ctx.fillStyle = "#d8cff5"; ctx.font = `400 30px ${sans}`;
    wrap(ctx, spec.scan || "", panelW - qrSize - 90).slice(0, 2).forEach((l, i) => ctx.fillText(l, tx, py + 132 + i * 40));
    spec.palette.slice(0, 5).forEach((col, i) => { ctx.fillStyle = col; roundRect(ctx, tx + i * (palW + 10), py + panelH - 44, palW, palH, 7); ctx.fill(); });
    ctx.textAlign = "center";
  } else {
    ctx.font = `600 40px ${serif}`; ctx.fillStyle = "#ffc861"; ctx.fillText(spec.footer || "horoscop.si", W / 2, SAFE_B - 40);
  }
  return await new Promise((res) => c.toBlob((b) => res(b!), "image/png"));
}

export type ShareResult = "shared" | "downloaded" | "cancelled";

export async function shareOrDownload(spec: CardSpec, filename: string): Promise<ShareResult> {
  const blob = await renderCard(spec);
  const file = new File([blob], filename.endsWith(".png") ? filename : `${filename}.png`, { type: "image/png" });
  const nav = navigator as Navigator & { canShare?: (d: unknown) => boolean };
  if (nav.canShare?.({ files: [file] })) {
    try { await nav.share({ files: [file], title: spec.title }); return "shared"; }
    catch (e) { if ((e as Error)?.name === "AbortError") return "cancelled"; /* other errors → download */ }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = file.name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  return "downloaded";
}
