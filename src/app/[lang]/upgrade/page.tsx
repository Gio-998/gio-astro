import { PageHero } from "@/components/ui";
import { PAID_EXTRAS } from "@/lib/payments";
export const metadata = { title: "Extras", robots: { index: false } };
export default function Page() {
  return (
    <div>
      <PageHero eyebrow="Coming later" emblem="tarot" img="pillars" title={<>Extras, <span className="italic text-aurora">honestly priced</span></>} sub="Everything in the app is free right now. These optional extras are planned. Prices will always be shown up front, with one-click cancel and real refunds." />
      <div className="grid gap-4 sm:grid-cols-2">
        {PAID_EXTRAS.map((x) => (
          <div key={x.id} className="card card-hover"><div className="flex items-center justify-between"><p className="h-display text-2xl">{x.name}</p><span className="chip">{x.price}</span></div><p className="text-sm text-dim">{x.description}</p><button className="btn-ghost mt-3" disabled>Not available yet</button></div>
        ))}
      </div>
    </div>
  );
}
