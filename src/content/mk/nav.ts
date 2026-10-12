import type { Nav } from "../en/nav";

export const nav: Nav = {
  more: "Повеќе", menu: "Мени", close: "Затвори", account: "Сметка", language: "Јазик",
  trust: [
    { icon: "🤝", text: "Без трикови", href: "/promise/" },
    { icon: "🔒", text: "Приватно по основа", href: "/privacy/" },
    { icon: "✦", text: "Целосни резултати бесплатно", href: "/promise/" },
    { icon: "↺", text: "Откажи кога сакаш", href: "/promise/" },
  ],
  trustLabel: "Нашето ветување за тебе",
  method: "Како се мери ова",
  today: { label: "Денес", desc: "Твоето небо, карта и прашање за денот" },
  groups: {
    me: {
      label: "Јас", feature: { title: "Целата ти, на една страница", text: "Знаци, бројки, аура и сите резултати, за еден поглед.", cta: "Отвори го профилот" },
      items: [
        { href: "/me/", icon: "sun", title: "Мој профил", desc: "Знаци, бројки и резултати на едно место" },
        { href: "/book/", icon: "eye", title: "Книгата за тебе", desc: "Твоето лично читање, поглавје по поглавје" },
        { href: "/chart/", icon: "chart", title: "Натална карта", desc: "Целото коло со планети и куќи" },
        { href: "/start/?attune=1", icon: "yinyang", title: "Повторно усогласи ја аурата", desc: "Нека аурата се смени според тоа како се чувствуваш денес" },
      ],
    },
    bonds: {
      label: "Врски", feature: { title: "Кој ти одговара и како?", text: "Спореди секого што го сакаш, со кого работиш или за кого се прашуваш, низ сите леќи.", cta: "Провери компатибилност" },
      items: [
        { href: "/match/", icon: "bond", title: "Компатибилност", desc: "Било кои двајца, сите леќи, со вежби" },
        { href: "/bond/", icon: "attachment", title: "Проверка на врска", desc: "Осум прашања на кои одговарате заедно" },
        { href: "/people/", icon: "care", title: "Луѓе", desc: "Сите што си ги зачувал/а, спремни за споредба" },
        { href: "/play/", icon: "tarot", title: "Play Mirror", desc: "Кратки игри со пријател" },
      ],
    },
    tests: {
      label: "Тестови", feature: { title: "Седум кратки теста", text: "Секој додава слој на твојот профил. Целосните резултати се бесплатни.", cta: "Сите тестови" },
      allHref: "/quizzes/", allTitle: "Сите тестови", allDesc: "Избери еден, по три минути",
      play: { href: "/play/", title: "Play Mirror игри", desc: "Лесни игри за двајца, за споделување" },
    },
    discover: {
      label: "Откриј", feature: { title: "Искрено, по дизајн", text: "Како е направена секоја бројка, што вели науката, а што не.", cta: "Како функционира" },
      items: [
        { href: "/daily/", icon: "moon", title: "Дневно по знак", desc: "Денешна порака за сите дванаесет знаци" },
        { href: "/blog/", icon: "palette", title: "Блог", desc: "Приказни за знаци, љубов и внатрешниот живот" },
        { href: "/learn/", icon: "number", title: "Како функционира", desc: "Методи, извори и искреност" },
        { href: "/premium/", icon: "vedic", title: "Премиум", desc: "Подлабоки извештаи, наскоро" },
        { href: "/promise/", icon: "temperament", title: "Нашето ветување", desc: "Без трикови, без лажна итност" },
      ],
    },
  },
};
