/** Header mega-menus + phone "More" sheet. Hrefs are locale-free; /play, /daily, /blog and /premium are new routes. */
export const nav = {
  more: "More", menu: "Menu", close: "Close", account: "Account", language: "Language",
  trust: [
    { icon: "🔒", text: "Private by default", href: "/privacy/" },
    { icon: "✦", text: "Free full results", href: "/promise/" },
    { icon: "↺", text: "Cancel anytime", href: "/promise/" },
  ],
  trustLabel: "Our promise to you",
  method: "How this is measured",
  today: { label: "Today", desc: "Your sky, card and prompt for the day" },
  horoscope: { label: "Daily horoscope", desc: "All twelve signs, fresh from today's sky" },
  pricing: { label: "Pricing", desc: "Plans, reports and what stays free" },
  groups: {
    me: {
      label: "Me", feature: { title: "Your whole self, one page", text: "Signs, numbers, aura and every test result, read in a glance.", cta: "Open my profile" },
      items: [
        { href: "/me/", icon: "sun", title: "My profile", desc: "Signs, numbers and results in one place" },
        { href: "/book/", icon: "eye", title: "The Book of You", desc: "Your personal reading, chapter by chapter" },
        { href: "/chart/", icon: "chart", title: "Birth chart", desc: "The full wheel with planets and houses" },
        { href: "/start/?attune=1", icon: "yinyang", title: "Re-attune my aura", desc: "Let your aura shift with how you feel today" },
      ],
    },
    bonds: {
      label: "Bonds", feature: { title: "Who fits you, and how?", text: "Compare anyone you love, work with or wonder about, across every lens.", cta: "Check a match" },
      items: [
        { href: "/match/", icon: "bond", title: "Compatibility", desc: "Any two people, every lens, with practices" },
        { href: "/bond/", icon: "attachment", title: "Bond Check", desc: "Eight questions you answer together" },
        { href: "/people/", icon: "care", title: "People", desc: "Everyone you saved, ready to compare" },
        { href: "/play/", icon: "tarot", title: "Play Mirror", desc: "Seven quick games that show how you act" },
      ],
    },
    tests: {
      label: "Tests", feature: { title: "Seven short tests", text: "Each one adds a layer to your profile. Full results are free.", cta: "See all tests" },
      allHref: "/quizzes/", allTitle: "All tests", allDesc: "Pick one, three minutes each",
      play: { href: "/play/", title: "Play Mirror games", desc: "Behaviour, not self-report: risk, trust, patience, focus" },
      deep: { href: "/deep/", title: "Deep Read", desc: "Hard choices and gut reactions, adapts to you" },
    },
    discover: {
      label: "Discover", feature: { title: "Honest by design", text: "How every number is made, what science says, and what it doesn't.", cta: "How it works" },
      items: [
        { href: "/daily/", icon: "moon", title: "Daily by sign", desc: "Today's note for all twelve signs" },
        { href: "/blog/", icon: "palette", title: "Blog", desc: "Stories on signs, love and the inner life" },
        { href: "/learn/", icon: "number", title: "How it works", desc: "Methods and honesty" },
        { href: "/promise/", icon: "temperament", title: "Our promise", desc: "Clear prices, honest results" },
      ],
    },
  },
};
export type Nav = typeof nav;
export type NavGroupKey = keyof typeof nav.groups;
