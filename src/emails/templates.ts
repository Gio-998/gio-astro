/**
 * Branded HTML email templates (demo; nothing is sent from here). Table layout + inline styles so they
 * render in Gmail, Outlook and Apple Mail. Supabase variables like {{ .Token }} are kept literally in the
 * sign-in template so the same HTML can be pasted into Supabase > Auth > Email Templates.
 */
export type EmailLang = "en" | "mk";
export type EmailId = "code" | "welcome" | "daily" | "weekly" | "report" | "bond";
export const EMAIL_IDS: EmailId[] = ["code", "welcome", "daily", "weekly", "report", "bond"];
const SITE = "https://horoscop.si";

const T = {
  en: {
    names: { code: "Sign-in code", welcome: "Welcome", daily: "Daily horoscope", weekly: "Weekly newsletter", report: "Compatibility report ready", bond: "Bond Check reminder" },
    footer: "You get this email because you have a Horoscop account.", unsubscribe: "Unsubscribe", prefs: "Email settings", privacy: "Privacy",
    code: { pre: "Your Horoscop code is inside. It works for 1 hour.", title: "Your sign-in code", lead: "Type or paste this code on the sign-in page. It works for one hour.", or: "Or open this link on the same device:", btn: "Sign in to Horoscop", ignore: "Didn't ask for this? You can ignore this email. Nobody can sign in without the code." },
    welcome: { pre: "Your sky is ready. Here's where to start.", title: "Welcome to Horoscop, Elena", lead: "You're one of our first testers, and we're really glad you're here. Your profile, readings and matches now follow you to every device.", steps: ["Open The Book of You, your personal reading in 11 chapters", "Take one of the 7 free tests to unlock deeper layers", "Add a person you care about and read your Bond Story"], btn: "Open my profile", ps: "P.S. Reply to this email any time. A real person reads every message." },
    daily: { pre: "Libra · Moon in Pisces · a soft day for honest talks", title: "Monday, 12 October", sign: "Libra", moon: "Moon in Pisces, waxing crescent", body: "A soft day. The Moon in water makes it easier to say the thing you've been rounding off for a week. Say it plainly, then listen longer than feels natural.", focus: "Focus", focusText: "One honest conversation", card: "Card of the day", cardText: "The Star: hope that comes from looking after yourself", journal: "Journal prompt", journalText: "What would I ask for if I knew the answer was yes?", btn: "Read today in the app" },
    weekly: { pre: "The week ahead: Mercury slows down, Venus warms up", title: "Your week, 12 to 18 October", lead: "Three things in the sky this week, in plain words.", items: [["Mercury slows down", "Double-check plans and messages before Thursday. Old conversations may come back for a better ending."], ["Venus enters Scorpio", "Love gets deeper and more private. Good week to talk about what you really want."], ["First Quarter Moon, Thursday", "A push to act on whatever you started at the New Moon."]], tip: "For Libra", tipText: "Say no once this week, kindly and without a long excuse. Notice how much energy it gives back.", btn: "See my week" },
    report: { pre: "Your Bond Story with Marko is ready to read", title: "Your Bond Story is ready", lead: "We read you and Marko through 14 lenses: stars, numbers, elements and the psychology that holds up.", score: "Overall harmony", bondType: "Bond type", bondTypeText: "The Builders: steady, loyal, slow to start and hard to shake", strength: "Your strongest lens", strengthText: "Care styles: you give exactly what the other one needs", btn: "Read our Bond Story" },
    bond: { pre: "Three minutes, eight questions, one honest check-in", title: "Time for your Bond Check", lead: "It's been a month since you and Marko did your last Bond Check. Eight short questions each, on one phone, about three minutes.", why: "Couples who check in regularly catch small things before they grow. Last time your strongest area was trust, and the one to watch was rest.", btn: "Start the Bond Check", later: "Not now? We'll remind you in a week." },
  },
  mk: {
    names: { code: "Код за најава", welcome: "Добредојде", daily: "Дневен хороскоп", weekly: "Неделен билтен", report: "Извештај за компатибилност", bond: "Потсетник за Проверка на врската" },
    footer: "Ја добиваш оваа порака затоа што имаш профил на Хороскоп.", unsubscribe: "Откажи", prefs: "Поставки за е-пошта", privacy: "Приватност",
    code: { pre: "Еве го твојот код за најава. Важи 1 час.", title: "Твојот код за најава", lead: "Внеси го овој код на страницата за најава. Важи еден час.", or: "Или отвори го овој линк на истиот уред:", btn: "Најави се на Хороскоп", ignore: "Не си побарал/а код? Слободно избриши ја пораката. Без кодот никој не може да се најави." },
    welcome: { pre: "Твоето небо е подготвено. Еве од каде да почнеш.", title: "Добредојде на Хороскоп, Елена", lead: "Ти си меѓу нашите први тестери и навистина ни е мило што си тука. Твојот профил, читањата и споредбите сега те следат на секој уред.", steps: ["Отвори ја Книгата за тебе, твоето лично читање во 11 поглавја", "Направи еден од 7-те бесплатни тестови за подлабоки слоеви", "Додај некој што ти е важен и прочитај ја вашата Приказна за врската"], btn: "Отвори го мојот профил", ps: "П.С. Одговори на оваа порака кога сакаш. Секоја порака ја чита вистински човек." },
    daily: { pre: "Вага · Месечина во Риби · добар ден за искрен разговор", title: "Понеделник, 12 октомври", sign: "Вага", moon: "Месечина во Риби, растечки срп", body: "Нежен ден. Месечината во воден знак ти помага да го кажеш она што цела недела го заобиколуваш. Кажи го едноставно, па слушај подолго отколку што ти е природно.", focus: "Фокус", focusText: "Еден искрен разговор", card: "Карта на денот", cardText: "Ѕвездата: надеж што доаѓа кога се грижиш за себе", journal: "Прашање за дневникот", journalText: "Што би побарал/а ако знаеш дека одговорот е да?", btn: "Види го денот во апликацијата" },
    weekly: { pre: "Неделата пред тебе: Меркур забавува, Венера се загрева", title: "Твојата недела, 12 до 18 октомври", lead: "Три работи на небото оваа недела, со едноставни зборови.", items: [["Меркур забавува", "Провери ги плановите и пораките пред четврток. Стари разговори може да се вратат за подобар крај."], ["Венера влегува во Скорпија", "Љубовта станува подлабока и поприватна. Добра недела да зборувате за она што навистина го сакате."], ["Прва четвртина, четврток", "Поттик да продолжиш со она што го започна на младата Месечина."]], tip: "За Вага", tipText: "Кажи не еднаш оваа недела, љубезно и без долго оправдување. Забележи колку енергија ти враќа тоа.", btn: "Види ја мојата недела" },
    report: { pre: "Вашата Приказна за врската со Марко е подготвена", title: "Вашата Приказна за врската е подготвена", lead: "Те споредивме со Марко од 14 агли: ѕвезди, бројки, елементи и психологија.", score: "Вкупна хармонија", bondType: "Тип на врска", bondTypeText: "Градителите: стабилни, верни, бавно почнуваат, а тешко се разделуваат", strength: "Вашата најсилна леќа", strengthText: "Начини на грижа: си давате токму она што на другиот му треба", btn: "Прочитај ја нашата приказна" },
    bond: { pre: "Три минути, осум прашања, еден искрен разговор", title: "Време е за Проверка на врската", lead: "Помина еден месец од последната Проверка на врската со Марко. По осум кратки прашања, на еден телефон, околу три минути.", why: "Паровите што редовно проверуваат ги фаќаат ситните работи пред да пораснат. Минатиот пат најсилна ви беше довербата, а за внимание беше одморот.", btn: "Почни ја проверката", later: "Не сега? Ќе те потсетиме за една недела." },
  },
} as const;

