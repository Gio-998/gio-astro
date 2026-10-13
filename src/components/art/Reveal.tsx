/** Content wrapper. Previously a scroll-reveal; content is now always visible so nothing can stay hidden on iOS. */
export function Reveal({ children, className = "" }: { children: React.ReactNode; delay?: number; className?: string; y?: number }) {
  return <div data-reveal className={className}>{children}</div>;
}
