import { pageMeta } from "@/lib/page-meta";
import { PageHero } from "@/components/ui";
export const generateMetadata = pageMeta("terms");
function PageEn() {
  return (
    <article className="prose-soft">
      <PageHero emblem="tarot" img="milkyway" title={<>Terms of use</>} />
      <p className="text-sm text-dim">Draft v0.1: to be reviewed by a lawyer before taking payments.</p>
      <h2>What this is</h2>
      <p>This app offers astrology, numerology, tarot, traditional systems and personality questionnaires <b>for self-reflection and entertainment</b>. It is not psychological, medical, legal or financial advice, and it cannot predict the future or whether a relationship will succeed. Don't make important decisions based only on it.</p>
      <h2>Age</h2>
      <p>You must be 16 or older to use the app (the age of digital consent in Poland).</p>
      <h2>Other people's data</h2>
      <p>When you add someone else, only enter details they would be comfortable sharing with you, ideally with their permission. Don't use the app to harass, pressure or make decisions about others.</p>
      <h2>Wellbeing</h2>
      <p>The body & energy questionnaire is inspired by tradition and gives general wellbeing ideas only. If you have health concerns, see a doctor. If you feel unsafe in a relationship, contact local emergency services or a helpline.</p>
      <h2>Free service and paid extras</h2>
      <p>The core service is free and provided “as is”. Any future paid extras will show their price clearly before purchase, can be cancelled in one click, and are covered by your statutory consumer rights in the EU.</p>
      <h2>Content</h2>
      <p>Interpretation texts are our own. Personality items from the International Personality Item Pool are in the public domain. City data © GeoNames (CC BY 4.0). Trademarks of third parties are not used, and we are not affiliated with any test publisher.</p>
    </article>
  );
}

function PageMk() {
  return (
    <article className="prose-soft">
      <PageHero emblem="tarot" img="milkyway" title={<>Услови за користење</>} />
      <p className="text-sm text-dim">Нацрт v0.1 — треба да го прегледа правник пред да се примаат плаќања.</p>
      <h2>Што е ова</h2>
      <p>Оваа апликација нуди астрологија, нумерологија, тарот, традиционални системи и прашалници за личност <b>за саморефлексија и забава</b>. Не е психолошки, медицински, правен или финансиски совет и не може да ја предвиди иднината ниту дали врската ќе успее. Не носи важни одлуки само врз основа на неа.</p>
      <h2>Возраст</h2>
      <p>Мораш да имаш 16 или повеќе години за да ја користиш апликацијата.</p>
      <h2>Податоци за други луѓе</h2>
      <p>Кога додаваш некого друг, внеси само податоци што тој/таа би сакал/а да ги сподели со тебе, идеално со нивна дозвола. Не ја користи апликацијата за вознемирување, притисок или донесување одлуки за други.</p>
      <h2>Добросостојба</h2>
      <p>Прашалникот за тело и енергија е инспириран од традицијата и дава само општи идеи за добросостојба. Ако имаш здравствени грижи, оди на лекар. Ако се чувствуваш небезбедно во врска, обрати се до локалните служби за итни случаи или до линија за помош.</p>
      <h2>Бесплатна услуга и платени додатоци</h2>
      <p>Основната услуга е бесплатна и се нуди „како што е“. Секој иден платен додаток јасно ќе ја прикаже цената пред купување, ќе може да се откаже со еден клик и е покриен со твоите законски права како потрошувач.</p>
      <h2>Содржина</h2>
      <p>Текстовите за толкување се наши. Ставките за личност од International Personality Item Pool се во јавна сопственост. Податоци за градовите © GeoNames (CC BY 4.0). Не се користат заштитени марки на трети страни и не сме поврзани со ниеден издавач на тестови.</p>
    </article>
  );
}
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return lang === "mk" ? <PageMk /> : <PageEn />;
}
