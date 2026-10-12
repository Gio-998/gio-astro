"use client";
import { PLAY_DIMS, type PlayProfile } from "@/engine/play";
import type { PlayContent } from "./content";
import { DIM_COL, playWords } from "./PlayCard";

/** 9:16 story card (1080×1920) for TikTok / Instagram stories. Drawn locally on a canvas, nothing uploaded. */
export async function renderPlayStory(profile: PlayProfile, P: PlayContent, name: string): Promise<Blob> {
  const W = 1080, H = 1920; const c = document.createElement("canvas"); c.width = W; c.height = H; const x = c.getContext("2d")!;
  const bg = x.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#1c1645"); bg.addColorStop(0.55, "#120f2e"); bg.addColorStop(1, "#2b2266"); x.fillStyle = bg; x.fillRect(0, 0, W, H);
  for (const [cx, cy, r, col] of [[200, 380, 520, "#8b6cf0"], [900, 1500, 560, "#f6b5cf"], [540, 900, 420, "#f6cf7a"]] as const) { const g = x.createRadialGradient(cx, cy, 0, cx, cy, r); g.addColorStop(0, col + "55"); g.addColorStop(1, col + "00"); x.fillStyle = g; x.fillRect(0, 0, W, H); }
  let seed = 11; const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  x.fillStyle = "rgba(255,255,255,.75)"; for (let i = 0; i < 140; i++) { x.beginPath(); x.arc(rnd() * W, rnd() * H, rnd() * 2 + 0.4, 0, 7); x.fill(); }
  x.textAlign = "center"; x.fillStyle = "#f6cf7a"; x.font = "600 38px Georgia, serif"; x.fillText(P.share.eyebrow.toUpperCase(), W / 2, 190);
  x.fillStyle = "#f5f1ff"; x.font = "italic 64px Georgia, serif"; x.fillText(name ? `${name}` : P.share.sub, W / 2, 280);
  x.font = "40px system-ui, sans-serif"; x.fillStyle = "#d9cdf5"; x.fillText(P.share.sub, W / 2, 345);
  // constellation
  const C = { x: W / 2, y: 820 }, R = 330;
  const at = (i: number, r: number) => { const a = ((-90 + i * (360 / PLAY_DIMS.length)) * Math.PI) / 180; return [C.x + r * Math.cos(a), C.y + r * Math.sin(a)]; };
  x.strokeStyle = "rgba(255,255,255,.12)"; x.lineWidth = 2; for (const k of [0.33, 0.66, 1]) { x.beginPath(); x.arc(C.x, C.y, R * k, 0, 7); x.stroke(); }
  const pts = PLAY_DIMS.map((d, i) => ({ d, i, v: profile.dims[d] })).filter((p) => p.v != null).map((p) => ({ ...p, xy: at(p.i, R * (0.16 + 0.84 * p.v! / 10)) }));
  if (pts.length >= 3) {
    const g = x.createRadialGradient(C.x, C.y, 0, C.x, C.y, R); g.addColorStop(0, "rgba(255,255,255,.75)"); g.addColorStop(0.45, "rgba(246,207,122,.55)"); g.addColorStop(1, "rgba(139,108,240,.35)");
    x.beginPath(); pts.forEach((p, k) => (k ? x.lineTo(p.xy[0], p.xy[1]) : x.moveTo(p.xy[0], p.xy[1]))); x.closePath(); x.fillStyle = g; x.shadowColor = "#f6cf7a"; x.shadowBlur = 50; x.fill(); x.shadowBlur = 0; x.strokeStyle = "#f6cf7a"; x.lineWidth = 4; x.stroke();
  }
  for (const p of pts) { x.beginPath(); x.arc(p.xy[0], p.xy[1], 13, 0, 7); x.fillStyle = DIM_COL[p.d]; x.shadowColor = DIM_COL[p.d]; x.shadowBlur = 24; x.fill(); x.shadowBlur = 0; }
  x.font = "30px system-ui, sans-serif"; PLAY_DIMS.forEach((d, i) => { const [lx, ly] = at(i, R + 70); x.fillStyle = profile.dims[d] != null ? "#ece6ff" : "rgba(236,230,255,.35)"; x.fillText(P.dims[d].name, lx, ly + 10); });
  // headline
  const words = playWords(profile.dims, P); const head = P.hub.headline(words);
  x.fillStyle = "#ffe3a8"; x.font = "700 68px Georgia, serif";
  const wrap = (t: string, max: number) => { const out: string[] = []; let line = ""; for (const w of t.split(" ")) { const s = line ? `${line} ${w}` : w; if (x.measureText(s).width > max && line) { out.push(line); line = w; } else line = s; } if (line) out.push(line); return out; };
  let y = 1330; for (const l of wrap(head, W - 160)) { x.fillText(l, W / 2, y); y += 80; }
  // top 4 pole bars
  const rows = PLAY_DIMS.filter((d) => profile.dims[d] != null).sort((a, b) => Math.abs(profile.dims[b]! - 5) - Math.abs(profile.dims[a]! - 5)).slice(0, 4);
  y += 20; x.font = "30px system-ui, sans-serif";
  for (const d of rows) {
    const v = profile.dims[d]!; const bx = 160, bw = W - 320;
    x.textAlign = "left"; x.fillStyle = "#bdb3e6"; x.fillText(P.dims[d].poles[0], bx, y); x.textAlign = "right"; x.fillText(P.dims[d].poles[1], bx + bw, y); x.textAlign = "center";
    x.fillStyle = "rgba(255,255,255,.12)"; x.beginPath(); x.roundRect(bx, y + 18, bw, 14, 7); x.fill();
    x.fillStyle = DIM_COL[d]; x.beginPath(); x.arc(bx + bw * v / 10, y + 25, 17, 0, 7); x.shadowColor = DIM_COL[d]; x.shadowBlur = 20; x.fill(); x.shadowBlur = 0;
    y += 92;
  }
  x.fillStyle = "#f3e9d2"; x.font = "600 36px Georgia, serif"; x.fillText(P.share.footer, W / 2, H - 110);
  return await new Promise((res) => c.toBlob((b) => res(b!), "image/png"));
}

export async function sharePlayStory(profile: PlayProfile, P: PlayContent, name: string) {
  const blob = await renderPlayStory(profile, P, name);
  const file = new File([blob], "play-mirror.png", { type: "image/png" });
  const nav = navigator as Navigator & { canShare?: (d: unknown) => boolean };
  if (nav.canShare?.({ files: [file] })) { try { await nav.share({ files: [file], title: P.share.sub }); return "shared"; } catch { /* cancelled */ } }
  const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "play-mirror.png"; a.click(); setTimeout(() => URL.revokeObjectURL(url), 2000);
  return "downloaded";
}
