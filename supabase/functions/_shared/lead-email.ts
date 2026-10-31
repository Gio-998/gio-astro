/**
 * The one email a lead gets, and every link it can contain. Server-side templates only.
 * Client values allowed in here: a first name that passed firstName() and is escaped, and a test id checked against TESTS.
 * Same look as src/emails/templates.ts, which cannot be imported here: it needs the Next.js path alias, and Deno runs this file with no build step.
 * To add a language, add one entry to TEXT and one name per test to TESTS. Until then that locale falls back to English.
 */
export const SITE = "https://horoscop.si";
export const FROM = "Horoscop <no-reply@horoscop.si>";
export const REPLY_TO = "contact@horoscop.si";

type Names = Record<string, string> & { en: string };
/** Test ids that may appear in an email or a link. Keep in step with ALL_QUIZ_IDS (tests/lead-email.test.ts checks it). */
export const TESTS: Record<string, Names> = {
  "big-five": { en: "Big Five", mk: "Големите пет", de: "Big Five", sr: "Velikih pet" },
  "big-five-long": { en: "Big Five, full version", mk: "Големите пет, цела верзија", de: "Big Five, ausführlich", sr: "Velikih pet, puna verzija" },
  attachment: { en: "Attachment style", mk: "Приврзаност", de: "Bindungsstil", sr: "Stil vezivanja" },
  nine: { en: "Nine motivations", mk: "Девет мотивации", de: "Neun Motive", sr: "Devet motivacija" },
  care: { en: "Care styles", mk: "Начини на грижа", de: "Zuwendungsstile", sr: "Stilovi brige" },
  shadow: { en: "Shadow and light", mk: "Сенка и светлина", de: "Schatten und Licht", sr: "Senka i svetlo" },
  dosha: { en: "Body type", mk: "Тип на тело", de: "Körpertyp", sr: "Tip tela" },
  explorer: { en: "Autopilot or explorer", mk: "Автопилот или истражувач", de: "Autopilot oder Entdecker", sr: "Autopilot ili istraživač" },
  "four-letter": { en: "Four-letter type", mk: "Тип од четири букви", de: "Vier-Buchstaben-Typ", sr: "Tip od četiri slova" },
};

