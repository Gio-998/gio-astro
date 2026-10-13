/** Pricing page copy, EN + MK + DE. Prices live in src/lib/pricing.ts. */
import type { PlanId, ReportId } from "@/lib/pricing";

type Cell = "yes" | "no" | string;
export interface PricingText {
  meta: { title: string; description: string };
  eyebrow: string; title: [string, string]; sub: string;
  monthly: string; yearly: string; save: (pct: number) => string;
  perMonth: string; perYear: string; billedYearly: (price: string) => string; forever: string;
  recommended: string; soon: string;
  plans: Record<PlanId, { name: string; line: string; cta: string; features: string[]; lead?: string }>;
  reports: { eyebrow: string; title: string; sub: string; once: string; items: Record<ReportId, { name: string; line: string }> };
  table: { eyebrow: string; title: string; feature: string; rows: [string, Cell, Cell, Cell][] };
  faq: { eyebrow: string; title: string; items: [string, string][] };
  bottom: { title: string; sub: string; cta: string };
}

export const en: PricingText = {
  meta: { title: "Pricing: free forever, Plus and Duo plans", description: "Free forever for every test and result. Plus from €7.49 a month for your full personal readings. Duo for couples." },
  eyebrow: "Pricing", title: ["Simple plans, ", "free at the core"], sub: "Every test and result stays free. Plus adds depth, every day, from your own chart.",
  monthly: "Monthly", yearly: "Yearly", save: (p) => `Save ${p}%`,
  perMonth: "/ month", perYear: "/ year", billedYearly: (p) => `${p} billed once a year`, forever: "free forever",
  recommended: "Recommended", soon: "Payments open soon. Start free today and keep everything you make.",
  plans: {
    free: { name: "Free", line: "Know yourself, at no cost", cta: "Start free",
      features: ["All tests with full results", "Your basic birth chart", "Chinese zodiac and numerology basics", "Basic compatibility score", "Daily horoscope for your sign"] },
    plus: { name: "Plus", line: "Your full personal sky, daily", cta: "Start free", lead: "Everything in Free, plus:",
      features: ["Daily, weekly and monthly readings from your chart", "Transit alerts for your own planets", "The full Book of You", "Full Bond stories", "Deep Read full portrait", "Your Year Ahead", "Unlimited compatibility", "PDF exports"] },
    duo: { name: "Duo", line: "Plus for the two of you", cta: "Start free", lead: "Everything in Plus, for two:",
      features: ["Two linked accounts", "Shared Bond dashboard", "Couple report for the pair", "Daily line for the two of you"] },
  },
  reports: { eyebrow: "One-time reports", title: "Just one reading?", sub: "Pay once, keep it forever. No plan needed.", once: "one time",
    items: {
      match: { name: "Match PDF", line: "Your match, ready to print" },
      year: { name: "Year Ahead 2027", line: "Month by month, for you" },
      deep: { name: "Deep Read", line: "Your full inner portrait" },
    } },
  table: { eyebrow: "Compare", title: "What each plan gives", feature: "Feature", rows: [
    ["All tests and results", "yes", "yes", "yes"],
    ["Birth chart", "Basic", "Full", "Full"],
    ["Chinese zodiac, numerology", "Basics", "Full", "Full"],
    ["Daily horoscope", "By sign", "Personal", "Personal"],
    ["Weekly and monthly readings", "no", "yes", "yes"],
    ["Transit alerts", "no", "yes", "yes"],
    ["Book of You", "First chapters", "Full", "Full"],
    ["Compatibility", "Basic score", "Unlimited", "Unlimited"],
    ["Bond stories", "Summary", "Full", "Full"],
    ["Deep Read", "Preview", "Full", "Full"],
    ["Year Ahead", "no", "yes", "yes"],
    ["PDF exports", "no", "yes", "yes"],
    ["Accounts", "1", "1", "2"],
    ["Shared Bond dashboard", "no", "no", "yes"],
    ["Couple report", "no", "no", "yes"],
  ] },
  faq: { eyebrow: "Questions", title: "Good to know", items: [
    ["Can I cancel anytime?", "Yes. One click in your account, with a reminder before every renewal. No weekly plans, no trials that turn into charges."],
    ["What stays free forever?", "Every test and its full result, your basic chart, the basic compatibility score and the daily horoscope for your sign."],
    ["How can I pay?", "Card payments are coming soon. Until then everything you see is free, and your profile carries over when plans open."],
    ["Which languages?", "The site is in English, Macedonian and German. You can switch at any time with the flag at the top."],
    ["Do prices include VAT?", "Yes. The price you see is the price you pay, in euro."],
  ] },
  bottom: { title: "Start with the free version", sub: "Make your chart and take the tests. Upgrade only if you want more.", cta: "Start free" },
};

