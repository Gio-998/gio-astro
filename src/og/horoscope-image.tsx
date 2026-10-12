/* eslint-disable @next/next/no-img-element -- Satori renders plain <img> into the share PNG */
/** Share images for the daily horoscope: 1200x630 (OG/link preview) and 1080x1920 (story). Rendered at build time. */
import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { reading, bankFor } from "@/lib/horoscope";
import { signHeroSvg, svgDataUri, moonPath } from "@/components/horoscope/art";
import type { Sign } from "@/engine/zodiac";
import { getContent } from "@/content";

const font = (f: string) => fs.readFileSync(path.join(process.cwd(), "src/og/fonts", f));
const FONTS = () => [
  { name: "Cormorant", data: font("cormorant-600.ttf"), weight: 600 as const, style: "normal" as const },
  { name: "Inter", data: font("inter-500.ttf"), weight: 500 as const, style: "normal" as const },
];
const GOLD = "#e9c78a", MIST = "#ece7ff", BG = "linear-gradient(165deg, #251c5c 0%, #140f36 55%, #0b0920 100%)";

export function horoscopeImage(lang: string, sign: Sign, iso: string, fmt: "wide" | "story") {
  const r = reading(lang, sign, iso); const brand = getContent(lang).site.brand;
  const art = svgDataUri(signHeroSvg(sign, r.sky.moon.angle, { moon: false }));
  const moon = svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"><circle cx="16" cy="16" r="15" fill="#1b1640" stroke="${GOLD}" stroke-opacity=".6"/><path d="${moonPath(r.sky.moon.angle, 16, 16, 13)}" fill="#f6ecd2"/></svg>`);
  const eyebrow = `${bankFor(lang).ui.hubTitle.toUpperCase()}  ·  ${r.dateLabel.toUpperCase()}`;
  if (fmt === "wide") return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: BG, fontFamily: "Inter", color: MIST, position: "relative" }}>
      <div style={{ position: "absolute", right: -60, top: -20, width: 640, height: 640, display: "flex" }}><img src={art} width={640} height={640} alt="" /></div>
      <div style={{ display: "flex", flexDirection: "column", padding: "64px 72px", width: 720, height: "100%" }}>
        <div style={{ fontSize: 20, letterSpacing: 3, color: GOLD, display: "flex" }}>{eyebrow}</div>
        <div style={{ fontFamily: "Cormorant", fontSize: 96, lineHeight: 1, marginTop: 18, display: "flex" }}>{r.signName}</div>
        <div style={{ fontFamily: "Cormorant", fontSize: 46, lineHeight: 1.12, marginTop: 26, color: GOLD, display: "flex" }}>{r.headline}</div>
        <div style={{ display: "flex", alignItems: "center", marginTop: "auto", fontSize: 24, color: "#c9c0e8" }}>
          <img src={moon} width={34} height={34} alt="" style={{ marginRight: 14 }} />{r.moonLine}
        </div>
        <div style={{ display: "flex", marginTop: 18, fontSize: 24, color: GOLD, letterSpacing: 3 }}>{brand.toUpperCase()}</div>
      </div>
    </div>, { width: 1200, height: 630, fonts: FONTS() });
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", background: BG, fontFamily: "Inter", color: MIST, padding: "150px 90px 120px" }}>
      <div style={{ fontSize: 30, letterSpacing: 5, color: GOLD, display: "flex" }}>{eyebrow}</div>
      <div style={{ display: "flex", width: 760, height: 760, marginTop: 40 }}><img src={art} width={760} height={760} alt="" /></div>
      <div style={{ fontFamily: "Cormorant", fontSize: 64, marginTop: 20, display: "flex" }}>{r.signName}</div>
      <div style={{ fontFamily: "Cormorant", fontSize: 70, lineHeight: 1.1, marginTop: 34, color: GOLD, textAlign: "center", display: "flex", justifyContent: "center" }}>{r.headline}</div>
      <div style={{ fontSize: 32, lineHeight: 1.4, marginTop: 34, color: "#d8d1f2", textAlign: "center", display: "flex", justifyContent: "center" }}>{r.love[0]}</div>
      <div style={{ display: "flex", alignItems: "center", marginTop: "auto", fontSize: 28, color: "#c9c0e8" }}><img src={moon} width={40} height={40} alt="" style={{ marginRight: 16 }} />{r.moonLine}</div>
      <div style={{ display: "flex", marginTop: 26, fontSize: 30, color: GOLD, letterSpacing: 4 }}>{brand.toUpperCase()}</div>
    </div>, { width: 1080, height: 1920, fonts: FONTS() });
}
