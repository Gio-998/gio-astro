/** Pricing page copy, EN + MK + DE + SR.Planned prices live in src/lib/pricing.ts. Nothing here is on sale: keep it true to PAYWALL_LIVE. */
import type { ReportId } from "@/lib/pricing";

export interface PricingText {
  meta: { title: string; description: string };
  eyebrow: string; title: [string, string]; sub: string;
  free: { name: string; line: string; features: string[]; note: string };
  later: { eyebrow: string; title: string; sub: string; planned: string; perMonth: string; orYear: (price: string) => string; once: string; plus: { name: string; line: string }; items: Record<ReportId, { name: string; line: string }> };
  cta: string;
  faq: { eyebrow: string; title: string; items: [string, string][] };
  bottom: { title: string; sub: string };
}

export const en: PricingText = {
  meta: { title: "Pricing: everything is free for now", description: "Every test, horoscope, birth chart and compatibility report on Horoscop is free right now. No card, no trial. Here is what may cost money later." },
  eyebrow: "Pricing", title: ["Everything is free ", "for now"], sub: "There is nothing to buy today and no card to enter.",
  free: { name: "Free", line: "Everything on the site, today",
    features: ["All tests with full results", "Deep Read and Play Mirror", "Birth chart, Chinese zodiac and numerology", "Daily, weekly and monthly horoscopes", "Compatibility for any two people", "Bond Check for two", "The Book of You", "PDF exports"],
    note: "Tests show a short preview at once. Your name and email open the full result, once per device." },
  later: { eyebrow: "Maybe later", title: "What may cost money later", sub: "We plan optional paid extras, and there is no date yet. These are the prices we have in mind. They can change, and none of this is on sale today.", planned: "Planned",
    perMonth: "/ month", orYear: (p) => `or ${p} a year`, once: "one time",
    plus: { name: "Plus", line: "Personal readings, every day" },
    items: {
      match: { name: "Match PDF", line: "Your match, ready to print" },
      year: { name: "Year Ahead 2027", line: "Month by month, for you" },
      deep: { name: "Deep Read report", line: "Your full inner portrait" },
    } },
  cta: "Start a test",
  faq: { eyebrow: "Questions", title: "Good to know", items: [
    ["Do I need a card or a subscription?", "No. There is nothing to pay for right now and no card form on the site, so nothing can renew or charge you."],
    ["What stays free?", "Every test and its full result, your basic chart, the basic compatibility score and the daily horoscope for your sign."],
    ["When do paid extras start?", "We have no date. Before anything costs money, its price will be on this page first."],
    ["Will I keep what I have?", "Yes. Your profile and results stay yours, whatever we add later."],
    ["Which languages?", "The site is in English, Macedonian, German and Serbian. You can switch at any time with the flag at the top."],
    ["Will prices include VAT?", "Yes. When paid extras open, the price you see will be the price you pay, in euro."],
  ] },
  bottom: { title: "Start with a test", sub: "It's free, it takes a few minutes, and you don't need an account." },
};

