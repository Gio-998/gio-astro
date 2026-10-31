import Link from "next/link";
import { pageMeta } from "@/lib/page-meta";
import { PageHero } from "@/components/ui";
export const generateMetadata = pageMeta("terms");
function PageEn() {
  return (
    <article className="prose-soft">
      <PageHero emblem="tarot" img="milkyway" title={<>Terms of use</>} />
      <p className="text-sm text-dim">Draft v0.2: a lawyer still has to review this text.</p>
      <h2>What this is</h2>
      <p>This app offers astrology, numerology, tarot, traditional systems and personality questionnaires <b>for self-reflection and entertainment</b>. It is not psychological, medical, legal or financial advice, and it cannot predict the future or whether a relationship will succeed. Don't make important decisions based only on it.</p>
      <h2>Age</h2>
      <p>You must be 16 or older to use the app.</p>
      <h2>Full test results</h2>
      <p>A test shows a short part of its result straight away. The full result opens once you leave your name and email, one time per device, and costs no money. Please use your own name and an address that is yours. We may then send you one email with a link back. The <Link href="/en/privacy/">privacy page</Link> explains what we keep and how to have it deleted. News by email is a separate choice, and no result depends on it.</p>
      <h2>Other people's data</h2>
      <p>When you add someone else, only enter details they would be comfortable sharing with you, ideally with their permission. Don't use the app to harass, pressure or make decisions about others.</p>
      <h2>Wellbeing</h2>
      <p>The body & energy questionnaire is inspired by tradition and gives general wellbeing ideas only. If you have health concerns, see a doctor. If you feel unsafe in a relationship, contact local emergency services or a helpline.</p>
      <h2>Free service and paid extras</h2>
      <p>The core service is free and provided “as is”. Any future paid extras will show their price clearly before purchase, can be cancelled in one click, and are covered by your statutory consumer rights in the EU.</p>
      <h2>Content</h2>
      <p>Interpretation texts are our own. Personality items from the International Personality Item Pool are in the public domain. City data © GeoNames (CC BY 4.0). Trademarks of third parties are not used, and we are not affiliated with any test publisher.</p>
      <h2>Contact</h2>
      <p>Questions or requests about your data? Write to <a href="mailto:contact@horoscop.si">contact@horoscop.si</a>.</p>
    </article>
  );
}

