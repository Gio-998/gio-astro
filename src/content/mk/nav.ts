import type { Nav } from "../en/nav";

export const nav: Nav = {
  aria: { utility: "Јазик и сметка", quick: "Брзи акции", tabs: "Главни делови" },
  more: "Повеќе", menu: "Мени", close: "Затвори", account: "Сметка", language: "Јазик",
  start: "Започни тест", login: "Најави се", profile: "Мој профил",
  tabs: { horoscope: "Хороскоп", tests: "Тестови", match: "Врски", numbers: "Броеви" },
  trust: [
    { icon: "🔒", text: "Приватно, секогаш", href: "/privacy/" },
    { icon: "✦", text: "Бесплатно за користење", href: "/promise/" },
    { icon: "↺", text: "Без сметка", href: "/promise/" },
  ],
  trustLabel: "Нашето ветување за тебе",
  method: "Како се мери ова",
  today: { label: "Мојот ден", desc: "Твоето небо, карта и прашање за денес" },
  horoscope: { label: "Дневен хороскоп", desc: "Сите 12 знаци, секој ден ново" },
  pricing: { label: "Цени", desc: "Засега сè е бесплатно" },
  groups: {
    astrology: {
      label: "Хороскоп", linksTitle: "Хороскопи, знаци и калкулатори",
      items: [
        { href: "/weekly-horoscope/", icon: "sun", title: "Неделен хороскоп", desc: "Твоите следни седум дена, знак по знак" },
        { href: "/monthly-horoscope/", icon: "moon", title: "Месечен хороскоп", desc: "Месецот пред тебе за сите 12 знаци" },
        { href: "/horoscope-2027/", icon: "eye", title: "Хороскоп 2027", desc: "Големите теми на годината по знаци" },
        { href: "/zodiac/", icon: "explorer", title: "Хороскопски знаци", desc: "Датуми, особини, љубов и работа" },
        { href: "/birth-chart/", icon: "chart", title: "Калкулатор за натална карта", desc: "Планети и куќи од твоите податоци за раѓање" },
        { href: "/rising-sign/", icon: "yinyang", title: "Калкулатор за асцендент", desc: "Твојот подзнак од времето и местото на раѓање" },
        { href: "/moon-sign/", icon: "moon", title: "Калкулатор за месечев знак", desc: "Каде била Месечината при твоето раѓање" },
        { href: "/moon-calendar/", icon: "moon", title: "Месечев календар", desc: "Млада и полна месечина и сите мени" },
        { href: "/mercury-retrograde/", icon: "vedic", title: "Ретрограден Меркур", desc: "Датумите и што значат" },
      ],
    },
    tests: {
      label: "Тестови",
      allHref: "/quizzes/", allTitle: "Сите тестови", allDesc: "Избери еден, од една до три минути",
      play: { href: "/play/", title: "Мини игри", desc: "Ризик, доверба, трпение и фокус" },
      deep: { href: "/deep/", title: "Длабоко читање", desc: "Тешки избори, прашања по мерка" },
    },
    bonds: {
      label: "Компатибилност",
      items: [
        { href: "/sign-compatibility/", icon: "bond", title: "Компатибилност на знаци", desc: "Како се сложуваат два знака" },
        { href: "/match/", icon: "care", title: "Спореди двајца луѓе", desc: "Од датумите на раѓање, со совети" },
        { href: "/bond/", icon: "attachment", title: "Проверка на врска", desc: "По десет прашања, одговарате заедно" },
      ],
    },
    numerology: {
      label: "Нумерологија",
      items: [
        { href: "/numerology/", icon: "number", title: "Нумерологија", desc: "Ангелски броеви, патека на животот, калкулатори" },
        { href: "/numerology/angel-numbers/", icon: "eye", title: "Ангелски броеви", desc: "Што можат да значат броевите што се повторуваат" },
        { href: "/numerology/calculator/life-path/", icon: "yinyang", title: "Калкулатор за животен пат", desc: "Твојот број од датумот на раѓање" },
        { href: "/numerology/life-path/", icon: "sun", title: "Броеви на животниот пат", desc: "Што значи секој број" },
        { href: "/numerology/mirror-hours/", icon: "moon", title: "Огледални часови", desc: "Кога постојано гледаш 11:11 или 22:22" },
        { href: "/numerology/compatibility/", icon: "bond", title: "Компатибилност на броеви", desc: "Како се спојуваат два животни пата" },
      ],
    },
    me: {
      label: "Мој профил",
      items: [
        { href: "/me/", icon: "sun", title: "Мој профил", desc: "Знаци, бројки и резултати на едно место" },
        { href: "/today/", icon: "moon", title: "Мојот ден", desc: "Твоето небо, карта и прашање за денес" },
        { href: "/book/", icon: "eye", title: "Книгата за тебе", desc: "Твоето лично читање, поглавје по поглавје" },
        { href: "/chart/", icon: "chart", title: "Натална карта", desc: "Сите планети и домови" },
        { href: "/people/", icon: "care", title: "Луѓе", desc: "Твоите зачувани луѓе" },
        { href: "/account/", icon: "yinyang", title: "Сметка", desc: "Најава, резервна копија и синхронизација" },
      ],
    },
    more: {
      label: "Повеќе",
      items: [
        { href: "/blog/", icon: "palette", title: "Блог", desc: "Знаци, љубов и душа" },
        { href: "/how-it-works/", icon: "number", title: "Како функционира", desc: "Како се прави секое читање" },
        { href: "/learn/", icon: "eye", title: "Методи и извори", desc: "Пресметки, истражувања и искреност" },
        { href: "/promise/", icon: "temperament", title: "Нашето ветување", desc: "Јасни правила, чесни резултати" },
      ],
    },
  },
};