export const mk: PricingText = {
  meta: { title: "Цени: засега сè е бесплатно", description: "Секој тест, хороскоп, натална карта и извештај за компатибилност на Horoscop засега е бесплатен. Без картичка, без проба. Еве што може да чини подоцна." },
  eyebrow: "Цени", title: ["Засега сè е ", "бесплатно"], sub: "Денес нема што да се купи и нема картичка за внесување.",
  free: { name: "Бесплатно", line: "Сè на страницата, денес",
    features: ["Сите тестови со целосни резултати", "Длабоко читање и мини игри", "Натална карта, кинески хороскоп и нумерологија", "Дневни, неделни и месечни хороскопи", "Компатибилност за кои било двајца", "Проверка на врска за двајца", "Книгата за тебе", "Извоз во PDF"],
    note: "Тестовите веднаш покажуваат краток преглед. Името и е-поштата го отвораат целиот резултат, еднаш по уред." },
  later: { eyebrow: "Можеби подоцна", title: "Што може да се наплаќа подоцна", sub: "Планираме незадолжителни платени додатоци, а датум сè уште нема. Ова се цените што ги имаме на ум. Може да се сменат и ништо од ова не се продава денес.", planned: "Планирано",
    perMonth: "/ месец", orYear: (p) => `или ${p} годишно`, once: "еднократно",
    plus: { name: "Плус", line: "Лични читања, секој ден" },
    items: {
      match: { name: "Компатибилност PDF", line: "Вашиот спој, за печатење" },
      year: { name: "Годината 2027", line: "Месец по месец, за тебе" },
      deep: { name: "Извештај од Длабоко читање", line: "Твојот целосен портрет" },
    } },
  cta: "Започни тест",
  faq: { eyebrow: "Прашања", title: "Добро е да знаеш", items: [
    ["Дали ми треба картичка или претплата?", "Не. Во моментов нема што да се плати и на страницата нема образец за картичка, па ништо не може да се обнови или наплати."],
    ["Што останува бесплатно?", "Секој тест со целосен резултат, основната карта, основниот резултат за компатибилност и дневниот хороскоп за твојот знак."],
    ["Кога почнуваат платените додатоци?", "Немаме датум. Пред нешто да чини пари, цената прво ќе стои на оваа страница."],
    ["Дали ќе го задржам она што го имам?", "Да. Твојот профил и резултатите остануваат твои, што и да додадеме подоцна."],
    ["На кои јазици?", "Страницата е на македонски, англиски, германски и српски. Јазикот го менуваш кога сакаш со знамето горе."],
    ["Дали цените ќе го вклучуваат ДДВ?", "Да. Кога ќе се отворат платените додатоци, цената што ја гледаш ќе биде цената што ја плаќаш, во евра."],
  ] },
  bottom: { title: "Започни со тест", sub: "Бесплатно е, трае неколку минути и не ти треба сметка." },
};

export const de: PricingText = {
  meta: { title: "Preise: Im Moment ist alles gratis", description: "Jeder Test, jedes Horoskop, Geburtshoroskop und Partnerhoroskop bei Horoscop ist im Moment gratis. Keine Karte, kein Abo. Das könnte später etwas kosten." },
  eyebrow: "Preise", title: ["Im Moment ist alles ", "gratis"], sub: "Heute gibt es nichts zu kaufen und keine Karte einzugeben.",
  free: { name: "Gratis", line: "Alles auf der Seite, heute",
    features: ["Alle Tests mit vollen Ergebnissen", "Tiefenlesung und Play Mirror", "Geburtshoroskop, chinesischer Tierkreis und Numerologie", "Tages-, Wochen- und Monatshoroskope", "Kompatibilität für zwei beliebige Menschen", "Beziehungscheck zu zweit", "Das Buch über dich", "PDF-Export"],
    note: "Tests zeigen sofort eine kurze Vorschau. Name und E-Mail öffnen das ganze Ergebnis, einmal pro Gerät." },
  later: { eyebrow: "Vielleicht später", title: "Was später etwas kosten könnte", sub: "Wir planen optionale bezahlte Extras, ein Datum gibt es noch nicht. Das sind die Preise, die wir im Kopf haben. Sie können sich ändern, und nichts davon ist heute zu kaufen.", planned: "Geplant",
    perMonth: "/ Monat", orYear: (p) => `oder ${p} im Jahr`, once: "einmalig",
    plus: { name: "Plus", line: "Persönliche Deutungen, jeden Tag" },
    items: {
      match: { name: "Match-PDF", line: "Eure Passung, bereit zum Drucken" },
      year: { name: "Dein Jahr 2027", line: "Monat für Monat, für dich" },
      deep: { name: "Tiefenlesung als Report", line: "Dein ganzes inneres Porträt" },
    } },
  cta: "Test starten",
  faq: { eyebrow: "Fragen", title: "Gut zu wissen", items: [
    ["Brauche ich eine Karte oder ein Abo?", "Nein. Im Moment gibt es nichts zu bezahlen und auf der Seite kein Kartenformular, also kann sich nichts verlängern oder abgebucht werden."],
    ["Was bleibt gratis?", "Jeder Test mit vollem Ergebnis, dein Basis-Horoskop, der einfache Kompatibilitätswert und das Tageshoroskop für dein Zeichen."],
    ["Wann starten bezahlte Extras?", "Wir haben kein Datum. Bevor etwas Geld kostet, steht der Preis zuerst auf dieser Seite."],
    ["Behalte ich, was ich schon habe?", "Ja. Dein Profil und deine Ergebnisse bleiben deine, egal was später dazukommt."],
    ["Welche Sprachen?", "Die Seite gibt es auf Deutsch, Englisch, Mazedonisch und Serbisch. Du kannst jederzeit oben über die Flagge wechseln."],
    ["Werden Preise die MwSt. enthalten?", "Ja. Wenn bezahlte Extras starten, ist der Preis, den du siehst, der Preis, den du zahlst, in Euro."],
  ] },
  bottom: { title: "Fang mit einem Test an", sub: "Er ist gratis, dauert ein paar Minuten, und du brauchst kein Konto." },
};

