"use client";
/** Client-side share cards (PNG via <canvas>) — no server, no cost. 1080×1350 (Instagram/TikTok friendly). */
export interface CardSpec {
  eyebrow: string;
  title: string;
  subtitle?: string;
  big?: string; // e.g. a score
  lines: string[];
  palette: string[];
  footer: string;
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const words = text.split(" "); const out: string[] = []; let line = "";
  for (const w of words) { const t = line ? `${line} ${w}` : w; if (ctx.measureText(t).width > maxW && line) { out.push(line); line = w; } else line = t; }
  if (line) out.push(line);
  return out;
}

export async function renderCard(spec: CardSpec): Promise<Blob> {
  const W = 1080, H = 1350;
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const ctx = c.getContext("2d")!;
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#0d0b1f"); bg.addColorStop(1, "#1d1840");
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  // soft palette orbs
  spec.palette.slice(0, 5).forEach((col, i) => {
    const g = ctx.createRadialGradient(180 + i * 190, 260 + (i % 2) * 120, 10, 180 + i * 190, 260 + (i % 2) * 120, 260);
    g.addColorStop(0, col + "cc"); g.addColorStop(1, col + "00");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  });
  // stars
  let seed = spec.title.length * 97;
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  for (let i = 0; i < 90; i++) { ctx.beginPath(); ctx.arc(rnd() * W, rnd() * H, rnd() * 1.8 + 0.3, 0, Math.PI * 2); ctx.fill(); }
  ctx.textAlign = "center"; ctx.fillStyle = "#f3e9d2";
  ctx.font = "600 34px Georgia, serif"; ctx.fillText(spec.eyebrow.toUpperCase(), W / 2, 560);
  ctx.font = "700 84px Georgia, serif";
  let y = 660;
  for (const l of wrap(ctx, spec.title, W - 140)) { ctx.fillText(l, W / 2, y); y += 92; }
  if (spec.subtitle) { ctx.font = "italic 40px Georgia, serif"; ctx.fillStyle = "#d9cdf5"; ctx.fillText(spec.subtitle, W / 2, y + 4); y += 70; }
  if (spec.big) { ctx.font = "700 150px Georgia, serif"; ctx.fillStyle = "#ffd98a"; ctx.fillText(spec.big, W / 2, y + 140); y += 190; }
  ctx.font = "36px system-ui, sans-serif"; ctx.fillStyle = "#ece6ff";
  y += 30;
  for (const line of spec.lines.slice(0, 7)) { for (const l of wrap(ctx, line, W - 180)) { ctx.fillText(l, W / 2, y); y += 50; } y += 8; }
  // palette bar
  const bw = 120; const sx = W / 2 - (spec.palette.length * bw) / 2;
  spec.palette.forEach((col, i) => { ctx.fillStyle = col; ctx.fillRect(sx + i * bw, H - 190, bw, 22); });
  ctx.font = "600 32px Georgia, serif"; ctx.fillStyle = "#f3e9d2"; ctx.fillText(spec.footer, W / 2, H - 100);
  return await new Promise((res) => c.toBlob((b) => res(b!), "image/png"));
}

export async function shareOrDownload(spec: CardSpec, filename: string): Promise<"shared" | "downloaded"> {
  const blob = await renderCard(spec);
  const file = new File([blob], filename, { type: "image/png" });
  const nav = navigator as Navigator & { canShare?: (d: unknown) => boolean };
  if (nav.canShare?.({ files: [file] })) {
    try { await nav.share({ files: [file], title: spec.title }); return "shared"; } catch { /* cancelled → fall through */ }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  return "downloaded";
}