const C = { night: "#120f2e", card: "#1c1645", ink: "#2b2448", gold: "#f6cf7a", rose: "#f6b5cf", mist: "#ece6ff", dim: "#b9aee0", paper: "#fbf6ee" };
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const btn = (href: string, label: string) => `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:26px auto 6px"><tr><td style="border-radius:999px;background:linear-gradient(90deg,${C.gold},${C.rose});background-color:${C.gold}"><a href="${href}" style="display:inline-block;padding:14px 30px;font:600 16px/1 Helvetica,Arial,sans-serif;color:${C.ink};text-decoration:none;border-radius:999px">${esc(label)} ✦</a></td></tr></table>`;
const h1 = (t: string) => `<h1 style="margin:0 0 12px;font:500 30px/1.15 Georgia,'Times New Roman',serif;color:${C.mist}">${esc(t)}</h1>`;
const p = (t: string, extra = "") => `<p style="margin:0 0 14px;font:16px/1.6 Helvetica,Arial,sans-serif;color:${C.mist};${extra}">${esc(t)}</p>`;
const label = (t: string) => `<p style="margin:0 0 4px;font:600 11px/1.4 Helvetica,Arial,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:${C.gold}">✦ ${esc(t)}</p>`;
const box = (inner: string) => `<div style="margin:16px 0;padding:16px 18px;border-radius:18px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12)">${inner}</div>`;

