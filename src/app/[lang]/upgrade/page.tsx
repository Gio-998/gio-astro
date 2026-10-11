import { PAID_EXTRAS } from "@/lib/payments";
export const metadata = { title: "Extras", robots: { index: false } };
export default function Page() {
  return (
    <div>
      <h1 className="h-display mb-2 text-4xl text-gold">Extras (coming later)</h1>
      <p className="mb-6 text-dim">Everything in the app is free right now. These optional extras are planned. Prices will always be shown up front, with one-click cancel and real refunds.</p>
      <div className="grid gap-3">
        {PAID_EXTRAS.map((x) => (
          <div key={x.id} className="card"><div className="flex items-center justify-between"><p className="font-semibold">{x.name}</p><span className="chip">{x.price}</span></div><p className="text-sm text-dim">{x.description}</p><button className="btn-ghost mt-3" disabled>Not available yet</button></div>
        ))}
      </div>
    </div>
  );
}