function PageMk() {
  return (
    <article className="prose-soft">
      <PageHero emblem="tarot" img="milkyway" title={<>Услови за користење</>} />
      <p className="text-sm text-dim">Нацрт v0.2: правник допрва треба да го прегледа овој текст.</p>
      <h2>Што е ова</h2>
      <p>Оваа апликација нуди астрологија, нумерологија, тарот, традиционални системи и прашалници за личност <b>за саморефлексија и забава</b>. Не е психолошки, медицински, правен или финансиски совет и не може да ја предвиди иднината ниту дали врската ќе успее. Не носи важни одлуки само врз основа на неа.</p>
      <h2>Возраст</h2>
      <p>Мораш да имаш 16 или повеќе години за да ја користиш апликацијата.</p>
      <h2>Цели резултати од тестовите</h2>
      <p>Тестот веднаш покажува краток дел од резултатот. Целиот резултат се отвора откако ќе оставиш име и е-пошта, еднаш по уред, и не чини пари. Те молиме користи го своето име и адреса што е твоја. Потоа може да ти пратиме една порака со линк назад. На <Link href="/mk/privacy/">страницата за приватност</Link> пишува што чуваме и како да се избрише. Новостите на е-пошта се посебен избор и ниту еден резултат не зависи од нив.</p>
      <h2>Податоци за други луѓе</h2>
      <p>Кога додаваш некого друг, внеси само податоци што тој човек е согласен да ги сподели со тебе, идеално со нивна дозвола. Не ја користи апликацијата за вознемирување, притисок или донесување одлуки за други.</p>
      <h2>Добросостојба</h2>
      <p>Прашалникот за тело и енергија е инспириран од традицијата и дава само општи идеи за добросостојба. Ако имаш здравствени грижи, оди на лекар. Ако се чувствуваш небезбедно во врска, обрати се до локалните служби за итни случаи или до линија за помош.</p>
      <h2>Бесплатна услуга и платени додатоци</h2>
      <p>Основната услуга е бесплатна и се нуди „како што е“. Секој иден платен додаток јасно ќе ја прикаже цената пред купување, ќе може да се откаже со еден клик и е покриен со твоите законски права како потрошувач.</p>
      <h2>Содржина</h2>
      <p>Текстовите за толкување се наши. Ставките за личност од International Personality Item Pool се во јавна сопственост. Податоци за градовите © GeoNames (CC BY 4.0). Не се користат заштитени марки на трети страни и не сме поврзани со ниеден издавач на тестови.</p>
      <h2>Контакт</h2>
      <p>Прашања или барања за твоите податоци? Пиши ни на <a href="mailto:contact@horoscop.si">contact@horoscop.si</a>.</p>
    </article>
  );
}
function PageDe() {
  return (
    <article className="prose-soft" lang="de">
      <PageHero emblem="tarot" img="milkyway" title={<>Nutzungsbedingungen</>} />
      <p className="text-sm text-dim">Entwurf v0.2: Dieser Text muss noch anwaltlich geprüft werden.</p>
      <h2>Was das ist</h2>
      <p>Diese App bietet Astrologie, Numerologie, Tarot, traditionelle Systeme und Persönlichkeitsfragebögen <b>zur Selbstreflexion und Unterhaltung</b>. Sie ist keine psychologische, medizinische, rechtliche oder finanzielle Beratung und kann weder die Zukunft vorhersagen noch, ob eine Beziehung gelingt. Triff wichtige Entscheidungen nicht allein auf ihrer Grundlage.</p>
      <h2>Alter</h2>
      <p>Du musst mindestens 16 Jahre alt sein, um die App zu nutzen.</p>
      <h2>Ganze Testergebnisse</h2>
      <p>Ein Test zeigt sofort einen kurzen Teil seines Ergebnisses. Das ganze Ergebnis öffnet sich, sobald du Name und E-Mail hinterlässt, einmal pro Gerät, und es kostet kein Geld. Bitte nutze deinen eigenen Namen und eine Adresse, die dir gehört. Danach können wir dir eine E-Mail mit einem Link zurück schicken. Auf der <Link href="/de/privacy/">Datenschutzseite</Link> steht, was wir speichern und wie du es löschen lässt. Neuigkeiten per E-Mail sind eine eigene Entscheidung, und kein Ergebnis hängt davon ab.</p>
      <h2>Daten anderer Menschen</h2>
      <p>Wenn du jemanden hinzufügst, gib nur Angaben ein, die diese Person dir gern geben würde, am besten mit ihrer Erlaubnis. Nutze die App nicht, um andere zu belästigen, unter Druck zu setzen oder über sie zu entscheiden.</p>
      <h2>Wohlbefinden</h2>
      <p>Der Fragebogen zu Körper und Energie ist von Traditionen inspiriert und gibt nur allgemeine Ideen fürs Wohlbefinden. Bei gesundheitlichen Sorgen geh bitte zu einer Ärztin oder einem Arzt. Wenn du dich in einer Beziehung nicht sicher fühlst, wende dich an den Notruf oder ein Hilfetelefon in deiner Nähe.</p>
      <h2>Gratis-Angebot und kostenpflichtige Extras</h2>
      <p>Das Kernangebot ist gratis und wird „wie besehen“ bereitgestellt. Künftige kostenpflichtige Extras zeigen ihren Preis vor dem Kauf klar an, lassen sich mit einem Klick kündigen und unterliegen deinen gesetzlichen Verbraucherrechten in der EU.</p>
      <h2>Inhalte</h2>
      <p>Die Deutungstexte sind unsere eigenen. Persönlichkeitsfragen aus dem International Personality Item Pool sind gemeinfrei. Städtedaten © GeoNames (CC BY 4.0). Marken Dritter werden nicht verwendet, und wir sind mit keinem Testverlag verbunden.</p>
      <h2>Kontakt</h2>
      <p>Fragen oder Anliegen zu deinen Daten? Schreib an <a href="mailto:contact@horoscop.si">contact@horoscop.si</a>.</p>
    </article>
  );
}
function PageSr() {
  return (
    <article className="prose-soft" lang="sr">
      <PageHero emblem="tarot" img="milkyway" title={<>Uslovi korišćenja</>} />
      <p className="text-sm text-dim">Nacrt v0.2: pravnik još treba da pregleda ovaj tekst.</p>
      <h2>Šta je ovo</h2>
      <p>Ova aplikacija nudi astrologiju, numerologiju, tarot, tradicionalne sisteme i upitnike o ličnosti <b>za razmišljanje o sebi i zabavu</b>. Ovo nije psihološki, medicinski, pravni ili finansijski savet i ne može da predvidi budućnost niti da li će neka veza uspeti. Nemoj da donosiš važne odluke samo na osnovu nje.</p>
      <h2>Uzrast</h2>
      <p>Za korišćenje aplikacije moraš da imaš 16 ili više godina.</p>
      <h2>Celi rezultati testova</h2>
      <p>Test odmah prikazuje kratak deo svog rezultata. Ceo rezultat se otvara kad ostaviš ime i mejl, jednom po uređaju, i ne košta ništa. Koristi svoje ime i adresu koja je tvoja. Zatim ti šaljemo jedan mejl sa linkom nazad. <Link href="/sr/privacy/">Stranica o privatnosti</Link> objašnjava šta čuvamo i kako da to obrišeš. Novosti mejlom su poseban izbor i nijedan rezultat ne zavisi od njih.</p>
      <h2>Podaci drugih ljudi</h2>
      <p>Kad dodaš nekog drugog, unesi samo podatke koje bi ta osoba rado podelila sa tobom, najbolje uz njenu dozvolu. Nemoj da koristiš aplikaciju da uznemiravaš druge, pritiskaš ih ili donosiš odluke o njima.</p>
      <h2>Dobrobit</h2>
      <p>Upitnik o telu i energiji inspirisan je tradicijom i daje samo opšte ideje za dobrobit. Ako imaš zdravstvene tegobe, obrati se lekaru. Ako se ne osećaš bezbedno u odnosu, obrati se lokalnim hitnim službama ili liniji za pomoć.</p>
      <h2>Besplatna usluga i plaćeni dodaci</h2>
      <p>Osnovna usluga je besplatna i pruža se „takva kakva jeste“. Svi budući plaćeni dodaci jasno će prikazati cenu pre kupovine, moći će da se otkažu jednim klikom i pokriveni su tvojim zakonskim potrošačkim pravima u EU.</p>
      <h2>Sadržaj</h2>
      <p>Tekstovi tumačenja su naši. Stavke o ličnosti iz International Personality Item Pool su javno dobro. Podaci o gradovima © GeoNames (CC BY 4.0). Ne koristimo žigove trećih strana i nismo povezani ni sa jednim izdavačem testova.</p>
      <h2>Kontakt</h2>
      <p>Pitanja ili zahtevi u vezi sa tvojim podacima? Piši na <a href="mailto:contact@horoscop.si">contact@horoscop.si</a>.</p>
    </article>
  );
}
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return lang === "mk" ? <PageMk /> : lang === "de" ? <PageDe /> : lang === "sr" ? <PageSr /> : <PageEn />;
}
