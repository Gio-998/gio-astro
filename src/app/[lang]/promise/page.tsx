import { pageMeta } from "@/lib/page-meta";
import { PageHero } from "@/components/ui";
export const generateMetadata = pageMeta("promise");
function PageEn() {
  return (
    <article className="prose-soft">
      <PageHero emblem="eye" img="helix" title={<>Our no-tricks promise</>} />
      <p>This category is known for $1 trials that quietly become $40 a month, cancellation mazes and fear-based upsells. We think that's wrong. Here is what we promise, in plain words:</p>
      <ul>
        <li><b>Free results, always.</b> Every quiz shows its full result the moment you finish. No email wall, no paywall at the end.</li>
        <li><b>The core stays free.</b> Birth chart, profile, quizzes, compatibility and daily guidance cost us almost nothing to run, so they stay free.</li>
        <li><b>Published prices.</b> If we add paid extras (like a deep printable report), the price is on the button before you click.</li>
        <li><b>No trials that turn into subscriptions.</b> No “€1 now, €40 later”.</li>
        <li><b>One-click cancel.</b> Any membership will be cancellable in one click, with a reminder before every renewal.</li>
        <li><b>Refunds in money, not credits.</b></li>
        <li><b>No fear, no fake urgency.</b> No countdown timers, no “danger in your chart”, no “psychic is typing”.</li>
        <li><b>No doom.</b> We never say two people are “incompatible”. We show strengths, growth edges and practices.</li>
        <li><b>Your data is yours.</b> Right now everything is stored only in your browser. Delete it any time on the privacy page.</li>
      </ul>
      <p>If we ever break this promise, tell us and we'll fix it.</p>
    </article>
  );
}

function PageMk() {
  return (
    <article className="prose-soft">
      <PageHero emblem="eye" img="helix" title={<>Нашето ветување без трикови</>} />
      <p>Оваа категорија е позната по пробни периоди од 1 евро што тивко стануваат 40 евра месечно, лавиринти за откажување и продажба преку страв. Мислиме дека тоа е погрешно. Еве што ветуваме, со едноставни зборови:</p>
      <ul>
        <li><b>Бесплатни резултати, секогаш.</b> Секој квиз го покажува целиот резултат штом ќе завршиш. Без барање е-пошта, без плаќање на крајот.</li>
        <li><b>Основата останува бесплатна.</b> Родената карта, профилот, квизовите, компатибилноста и дневните насоки не чинат речиси ништо за одржување, па остануваат бесплатни.</li>
        <li><b>Објавени цени.</b> Ако додадеме платени додатоци (како длабок извештај за печатење), цената е на копчето пред да кликнеш.</li>
        <li><b>Без пробни периоди што стануваат претплати.</b> Без „1 евро сега, 40 евра подоцна“.</li>
        <li><b>Откажување со еден клик.</b> Секое членство ќе може да се откаже со еден клик, со потсетник пред секое обновување.</li>
        <li><b>Враќање во пари, не во кредити.</b></li>
        <li><b>Без страв, без лажна итност.</b> Без тајмери со одбројување, без „опасност во твојата карта“, без „видовитата пишува…“.</li>
        <li><b>Без пропаст.</b> Никогаш не велиме дека двајца луѓе се „некомпатибилни“. Покажуваме силни страни, рабови за раст и вежби.</li>
        <li><b>Твоите податоци се твои.</b> Засега сè е зачувано само во твојот прелистувач. Избриши ги кога сакаш на страницата за приватност.</li>
      </ul>
      <p>Ако некогаш го прекршиме ова ветување, кажи ни и ќе го поправиме.</p>
    </article>
  );
}
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return lang === "mk" ? <PageMk /> : <PageEn />;
}
