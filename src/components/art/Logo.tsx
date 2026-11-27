export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <circle cx="20" cy="20" r="18" fill="none" stroke="url(#lg-g)" strokeWidth="1.2" />
      <path d="M26 9 A12 12 0 1 0 26 31 A9.5 12 0 1 1 26 9 Z" fill="url(#lg-g)" opacity=".9" />
      <path d="M27 17 l1 3 3 1 -3 1 -1 3 -1 -3 -3 -1 3 -1z" fill="#fffaf0" />
    </svg>
  );
}