export const mk: PricingText = {
  meta: { title: "Цени: бесплатно засекогаш, Плус и Дуо", description: "Секој тест и резултат е бесплатен засекогаш. Плус од 7,49 € месечно за целосни лични читања. Дуо за парови." },
  eyebrow: "Цени", title: ["Едноставни планови, ", "бесплатна основа"], sub: "Секој тест и резултат останува бесплатен. Плус додава длабочина, секој ден, од твојата карта.",
  monthly: "Месечно", yearly: "Годишно", save: (p) => `Заштеди ${p}%`,
  perMonth: "/ месец", perYear: "/ година", billedYearly: (p) => `${p} еднаш годишно`, forever: "бесплатно засекогаш",
  recommended: "Препорачано", soon: "Плаќањата се отвораат наскоро. Започни бесплатно денес и сè што ќе направиш останува твое.",
  plans: {
    free: { name: "Бесплатно", line: "Запознај се себеси, без трошок", cta: "Започни бесплатно",
      features: ["Сите тестови со целосни резултати", "Основна родена карта", "Основи на кинески хороскоп и нумерологија", "Основен резултат за компатибилност", "Дневен хороскоп за твојот знак"] },
    plus: { name: "Плус", line: "Целото твое небо, секој ден", cta: "Започни бесплатно", lead: "Сè од Бесплатно, и уште:",
      features: ["Дневни, неделни и месечни читања од твојата карта", "Известувања за транзити на твоите планети", "Целата Книга за тебе", "Целосни приказни за врските", "Целосен портрет од Длабоко читање", "Твојата година што доаѓа", "Неограничена компатибилност", "Извоз во PDF"] },
    duo: { name: "Дуо", line: "Плус за вас двајца", cta: "Започни бесплатно", lead: "Сè од Плус, за двајца:",
      features: ["Две поврзани сметки", "Заедничка табла за врската", "Извештај за парот", "Дневна порака за вас двајца"] },
  },
  reports: { eyebrow: "Еднократни извештаи", title: "Сакаш само едно читање?", sub: "Платиш еднаш, твое е засекогаш. Без план.", once: "еднократно",
    items: {
      match: { name: "Компатибилност PDF", line: "Вашиот спој, за печатење" },
      year: { name: "Годината 2027", line: "Месец по месец, за тебе" },
      deep: { name: "Длабоко читање", line: "Твојот целосен портрет" },
    } },
  table: { eyebrow: "Споредба", title: "Што нуди секој план", feature: "Можност", rows: [
    ["Сите тестови и резултати", "yes", "yes", "yes"],
    ["Родена карта", "Основна", "Целосна", "Целосна"],
    ["Кинески хороскоп, нумерологија", "Основи", "Целосно", "Целосно"],
    ["Дневен хороскоп", "По знак", "Личен", "Личен"],
    ["Неделни и месечни читања", "no", "yes", "yes"],
    ["Известувања за транзити", "no", "yes", "yes"],
    ["Книга за тебе", "Први поглавја", "Целосна", "Целосна"],
    ["Компатибилност", "Основна", "Без лимит", "Без лимит"],
    ["Приказни за врските", "Краток преглед", "Целосни", "Целосни"],
    ["Длабоко читање", "Преглед", "Целосно", "Целосно"],
    ["Годината што доаѓа", "no", "yes", "yes"],
    ["Извоз во PDF", "no", "yes", "yes"],
    ["Сметки", "1", "1", "2"],
    ["Заедничка табла", "no", "no", "yes"],
    ["Извештај за парот", "no", "no", "yes"],
  ] },
  faq: { eyebrow: "Прашања", title: "Добро е да знаеш", items: [
    ["Можам ли да откажам кога сакам?", "Да. Еден клик во твојата сметка, со потсетник пред секое обновување. Без неделни планови и без пробни периоди што стануваат наплата."],
    ["Што останува бесплатно засекогаш?", "Секој тест со целосен резултат, основната карта, основниот резултат за компатибилност и дневниот хороскоп за твојот знак."],
    ["Како ќе плаќам?", "Плаќањето со картичка доаѓа наскоро. Дотогаш сè што гледаш е бесплатно, а твојот профил останува и кога ќе се отворат плановите."],
    ["На кои јазици?", "Сè е на македонски и англиски, вклучително извештаите и PDF. Јазикот го менуваш кога сакаш."],
    ["Дали ДДВ е вклучен?", "Да. Цената што ја гледаш е цената што ја плаќаш, во евра."],
  ] },
  bottom: { title: "Започни со бесплатната верзија", sub: "Направи ја твојата карта и пополни ги тестовите. Надгради само ако сакаш повеќе.", cta: "Започни бесплатно" },
};

