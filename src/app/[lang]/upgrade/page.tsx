import { pageMeta } from "@/lib/page-meta";
import { PageHero } from "@/components/ui";
import { PAID_EXTRAS } from "@/lib/payments";
import { getContent } from "@/content";
export const generateMetadata = pageMeta("upgrade", { robots: { index: false } });
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const U = getContent((await params).lang).ui.extras;
  return (
    <div>
      <PageHero eyebrow={U.eyebrow} emblem="tarot" img="pillars" title={<>{U.titleA}<span className="italic text-aurora">{U.titleB}</span></>} sub={U.sub} />
      <div className="grid gap-4 sm:grid-cols-2">
        {PAID_EXTRAS.map((p) => ({ ...p, ...U.items[p.id] })).map((x) => (
          <div key={x.id} className="card card-hover"><div className="flex items-center justify-between"><p className="h-display text-2xl">{x.name}</p><span className="chip">{x.price}</span></div><p className="text-sm text-dim">{x.description}</p><button className="btn-ghost mt-3" disabled>{U.notYet}</button></div>
        ))}
      </div>
    </div>
  );
}
