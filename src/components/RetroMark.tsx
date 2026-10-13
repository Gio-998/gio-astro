/** Retrograde marker. A boxed "R" in the UI font instead of the ℞ glyph, which many fonts lack (it fell back to a "я"-like shape). */
export function RetroMark({ label, className = "" }: { label?: string; className?: string }) {
  return (
    <abbr title={label} aria-label={label} aria-hidden={label ? undefined : true} className={`ml-1 inline-flex h-[15px] min-w-[15px] items-center justify-center rounded-[4px] border border-gold/55 px-[3px] align-[1px] font-sans text-[9.5px] font-semibold not-italic leading-none text-gold no-underline ${className}`} data-testid="retro-mark">R</abbr>
  );
}