export const de: PricingText = {
  meta: { title: "Preise: für immer gratis, Plus und Duo", description: "Jeder Test und jedes Ergebnis bleibt für immer gratis. Plus ab 7,49 € im Monat für deine vollen persönlichen Deutungen. Duo für Paare." },
  eyebrow: "Preise", title: ["Einfache Pläne, ", "im Kern gratis"], sub: "Jeder Test und jedes Ergebnis bleibt gratis. Plus bringt mehr Tiefe, jeden Tag, aus deinem eigenen Horoskop.",
  monthly: "Monatlich", yearly: "Jährlich", save: (p) => `${p} % sparen`,
  perMonth: "/ Monat", perYear: "/ Jahr", billedYearly: (p) => `${p} einmal im Jahr`, forever: "für immer gratis",
  recommended: "Empfohlen", soon: "Zahlungen starten bald. Fang heute gratis an, alles, was du anlegst, bleibt dir.",
  plans: {
    free: { name: "Gratis", line: "Lern dich kennen, ohne Kosten", cta: "Gratis starten",
      features: ["Alle Tests mit vollen Ergebnissen", "Dein Basis-Geburtshoroskop", "Grundlagen zu chinesischem Tierkreis und Numerologie", "Einfacher Kompatibilitätswert", "Tageshoroskop für dein Zeichen"] },
    plus: { name: "Plus", line: "Dein ganzer Himmel, jeden Tag", cta: "Gratis starten", lead: "Alles aus Gratis, dazu:",
      features: ["Tages-, Wochen- und Monatsdeutungen aus deinem Horoskop", "Transit-Hinweise für deine Planeten", "Das ganze Buch über dich", "Volle Beziehungsgeschichten", "Volles Porträt aus der Tiefenlesung", "Dein Jahr im Voraus", "Unbegrenzte Kompatibilität", "PDF-Export"] },
    duo: { name: "Duo", line: "Plus für euch beide", cta: "Gratis starten", lead: "Alles aus Plus, für zwei:",
      features: ["Zwei verknüpfte Konten", "Gemeinsames Beziehungs-Dashboard", "Paar-Report für euch zwei", "Tagesimpuls für euch beide"] },
  },
  reports: { eyebrow: "Einmalige Reports", title: "Nur eine Deutung?", sub: "Einmal zahlen, für immer behalten. Kein Plan nötig.", once: "einmalig",
    items: {
      match: { name: "Match-PDF", line: "Eure Passung, bereit zum Drucken" },
      year: { name: "Dein Jahr 2027", line: "Monat für Monat, für dich" },
      deep: { name: "Tiefenlesung", line: "Dein ganzes inneres Porträt" },
    } },
  table: { eyebrow: "Vergleich", title: "Was jeder Plan bietet", feature: "Funktion", rows: [
    ["Alle Tests und Ergebnisse", "yes", "yes", "yes"],
    ["Geburtshoroskop", "Basis", "Voll", "Voll"],
    ["Chinesischer Tierkreis, Numerologie", "Basis", "Voll", "Voll"],
    ["Tageshoroskop", "Nach Zeichen", "Persönlich", "Persönlich"],
    ["Wochen- und Monatsdeutungen", "no", "yes", "yes"],
    ["Transit-Hinweise", "no", "yes", "yes"],
    ["Buch über dich", "Erste Kapitel", "Voll", "Voll"],
    ["Kompatibilität", "Basiswert", "Ohne Limit", "Ohne Limit"],
    ["Beziehungsgeschichten", "Kurzfassung", "Voll", "Voll"],
    ["Tiefenlesung", "Vorschau", "Voll", "Voll"],
    ["Dein Jahr im Voraus", "no", "yes", "yes"],
    ["PDF-Export", "no", "yes", "yes"],
    ["Konten", "1", "1", "2"],
    ["Gemeinsames Dashboard", "no", "no", "yes"],
    ["Paar-Report", "no", "no", "yes"],
  ] },
  faq: { eyebrow: "Fragen", title: "Gut zu wissen", items: [
    ["Kann ich jederzeit kündigen?", "Ja. Ein Klick in deinem Konto, mit einer Erinnerung vor jeder Verlängerung. Keine Wochenabos, keine Testphasen, die heimlich kostenpflichtig werden."],
    ["Was bleibt für immer gratis?", "Jeder Test mit vollem Ergebnis, dein Basis-Horoskop, der einfache Kompatibilitätswert und das Tageshoroskop für dein Zeichen."],
    ["Wie kann ich zahlen?", "Kartenzahlung kommt bald. Bis dahin ist alles, was du siehst, gratis, und dein Profil bleibt erhalten, wenn die Pläne starten."],
    ["Welche Sprachen?", "Die Seite gibt es auf Deutsch, Englisch und Mazedonisch. Du kannst jederzeit oben über die Flagge wechseln."],
    ["Sind die Preise inklusive MwSt.?", "Ja. Der Preis, den du siehst, ist der Preis, den du zahlst, in Euro."],
  ] },
  bottom: { title: "Starte mit der Gratis-Version", sub: "Erstell dein Horoskop und mach die Tests. Upgrade nur, wenn du mehr willst.", cta: "Gratis starten" },
};

export const pricingText = (lang: string) => ({ en, mk, de } as Record<string, PricingText>)[lang] ?? en;