const TEXT = {
  en: {
    subject: "Your way back to Horoscop",
    pre: "Your results stay on this device. Here is how to get back to them.",
    hello: (n: string | null) => (n ? `Hi ${n},` : "Hi,"),
    lead: "Thanks for trying Horoscop.",
    leadTest: (t: string) => `Thanks for taking the ${t} test on Horoscop.`,
    device: "Your results stay on this device. They are not in this email, and we never see your answers.",
    openHint: "Open the link in the same browser you used for the test.",
    open: "Open my results", test: "Back to the test", tests: "See all tests",
    confirmTitle: "One click for the news",
    confirmText: "You ticked the box for occasional news from Horoscop. Please confirm that this was you. Without this click we send you no news, and your results are not affected either way. The link works for 30 days.",
    confirm: "Yes, send me news",
    notYou: "Didn't ask for this? Then someone typed your address by mistake. You can ignore this email.",
    footer: "You get this email because this address was entered on horoscop.si.",
    unsubscribe: "Unsubscribe", privacy: "Privacy",
  },
  mk: {
    subject: "Твојот пат назад до Хороскоп",
    pre: "Твоите резултати остануваат на овој уред. Еве како да се вратиш до нив.",
    hello: (n: string | null) => (n ? `Здраво ${n},` : "Здраво,"),
    lead: "Ти благодариме што го проба Хороскоп.",
    leadTest: (t: string) => `Ти благодариме што го направи тестот „${t}“ на Хороскоп.`,
    device: "Твоите резултати остануваат на овој уред. Ги нема во оваа порака, а твоите одговори никогаш не ги гледаме.",
    openHint: "Отвори го линкот во истиот прелистувач во кој го правеше тестот.",
    open: "Отвори ги моите резултати", test: "Назад кон тестот", tests: "Сите тестови",
    confirmTitle: "Еден клик за новостите",
    confirmText: "Го штиклира полето за повремени новости од Хороскоп. Потврди дека тоа беше ти. Без овој клик не ти праќаме новости, а твоите резултати не зависат од тоа. Линкот важи 30 дена.",
    confirm: "Да, прати ми новости",
    notYou: "Не си го побарал/а ова? Тогаш некој по грешка ја внел твојата адреса. Слободно игнорирај ја пораката.",
    footer: "Ја добиваш оваа порака затоа што оваа адреса е внесена на horoscop.si.",
    unsubscribe: "Одјави се", privacy: "Приватност",
  },
  de: {
    subject: "Dein Weg zurück zu Horoscop",
    pre: "Deine Ergebnisse bleiben auf diesem Gerät. So kommst du wieder zu ihnen.",
    hello: (n: string | null) => (n ? `Hallo ${n},` : "Hallo,"),
    lead: "Schön, dass du Horoscop ausprobiert hast.",
    leadTest: (t: string) => `Schön, dass du den Test „${t}“ bei Horoscop gemacht hast.`,
    device: "Deine Ergebnisse bleiben auf diesem Gerät. Sie stehen nicht in dieser E-Mail, und deine Antworten sehen wir nie.",
    openHint: "Öffne den Link im selben Browser, in dem du den Test gemacht hast.",
    open: "Meine Ergebnisse öffnen", test: "Zurück zum Test", tests: "Alle Tests ansehen",
    confirmTitle: "Ein Klick für die Neuigkeiten",
    confirmText: "Du hast das Feld für gelegentliche Neuigkeiten von Horoscop angehakt. Bitte bestätige, dass du das warst. Ohne diesen Klick bekommst du keine Neuigkeiten, und deine Ergebnisse hängen nicht davon ab. Der Link gilt 30 Tage.",
    confirm: "Ja, schickt mir Neuigkeiten",
    notYou: "Du hast das nicht angefordert? Dann hat jemand deine Adresse versehentlich eingetippt. Du kannst diese E-Mail ignorieren.",
    footer: "Du bekommst diese E-Mail, weil diese Adresse auf horoscop.si eingegeben wurde.",
    unsubscribe: "Abmelden", privacy: "Datenschutz",
  },
  sr: {
    subject: "Tvoj put nazad do sajta Horoscop",
    pre: "Tvoji rezultati ostaju na ovom uređaju. Evo kako da im se vratiš.",
    hello: (n: string | null) => (n ? `Zdravo, ${n}!` : "Zdravo!"),
    lead: "Hvala što isprobavaš Horoscop.",
    leadTest: (t: string) => `Hvala za test „${t}“ na sajtu Horoscop.`,
    device: "Tvoji rezultati ostaju na ovom uređaju. Nisu u ovom mejlu, a tvoje odgovore nikad ne vidimo.",
    openHint: "Otvori link u istom pregledaču u kom je rađen test.",
    open: "Otvori moje rezultate", test: "Nazad na test", tests: "Pogledaj sve testove",
    confirmTitle: "Jedan klik za novosti",
    confirmText: "Polje za povremene novosti sa sajta Horoscop je označeno. Potvrdi da je to tvoj izbor. Bez ovog klika ne šaljemo ti novosti, a tvoji rezultati ni u jednom slučaju ne zavise od toga. Link važi 30 dana.",
    confirm: "Da, šaljite mi novosti",
    notYou: "Ovo nije od tebe? Onda je neko greškom upisao tvoju adresu. Možeš da ignorišeš ovaj mejl.",
    footer: "Ovaj mejl dobijaš zato što je ova adresa uneta na sajtu horoscop.si.",
    unsubscribe: "Odjavi se", privacy: "Privatnost",
  },
};
type Lang = keyof typeof TEXT;

export const emailLocale = (locale: string): Lang => (Object.hasOwn(TEXT, locale) ? (locale as Lang) : "en");
/** The id used for "once per address per source". Unknown sources share one key, so changing the source string cannot buy more emails. */
export const emailSource = (source: string) => (Object.hasOwn(TESTS, source) ? source : "other");

export const testUrl = (locale: string, id: string) => `${SITE}/${emailLocale(locale)}/quiz/${id}/`;
export const testsUrl = (locale: string) => `${SITE}/${emailLocale(locale)}/quizzes/`;
export const resultsUrl = (locale: string) => `${SITE}/${emailLocale(locale)}/me/`;
export const privacyUrl = (locale: string) => `${SITE}/${emailLocale(locale)}/privacy/`;
/** Tokens travel in the fragment, so they stay out of the web host's logs. The page asks for a click before anything changes. */
export const actionUrl = (locale: string, action: "confirm" | "unsubscribe", token: string) => `${SITE}/${emailLocale(locale)}/email/#a=${action}&t=${token}`;
export const statusUrl = (locale: string, status: string) => `${SITE}/${emailLocale(locale)}/email/#s=${status}`;

