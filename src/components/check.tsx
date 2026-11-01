"use client";
/** Apart from controls.tsx so the sign-in forms, which load with the site header, do not pull in the animation library. */
/** Styled checkbox (keeps a real input for forms, a11y and tests). */
export function Check({ checked, onChange, testId }: { checked: boolean; onChange: (v: boolean) => void; testId?: string }) {
  return (
    <span className="relative mt-0.5 inline-grid h-6 w-6 shrink-0 place-items-center">
      <input type="checkbox" data-testid={testId} checked={checked} onChange={(e) => onChange(e.target.checked)}
        className="peer absolute inset-0 h-6 w-6 cursor-pointer appearance-none rounded-lg border border-white/30 bg-white/5 transition checked:border-gold checked:bg-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold/70" />
      <span aria-hidden className="pointer-events-none relative text-sm font-bold text-night opacity-0 transition peer-checked:opacity-100">✓</span>
    </span>
  );
}
