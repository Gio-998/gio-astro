/** Server-rendered heading and text for a tool page: crawlers and slow phones get them in the HTML, and the client view replaces them on load, so there is one h1 at any time. */
export function StaticIntro({ title, lead, text }: { title: string; lead?: string; text: string }) {
  return (
    <div className="mx-auto max-w-xl py-6 text-center" data-testid="static-intro">
      <h1 className="h-display mb-2 text-4xl"><span className="text-aurora">{title}</span></h1>
      {lead && <p className="mb-2 text-mist/85">{lead}</p>}
      <p className="text-dim">{text}</p>
    </div>
  );
}
