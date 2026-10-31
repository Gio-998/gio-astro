import Link from "next/link";

/** Section heading for the home page: small label, serif title, one line of text, and an optional link at the right. */
export function SectionHead({ id, eyebrow, title, sub, link }: { id: string; eyebrow?: string; title: React.ReactNode; sub?: string; link?: { href: string; label: string } }) {
  return (
    <div className="mb-5 flex flex-col gap-1 sm:mb-6 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
      <div className="min-w-0 max-w-xl">
        {eyebrow && <p className="eyebrow mb-1.5 text-[11px]">{eyebrow}</p>}
        <h2 id={id} className="h-display text-[clamp(1.95rem,4.2vw,2.75rem)]! font-medium leading-[1.1]!">{title}</h2>
        {sub && <p className="mt-2 text-[15.5px] leading-relaxed text-mist/75">{sub}</p>}
      </div>
      {link && <Link href={link.href} className="inline-flex min-h-[44px] shrink-0 items-center whitespace-nowrap text-sm text-gold underline-offset-4 hover:underline">{link.label} →</Link>}
    </div>
  );
}

/** Links a section down to its pages: tall enough to tap, and it wraps instead of scrolling sideways. */
export function Pills({ items }: { items: { href: string; label: string; strong?: boolean }[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((x) => (
        <li key={x.href}>
          <Link href={x.href} className={`flex min-h-[44px] items-center rounded-full border px-4 text-[14.5px] transition ${x.strong ? "border-gold/45 bg-gold/[0.08] text-gold hover:border-gold/70" : "border-white/12 bg-white/[0.04] text-mist/85 hover:border-gold/50 hover:text-gold"}`}>{x.label}</Link>
        </li>
      ))}
    </ul>
  );
}

export function Ornament({ light = false }: { light?: boolean }) {
  const c = light ? "#b8862e" : "#f6cf7a";
  return (
    <svg viewBox="0 0 200 16" className="mx-auto h-4 w-48" aria-hidden>
      <line x1="0" y1="8" x2="82" y2="8" stroke={c} strokeOpacity=".6" />
      <line x1="118" y1="8" x2="200" y2="8" stroke={c} strokeOpacity=".6" />
      <path d="M100 0 l3 5 5 3 -5 3 -3 5 -3 -5 -5 -3 5 -3z" fill={c} />
      <circle cx="88" cy="8" r="1.6" fill={c} /><circle cx="112" cy="8" r="1.6" fill={c} />
    </svg>
  );
}
