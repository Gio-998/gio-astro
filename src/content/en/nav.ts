/** Header menus, the phone menu sheet and the bottom bar. Hrefs are locale-free. */
export const nav = {
  aria: { utility: "Language and account", quick: "Quick actions", tabs: "Main sections" },
  more: "More", menu: "Menu", close: "Close", account: "Account", language: "Language",
  start: "Start a test", login: "Log in", profile: "My profile",
  tabs: { horoscope: "Horoscope", tests: "Tests", match: "Match", numbers: "Numbers" },
  trust: [
    { icon: "🔒", text: "Private by default", href: "/privacy/" },
    { icon: "✦", text: "Free to use", href: "/promise/" },
    { icon: "↺", text: "No account needed", href: "/promise/" },
  ],
  trustLabel: "Our promise to you",
  method: "How this is measured",
  today: { label: "My day", desc: "Your sky, card and prompt for today" },
  horoscope: { label: "Daily horoscope", desc: "All twelve signs, fresh from today's sky" },
  pricing: { label: "Pricing", desc: "Everything is free for now" },
  groups: {
    astrology: {
      label: "Horoscope", linksTitle: "Horoscopes, zodiac signs and calculators",
      items: [
        { href: "/weekly-horoscope/", icon: "sun", title: "Weekly horoscope", desc: "Your next seven days, sign by sign" },
        { href: "/monthly-horoscope/", icon: "moon", title: "Monthly horoscope", desc: "The month ahead for all twelve signs" },
        { href: "/horoscope-2027/", icon: "eye", title: "Horoscope 2027", desc: "The big themes of the year, by sign" },
        { href: "/zodiac/", icon: "explorer", title: "Zodiac signs", desc: "Dates, traits, love and work for each sign" },
        { href: "/birth-chart/", icon: "chart", title: "Birth chart calculator", desc: "Planets and houses from your birth data" },
        { href: "/rising-sign/", icon: "yinyang", title: "Rising sign calculator", desc: "Find your ascendant from time and place" },
        { href: "/moon-sign/", icon: "moon", title: "Moon sign calculator", desc: "Where the Moon stood when you were born" },
        { href: "/moon-calendar/", icon: "moon", title: "Moon calendar", desc: "New moons, full moons and every phase" },
        { href: "/mercury-retrograde/", icon: "vedic", title: "Mercury retrograde", desc: "The dates and what they mean" },
      ],
    },
    tests: {
      label: "Tests",
      allHref: "/quizzes/", allTitle: "All tests", allDesc: "Pick one, one to three minutes each",
      play: { href: "/play/", title: "Play Mirror games", desc: "Behaviour, not self-report: risk, trust, patience, focus" },
      deep: { href: "/deep/", title: "Deep Read", desc: "Hard choices and gut reactions, adapts to you" },
    },
    bonds: {
      label: "Compatibility",
      items: [
        { href: "/sign-compatibility/", icon: "bond", title: "Zodiac compatibility", desc: "How any two signs get along" },
        { href: "/match/", icon: "care", title: "Compare two people", desc: "From birth dates, with things to try" },
        { href: "/bond/", icon: "attachment", title: "Bond Check", desc: "Ten questions each, answered together" },
      ],
    },
    numerology: {
      label: "Numerology",
      items: [
        { href: "/numerology/", icon: "number", title: "Numerology", desc: "Angel numbers, life path and calculators" },
        { href: "/numerology/angel-numbers/", icon: "eye", title: "Angel numbers", desc: "What repeating numbers can mean" },
        { href: "/numerology/calculator/life-path/", icon: "yinyang", title: "Life path calculator", desc: "Your number from your birth date" },
        { href: "/numerology/life-path/", icon: "sun", title: "Life path numbers", desc: "What each number stands for" },
        { href: "/numerology/mirror-hours/", icon: "moon", title: "Mirror hours", desc: "When 11:11 and 22:22 keep showing up" },
        { href: "/numerology/compatibility/", icon: "bond", title: "Number compatibility", desc: "How two life paths fit together" },
      ],
    },
    me: {
      label: "My profile",
      items: [
        { href: "/me/", icon: "sun", title: "My profile", desc: "Signs, numbers and results in one place" },
        { href: "/today/", icon: "moon", title: "My day", desc: "Your sky, card and prompt for today" },
        { href: "/book/", icon: "eye", title: "The Book of You", desc: "Your personal reading, chapter by chapter" },
        { href: "/chart/", icon: "chart", title: "Birth chart", desc: "The full wheel with planets and houses" },
        { href: "/people/", icon: "care", title: "People", desc: "Everyone you saved, ready to compare" },
        { href: "/account/", icon: "yinyang", title: "Account", desc: "Log in, back up and sync" },
      ],
    },
    more: {
      label: "More",
      items: [
        { href: "/blog/", icon: "palette", title: "Blog", desc: "Stories on signs, love and the inner life" },
        { href: "/how-it-works/", icon: "number", title: "How it works", desc: "How each reading is made" },
        { href: "/learn/", icon: "eye", title: "Methods and sources", desc: "Calculations, studies and honesty" },
        { href: "/promise/", icon: "temperament", title: "Our promise", desc: "Clear rules, honest results" },
      ],
    },
  },
};
export type Nav = typeof nav;
export type NavGroupKey = keyof typeof nav.groups;
