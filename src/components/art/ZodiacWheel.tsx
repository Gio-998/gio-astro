import { SIGNS, SIGN_GLYPH } from "@/engine/zodiac";

/** The wheel's line work, rendered once into the page sprite (SvgDefs). */
export function wheelBody() {
  const R = 200;
  const f = (n: number) => Math.round(n * 100) / 100;
  return (
    <>
      <g fill="none" stroke="url(#zw-g)">
        <circle cx={R} cy={R} r="196" strokeWidth=".8" strokeOpacity=".7" />
        <circle cx={R} cy={R} r="186" strokeWidth=".5" strokeOpacity=".5" />
        <circle cx={R} cy={R} r="146" strokeWidth=".8" strokeOpacity=".6" />
        <circle cx={R} cy={R} r="100" strokeWidth=".5" strokeOpacity=".35" strokeDasharray="2 5" />
        <circle cx={R} cy={R} r="54" strokeWidth=".6" strokeOpacity=".4" />
        {Array.from({ length: 72 }, (_, i) => {
          const a = (i * 5 * Math.PI) / 180; const r1 = i % 6 === 0 ? 146 : 180;
          return <line key={i} x1={f(R + Math.cos(a) * r1)} y1={f(R + Math.sin(a) * r1)} x2={f(R + Math.cos(a) * 186)} y2={f(R + Math.sin(a) * 186)} strokeWidth={i % 6 === 0 ? 0.8 : 0.4} strokeOpacity=".55" />;
        })}
        {/* aspect star */}
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i * 30 * Math.PI) / 180, b = ((i * 30 + 120) * Math.PI) / 180;
          return <line key={`s${i}`} x1={f(R + Math.cos(a) * 100)} y1={f(R + Math.sin(a) * 100)} x2={f(R + Math.cos(b) * 100)} y2={f(R + Math.sin(b) * 100)} strokeWidth=".4" strokeOpacity=".3" />;
        })}
      </g>
      {SIGNS.map((s, i) => {
        const a = ((i * 30 + 15 - 90) * Math.PI) / 180;
        return <text key={s} x={f(R + Math.cos(a) * 166)} y={f(R + Math.sin(a) * 166 + 7)} textAnchor="middle" fontSize="20" fill="url(#zw-g)" fontFamily="serif">{SIGN_GLYPH[s]}</text>;
      })}
      <circle cx={R} cy={R} r="6" fill="#f6cf7a" />
    </>
  );
}

/** Gilded thin-line zodiac wheel (decorative). Rotation via CSS class from caller. */
export function ZodiacWheel({ className = "" }: { className?: string }) {
  return <svg viewBox="0 0 400 400" className={className} aria-hidden><use href="#zodiac-wheel" /></svg>;
}