const C = { night: "#120f2e", card: "#1c1645", ink: "#2b2448", gold: "#f6cf7a", rose: "#f6b5cf", mist: "#ece6ff", dim: "#b9aee0" };
export const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const btn = (href: string, label: string) => `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:22px auto 6px"><tr><td style="border-radius:999px;background:linear-gradient(90deg,${C.gold},${C.rose});background-color:${C.gold}"><a href="${esc(href)}" style="display:inline-block;padding:14px 26px;font:600 16px/1.3 Helvetica,Arial,sans-serif;color:${C.ink};text-align:center;text-decoration:none;border-radius:999px">${esc(label)} ✦</a></td></tr></table>`;
const p = (t: string, extra = "") => `<p style="margin:0 0 14px;font:16px/1.6 Helvetica,Arial,sans-serif;color:${C.mist};${extra}">${esc(t)}</p>`;

export interface WelcomeInput { locale: string; firstName: string | null; source: string; unsubscribeToken: string; confirmToken: string | null }

export function renderWelcome(input: WelcomeInput): { subject: string; html: string; text: string } {
  const lang = emailLocale(input.locale); const L = TEXT[lang];
  const test = Object.hasOwn(TESTS, input.source) ? input.source : null;
  const testName = test ? TESTS[test][lang] ?? TESTS[test].en : null;
  const lead = testName ? L.leadTest(testName) : L.lead;
  const back = test ? { href: testUrl(lang, test), label: L.test } : { href: testsUrl(lang), label: L.tests };
  const confirm = input.confirmToken ? actionUrl(lang, "confirm", input.confirmToken) : null;
  const unsubscribe = actionUrl(lang, "unsubscribe", input.unsubscribeToken);
  const privacy = privacyUrl(lang);

  const html = `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark light"><title>Horoscop</title></head>
<body style="margin:0;padding:0;background:${C.night}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(L.pre)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.night}"><tr><td align="center" style="padding:28px 14px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">
    <tr><td align="center" style="padding:6px 0 22px"><a href="${SITE}/${lang}/" style="text-decoration:none"><span style="font:600 26px/1 Georgia,serif;letter-spacing:.06em;color:${C.gold}">☾ Horoscop</span></a></td></tr>
    <tr><td style="background:${C.card};border:1px solid rgba(255,255,255,.12);border-radius:28px;padding:34px 28px">
      <h1 style="margin:0 0 12px;font:500 30px/1.15 Georgia,'Times New Roman',serif;color:${C.mist}">${esc(L.hello(input.firstName))}</h1>
      ${p(lead)}${p(L.device)}
      ${btn(resultsUrl(lang), L.open)}
      ${p(L.openHint, `margin-top:10px;font-size:13px;color:${C.dim};text-align:center`)}
      <p style="margin:0 0 6px;text-align:center;font:15px/1.5 Helvetica,Arial,sans-serif"><a href="${esc(back.href)}" style="color:${C.gold}">${esc(back.label)}</a></p>
      ${confirm ? `<div style="margin:22px 0 4px;padding:18px;border-radius:18px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12)"><p style="margin:0 0 6px;font:600 17px/1.3 Georgia,serif;color:${C.gold}">${esc(L.confirmTitle)}</p>${p(L.confirmText, "margin:0")}${btn(confirm, L.confirm)}</div>` : ""}
      ${p(L.notYou, `margin:18px 0 0;font-size:13px;color:${C.dim}`)}
    </td></tr>
    <tr><td align="center" style="padding:22px 10px;font:12px/1.6 Helvetica,Arial,sans-serif;color:${C.dim}">
      ${esc(L.footer)}<br>
      <a href="mailto:${REPLY_TO}" style="color:${C.dim}">${REPLY_TO}</a><br>
      <a href="${esc(unsubscribe)}" style="color:${C.dim}">${esc(L.unsubscribe)}</a> · <a href="${esc(privacy)}" style="color:${C.dim}">${esc(L.privacy)}</a>
    </td></tr>
  </table>
</td></tr></table></body></html>`;

  const text = [
    L.hello(input.firstName), "", lead, L.device, "",
    `${L.open}: ${resultsUrl(lang)}`, L.openHint, `${back.label}: ${back.href}`,
    ...(confirm ? ["", L.confirmTitle, L.confirmText, `${L.confirm}: ${confirm}`] : []),
    "", L.notYou, "", L.footer, REPLY_TO, `${L.unsubscribe}: ${unsubscribe}`, `${L.privacy}: ${privacy}`,
  ].join("\n");

  return { subject: L.subject, html, text };
}
