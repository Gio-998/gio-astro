/** Home page copy. Titles are [before, highlighted, after]. */
export const landing = {
  signs: { more: "More from the sky" },
  tests: { eyebrow: "Personality tests", title: ["Seven short tests, ", "all free", ""], sub: "One to three minutes each. No account and no birth date: pick one and the first question is on your screen.", all: "See all tests" },
  pairs: {
    eyebrow: "Compatibility", title: ["How two people ", "fit together", ""], sub: "Start with your signs, or compare two real people from their birth dates.",
    cards: [
      { t: "Zodiac compatibility", d: "Any two signs, in plain words." },
      { t: "Compare two people", d: "Birth dates are enough. Test results add depth." },
      { t: "Bond Check", d: "Ten questions each, answered side by side." },
    ],
  },
  how: {
    eyebrow: "How it works", title: ["Three simple steps", "", ""], more: "How each reading is made",
    steps: [
      ["Pick a test", "It starts right away. Your progress saves on this device after every answer, so you can stop and come back."],
      ["See your result", "A short preview appears at once. Leave your name and email to open the full result. You do this once per device."],
      ["Go further if you like", "Add your birth date for your chart, your day and compatibility. We only ask when a page really needs it."],
    ] as [string, string][],
  },
  trust: {
    eyebrow: "Our promise", title: ["Hope without fake certainty. ", "Value without traps.", ""], read: "Read the promise",
    items: ["Free to use right now, with no card and no paywall at the end", "Astrology and numerology are mirrors for reflection, never predictions", "We say what has research behind it and what is tradition", "No fake urgency, no “psychic is typing”, no fake reviews"],
  },
  faqTitle: "Good to know",
  faq: [
    ["Is it really free?", "Yes. Every test, chart and compatibility report here is free right now, with no card and no paywall at the end. Optional paid extras may come later, and their prices will be published first."],
    ["Do I need an account?", "No. Tests, horoscopes and numerology all work without one. An optional free account backs up your profile and syncs it between your devices."],
    ["Why do you ask for my name and email?", "After a test you see a short preview at once. Your name and email then open the full result, and every other result on this device stays open after that. Results show on screen, and marketing email is a separate choice you can skip."],
    ["Where is my data stored?", "Your answers and results stay in your browser, on your device, unless you choose an account that backs them up in the EU. If you leave your name and email we keep those, never your answers. You can export or delete everything any time."],
    ["Do I need my birth date or time?", "Not for the tests. For a chart, your birth date is enough to begin. Time and place add your rising sign, houses and a more precise Moon."],
    ["Can astrology predict who I'll get along with?", "No, and we'll never pretend it can. Astrology and numerology are good mirrors for reflection. That's why we also include research-backed tests (Big Five, attachment) and label each one honestly."],
  ] as [string, string][],
  cta: { title: ["Ready when ", "you are", "."], sub: "Pick a test and see what comes up. It's free, and it starts right away." },
};
