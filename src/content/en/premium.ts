// Premium + paid offers copy (DEMO phase). Macedonian mirror: src/content/mk/premium.ts (same keys).
// Prices live in src/lib/payments.ts; text here gets them as formatted strings.

type Faq = { q: string; a: string };
type Page = { heading: string; body: string };
export interface OfferText {
  name: string; tagline: string; short: string; badge?: string;
  pitch: string[];
  youGet: string[];
  format: [string, string][];
  forWho: string;
  sampleTitle: string; sampleNote: string; sample: Page[];
  options?: Record<string, { label: string; note: string }>;
  faq: Faq[];
}

export const premium = {
  meta: { title: "Premium and deep readings", description: "Free forever for the basics. Premium for the full Book of You, every Bond Story and your daily, weekly and monthly forecasts. Plus deep reports, a hardcover book and private sessions." },
  demo: {
    badge: "Demo, no charge",
    adminNote: "You're seeing the admin demo. Regular visitors see \"coming soon\" and an early access button instead of checkout.",
    controls: "Demo controls",
    previewAs: "Preview the app as",
    off: "Normal (beta, all open)",
    free: "Free user",
    premium: "Premium member",
    previewHint: "Only on this device, only for your admin account. Nobody else is affected.",
    grants: "Demo purchases on this device",
    noGrants: "None yet. Run a demo checkout to see the unlocked state.",
    clear: "Clear demo purchases",
    banner: (mode: string) => `Admin preview: ${mode}`,
    exit: "Exit preview",
    panel: "Monetization demo",
    interest: "Early access sign-ups",
    noInterest: "Nobody yet.",
  },
  hero: {
    eyebrow: "Horoscop Premium",
    titleA: "Know yourself ",
    titleB: "all the way down",
    sub: "The basics stay free forever. Premium opens the long reads: your whole Book of You, a Bond Story for everyone you care about, and a forecast for today, this week and this month.",
    ctaDemo: "Try the demo checkout",
    ctaSoon: "Join early access",
    seeOffers: "See deep readings",
    trust: ["Cancel in one click", "7-day money back", "Price includes VAT"],
  },
  trustStrip: {
    title: "Fair and clear, always",
    items: [
      { icon: "€", title: "Clear prices", text: "The price you see includes VAT. No hidden fees, no surprise add-ons." },
      { icon: "✕", title: "Cancel in one click", text: "From your account page, any time. Nothing renews after that." },
      { icon: "↺", title: "7-day money back", text: "Not for you? Ask within 7 days and you get every cent back." },
      { icon: "🔒", title: "Your data stays yours", text: "We never sell or share your data. Card details go to the payment partner, never to us." },
      { icon: "◷", title: "No pressure", text: "No countdown timers, no fake \"only 2 left\", no made-up reviews." },
    ],
  },
  mkd: (amount: string) => `about ${amount}`,
  productUi: { back: "Premium and deep readings", youGet: "What you get", format: "Format and delivery", forWho: "Who it's for", faq: "Questions", choose: "Choose", buy: "Get it", once: "one-time payment, yours to keep", swipe: "Swipe to see more pages" },
  toggle: { label: "Billing", monthly: "Monthly", yearly: "Yearly", save: (pct: number) => `Save ${pct}%` },
  price: {
    perMonth: "/ month", perYear: "/ year", once: "one time",
    yearlyEq: (p: string) => `Works out at ${p} a month`,
    from: (p: string) => `from ${p}`,
    vat: "Prices in euro, VAT included.",
  },
  plans: {
    free: { name: "Free", tag: "Forever", price: "€0", cta: "Start free", lead: "Everything you need to start.", items: ["Your full profile across every lens", "All 7 tests and their results", "Basic compatibility for anyone", "Today's short reading and journal", "The first chapters of your Book of You and each Bond Story"] },
    premium: { name: "Premium", tag: "Most complete", lead: "For people who come back every day.", items: ["The full Book of You, all 11 chapters", "Unlimited Bond Stories, every chapter", "Your Day, plus weekly and monthly forecasts", "A daily email written for your chart", "Saved history of every reading and journal entry", "New features first"] },
  },
  compare: {
    title: "Free and Premium, side by side",
    free: "Free", premium: "Premium",
    rows: [
      ["Profile, all lenses and all tests", "yes", "yes"],
      ["Compatibility score for any pair", "yes", "yes"],
      ["Today's short reading", "yes", "yes"],
      ["Book of You", "3 chapters", "All 11"],
      ["Bond Story", "2 chapters", "Every chapter, any person"],
      ["Your Day story", "Short version", "Full story with practice"],
      ["Weekly and monthly forecast", "no", "yes"],
      ["Daily email for your chart", "no", "yes"],
      ["Saved history", "This device", "Everything, on every device"],
      ["New features", "Later", "First"],
    ] as [string, string, string][],
  },
  included: {
    title: "What Premium opens",
    items: [
      { icon: "📖", title: "The full Book of You", text: "All 11 chapters, about 5,000 words about you: love, work, body and mind, the year you're in. Printable." },
      { icon: "💞", title: "Unlimited Bond Stories", text: "A long read for every person you add. How you meet, how you fight, what keeps you close." },
      { icon: "☀", title: "Your Day, week and month", text: "A short story for each day from your own chart and today's sky, with a weekly overview and a monthly theme." },
      { icon: "✉", title: "A daily email", text: "One calm message in the morning. Your day in three lines, no spam, unsubscribe in one tap." },
      { icon: "🗂", title: "Saved history", text: "Every reading, journal entry and Bond Story kept and synced, so you can look back at how a month really went." },
      { icon: "✦", title: "New things first", text: "Members get new tests, lenses and features before anyone else, and a say in what we build next." },
    ],
  },
  promises: {
    title: "Our promises",
    items: [
      { title: "Cancel in one click", text: "From your account page. No emails to write, no phone calls, no \"are you sure\" maze." },
      { title: "7-day money back", text: "If Premium isn't for you, ask within 7 days and you get every cent back. No questions." },
      { title: "No trial traps", text: "No free trial that quietly turns into a payment. You pay when you decide to, and we remind you before each yearly renewal." },
      { title: "Honest about what this is", text: "Astrology and numerology are mirrors for reflection, not predictions. The research-based tests are labelled as such." },
    ],
  },
  offers: {
    eyebrow: "Deep readings",
    title: "Made for the big moments",
    sub: "One-time reports and experiences, for a birthday, a relationship, a new year or a gift. Buy once, keep forever.",
    view: "Look inside",
  },
  faq: {
    title: "Questions",
    items: [
      { q: "Can I cancel any time?", a: "Yes. One click on your account page. You keep Premium until the end of the period you paid for, and nothing renews after that." },
      { q: "Is there a free trial?", a: "No trial that turns into a payment. Instead the free plan is generous, and Premium has a 7-day money-back guarantee." },
      { q: "What happens to my data if I cancel?", a: "Your profile, results and journal stay yours. You go back to the free plan and can download or delete everything at any time." },
      { q: "How do I pay?", a: "Card, Apple Pay, Google Pay or PayPal through our payment partner, who also handles VAT and sends the invoice. We never see your card details." },
      { q: "Do the prices include VAT?", a: "Yes. The price you see is the price you pay." },
      { q: "Is this a prediction of my future?", a: "No. Astrology, numerology and tarot are for reflection. Big Five and attachment are research-based and labelled that way. Nothing here replaces medical, legal or financial advice." },
      { q: "Who writes the texts?", a: "People do. Every paragraph was written and edited by hand. Our engine picks and combines them for your chart and your answers, so the reading is personal without being invented." },
    ] as Faq[],
  },
  soon: {
    eyebrow: "Coming soon",
    title: "Premium isn't open yet",
    text: "During the beta everything is free for you. Join early access and you'll be the first to know when Premium and the deep readings open.",
    join: "Join early access",
    joined: "You're on the early access list. We'll tell you first.",
    signIn: "Log in to join",
    orEmail: "Or leave your email:",
  },
  gate: {
    badge: "Premium",
    titles: { book: "The rest of your Book of You", bond: "The rest of this Bond Story", day: "Your week and month ahead" } as Record<string, string>,
    texts: {
      book: "These chapters are part of Premium: love, work, body and mind, and the year you're in.",
      bond: "The full story of the two of you, chapter by chapter, is part of Premium.",
      day: "A weekly overview and this month's theme, made from your chart, are part of Premium.",
    } as Record<string, string>,
    unlock: "Unlock with Premium",
    seePlans: "See what's in Premium",
    sheetTitle: "Open everything",
    sheetLead: "Premium opens every chapter and every forecast, for you and everyone you add.",
    demoCheckout: "Demo checkout (no charge)",
    later: "Not now",
    openBeta: "free during the beta",
  },
  forecast: {
    eyebrow: "Premium forecast",
    week: "Your week ahead",
    month: "This month",
    dayLine: (moon: string, sign: string, n: number) => `${moon} in ${sign} · your day ${n}`,
    monthTheme: (n: number, essence: string) => `Personal month ${n}: ${essence}`,
    monthText: "Let this theme set the pace for the next weeks. Use the quieter days to plan and the busier ones to act.",
  },
  checkout: {
    title: "Checkout",
    steps: ["Choose", "Details", "Payment", "Done"],
    choose: "Choose what you want",
    details: "Your details",
    name: "Name", email: "Email", country: "Country",
    countryHint: "Used for VAT. The payment partner shows the final amount before you pay.",
    forWho: "Who is it for?",
    partner: "Partner",
    people: "People in the map (up to 6)",
    giftTo: "Recipient's name", giftMsg: "A short message", giftDate: "Send on",
    session: { topic: "What would you like to talk about?", times: "Times that suit you", lang: "Language" },
    shipping: "Shipping address",
    payment: "Payment",
    demoCard: "This is a demo. No card is needed and nothing is charged. In the real checkout, the payment partner's secure window opens here.",
    pay: (p: string) => `Pay ${p} (demo)`,
    paying: "Processing the demo payment…",
    total: "Total",
    vatIncl: "VAT included",
    agree: "By paying you agree to the Terms. Digital items are delivered right away; you keep the 7-day money-back guarantee on Premium.",
    successTitle: "Demo payment complete",
    successText: "Nothing was charged. On this device your admin account now has this unlocked, so you can see what a member sees.",
    open: "Open it now",
    back: "Back", next: "Continue",
    closed: "Checkout isn't open yet",
    closedText: "Payments aren't switched on during the beta. Join early access and we'll tell you first.",
    order: "Demo order",
  },
  admin: {
    title: "Monetization demo",
    sub: "Everything here is a demo. No payments are taken and nothing is written to the entitlements table from the browser.",
    links: "Pages to try",
    checklist: "Before going live",
    steps: [
      "Register as a sole trader or company (needed for payouts).",
      "Pick the payment partner (Lemon Squeezy or Paddle) and create the products and prices.",
      "Deploy the webhook Edge Function that writes entitlements with the service role.",
      "Switch PAYWALL_LIVE on and add the provider overlay in lib/payments.ts.",
      "Move hosting off Vercel Hobby (it doesn't allow commercial use).",
      "Have the Terms and Privacy pages reviewed for paid plans.",
    ],
  },
  products: {
    "soul-blueprint": {
      name: "Soul Blueprint", tagline: "Your whole self, in one book you can hold", badge: "Our favourite",
      short: "A 40+ page personal deep report across every lens. PDF and print-ready.",
      pitch: [
        "The Book of You is a long read. The Soul Blueprint goes further: every lens we have, read together and side by side, in a document you can print, keep and come back to on your birthday.",
        "Your birth chart in full, house by house. Your numbers from Life Path to Personal Year. Your Chinese and Vedic signs. Your Big Five and attachment results, read in plain words. Then the part people tell us they reread most: where all of these agree about you, and where they pull in different directions.",
        "It ends with a year of small practices matched to your chart, so it's something you use, not something you read once and forget.",
      ],
      youGet: ["40+ pages written for your chart and your answers", "Your birth wheel, drawn and explained", "Every lens: Western, Vedic, Chinese, numerology, Big Five, attachment", "Where your lenses agree and where they disagree", "12 monthly practices for the year ahead", "A print-ready version with a cover page"],
      format: [["Format", "PDF (A4) + printable version"], ["Length", "40 to 55 pages"], ["Delivery", "In your account within minutes"], ["Languages", "English or Macedonian"]],
      forWho: "For birthdays, turning points, or anyone who wants the full picture in one place.",
      sampleTitle: "Look inside", sampleNote: "Sample pages for an example person (Mila, Leo sun, Pisces moon, Life Path 7).",
      sample: [
        { heading: "Chapter 1 · The shape of you", body: "Mila, your Sun in Leo wants to be seen, and your Pisces Moon would rather disappear into a book. Most people meet the first one. The people closest to you know the second, and they know that the bright, warm version of you needs a quiet room to recharge in." },
        { heading: "Where your lenses agree", body: "Three lenses say the same thing in different words: you need meaning more than applause. Life Path 7, a Pisces Moon and high Openness all point to someone who asks why before how. When work feels pointless, you lose energy fast. When it matters, you can go for hours." },
        { heading: "A practice for March", body: "Once a week, do one thing you're good at where nobody can see it. Cook for yourself, write a page, fix something. Your Leo side learns that the warmth is yours even without an audience." },
      ],
      faq: [
        { q: "Is it written by hand for me?", a: "Every paragraph was written by a person. Our engine chooses and combines them for your chart and your answers. That's how we keep it personal, honest and affordable." },
        { q: "Do I need to finish the tests first?", a: "No, but it gets richer with each one. Missing tests are marked, and you can download a new version after taking them." },
      ],
    },
    "couple-deep-dive": {
      name: "Couple Deep Dive", tagline: "The two of you, read properly, plus 30 days of small rituals",
      short: "A full relationship report for two and a 30-day couple ritual program.",
      pitch: [
        "A compatibility score is a start. This is the long version: how the two of you meet, how you argue, how each of you wants to be loved, and what usually gets in the way.",
        "Then comes the part that changes things: 30 days of short rituals for two. One small thing a day, five minutes at most. A question to ask at dinner, a way to say sorry that lands, a walk with a topic. Built from your two charts and both of your test results.",
      ],
      youGet: ["A 25+ page report about the two of you", "Both charts compared, sign by sign and planet by planet", "Attachment and love language pairing in plain words", "Your usual argument, and a way out of it", "30 daily rituals, one each morning in the app or by email", "A printable version for the fridge"],
      format: [["Format", "PDF + in-app program"], ["Length", "25+ pages and 30 rituals"], ["Delivery", "Report in minutes, rituals daily for 30 days"], ["Needs", "Birth details for both of you"]],
      forWho: "For couples who want to understand each other better, at the start or many years in.",
      sampleTitle: "Look inside", sampleNote: "Sample pages for an example couple (Mila and Jan).",
      sample: [
        { heading: "How you argue", body: "Mila goes quiet. Jan wants to talk it through right now. To Jan, silence feels like a door closing. To Mila, being pushed to talk feels like being cornered. Neither of you is wrong. You're both asking for safety in different ways." },
        { heading: "Ritual, day 4", body: "Tonight, each of you finishes this sentence out loud: \"I felt close to you this week when…\" No replies, no fixing. Just listen and say thank you." },
      ],
      faq: [
        { q: "Does my partner need an account?", a: "No. You add their birth details, and if they'd like, they can take the tests on your phone or their own." },
        { q: "Is it only for romantic couples?", a: "It's written for partners. For friends, family or a team, look at the Family and Team Constellation." },
      ],
    },
    "year-ahead": {
      name: "Year Ahead", tagline: "Twelve chapters, one for each month",
      short: "Your personal forecast: 12 monthly chapters from your chart, numbers and Chinese year.",
      pitch: [
        "Each month gets its own short chapter: the main transits to your chart, your personal month number, the Chinese year's mood, and what that could mean for love, work and rest.",
        "It's a planning companion, not a prophecy. People use it to choose when to start something, when to slow down, and what to watch for in themselves.",
      ],
      youGet: ["12 monthly chapters, starting from the month you choose", "The key dates of each month in your chart", "Your personal year and month numbers explained", "One question and one practice per month", "Calendar file with the key dates"],
      format: [["Format", "PDF + in-app"], ["Length", "12 chapters, about 25 pages"], ["Delivery", "In your account within minutes"], ["Starts", "Any month you pick, often your birthday"]],
      forWho: "For a birthday, a new year, or the start of something big.",
      sampleTitle: "Look inside", sampleNote: "Sample month for Mila.",
      sample: [
        { heading: "October · Personal month 5", body: "Restless, in a good way. Jupiter touches your Sun this month, and your numbers ask for change. Say yes to one thing you'd normally postpone. Around the 18th, a conversation about money or time is worth having early, not late." },
        { heading: "Your question for October", body: "What would you try if nobody you know were watching?" },
      ],
      faq: [
        { q: "When should I start it?", a: "Most people start on their birthday or on 1 January. You choose the first month at checkout." },
      ],
    },
    constellation: {
      name: "Family and Team Constellation", tagline: "How your group really fits together",
      short: "A group compatibility map for up to 6 people, with roles, pairings and group habits.",
      pitch: [
        "Add up to six people: family, friends, a team. You get a map of the whole group with every pairing scored and explained, who brings energy, who keeps the peace, and where friction tends to start.",
        "For families it's a way to understand each other with a little humour. For teams it's a friendly starting point for talking about how you work together.",
      ],
      youGet: ["An interactive map of the whole group", "All pairings (up to 15) with a short reading each", "Roles in the group: spark, anchor, bridge and more", "Where the group clicks and where it rubs", "Ideas for family dinners or team meetings", "A printable poster of your constellation"],
      format: [["Format", "In-app map + PDF + poster"], ["People", "3 to 6"], ["Delivery", "In your account within minutes"], ["Needs", "Birth dates; birth times are optional"]],
      forWho: "For families, friend groups and small teams.",
      sampleTitle: "Look inside", sampleNote: "Sample map for an example family of four.",
      sample: [
        { heading: "The anchor: Vera", body: "Earth-heavy chart, high Conscientiousness. Vera is the one who remembers birthdays and quietly fixes plans. The group leans on her more than it says. Tell her." },
        { heading: "Spark and spark: Leo and Ana", body: "Two fire signs, both high in Extraversion. Great at holidays, loud at breakfast. They rarely fight for long, but they can talk over the quieter two. A simple house rule helps: one person speaks at a time at dinner." },
      ],
      faq: [
        { q: "Do all six people need to take the tests?", a: "No. Birth dates are enough for the map. Every test someone takes adds detail." },
        { q: "Is it okay for work?", a: "As a conversation starter, yes. Please don't use it to hire, rate or rank people. It isn't made for that, and we say so in the report." },
      ],
    },
    hardcover: {
      name: "Book of You, hardcover", tagline: "Your reading, printed and bound",
      short: "Your full Book of You as a printed hardcover, shipped to your door.",
      pitch: [
        "Some things deserve paper. Your complete Book of You, typeset with your birth wheel and chapter art, printed as a hardcover and shipped to you or to someone you love.",
        "Each copy is printed on demand, just for that person. It makes an unusual gift: a book about the person holding it.",
      ],
      youGet: ["All 11 chapters of your Book of You", "Your name and birth wheel on the cover", "Full-colour chapter art", "About 80 pages, A5 hardcover", "A gift note if it's for someone else"],
      format: [["Format", "A5 hardcover, about 80 pages"], ["Printing", "Print on demand (partner to be confirmed)"], ["Delivery", "2 to 3 weeks in the EU"], ["Shipping", "Shown at checkout"]],
      forWho: "For gifts, birthdays and anyone who prefers paper.",
      sampleTitle: "Look inside", sampleNote: "Sample spread. Final print layout depends on the print partner.",
      sample: [
        { heading: "Cover", body: "Deep blue linen look, gold title: \"The Book of Mila\". Below it, her birth wheel in gold foil style." },
        { heading: "Chapter 4 · How you love", body: "You fall for minds before faces. Once you're in, you're loyal to a fault, and the hardest thing for you is asking for what you need before you're already tired." },
      ],
      faq: [
        { q: "Who prints it?", a: "We're testing print-on-demand partners now. The partner will be named here before this goes on sale." },
        { q: "Can I send it as a gift?", a: "Yes. Enter their address at checkout and add a note. The price isn't printed anywhere." },
      ],
    },
    session: {
      name: "Private 1:1 session", tagline: "An hour on video, about you",
      short: "A 60-minute video reading and coaching session with the founder or a partner reader.",
      pitch: [
        "Sometimes you want to talk it through with a person. In a private session we go through your chart and test results together and spend the hour on what matters to you right now: a decision, a relationship, a new chapter.",
        "It's reflective coaching using astrology and psychology as a shared language. It isn't therapy, and we'll say so if something needs a different kind of help.",
      ],
      youGet: ["60 minutes on video (Google Meet or Zoom)", "We read your profile before the call", "A written summary and three next steps afterwards", "A recording if you want one"],
      format: [["Length", "60 minutes"], ["Where", "Video call"], ["Languages", "English or Macedonian"], ["Booking", "Send your preferred times; we confirm by email"]],
      forWho: "For a decision, a relationship question, or a birthday treat.",
      options: {
        "session-partner": { label: "With a partner reader", note: "Readers are being selected now. This option opens once they're confirmed." },
        "session-founder": { label: "With the founder", note: "Limited by the founder's calendar, not by a timer." },
      },
      sampleTitle: "How a session goes", sampleNote: "A typical hour.",
      sample: [
        { heading: "First 10 minutes", body: "What's on your mind, and what would make this hour worth it for you." },
        { heading: "Next 40 minutes", body: "Your chart, your numbers and your test results, read around that question. Lots of room for your own words." },
        { heading: "Last 10 minutes", body: "Three small next steps, written down together. You get the summary by email the same day." },
      ],
      faq: [
        { q: "Can I reschedule?", a: "Yes, up to 24 hours before, as often as you need." },
        { q: "Is it therapy?", a: "No. It's reflective coaching. If something needs a professional, we'll tell you kindly and point you to one." },
      ],
    },
    "gift-card": {
      name: "Gift card", tagline: "Give someone a closer look at themselves",
      short: "Gift cards for any amount above, or for a specific reading.",
      pitch: [
        "A gift card can be spent on Premium or any deep reading. Choose the amount, write a short message and pick the day it arrives. Or print it and put it in a card.",
      ],
      youGet: ["A designed gift card by email or as a printable PDF", "Your message on it", "Delivery on the day you choose", "Valid for 2 years, on anything in the shop"],
      format: [["Amounts", "€25, €49 or €99"], ["Delivery", "Email on your date, or PDF to print"], ["Valid", "2 years"]],
      forWho: "For birthdays, anniversaries and friends who love this stuff.",
      options: {
        "gift-25": { label: "€25", note: "About 5 months of Premium, or the Year Ahead" },
        "gift-49": { label: "€49", note: "A year of Premium, or the Soul Blueprint" },
        "gift-99": { label: "€99", note: "A private session with a partner reader, or two deep readings" },
      },
      sampleTitle: "The card", sampleNote: "What the recipient sees.",
      sample: [
        { heading: "For Ana", body: "\"Happy birthday! I think you'll find this scarily accurate. Love, Mila.\" A €49 gift for Horoscop, to spend on anything." },
      ],
      faq: [
        { q: "What if they don't use it all?", a: "The rest stays on their account until the card expires after 2 years." },
      ],
    },
  } as Record<string, OfferText>,
};
export type PremiumText = typeof premium;
