import Link from "next/link";
import { SIGNS, SIGN_GLYPH } from "@/engine/zodiac";
import { getContent } from "@/content";
import { bankFor, horoPath } from "@/lib/horoscope";

/** Homepage strip: the 12 signs as slim pills to each sign's daily horoscope. One line; scrolls sideways on phones. */
export function SignsToday({ lang }: { lang: string }) {
  const U = bankFor(lang).ui; const c = getContent(lang);
  return (
    <section className="py-10 sm:py-14" aria-labelledby="signs-today">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div><p className="eyebrow text-[11px]">☾ {U.homeEyebrow}</p><h2 id="signs-today" className="h-display text-[1.7rem]! leading-tight! sm:text-[2.2rem]!">{U.homeTitle}</h2></div>
        <Link href={horoPath(lang)} className="shrink-0 whitespace-nowrap text-[13px] text-gold underline-offset-4 hover:underline">{U.homeAll} →</Link>
      </div>
      <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] [mask-image:linear-gradient(90deg,#000_88%,transparent)] sm:mx-0 sm:px-0 sm:[mask-image:none]">
        <ul className="flex w-max gap-2 sm:grid sm:w-full sm:grid-cols-6">
          {SIGNS.map((s) => (
            <li key={s}><Link href={horoPath(lang, s)} className="flex h-10 items-center gap-1.5 whitespace-nowrap rounded-full border border-white/12 bg-white/[0.05] px-3.5 text-[13px] text-mist/90 transition hover:border-gold/50 hover:text-gold sm:justify-center">
              <span aria-hidden className="text-base text-gold">{SIGN_GLYPH[s]}</span>{c.astro.signs[s].name}
            </Link></li>
          ))}
        </ul>
      </div>
    </section>
  );
}
