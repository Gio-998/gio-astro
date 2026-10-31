import type { CalendarCopy } from "./types";

export const en: CalendarCopy = {
  dayShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], and: "and",
  signIn: { aries: "in Aries", taurus: "in Taurus", gemini: "in Gemini", cancer: "in Cancer", leo: "in Leo", virgo: "in Virgo", libra: "in Libra", scorpio: "in Scorpio", sagittarius: "in Sagittarius", capricorn: "in Capricorn", aquarius: "in Aquarius", pisces: "in Pisces" },
  signTo: { aries: "into Aries", taurus: "into Taurus", gemini: "into Gemini", cancer: "into Cancer", leo: "into Leo", virgo: "into Virgo", libra: "into Libra", scorpio: "into Scorpio", sagittarius: "into Sagittarius", capricorn: "into Capricorn", aquarius: "into Aquarius", pisces: "into Pisces" },
  quarter: { new: "New moon", "first-quarter": "First quarter", full: "Full moon", "last-quarter": "Last quarter" },
  eclipse: { "solar-total": "total solar eclipse", "solar-annular": "annular solar eclipse", "solar-partial": "partial solar eclipse", "lunar-total": "total lunar eclipse", "lunar-partial": "partial lunar eclipse", "lunar-penumbral": "penumbral lunar eclipse" },
  span: (d, h) => `${d} days and ${h} hour${h === 1 ? "" : "s"}`,
  pct: (n) => `${n}%`,
  times: (n) => ["", "once", "twice", "three times", "four times"][n] ?? `${n} times`,
  when: (date, time, signIn) => `${date} at ${time}, ${signIn}`,
  links: { daily: "Daily horoscope", dailySub: "Your sign today", monthly: "Monthly horoscope", moonSign: "Moon sign calculator", rising: "Rising sign calculator", zodiacOf: (n) => `${n}: the sign`, horoscopeOf: (n) => `${n} daily horoscope`, moonYear: (y) => `Moon calendar ${y}`, mercuryYear: (y) => `Mercury retrograde ${y}` },

  moon: {
    crumb: "Moon calendar",
    hub: {
      h1: "Moon calendar: the current phase and what comes next",
      title: "Moon calendar: current phase, full moon and new moon",
      description: "Today's moon phase, the next full and new moon with exact times and signs, and a calendar for every month through December 2027, day by day.",
      blocks: [
        { id: "phases", title: "The eight phases in plain words", paras: ["The Moon has no light of its own. What changes through the month is how much of its sunlit half faces us. The four main phases are moments you can time to the minute, and the four in between are stretches of days."], list: [
          "New moon: the Moon stands between Earth and Sun and you cannot see it. A quiet point for choosing one thing to start.",
          "Waxing crescent: a thin curve in the evening sky. Small first steps count here.",
          "First quarter: half lit, a quarter of the way around. Often the moment a plan meets its first problem.",
          "Waxing gibbous: more than half lit and growing. Good for adjusting what you started.",
          "Full moon: Earth sits between Sun and Moon, so the whole near side is lit. Things tend to feel clearer, or at least louder.",
          "Waning gibbous: the light starts to shrink. A natural time to share what you learned.",
          "Last quarter: half lit again, the other half. Ask what you can put down.",
          "Waning crescent: a thin curve before dawn. Rest, tidy up, leave some space.",
        ] },
        { id: "sign", title: "What the Moon's sign adds", paras: [
          "Your star sign is where the Sun was on your birthday. The Moon moves far faster: it circles the zodiac in a little over 27 days and spends roughly two and a half days in each sign. That is why the day tables on the month pages change so often.",
          "A new moon always falls in the sign the Sun is in, because the two line up. A full moon falls in the opposite sign, so each one pairs two themes, like Taurus and Scorpio, or Gemini and Sagittarius. The month pages take this into account and read each lunation for its own sign.",
        ] },
        { id: "use", title: "How to use a moon calendar for reflection", list: [
          "At the new moon, write one sentence on what you want to begin. One, so you can remember it.",
          "At the first quarter, note what got in the way. That is usually where the real work is.",
          "At the full moon, read your sentence again and ask what you can see now that you could not see then.",
          "At the last quarter, drop one thing that is no longer helping.",
          "After three rounds, read your notes in one sitting. Patterns are easier to spot than single moments.",
        ] },
        { id: "method", title: "Where these dates come from", paras: [
          "Every date and time here is calculated, not copied from a table. We use the astronomy-engine library, the same code that drives our daily horoscope, and a test recomputes every date a second way. Times are shown on the clock in Skopje, which is the same as in Berlin, Vienna and Paris. Add or subtract hours for other zones.",
          "A moon calendar tells you where the Moon is. It cannot tell you what is going to happen, and we would not trust one that claimed to. Some calendars rate days for cutting hair or planting beans; we leave that out because we cannot back it up. What we offer is an accurate sky and a good question to go with it.",
        ] },
      ],
      faq: [
        ["How long is a lunar cycle?", "About 29 and a half days from one new moon to the next. The exact length varies by several hours because the Moon's orbit is not a perfect circle. Each month page shows the real length of the cycle that starts there."],
        ["Why do other calendars show a slightly different time?", "Most differences come from time zones or rounding to the minute. We show the Skopje clock, which matches Central Europe. In summer that is UTC+2 and in winter UTC+1."],
        ["Why is the Moon's sign different from my star sign?", "They measure different things. Your star sign is the Sun's position on your birthday, while the Moon changes sign every two to three days. If you want to know where the Moon stood when you were born, the moon sign calculator will tell you."],
        ["Does the full moon affect sleep or mood?", "Some people say so, and we cannot promise it either way. If you are curious, keep a short note for three cycles and look at your own pattern instead of a general rule."],
      ],
    },
    today: (date, phase, n, signIn) => `Today, ${date}: ${phase}, ${n}% lit, with the Moon ${signIn}.`,
    todayLabel: "Today", nowTitle: "The Moon today and the next phases", monthsTitle: "Moon calendar by month",
    head: { phase: "Phase", date: "Date", time: "Time", sign: "Sign", day: "Day", moon: "Moon", moonSign: "Moon's sign", horoscope: "Horoscope", month: "Month", newMoon: "New moon", fullMoon: "Full moon", note: "Note" },
    faqNext: { qFull: "When is the next full moon?", qNew: "When is the next new moon?", a: (when) => `On ${when}. This page updates every night, so the answer stays current.` },
    zone: { winter: "Times in CET (UTC+1), the clock in Skopje, Berlin and Vienna.", summer: "Times in CEST (UTC+2), the clock in Skopje, Berlin and Vienna.", change: (d) => `Times on the clock in Skopje, Berlin and Vienna. The clocks change on ${d}.` },
    month: {
      h1: (m, y) => `Moon calendar ${m} ${y}`,
      title: (m, y) => `Moon calendar ${m} ${y}: full moon and new moon`,
      description: ({ newMoon, full, m, y }) => `New moon ${newMoon}, full moon ${full}. Every phase of ${m} ${y} with times, plus the Moon's sign for each day.`,
      lead: ({ newMoons, fulls, m, y }) => `${m} ${y}: new moon on ${newMoons}, full moon on ${fulls}.`,
      phasesTitle: (m, y) => `Moon phases in ${m} ${y}`, factsTitle: (m, y) => `The sky in ${m} ${y}`, daysTitle: (m, y) => `The Moon day by day in ${m} ${y}`,
      lunationTitle: (q, signIn, date) => `${q} ${signIn}, ${date}`,
      daysCaption: "Times show when the Moon changes sign. The link opens the daily horoscope for the sign the Moon is in at noon; days not published yet open that sign's current page.",
      cycle: (start, length, next) => `The lunar cycle that opens on ${start} lasts ${length}, until the next new moon on ${next}.`,
      sun: (date, signTo) => `The Sun moves ${signTo} on ${date}.`,
      changes: (m, y, n, from, to) => `In ${m} ${y} the Moon changes sign ${n} times, starting ${from} and ending ${to}.`,
      mercury: (m, y, from, to) => `Mercury's retrograde from ${from} to ${to} overlaps ${m} ${y}.`,
      eclipse: (q, date, e) => `The ${q.toLowerCase()} of ${date} comes with an eclipse (${e}), visible only from parts of the Earth.`,
      qFull: (m, y) => `When is the full moon in ${m} ${y}?`, qNew: (m, y) => `When is the new moon in ${m} ${y}?`, qHalf: (m, y) => `When are the half moons in ${m} ${y}?`,
      aFull: (m, y, list) => `The full moon of ${m} ${y} falls on ${list}.`, aNew: (m, y, list) => `The new moon of ${m} ${y} falls on ${list}.`,
      aHalf: (first, last) => `First quarter: ${first}. Last quarter: ${last}.`,
    },
    plural: { new: "new moons", full: "full moons" },
    twoInMonth: (p, m, y, dates) => `${m} ${y} holds two ${p}, on ${dates}.`,
    year: {
      h1: (y) => `Moon calendar ${y}: every full moon and new moon`,
      title: (y) => `Full moon calendar ${y}: all full and new moon dates`,
      description: (y, f, n) => `All ${f} full moons and ${n} new moons of ${y} with date, time and zodiac sign, plus the eclipses of the year. Two clear tables, ready to save.`,
      lead: (y, f, n) => `${y} has ${f} full moons and ${n} new moons, listed here in order with the sign of each.`,
      aboutTitle: (y) => `The lunar year ${y}`, fullTitle: (y) => `Full moon calendar ${y}`, newTitle: (y) => `New moons ${y}`, eclipseTitle: (y) => `Eclipses ${y}`,
      intro: {
        2026: ["This page lists every full and new moon of 2026 with its date, time and sign. The last two months have their own pages with all four phases, the Moon's sign for each day and a reflection for each lunation. The earlier dates stay here for your records or a look back.", "Looking back works well with a lunar calendar. Pick a full moon from earlier in the year and check your notes or photos from that week. It can be surprising what you were worried about, and how much of it has gone."],
        2027: ["Here is the whole of 2027 at a glance. Each date links to its month page with all four phases, the Moon's sign day by day, and a reflection written for that lunation's sign.", "A year of lunations makes a simple planner. Mark the new moons for starting things and the full moons for checking how they went. Over twelve months you can watch the signs move around the wheel and see which parts of your life each one tends to light up."],
      },
      twice: (p, signIn, y, dates) => `Two ${p} fall ${signIn} in ${y}, on ${dates}.`,
      eclipseLine: (date, e, q, signIn) => `${date}: ${e}, at the ${q.toLowerCase()} ${signIn}.`,
      tableCaption: "Times on the clock in Skopje, Berlin and Vienna (CET or CEST). Dates link to the month page where one exists.",
      qFull: (y) => `How many full moons are there in ${y}?`, qNew: (y) => `How many new moons are there in ${y}?`, qEclipse: (y) => `Which eclipses happen in ${y}?`,
      aCount: (y, n, p, first, last) => `${y} has ${n} ${p}. The first is on ${first}, the last on ${last}.`,
      aEclipse: (list) => `These can each be seen only from parts of the Earth: ${list}.`,
    },
    reflect: {
      "last-quarter:leo": [
        "With the Moon in Leo and the Sun in Scorpio, pride and privacy pull against each other. Think of something you did for applause and got silence. You can put that down without pretending it never mattered. Ask what you would still do if nobody clapped.",
        "This one lands at the far end of Leo, when the wish to be seen has nearly burned down. Notice where you are still performing: the cheerful group message, the joke that covers tiredness. Drop one small act this week and see who stays close anyway.",
      ],
      "new:scorpio": [
        "A Scorpio new moon suits things you would never post. Name one weight you have been carrying alone: a debt, a grudge, a fear about someone you love. You do not have to fix it tonight. Write it down, then write what you would want if it stopped running your days. That short, private sentence is a fine way to open a cycle.",
        "Early Scorpio has a plain way of asking what you really want, minus the polite version. Pick one place where you keep saying it is fine. Over the next two weeks, try the honest version with one person you trust. Closeness tends to grow through small disclosures, so start small and give them time to answer.",
      ],
      "first-quarter:aquarius": [
        "Aquarius squares the Scorpio Sun here: head against gut. Something you started at the new moon now wants a decision, and friends may have opinions. Hear them, then check how your body reacts. If a plan only works when you ignore a feeling, change the plan.",
        "By now the Moon has reached Aquarius and wants air in the room. If a private worry has become a loop, take it outside: a walk with a friend, a plain question for someone who sees it from far off. A wider view may not solve it, but it can show the next step.",
      ],
      "full:gemini": [
        "The full moon in Gemini faces a Sagittarius Sun, so small facts meet big beliefs. Maybe a story you tell about your life no longer matches the details. Look at the messages you sent this month, the argument you keep rehearsing, the rumour you passed on. What did you actually know, and what did you just enjoy saying? Say one true thing out loud, then let the talk end without needing to win it.",
        "This Gemini full moon shines on the noise of the season: lists, group chats, opinions from every relative. Before you answer the next message, count how many threads you are holding and which three matter. You probably know enough already. Pick the one talk you have been circling and have it warmly, with the phone in another room.",
      ],
      "last-quarter:virgo": [
        "A last quarter in Virgo is a good moment for an honest edit. Look at your list and cross off what only exists because you feel you should. Keep the jobs that make next week easier. Tidying one drawer can settle a busy head more than a grand plan.",
        "Here the Moon tests the standards you set yourself. When did good enough stop being good enough? Pick one job you keep redoing and call it finished. The time you get back belongs to you, and the people around you will probably not notice the missing polish.",
      ],
      "new:sagittarius": [
        "Sagittarius new moons want a horizon. You do not need a plane ticket for that: a course, a language, a question you have wanted to answer for years will do. Ask what you believe now that you did not believe five years ago. Then choose one small step toward whatever that belief is pointing at, and take it before the week ends.",
        "Under this new moon, notice where your life has grown too small for you. It may be a routine, a town, or a way of describing yourself. Write down three places you would go if money and duty kept quiet for a day. One of them usually holds a clue about what you are hungry for, and that clue is enough to start a cycle.",
      ],
      "first-quarter:pisces": [
        "The Moon in Pisces squares a Sagittarian Sun: big plans meet a tired heart. If your enthusiasm has dropped a little, listen before you push. Some goals need faith, and others need a nap. Ask yourself which one this is.",
        "Late in the year a Pisces first quarter can blur the line between what you want and what everyone around you wants. Take ten quiet minutes and separate the two on paper. The list that is yours may be shorter, and that is a relief.",
      ],
      "full:cancer": [
        "A full moon in Cancer, set against the Capricorn Sun, brings home and duty face to face. Who has been holding everything together, and who has noticed? If that person is you, say so. If it is someone else, thank them in plain words. Look at the table you eat at, the calls you put off, the people you would drop everything for. The answer to where you belong tends to be sitting right there.",
      ],
      "last-quarter:libra": [
        "Closing the year under a Libra last quarter invites a fair look at your relationships. Which ones felt even, and which left you doing the sums? You do not have to settle anything now. Name one thing you want to balance differently next year, and leave the rest for January.",
      ],
      "new:capricorn": [
        "A Capricorn new moon has the clear, cold air of a first working day. Skip the grand resolution. Pick one thing you are willing to build slowly: a savings habit, a skill, a boundary at work. Ask what it would look like in twelve months if you gave it ten minutes a day. Dull, steady effort is what this sign respects, and it tends to pay you back in self-respect first.",
        "The last new moon of the year falls in Capricorn, and it can make you want to audit your whole life by Friday. Try a smaller question: what did you carry this year that was never your job? Hand one of those things back. A clean start often begins with a clear description of what you will stop doing.",
      ],
      "first-quarter:aries": [
        "Aries pushes against the Capricorn Sun here, so patience and impatience share a room. If a new goal already feels slow, you are in the right place. Act on one thing today without asking for permission, then go back to the long plan.",
      ],
      "full:leo": [
        "Under a full moon in Leo, facing the Aquarius Sun, your own wishes meet the needs of the group. You may feel a pull to stand up and be counted, and a fear of being too much. Look at where you make yourself smaller so that others stay comfortable. Then look at where you take up the room that someone else needs. Both are worth seeing. Do one generous thing that also has your name on it.",
      ],
      "last-quarter:scorpio": [
        "The Moon in Scorpio asks what you are still holding on to. A last quarter is for letting go, and this sign does not let go easily. Start with something small: a message you reread, a score you keep. Delete it, and notice how that feels.",
      ],
      "new:aquarius": [
        "An Aquarius new moon is a good time to rethink who you spend your hours with. Which groups give you ideas, and which only give you obligations? Write one thing you would change about your circle if nobody could be offended. You may want to join something new, or to leave something politely. Either way, start with a single message and let the rest follow in its own time.",
      ],
      "first-quarter:taurus": [
        "Taurus squares the Aquarius Sun, and your body gets a vote on your ideas. A plan may look great on a screen and feel wrong on a Tuesday morning. Ask what it costs in sleep, money and meals. Then make one practical change so the idea can actually live in your week.",
      ],
      "full:virgo": [
        "The full moon in Virgo, opposite a Pisces Sun, sets the tidy list against the bigger feeling. Maybe you have been fixing small things to avoid a large one, or dreaming to avoid a small one. Look at your daily habits as if they belonged to a friend. What would you gently point out? Choose one routine to repair and one worry to release, and let them be two separate jobs.",
      ],
      "last-quarter:sagittarius": [
        "A last quarter in Sagittarius can show how much of your plan was optimism. That is no bad thing. Keep the direction and let go of the deadline you made up. Ask which promise you could quietly renegotiate, with yourself first.",
      ],
      "new:pisces": [
        "A Pisces new moon is soft and easy to miss. There is no need to set a target. Give yourself a slow hour with no screen and see what comes up: a song, a name, an old sadness. Write it down without trying to explain it. If there is one thing to begin here, it may be a habit of listening to yourself before the day gets loud.",
      ],
      "first-quarter:gemini": [
        "Gemini squares the Pisces Sun: feelings meet the need to explain them. You might talk a lot this week and say little. Try writing three sentences about what you really want, then read them to someone who will not try to fix it.",
      ],
      "full:libra": [
        "The full moon in Libra, opposite an Aries Sun, pairs me with we. You may notice how often you decide alone, or how often you wait for someone else to decide. Look at one relationship and ask what each of you has been giving up. Fairness here is about more than splitting things down the middle. Say what you need in one calm sentence, then ask the same of them.",
      ],
      "last-quarter:capricorn": [
        "A last quarter in Capricorn is practical about what to quit. Look at one commitment that takes more than it gives. Could you end it, shrink it or hand it on? Do the awkward admin this week, and you may find a little room to breathe.",
      ],
      "new:aries": [
        "The Aries new moon is the closest thing the sky has to a starting gun. If you have been waiting for the right moment, ask what you are really waiting for. Choose something you can begin before lunch: one call, one page, one lap around the block. Keep the bar low and the start real. Your courage tends to grow after you move, seldom before.",
      ],
      "first-quarter:cancer": [
        "Cancer squares the Aries Sun, and your drive meets your need for safety. If something you began now feels exposed, check what you need in order to keep going. A familiar meal, a talk with family or an early night can count as progress.",
      ],
      "full:scorpio": [
        "This full moon sits right at the start of Scorpio, facing a Sun that has just entered Taurus. What you own meets what owns you. Look at something you hold tightly: money, a person, a story about the past. Ask what you are afraid would happen if you loosened your grip by one finger. You do not need to give anything away. Seeing the fear clearly is the work of this night.",
        "A month later the full moon falls in Scorpio again, this time in its last degrees, with the Sun at the very end of Taurus. Something you noticed in April may feel ready to finish. Think of what has changed since then, and what has only been moved around. If a chapter wants closing, close it kindly: one honest conversation, one cleared account, one thing you agree to stop mentioning.",
      ],
      "last-quarter:aquarius": [
        "The Moon in Aquarius lifts you a little above the week. From there, what looks unnecessary? A group you only attend out of habit, a debate you no longer care about. Step back from one of them and see whether anyone minds.",
      ],
      "new:taurus": [
        "A Taurus new moon starts with the body and the bank balance. What makes you feel safe, and what only looks like it should? Walk through your home and pick one thing that gives you real pleasure and one thing you keep out of guilt. Plant something this week, cook something slowly, or open a savings pot with a small, boring amount. Steady comfort is a fine goal.",
      ],
      "first-quarter:leo": [
        "The Moon in Leo squares the Taurus Sun: wanting to shine meets wanting to stay comfortable. If a project needs you to show your face, this is a good week to do it. Post the thing, sing the song, start the talk about your pay.",
      ],
      "last-quarter:pisces": [
        "A last quarter in Pisces asks for less noise. Let one obligation slide without a long excuse, and give the time to rest or to someone who needs you. Tears, naps and long baths all count as useful here, whatever your calendar says.",
      ],
      "new:gemini": [
        "A Gemini new moon loves a fresh idea, and you may have five of them by breakfast. Write them all down, then circle one you would happily explain to a friend tomorrow. Curiosity needs a place to land. Sign up for the class, send the first message, ask the question you think is too simple. Over the next month, follow that single thread and see where it goes.",
      ],
      "first-quarter:virgo": [
        "Virgo squares the Gemini Sun, so all those ideas meet the calendar. Which one can you actually fit in? Give it a date and a first small task. The ones you drop are still there, and a short list gets further than a long one.",
      ],
      "full:sagittarius": [
        "The full moon in Sagittarius faces a Gemini Sun: the long view against the latest detail. You may be tired of small talk and hungry for meaning, or tired of big ideas and in need of a fact. Step outside if you can and look at something far away. Then ask which belief has guided you this year, and whether it still deserves to. Keep the part that makes you kinder and braver.",
      ],
      "last-quarter:aries": [
        "The Moon in Aries can make you want to quit in a blaze. Pause first. A last quarter works better with a clean cut than a dramatic one. Name the fight you are done with, and end your part of it without a speech.",
      ],
      "new:cancer": [
        "A Cancer new moon begins at home, in whatever way home means for you now. Look at who you call when things go wrong, and who calls you. Choose one way to make your space or your family life a bit gentler: a shared meal, a repaired shelf, a conversation that starts with how are you, really. Care that you plan for tends to last longer than care you only feel.",
      ],
      "first-quarter:libra": [
        "Libra squares the Cancer Sun: what you owe your own people against what you owe everyone else. If you have been keeping the peace at a cost, this is a good week to notice it. Offer one honest preference, however small, and see what happens.",
      ],
      "full:capricorn": [
        "The full moon in Capricorn, opposite a Cancer Sun, puts work and home on the same scale. You may see clearly what your ambitions ask of the people you love, and what your family habits ask of your goals. Neither side needs to lose. Take an honest look at your last two weeks: where did your hours go? Move one hour, for one week, toward the side that has been missing you.",
      ],
      "last-quarter:taurus": [
        "A last quarter in Taurus asks what you own that owns you. It might be a cupboard full of maybes or a habit of buying comfort. Give away one thing this week, and see whether you miss it.",
      ],
      "new:leo": [
        "This new moon in Leo comes with the Sun and Moon aligned so closely that a solar eclipse crosses part of the Earth. Astronomy aside, the sign has a clear question: what would you do if you stopped worrying about looking silly? Make something with your own hands and your own name on it. Show one person. Joy you create tends to spread further than praise you collect.",
      ],
      "first-quarter:scorpio": [
        "Scorpio squares the Leo Sun: what you show against what you hide. Something you started in high spirits may now reveal a tender spot. Ask what you would rather no one found out, and consider telling one trusted person. The relief can be bigger than the risk.",
      ],
      "full:aquarius": [
        "The full moon in Aquarius, facing the Leo Sun, weighs your own story against the group's. Are you part of something bigger, or only standing near it? Think of the friends, causes and communities you belong to. Which ones know the real you? Send a message to someone who has seen you at your worst and stayed. Then ask what you could give back that only you can give.",
      ],
      "last-quarter:gemini": [
        "A Gemini last quarter comes with too many open tabs, and sometimes literally. Close some. Unsubscribe, delete drafts, answer or archive. Ask which conversation has gone on long enough, and bring it to a friendly end.",
      ],
      "new:virgo": [
        "A second new moon in one month gives you a second chance to begin, this time in Virgo. Forget the big gesture. Look at your mornings, your desk, the way you treat your body. Which small habit would make everything else easier? Start it tomorrow and keep it boring. Virgo's kind of progress is a series of tiny repairs, and they add up faster than you would expect.",
      ],
      "first-quarter:sagittarius": [
        "Sagittarius squares the Virgo Sun, and your careful plan wants some room to run. If you have been stuck in details, zoom out for an hour. Ask what all this tidying is for. A little wider purpose can make the small jobs lighter.",
      ],
      "full:pisces": [
        "The full moon in Pisces, opposite a Virgo Sun, sets control against surrender. You may have worked hard on the details, and still feel something slipping through. Let it. Take an evening off from solving things, and notice what you feel when you stop. Sadness, relief and tiredness are all useful information. Ask where you could trust the process more, and where a clear limit would actually protect you.",
      ],
      "last-quarter:cancer": [
        "This last quarter falls at the very start of Cancer, as summer's pace winds down. Which old family role are you still playing out of habit? You can be loving without being on call. Choose one small duty to hand back this week.",
        "This time the Moon reaches the end of Cancer, so the mood is ready to move on. Sort a box of old papers or photos and keep only what warms you. Memory is a good guest, and you get to decide how much room it has.",
      ],
      "new:libra": [
        "A Libra new moon starts with a question about how you relate. Where do you say yes while thinking no? Choose one relationship to bring into better balance, and begin with something small and specific: who plans, who pays, who apologises first. Then look at the beauty side of this sign. A cleaner room or one lovely object can make it easier to be fair with people.",
      ],
      "first-quarter:capricorn": [
        "Capricorn squares the Libra Sun: pleasing others meets getting things done. A decision you put off to keep the peace may now need making. Give yourself a deadline, tell one person, and accept that someone might be a little disappointed.",
      ],
      "full:aries": [
        "The full moon in Aries, opposite a Libra Sun, brings out the difference between what you want and what keeps everyone happy. Tempers can run short, so give yourself a walk before you answer. What have you been swallowing for the sake of harmony? Say it simply, without blame, starting with the word I. Your anger is often a sign that a limit was crossed, and that is worth knowing.",
      ],
      "full:taurus": [
        "The full moon in Taurus, opposite a Scorpio Sun, asks what really gives you security. Look at what you have: your savings, your health, a friend who answers at midnight. Then look at what you fear losing. Both can be true on one night. Do something slow and physical before you sleep, like cooking, stretching or a long walk, and let your body remind you what is solid.",
      ],
    },
  },

  mercury: {
    crumb: "Mercury retrograde",
    hub: {
      h1: "Is Mercury retrograde right now?",
      title: "Is Mercury retrograde now? Dates for 2026 and 2027",
      description: "Is Mercury retrograde today? A dated answer, every period of 2026 and 2027 with shadow dates and signs, and what to do with it, without the fear.",
      blocks: [
        { id: "what", title: "What retrograde actually means", paras: [
          "Mercury does not turn around. Retrograde is an apparent motion, something we see from Earth. Mercury circles the Sun in about 88 days, far quicker than we do, and three or four times a year it passes us on the inside track. As it does, it seems to stop, drift backwards against the stars for about three weeks, stop again and carry on.",
          "Picture two runners on a track. You are in an outer lane, Mercury is on an inner one and much quicker. Most of the time it seems to drift one way across the far stand. Each time it laps you, it crosses the stand the other way for a while. It never turned around. Only the angle between you changed. Astronomers call the two turning points stations, and the dates on this page are calculated from the planet's real position.",
        ] },
        { id: "shadow", title: "What the shadow periods are", paras: [
          "Before Mercury stops, it crosses the same stretch of the zodiac it will later walk back over. That lead-in is the pre-shadow. After it turns direct, it covers that ground a third time until it passes the point where it first stopped. That wind-down is the post-shadow. Astronomically they are ordinary days. Astrologers use them as a way to mark the before and after of a retrograde, and the dates are simple to compute, so we list them.",
        ] },
        { id: "people", title: "What people connect with it", paras: [
          "In astrology Mercury stands for messages, travel, trade and how we think, so a backwards Mercury became shorthand for crossed wires: lost post, delayed trains, misread texts, an ex who turns up out of nowhere. The idea is old and it makes good jokes.",
          "Trains are late in every month, though, and memory favours the times that fit a story. We know of no sound evidence that phones fail or deals go wrong because of Mercury's apparent motion, and we would not tell you to rearrange your life around it. What the tradition does offer is a regular reminder to slow down and check things. That is useful, and it costs nothing.",
        ] },
        { id: "do", title: "What is worth doing", list: [
          "Reread before you send, especially anything written in a temper.",
          "Back up your phone and laptop. Do it because backups are good, and let the calendar be your reminder.",
          "Check bookings, times and addresses twice before you travel.",
          "Return to something unfinished: a draft, a repair, a course, a message you owe.",
          "Ask what you may have misunderstood. Repeat back what you heard.",
          "Go ahead with real life. If you need to sign, buy or book, read it properly and do it, as you would in any month.",
        ] },
        { id: "houses", title: "How we read it for your sign", paras: [
          "Each year page has a table for all 12 signs. We count houses from your Sun sign, one whole sign per house, the same way as our daily horoscope. Mercury's sign then lands in one area of life for you: money, home, partners, work. If you know your rising sign, read the table for that as well, since it can be a closer fit.",
        ] },
      ],
      faq: [
        ["Is Mercury retrograde bad?", "No. It is a repeating view of the sky that lasts about three weeks. Some people find it a helpful moment to review things. If you notice more mix-ups than usual, take it as a reason to check twice, without any dread."],
        ["Can I sign a contract or travel during Mercury retrograde?", "Yes. Plenty of good decisions get made in these weeks. Read what you sign and check your bookings, the same care you would take at any other time. Do not put off something you need because of a date in a calendar."],
        ["How often is Mercury retrograde?", "Three times in both 2026 and 2027, and sometimes four times in a calendar year. Each period lasts about three weeks. The pages for each year list the exact dates."],
        ["Does Mercury really move backwards?", "No. It keeps circling the Sun in the same direction. From Earth it only appears to move backwards while it overtakes us on its smaller, faster orbit."],
        ["Why do some sites give a different day?", "Stations happen at one exact moment, so the calendar date depends on your time zone. We show the Skopje clock, the same as Berlin or Vienna. Further west or east the date can shift by one."],
      ],
    },
    answer: {
      retrograde: (d) => `Yes. Mercury has been retrograde since ${d.since}, ${d.signIn}. It turns direct on ${d.direct}, and the shadow ends on ${d.shadowEnd}.`,
      "pre-shadow": (d) => `Not yet. Mercury entered its pre-shadow on ${d.since} and turns retrograde on ${d.retro}, ${d.signIn}.`,
      "post-shadow": (d) => `No. Mercury turned direct on ${d.since}. It stays in its post-shadow until ${d.shadowEnd}.`,
      clear: (d) => `No. Mercury is moving forward. The next retrograde starts on ${d.retro}, ${d.signIn}, with the pre-shadow from ${d.shadowStart}.`,
    },
    asOf: (date) => `Checked against the planet's calculated position as of ${date}. The page updates every night.`,
    nowTitle: "Mercury right now", nextTitle: "The next Mercury retrograde dates",
    head: { stage: "Stage", date: "Date", time: "Time", position: "Position", period: "Retrograde", signs: "Signs", shadow: "With shadow", sign: "Sign", house: "House", focus: "Worth a look" },
    stage: { preShadow: "Pre-shadow begins", retro: "Stations retrograde", direct: "Stations direct", postShadow: "Post-shadow ends", moves: (signTo) => `Moves back ${signTo}` },
    clock: "Times on the clock in Skopje, Berlin and Vienna.",
    range: (from, to) => `${from} to ${to}`,
    year: {
      h1: (y) => `Mercury retrograde ${y}: all dates and shadow periods`,
      title: (y) => `Mercury retrograde ${y}: dates, shadow periods, signs`,
      description: (y, n) => `Mercury turns retrograde ${n} in ${y}. All station dates, shadow periods and signs, plus what each period can mean for your sign, house by house.`,
      lead: (y, n, list) => `Mercury goes retrograde ${n} in ${y}: ${list}.`,
      overviewTitle: (y) => `Mercury retrograde dates ${y}`,
      periodTitle: (range, signs) => `${range}: ${signs}`, bySignTitle: (signs) => `For each sign: ${signs}`,
      bySignCaption: "Houses counted from your Sun sign, one whole sign per house. Two numbers mean Mercury changes sign during the period.",
      intro: {
        2026: ["In 2026 each retrograde stays inside one sign: Pisces, Cancer, then Scorpio. All three are water signs, so the reviews tend to touch feelings, memory and trust more than paperwork. That is a reading, not a forecast. The dates are astronomy, and what you do with them is up to you."],
        2027: ["In 2027 each retrograde starts in a water sign and slips back into the air sign before it: Pisces into Aquarius, Cancer into Gemini, Scorpio into Libra. So each period has two chapters, and feelings tend to get talked through before the review ends. Your house changes along the way, which is why the tables show two numbers."],
      },
      qWhen: (y) => `When is Mercury retrograde in ${y}?`, aWhen: (y, list) => `In ${y} Mercury is retrograde ${list}.`,
      qShadow: (y) => `When are the Mercury shadow periods in ${y}?`, aShadow: (list) => `Counting pre-shadow and post-shadow, the periods run ${list}.`,
      qSigns: (y) => `Which signs does Mercury retrograde touch in ${y}?`, aSigns: (list) => `While retrograde, Mercury moves through ${list}.`,
    },
    periods: {
      "2026:pisces": {
        paras: ["In Pisces, Mercury trades precision for mood. Thoughts come as images and half-remembered songs instead of lists, so this is a natural window for rereading what you felt, as well as what you said. Keep a notebook close. Old dreams and unfinished creative work may come back, and they deserve an hour of your time.", "On the practical side, double-check what Pisces likes to blur: times, amounts, who agreed to what. A short written summary after a conversation saves a lot of guessing later."],
        bySign: ["Quiet time. Old worries may surface, so write them down instead of chewing on them at night.", "Friends and groups. A stale group chat or shared plan could use an honest update.", "Work and reputation. Check what you promised a boss or client before you promise more.", "Study and travel. Recheck bookings, and go back to a course you dropped.", "Shared money and trust. Reread a joint bill or a loan, and ask what you still owe.", "Partners. Repeat back what you heard before you answer. Old talks may need a second round.", "Daily routine. Review the habits that tire you, and fix one small system at work.", "Joy and romance. An old flame or an old hobby could return. Decide what you want from it.", "Home and family. Talk through a house matter again and look for that missing paperwork.", "Messages and short trips. Slow your replies and check the address twice.", "Money and values. Go through your subscriptions and ask what you are really paying for.", "You, in the mirror. Rethink how you come across, and give yourself room to change your mind."],
      },
      "2026:cancer": {
        paras: ["With Mercury backing through Cancer, memory runs the show. Old photos, family stories and the smell of a certain kitchen can feel closer than this week's to-do list. Many people use a Cancer retrograde to call a parent, sort a box of papers or finally answer a message from home.", "If a family conversation repeats itself, notice the feeling under the words. You can change how you respond even when the topic stays the same."],
        bySign: ["Home ground. Family talks may circle back, so listen for what sits under the old complaint.", "Neighbours, siblings, daily notes. Send the kind message you keep drafting in your head.", "Your money habits. Look at what you spend for comfort and whether it still comforts you.", "Your own moods. Let yourself be slower this month, and rethink a decision made in a hurry.", "The back of your mind. Sleep, dreams and old regrets ask for a quiet hour with a notebook.", "Your circle. Someone from an old group may get in touch. See if the bond still fits.", "Career and family collide. Look again at how you split your time between the two.", "Beliefs from home. Check which opinions are yours and which you inherited.", "Shared resources. Family money or debts may need a clear, calm conversation.", "Close relationships. Old hurts may come up. Ask before you assume you know what they meant.", "Daily care. Revisit meals, sleep and the chores that keep falling to you.", "Play and children. Reopen something you loved as a kid, just for the pleasure of it."],
      },
      "2026:scorpio": {
        paras: ["Scorpio reads between the lines, and a retrograde here tends to sharpen suspicion as much as insight. You may notice what was left out of a contract, a story or an apology. Before you act on it, ask yourself: do I know this, or do I fear it?", "It is a strong period for research, for facing a number you have avoided and for honest talks about money or trust. Go slowly with accusations. A question opens more doors."],
        bySign: ["Debts and trust. Read the small print on anything shared, and ask the direct question.", "Your partner's worries. Something hidden may surface. Let them finish before you respond.", "Work habits. Dig out the real cause of that recurring problem instead of patching it.", "Love and creativity. An old crush or abandoned project may tug at you. Ask why now.", "Family matters and house repairs. Look under the floorboards, literally or not.", "Words with an edge. Reread the sharp message before you press send.", "Your savings. Find out where the money really goes, without shaming yourself.", "Your own motives. You may see yourself more clearly than is comfortable. Use it kindly.", "What you keep to yourself. Give a private fear an hour on paper.", "Alliances. Check who you really trust in your group, and who you keep out of habit.", "Power at work. Rethink a career move in private before you announce anything.", "Deep study. Return to a question that has bothered you for years and read something difficult."],
      },
      "2027:pisces>aquarius": {
        paras: ["This period opens in Pisces and slips back into Aquarius partway through. The first stretch is inward: feelings, dreams, the things you would struggle to put in an email. The second is cooler and more social, good for checking an idea with friends or rethinking your place in a group.", "Watch the handover. What you felt privately in the first week may become something you can finally explain in the third. The table shows the day Mercury changes sign."],
        bySign: ["From private worries to the friends who could hear them. Let one person in.", "Group plans turn into work questions. Check who is really doing what.", "A career rethink may lead to a course or a trip. Compare notes before you commit.", "Big ideas meet the budget. Ask what your plan costs and who shares the bill.", "Shared money becomes a talk with a partner. Bring the numbers and keep your tone calm.", "A talk with a partner turns into daily habits. Sort out who does which chore.", "Routine gives way to play. Drop one duty and restart a hobby you miss.", "Romance and home meet. Think about who you let into your private space.", "A home matter needs saying aloud. Call the sibling or neighbour involved.", "Words become money. Reread an invoice, a quote, the terms of a job.", "Your values come back to you. Ask whether your spending still looks like you.", "You start in your own sign and end behind the scenes. Rest is part of the review."],
      },
      "2027:cancer>gemini": {
        paras: ["Home first, then headlines. Mercury begins backing through Cancer, where memory and family set the tone, then slides into Gemini, one of its own signs, where news, errands and messages pile up. Gemini also likes a double meaning, so reread before you reply.", "Because Gemini is Mercury's home, this period can feel busier than others. Keep lists short, confirm plans in writing, and allow an extra day for anything that depends on other people's replies."],
        bySign: ["Family talk moves to plain logistics. Agree on dates, lifts and keys.", "Messages lead to money. Follow up that unpaid favour or unsent invoice.", "Mercury rules your sign and comes home to it. Review your budget, then your own plans.", "The period starts with you and then turns inward. Leave room for naps and private thinking.", "Old feelings surface, then friends help you sort them. Phone the one who knows the story.", "Your ruling planet moves from community to career. Rework a goal before you pitch it.", "Work duties give way to bigger questions. Ask what this job is teaching you.", "A belief gets tested by real stakes. Check facts where money or trust are involved.", "Shared finances turn into talks with a partner. Say the number out loud.", "A relationship topic lands in your calendar. Fix the small daily habit behind the friction.", "Work rhythms loosen. Review your workload, then leave time for something fun.", "Creative work meets home life. Clear a corner where the old project can live again."],
      },
      "2027:scorpio>libra": {
        paras: ["A serious start and a diplomatic finish. In Scorpio, Mercury digs for what is under the surface. Once it backs into Libra, the question shifts from what is true to what is fair, and agreements with partners or colleagues come up for review.", "It is a useful order. You get honest with yourself first, then work out how to say it so the other person can hear it. A delayed conversation that happens at the right moment is rarely wasted."],
        bySign: ["Trust issues move into the open. Have the talk with your partner instead of guessing.", "A tense conversation can settle into better daily arrangements. Write down who agreed to what.", "Mercury runs your sign. Tidy the systems at work, then go back to what you enjoy making.", "Desire meets home. Talk about what you want from family time this autumn.", "A private family matter needs plain words. Choose the one person to tell first.", "Your ruler moves through talk and money. Confirm figures in writing, twice.", "Your budget comes first, then your image. Decide what you want to be known for.", "The spotlight fades on purpose. Rethink how you present yourself, then take a quiet week.", "Private doubts find a place among friends. Ask for one honest opinion.", "Contacts help with career questions. Look up a former colleague before you decide.", "A career question turns philosophical. Look at the long view before you change course.", "A big idea needs a close look at costs and commitments. Ask who else it affects."],
      },
    },
  },
};