export const sr: PricingText = {
  meta: { title: "Cene: za sada je sve besplatno", description: "Svaki test, horoskop, natalna karta i izveštaj o kompatibilnosti na sajtu Horoscop sada su besplatni. Bez kartice. Evo šta bi kasnije moglo da košta." },
  eyebrow: "Cene", title: ["Za sada je sve ", "besplatno"], sub: "Danas nema šta da se kupi i nema kartice za unos.",
  free: { name: "Besplatno", line: "Sve na sajtu, već danas",
    features: ["Svi testovi sa celim rezultatima", "Dubinsko čitanje i Igre ogledala", "Natalna karta, kineski horoskop i numerologija", "Dnevni, nedeljni i mesečni horoskopi", "Kompatibilnost za bilo koje dve osobe", "Provera veze za dvoje", "Knjiga o tebi", "Izvoz u PDF"],
    note: "Testovi odmah prikazuju kratak pregled. Ime i mejl otvaraju ceo rezultat, jednom po uređaju." },
  later: { eyebrow: "Možda kasnije", title: "Šta bi kasnije moglo da košta", sub: "Planiramo opcione plaćene dodatke, a datuma još nema. Ovo su cene koje imamo na umu. Mogu da se promene, i ništa od ovoga se danas ne prodaje.", planned: "U planu",
    perMonth: "/ mesec", orYear: (p) => `ili ${p} godišnje`, once: "jednokratno",
    plus: { name: "Plus", line: "Lična čitanja, svakog dana" },
    items: {
      match: { name: "Kompatibilnost PDF", line: "Vaše slaganje, spremno za štampu" },
      year: { name: "Godina pred tobom 2027", line: "Mesec po mesec, za tebe" },
      deep: { name: "Izveštaj Dubinskog čitanja", line: "Tvoj ceo unutrašnji portret" },
    } },
  cta: "Počni test",
  faq: { eyebrow: "Pitanja", title: "Dobro je da znaš", items: [
    ["Da li mi treba kartica ili pretplata?", "Ne. Trenutno nema šta da se plati i na sajtu nema obrasca za karticu, pa ništa ne može da se obnovi ili naplati."],
    ["Šta ostaje besplatno?", "Svaki test sa celim rezultatom, tvoja osnovna karta, osnovni rezultat kompatibilnosti i dnevni horoskop za tvoj znak."],
    ["Kada počinju plaćeni dodaci?", "Nemamo datum. Pre nego što bilo šta bude koštalo, cena će prvo stajati na ovoj stranici."],
    ["Da li ću zadržati ono što imam?", "Da. Tvoj profil i rezultati ostaju tvoji, šta god kasnije dodali."],
    ["Na kojim jezicima?", "Sajt je na srpskom, engleskom, makedonskom i nemačkom. Jezik menjaš kad god želiš, preko zastave na vrhu."],
    ["Da li će cene uključivati PDV?", "Da. Kad plaćeni dodaci krenu, cena koju vidiš biće cena koju plaćaš, u evrima."],
  ] },
  bottom: { title: "Počni testom", sub: "Besplatno je, traje nekoliko minuta i ne treba ti nalog." },
};

export const pricingText = (lang: string) => ({ en, mk, de, sr } as Record<string, PricingText>)[lang] ?? en;