function layout(lang: EmailLang, pre: string, body: string, opts: { marketing?: boolean } = {}) {
  const L = T[lang];
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark light"><title>Horoscop</title></head>
<body style="margin:0;padding:0;background:${C.night}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(pre)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.night};background-image:radial-gradient(600px 300px at 20% 0%,rgba(139,108,240,.35),transparent 70%),radial-gradient(500px 300px at 90% 100%,rgba(246,181,207,.18),transparent 70%)">
<tr><td align="center" style="padding:28px 14px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">
    <tr><td align="center" style="padding:6px 0 22px"><a href="${SITE}/${lang}/" style="text-decoration:none"><span style="font:600 26px/1 Georgia,serif;letter-spacing:.06em;color:${C.gold}">☾ Horoscop</span></a></td></tr>
    <tr><td style="background:${C.card};border:1px solid rgba(255,255,255,.12);border-radius:28px;padding:34px 28px">${body}</td></tr>
    <tr><td align="center" style="padding:22px 10px;font:12px/1.6 Helvetica,Arial,sans-serif;color:${C.dim}">
      ${esc(L.footer)}<br>
      <a href="mailto:contact@horoscop.si" style="color:${C.dim}">contact@horoscop.si</a><br>
      ${opts.marketing ? `<a href="${SITE}/${lang}/account/" style="color:${C.dim}">${esc(L.unsubscribe)}</a> · <a href="${SITE}/${lang}/account/" style="color:${C.dim}">${esc(L.prefs)}</a> · ` : ""}<a href="${SITE}/${lang}/privacy/" style="color:${C.dim}">${esc(L.privacy)}</a><br>✦ ✧ ✦
    </td></tr>
  </table>
</td></tr></table></body></html>`;
}

export function renderEmail(id: EmailId, lang: EmailLang): { subject: string; html: string } {
  const L = T[lang]; const site = `${SITE}/${lang}`;
  switch (id) {
    case "code": {
      const X = L.code;
      const code = `<div style="margin:22px 0;text-align:center"><span style="display:inline-block;padding:16px 22px;border-radius:18px;background:${C.paper};font:700 34px/1 'Courier New',monospace;letter-spacing:.32em;color:${C.ink}">{{ .Token }}</span></div>`;
      return { subject: lang === "mk" ? "Твојот код за Хороскоп: {{ .Token }}" : "Your Horoscop code: {{ .Token }}", html: layout(lang, X.pre, `${h1(X.title)}${p(X.lead)}${code}${p(X.or, `font-size:13px;color:${C.dim}`)}${btn("{{ .ConfirmationURL }}", X.btn)}${p(X.ignore, `margin-top:18px;font-size:13px;color:${C.dim}`)}`) };
    }
    case "welcome": {
      const X = L.welcome;
      const steps = X.steps.map((s, i) => `<tr><td style="padding:8px 12px 8px 0;vertical-align:top;font:700 18px/1 Georgia,serif;color:${C.gold}">${i + 1}</td><td style="padding:8px 0;font:15px/1.5 Helvetica,Arial,sans-serif;color:${C.mist}">${esc(s)}</td></tr>`).join("");
      return { subject: X.title, html: layout(lang, X.pre, `${h1(X.title)}${p(X.lead)}<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0">${steps}</table>${btn(`${site}/me/`, X.btn)}${p(X.ps, `margin-top:18px;font-size:13px;color:${C.dim}`)}`) };
    }
    case "daily": {
      const X = L.daily;
      return { subject: `${X.sign} · ${X.title}`, html: layout(lang, X.pre, `${label(`${X.sign} · ${X.moon}`)}${h1(X.title)}${p(X.body)}${box(`${label(X.focus)}${p(X.focusText, "margin:0")}`)}${box(`${label(X.card)}${p(X.cardText, "margin:0")}`)}${box(`${label(X.journal)}${p(X.journalText, "margin:0;font-style:italic")}`)}${btn(`${site}/today/`, X.btn)}`, { marketing: true }) };
    }
    case "weekly": {
      const X = L.weekly;
      const items = X.items.map(([t, d]) => box(`<p style="margin:0 0 4px;font:600 17px/1.3 Georgia,serif;color:${C.gold}">${esc(t)}</p>${p(d, "margin:0")}`)).join("");
      return { subject: X.title, html: layout(lang, X.pre, `${h1(X.title)}${p(X.lead)}${items}${box(`${label(X.tip)}${p(X.tipText, "margin:0")}`)}${btn(`${site}/today/`, X.btn)}`, { marketing: true }) };
    }
    case "report": {
      const X = L.report;
      const ring = `<div style="margin:20px 0;text-align:center"><span style="display:inline-block;width:120px;height:120px;border-radius:50%;border:6px solid ${C.gold};font:600 40px/120px Georgia,serif;color:${C.mist}">82</span><p style="margin:8px 0 0;font:12px Helvetica,Arial,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:${C.dim}">${esc(X.score)}</p></div>`;
      return { subject: X.title, html: layout(lang, X.pre, `${h1(X.title)}${p(X.lead)}${ring}${box(`${label(X.bondType)}${p(X.bondTypeText, "margin:0")}`)}${box(`${label(X.strength)}${p(X.strengthText, "margin:0")}`)}${btn(`${site}/match/`, X.btn)}`) };
    }
    case "bond": {
      const X = L.bond;
      return { subject: X.title, html: layout(lang, X.pre, `${h1(X.title)}${p(X.lead)}${box(p(X.why, "margin:0"))}${btn(`${site}/bond/`, X.btn)}${p(X.later, `margin-top:14px;font-size:13px;color:${C.dim};text-align:center`)}`, { marketing: true }) };
    }
  }
}
export const emailName = (id: EmailId, lang: EmailLang) => T[lang].names[id];
