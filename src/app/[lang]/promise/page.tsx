import { pageMeta } from "@/lib/page-meta";
import { PageHero } from "@/components/ui";
export const generateMetadata = pageMeta("promise");
function PageEn() {
  return (
    <article className="prose-soft">
      <PageHero emblem="eye" img="helix" title={<>Our promise</>} />
      <p>This category is known for $1 trials that quietly become $40 a month, cancellation mazes and fear-based upsells. We think that's wrong. Here is what we promise, in plain words:</p>
      <ul>
        <li><b>Full results at no cost.</b> Every test shows a short part of its result the moment you finish. For the rest we ask once for your name and email, and then every result on your device stays open. No paywall at the end, and saying yes to our news is never the price of a result.</li>
        <li><b>The core stays free.</b> Birth chart, profile, tests, compatibility and daily guidance cost us almost nothing to run, so they stay free.</li>
        <li><b>Published prices.</b> If we add paid extras (like a deep printable report), the price is on the button before you click.</li>
        <li><b>No trials that turn into subscriptions.</b> No “€1 now, €40 later”.</li>
        <li><b>One-click cancel.</b> Any membership will be cancellable in one click, with a reminder before every renewal.</li>
        <li><b>Refunds in money, not credits.</b></li>
        <li><b>No fear, no fake urgency.</b> No countdown timers, no “danger in your chart”, no “psychic is typing”.</li>
        <li><b>No doom.</b> We never say two people are “incompatible”. We show strengths, growth edges and practices.</li>
        <li><b>Your data is yours.</b> Your answers and results stay in your browser unless you create an account. The privacy page lists what does leave your device, and how to delete it.</li>
      </ul>
      <p>If we ever break this promise, tell us and we'll fix it.</p>
    </article>
  );
}

function PageMk() {
  return (
    <article className="prose-soft">
      <PageHero emblem="eye" img="helix" title={<>Нашето ветување</>} />
      <p>Оваа категорија е позната по пробни периоди од 1 евро што тивко стануваат 40 евра месечно, лавиринти за откажување и продажба преку страв. Мислиме дека тоа е погрешно. Еве што ветуваме, со едноставни зборови:</p>
      <ul>
        <li><b>Целите резултати без плаќање.</b> Секој тест покажува краток дел од резултатот штом ќе завршиш. За остатокот еднаш бараме име и е-пошта, а потоа сите резултати на твојот уред остануваат отворени. Без плаќање на крајот, а согласноста за новости никогаш не е цена за резултат.</li>
        <li><b>Основата останува бесплатна.</b> Родената карта, профилот, тестовите, компатибилноста и дневните насоки не чинат речиси ништо за одржување, па остануваат бесплатни.</li>
        <li><b>Објавени цени.</b> Ако додадеме платени додатоци (како длабок извештај за печатење), цената е на копчето пред да кликнеш.</li>
        <li><b>Без пробни периоди што стануваат претплати.</b> Без „1 евро сега, 40 евра подоцна“.</li>
        <li><b>Откажување со еден клик.</b> Секое членство ќе може да се откаже со еден клик, со потсетник пред секое обновување.</li>
        <li><b>Враќање во пари, не во кредити.</b></li>
        <li><b>Без страв, без лажна итност.</b> Без тајмери со одбројување, без „опасност во твојата карта“, без „видовитата пишува…“.</li>
        <li><b>Без пропаст.</b> Никогаш не велиме дека двајца луѓе се „некомпатибилни“. Покажуваме силни страни, рабови за раст и вежби.</li>
        <li><b>Твоите податоци се твои.</b> Одговорите и резултатите остануваат во твојот прелистувач, освен ако создадеш сметка. На страницата за приватност пишува што го напушта уредот и како да го избришеш.</li>
      </ul>
      <p>Ако некогаш го прекршиме ова ветување, кажи ни и ќе го поправиме.</p>
    </article>
  );
}
function PageDe() {
  return (
    <article className="prose-soft" lang="de">
      <PageHero emblem="eye" img="helix" title={<>Unser Versprechen</>} />
      <p>Diese Branche ist bekannt für Testabos für 1 €, die still zu 40 € im Monat werden, für Kündigungslabyrinthe und Angstmache beim Verkaufen. Wir finden das falsch. Das versprechen wir dir, in klaren Worten:</p>
      <ul>
        <li><b>Ganze Ergebnisse ohne Bezahlung.</b> Jeder Test zeigt einen kurzen Teil seines Ergebnisses, sobald du fertig bist. Für den Rest fragen wir einmal nach Name und E-Mail, danach bleiben alle Ergebnisse auf deinem Gerät offen. Keine Bezahlschranke am Ende, und ein Ja zu unseren Neuigkeiten ist nie der Preis für ein Ergebnis.</li>
        <li><b>Der Kern bleibt gratis.</b> Geburtshoroskop, Profil, Tests, Kompatibilität und Tagesimpulse kosten uns kaum etwas, also bleiben sie gratis.</li>
        <li><b>Klare Preise.</b> Wenn wir kostenpflichtige Extras anbieten (etwa einen ausführlichen Report zum Drucken), steht der Preis auf dem Button, bevor du klickst.</li>
        <li><b>Keine Testphasen, die zu Abos werden.</b> Kein „1 € jetzt, 40 € später“.</li>
        <li><b>Kündigen mit einem Klick.</b> Jede Mitgliedschaft lässt sich mit einem Klick kündigen, mit einer Erinnerung vor jeder Verlängerung.</li>
        <li><b>Erstattung in Geld, nicht in Gutscheinen.</b></li>
        <li><b>Keine Angst, kein künstlicher Druck.</b> Keine Countdowns, keine „Gefahr in deinem Horoskop“, kein „Hellseherin schreibt…“.</li>
        <li><b>Keine Untergangsprognosen.</b> Wir sagen nie, dass zwei Menschen „nicht zusammenpassen“. Wir zeigen Stärken, Wachstumsfelder und Übungen.</li>
        <li><b>Deine Daten gehören dir.</b> Deine Antworten und Ergebnisse bleiben in deinem Browser, außer du legst ein Konto an. Die Datenschutzseite zeigt, was dein Gerät verlässt und wie du es löschst.</li>
      </ul>
      <p>Wenn wir dieses Versprechen je brechen, sag es uns, und wir bringen es in Ordnung.</p>
    </article>
  );
}
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return lang === "mk" ? <PageMk /> : lang === "de" ? <PageDe /> : <div lang="en"><PageEn /></div>;
}
