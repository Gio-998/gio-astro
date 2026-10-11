/** Shared gradients for all line-art (rendered once, visible, zero-size — gradients inside display:none SVGs don't paint in Chrome). */
export function SvgDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden focusable="false">
      <defs>
        <linearGradient id="em-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffe7b0" /><stop offset=".6" stopColor="#f6cf7a" /><stop offset="1" stopColor="#f6b5cf" /></linearGradient>
        <linearGradient id="zw-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffe7b0" /><stop offset=".5" stopColor="#f6cf7a" /><stop offset="1" stopColor="#f6b5cf" /></linearGradient>
        <linearGradient id="lg-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffe7b0" /><stop offset=".6" stopColor="#f6cf7a" /><stop offset="1" stopColor="#f6b5cf" /></linearGradient>
        <linearGradient id="sa-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffe7b0" /><stop offset="1" stopColor="#e9b44c" /></linearGradient>
        <filter id="sa-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
    </svg>
  );
}
