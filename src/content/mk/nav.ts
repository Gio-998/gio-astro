import type { Nav } from "../en/nav";

export const nav: Nav = {
  aria: { utility: "Јазик и сметка", quick: "Брзи акции", tabs: "Главни делови" },
  more: "Повеќе", menu: "Мени", close: "Затвори", account: "Сметка", language: "Јазик",
  trust: [
    { icon: "🔒", text: "Приватно, секогаш", href: "/privacy/" },
    { icon: "✦", text: "Сè бесплатно", href: "/promise/" },
    { icon: "↺", text: "Откажи кога сакаш", href: "/promise/" },
  ],
  trustLabel: "Нашето ветување за тебе",
  method: "Како се мери ова",
  today: { label: "Денес", desc: "Твоето небо, карта и прашање за денот" },
  horoscope: { label: "Дневен хороскоп", desc: "Сите 12 знаци, секој ден ново" },
  pricing: { label: "Цени", desc: "Планови, извештаи и што е бесплатно" },
  groups: {
    astrology: {
      label: "Астрологија", linksTitle: "Хороскопи, знаци и калкулатори",
      feature: { title: "Твоето небо, објаснето", text: "Знаци, компатибилност, календари и калкулатори на едно место.", cta: "Кон хороскопските знаци" },
      items: [
        { href: "/weekly-horoscope/", icon: "sun", title: "Неделен хороскоп", desc: "Твоите следни седум дена, знак по знак" },
        { href: "/monthly-horoscope/", icon: "moon", title: "Месечен хороскоп", desc: "Месецот пред тебе за сите 12 знаци" },
        { href: "/horoscope-2027/", icon: "eye", title: "Хороскоп 2027", desc: "Големите теми на годината по знаци" },
        { href: "/zodiac/", icon: "explorer", title: "Хороскопски знаци", desc: "Датуми, особини, љубов и работа" },
        { href: "/sign-compatibility/", icon: "bond", title: "Компатибилност на знаци", desc: "Како се сложуваат два знака" },
        { href: "/birth-chart/", icon: "chart", title: "Калкулатор за натална карта", desc: "Планети и куќи од твоите податоци за раѓање" },
        { href: "/rising-sign/", icon: "yinyang", title: "Калкулатор за асцендент", desc: "Твојот подзнак од времето и местото на раѓање" },
        { href: "/moon-sign/", icon: "moon", title: "Калкулатор за месечев знак", desc: "Каде била Месечината при твоето раѓање" },
        { href: "/moon-calendar/", icon: "moon", title: "Месечев календар", desc: "Млада и полна месечина и сите мени" },
        { href: "/mercury-retrograde/", icon: "vedic", title: "Ретрограден Меркур", desc: "Датумите и што значат" },
      ],
    },
    me: {
      label: "Јас", feature: { title: "Сè за тебе, на едно место", text: "Знаци, бројки, аура и резултати.", cta: "Отвори го профилот" },
      items: [
        { href: "/me/", icon: "sun", title: "Мој профил", desc: "Знаци, бројки и резултати на едно место" },
        { href: "/book/", icon: "eye", title: "Книгата за тебе", desc: "Твоето лично читање, поглавје по поглавје" },
        { href: "/chart/", icon: "chart", title: "Натална карта", desc: "Сите планети и домови" },
        { href: "/start/?attune=1", icon: "yinyang", title: "Освежи ја аурата", desc: "Според тоа како си денес" },
      ],
    },
    bonds: {
      label: "Врски", feature: { title: "Кој ти одговара и како?", text: "Спореди се со кого сакаш.", cta: "Провери компатибилност" },
      items: [
        { href: "/match/", icon: "bond", title: "Компатибилност", desc: "Кои било двајца, со совети" },
        { href: "/bond/", icon: "attachment", title: "Проверка на врска", desc: "Осум прашања на кои одговарате заедно" },
        { href: "/people/", icon: "care", title: "Луѓе", desc: "Твоите зачувани луѓе" },
        { href: "/play/", icon: "tarot", title: "Мини игри", desc: "Брзи игри за тоа како постапуваш" },
      ],
    },
    tests: {
      label: "Тестови", feature: { title: "Седум кратки тестови", text: "Секој открива нешто ново. Сè бесплатно.", cta: "Сите тестови" },
      allHref: "/quizzes/", allTitle: "Сите тестови", allDesc: "Избери еден, по три минути",
      play: { href: "/play/", title: "Мини игри", desc: "Ризик, доверба, трпение и фокус" },
      deep: { href: "/deep/", title: "Длабоко читање", desc: "Тешки избори, прашања по мерка" },
    },
    discover: {
      label: "Откриј", feature: { title: "Без тајни", text: "Како пресметуваме и што вели науката.", cta: "Како функционира" },
      items: [
        { href: "/numerology/", icon: "number", title: "Нумерологија", desc: "Ангелски броеви, патека на животот, калкулатори" },
        { href: "/daily/", icon: "moon", title: "Дневно по знак", desc: "Порака за секој знак" },
        { href: "/blog/", icon: "palette", title: "Блог", desc: "Знаци, љубов и душа" },
        { href: "/learn/", icon: "number", title: "Како функционира", desc: "Методи и искреност" },
        { href: "/promise/", icon: "temperament", title: "Нашето ветување", desc: "Јасни цени, чесни резултати" },
      ],
    },
  },
};
