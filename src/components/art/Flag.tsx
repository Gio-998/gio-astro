/** Inline SVG flags (Windows does not render flag emoji). Decorative: the language name is always given as text or aria-label. */
export function Flag({ code, className = "" }: { code: string; className?: string }) {
  const common = { className: `inline-block shrink-0 overflow-hidden rounded-[3px] ${className}`, "aria-hidden": true as const, focusable: "false" as const };
  if (code === "de") return (
    <svg viewBox="0 0 5 3" {...common}><rect width="5" height="1" y="0" fill="#000" /><rect width="5" height="1" y="1" fill="#DD0000" /><rect width="5" height="1" y="2" fill="#FFCE00" /></svg>
  );
  if (code === "sr") return (
    <svg viewBox="0 0 5 3" {...common}><rect width="5" height="1" y="0" fill="#C6363C" /><rect width="5" height="1" y="1" fill="#0C4076" /><rect width="5" height="1" y="2" fill="#fff" /></svg>
  );
  if (code === "sl") return (
    // The coat of arms sits on the hoist side across the white and blue stripes, as on the real flag; without it the tricolour reads as Russia's.
    <svg viewBox="0 0 30 18" {...common}>
      <rect width="30" height="6" y="0" fill="#fff" /><rect width="30" height="6" y="6" fill="#0053A5" /><rect width="30" height="6" y="12" fill="#ED1C24" />
      <path d="M5 2.4h6v5.1c0 2-1.4 3.2-3 3.6-1.6-.4-3-1.6-3-3.6z" fill="#0053A5" stroke="#ED1C24" strokeWidth=".7" />
      <path d="M5.6 9.1l1.4-2.2.6.7.4-.9.4.9.6-.7 1.4 2.2z" fill="#fff" />
      <path d="M6.2 8.7q.45-.3.9 0t.9 0 .9 0 .9 0" fill="none" stroke="#0053A5" strokeWidth=".3" />
      <g fill="#FFDD00"><circle cx="7" cy="3.7" r=".45" /><circle cx="9" cy="3.7" r=".45" /><circle cx="8" cy="4.6" r=".45" /></g>
    </svg>
  );
  if (code === "mk") return (
    <svg viewBox="0 0 28 14" {...common}>
      <rect width="28" height="14" fill="#D20000" />
      <g fill="#FFE600">
        <path d="M0 0h4.2L14 6.1 23.8 0H28L0 14h4.2L14 7.9 23.8 14H28z" />
        <path d="M0 5.6v2.8L14 7zM28 5.6v2.8L14 7zM12.6 0h2.8L14 7zM12.6 14h2.8L14 7z" />
        <circle cx="14" cy="7" r="3.1" fill="#D20000" />
        <circle cx="14" cy="7" r="2.6" />
      </g>
    </svg>
  );
  return (
    <svg viewBox="0 0 60 30" {...common}>
      <clipPath id="uk-c"><path d="M30 15h30v15zv15H0zH0V0zV0h30z" /></clipPath>
      <path d="M0 0v30h60V0z" fill="#012169" />
      <path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6" />
      <path d="M0 0l60 30m0-30L0 30" clipPath="url(#uk-c)" stroke="#C8102E" strokeWidth="4" />
      <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
      <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}
