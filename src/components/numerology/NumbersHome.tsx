import Link from "next/link";
import { numContent } from "@/content/numerology";
import { localizedPath } from "@/lib/i18n-routes";

const TOP = ["111", "222", "333", "444", "555", "777", "888", "1111", "1212", "1234"];
/** Homepage strip: the most searched angel numbers as slim pills, plus the calculator. One line; scrolls sideways on phones. */
export function NumbersHome({ lang }: { lang: string }) {
  const U = numContent(lang).ui; const p = (x: string) => localizedPath(lang, x);
  return (
    <section className="pb-6 sm:pb-8" aria-labelledby="numbers-home">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div className="min-w-0"><p className="eyebrow text-[11px]">✦ {U.homeEyebrow}</p><h2 id="numbers-home" className="h-display text-balance text-[1.7rem]! leading-tight! sm:text-[2.2rem]!">{U.homeTitle}</h2><p className="mt-1 text-[13.5px] text-mist/70">{U.homeSub}</p></div>
        <Link href={p("/numerology/")} className="shrink-0 whitespace-nowrap text-[13px] text-gold underline-offset-4 hover:underline">{U.see} →</Link>
      </div>
      <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] [mask-image:linear-gradient(90deg,#000_88%,transparent)] sm:mx-0 sm:px-0 sm:[mask-image:none]">
        <ul className="flex w-max gap-2 sm:w-full sm:flex-wrap">
          <li><Link href={p("/numerology/calculator/life-path/")} className="flex h-10 items-center gap-1.5 whitespace-nowrap rounded-full border border-gold/40 bg-gold/[0.08] px-3.5 text-[13px] text-gold transition hover:border-gold/70">∑ {U.calc.tryLife}</Link></li>
          {TOP.map((n) => <li key={n}><Link href={p(`/numerology/angel-numbers/${n}/`)} className="flex h-10 items-center whitespace-nowrap rounded-full border border-white/12 bg-white/[0.05] px-3.5 font-display text-[15px] text-mist/90 transition hover:border-gold/50 hover:text-gold">{n}</Link></li>)}
          <li><Link href={p("/numerology/angel-numbers/")} className="flex h-10 items-center whitespace-nowrap rounded-full border border-white/12 bg-white/[0.05] px-3.5 text-[13px] text-mist/90 transition hover:border-gold/50 hover:text-gold">{U.allAngel} →</Link></li>
        </ul>
      </div>
    </section>
  );
}
