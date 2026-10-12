import type { Trait } from "@/engine/bigfive";
import type { Axis, SourceId, Unified } from "@/engine/unified";

type Pair = [string, string];
type Lv = { low: string; mid: string; high: string };

const dilemmas: Record<string, { q: string; a: Pair; b: Pair }> = {
  o1: { q: "A free evening in a city you love.", a: ["Try the odd new place nobody has reviewed", "It might be awful, and the night is gone"], b: ["Go back to your favourite spot", "You already know exactly how it will feel"] },
  o1t: { q: "Holiday booked, one day left with no plan.", a: ["Wander and see what happens", "You may spend an hour lost and hungry"], b: ["Go back to the place you loved on day one", "You'll miss whatever else was out there"] },
  o2: { q: "A friend sends you a three-hour art film.", a: ["Watch it tonight", "You'll be lost for the first hour"], b: ["Put on a series you already know", "Your friend will ask what you thought"] },
  o3: { q: "At work you could try a method nobody has tested yet.", a: ["Try it", "If it fails, it's on you"], b: ["Stick with what works", "Someone else may get credit for the new idea"] },
  o4: { q: "A big question about life pops up at 1 a.m.", a: ["Stay up and think it through", "Tomorrow you'll be a zombie"], b: ["Park it and sleep", "The thought may be gone by morning"] },
  c1: { q: "Friday evening. A task is due on Monday.", a: ["Finish it tonight", "You miss drinks with friends"], b: ["Go out, do it on Sunday", "Sunday evening will be tense"] },
  c1t: { q: "Bills on the table, sunshine outside.", a: ["Sort them now, then go out", "The best light is gone by then"], b: ["Go out now, bills later", "They'll sit in your head all afternoon"] },
  c2: { q: "A weekend trip with friends.", a: ["Make a shared plan with times", "Someone will call you the boss"], b: ["Just show up and see", "You might wait two hours for a table"] },
  c3: { q: "Your place is a mess and guests arrive in an hour.", a: ["Clean properly", "No time left to shower"], b: ["Push everything into a cupboard", "You'll hunt for your keys all week"] },
  c4: { q: "A new goal for the year.", a: ["Write a weekly plan and track it", "Missing a week will sting"], b: ["Keep it loose, follow the mood", "By March you may have forgotten it"] },
  e1: { q: "Saturday, tired after a long week. Friends call you out.", a: ["Go, people will charge you up", "You might be wiped out on Sunday"], b: ["Stay in with a film", "You'll miss the stories they tell for months"] },
  e1t: { q: "A colleague's wedding. You know two people there.", a: ["Work the room, meet new faces", "Small talk for five hours"], b: ["Stay with the two you know", "You leave having met nobody new"] },
  e2: { q: "In a meeting, an idea pops into your head.", a: ["Say it out loud straight away", "It may sound half-baked"], b: ["Note it down and send it later", "Someone else may say it first"] },
  e3: { q: "Long train ride. The person next to you starts chatting.", a: ["Chat the whole way", "Goodbye, podcast"], b: ["A polite answer, headphones back on", "They might think you're cold"] },
  e4: { q: "Your birthday.", a: ["A big party with all your people", "Tiring, and you can't really talk to anyone"], b: ["Dinner with two close friends", "Some people may feel left out"] },
  a1: { q: "A friend asks for help moving on your only free day.", a: ["Say yes", "Your own plans wait another week"], b: ["Say no, kindly", "They may be cool with you for a while"] },
  a1t: { q: "A colleague asks you to cover their shift. Again.", a: ["Cover it", "Your evening is gone"], b: ["Not this time", "The office mood may turn icy"] },
  a2: { q: "Group decision, and you strongly disagree.", a: ["Go along to keep the peace", "You're stuck with a choice you dislike"], b: ["Push your view until it's settled", "Someone may leave annoyed"] },
  a3: { q: "You get feedback that feels unfair.", a: ["Assume they meant well, let it go", "It may happen again"], b: ["Say so, clearly", "Things between you get cooler"] },
  a4: { q: "Splitting the bill. One person ordered far more.", a: ["Split evenly, not worth a fuss", "You pay for someone else's steak"], b: ["Suggest everyone pays for their own", "You look petty in front of everyone"] },
  n1: { q: "Your message shows as seen. No reply for six hours.", a: ["Re-read it to find what went wrong", "Your afternoon goes on it"], b: ["They're busy, move on", "You might miss a real problem"] },
  n1t: { q: "Your boss writes: \"Can we talk tomorrow?\"", a: ["Prepare for the worst all evening", "Sleep will be thin"], b: ["Shrug, probably a normal chat", "If it's bad, you walk in unprepared"] },
  n2: { q: "The night before a big day.", a: ["Run every scenario in your head", "You arrive tired from worrying"], b: ["Trust it will be fine", "Small surprises can catch you off guard"] },
  n3: { q: "A small mistake at work. Nobody noticed.", a: ["Replay it for the rest of the day", "Hard to enjoy the evening"], b: ["Fix it and forget it", "You might skip the lesson in it"] },
  n4: { q: "Plans change at the last minute.", a: ["You feel thrown and need a minute", "Others may think you're overreacting"], b: ["Roll with it", "People may assume you never mind, even when you do"] },
};

const gut: Record<string, string> = {
  go1: "I get bored with routines fast.", go2: "If it works, why change it?",
  gc1: "I make lists, and I finish them.", gc2: "Deadlines are more like suggestions.",
  ge1: "A full room gives me energy.", ge2: "After a party I need a quiet day.",
  ga1: "I'd rather lose an argument than hurt someone.", ga2: "I say what I think, even if it stings.",
  gn1: "Small things can ruin my whole day.", gn2: "I sleep fine even before big days.",
};

const traits: Record<Trait, { name: string; poles: Pair; text: Lv }> = {
  O: { name: "Curiosity", poles: ["Familiar", "New"], text: {
    low: "You choose the known and loved over the shiny and untested. You get deep value out of what already works, and you're rarely fooled by hype.",
    mid: "New things tempt you when they look worth it, and you happily go back to old favourites. You pick novelty on purpose, not by reflex.",
    high: "When in doubt, you pick the door you haven't opened yet. Ideas, places and odd films feed you, even when they cost a night.",
  } },
  C: { name: "Structure", poles: ["Free flow", "Planned"], text: {
    low: "You'd rather keep the evening than the schedule. Plans bend around life, not the other way round, and you're good in a surprise.",
    mid: "You plan what matters and let the rest float. Some lists get finished, some get lost, and you seem fine with that balance.",
    high: "Duty first, fun after. You trade the drink now for a calm Sunday, and people know a job given to you gets done.",
  } },
  E: { name: "Energy", poles: ["Inward", "Outward"], text: {
    low: "You recharge alone or with one or two people. You choose depth over a crowd, and you think before you speak.",
    mid: "Some days the crowd, some days the sofa. You read your battery well and pick the room that fits.",
    high: "People charge you up. You speak ideas out loud, say yes to the party and find the stranger on the train interesting.",
  } },
  A: { name: "Warmth", poles: ["Direct", "Accommodating"], text: {
    low: "You say what you think and protect your time. People always know where they stand with you, even when it stings a little.",
    mid: "You help when it's fair and push back when it isn't. Kind, but with a line.",
    high: "You give the day, the shift and the benefit of the doubt. Peace matters to you. Watch that your own plans don't always wait.",
  } },
  N: { name: "Sensitivity", poles: ["Steady", "Sensitive"], text: {
    low: "Seen messages and last-minute changes barely ripple. You stay level, which calms the people around you.",
    mid: "Some things get under your skin and most don't. You feel the wobble, then you find your feet.",
    high: "You feel things early and strongly: an unanswered message, a vague email. That radar notices problems first. Give it a bedtime.",
  } },
};

const axes: Record<Axis, { name: string; poles: Pair }> = {
  energy: { name: "Energy", poles: ["Inward", "Outward"] },
  curiosity: { name: "Curiosity", poles: ["Familiar", "New"] },
  structure: { name: "Structure", poles: ["Free flow", "Planned"] },
  warmth: { name: "Warmth", poles: ["Direct", "Warm"] },
  steadiness: { name: "Steadiness", poles: ["Sensitive", "Steady"] },
  daring: { name: "Daring", poles: ["Careful", "Bold"] },
};

const sources: Record<SourceId, string> = { chart: "Birth chart", bigFive: "Big Five", bigFiveLong: "Big Five (long)", fourLetter: "Four-letter test", adaptive: "Deep Read", play: "Play Mirror" };

export const adaptive = {
  meta: { title: "Deep Read", description: "An adaptive personality test: real dilemmas where every choice costs something, quick gut reactions and a test that follows your answers." },
  hero: { eyebrow: "Deep Read", titleA: "No easy ", titleB: "answers", sub: "Real dilemmas where every option costs you something. The next question depends on your last one, a few are timed, and some come back in disguise to check you meant it. About four minutes." },
  how: ["Pick the option you'd really choose, cost and all", "Gold timer? Answer with your gut", "It stops when it knows you well enough"],
  begin: "Start Deep Read", again: "Take it again", minutes: "about 4 min",
  ui: {
    dilemma: "Which would you do?", cost: "Cost", gut: "Gut reaction", gutHint: "Answer before the light runs out",
    yes: "That's me", no: "Not me", timeout: "Too slow, that's fine. Next one.", progress: "Getting to know you", twin: "Familiar question, new scene",
    almost: "Almost there",
  },
  result: {
    eyebrow: "Your Deep Read", title: "What your choices show", code: "Your four letters from this test",
    sure: "How sure", consistent: (n: number, t: number) => (t ? `You answered ${n} of ${t} twin questions the same way.` : ""),
    gutFast: "Your gut answers were quick, which usually means those parts of you are clear.",
    gutSlow: "You took your time on the gut questions. Grey zones are normal and often the most interesting part.",
    flags: { rushed: "You went through the dilemmas very fast. If you were rushing, take it again later for a truer read.", mixed: "Some twin questions got opposite answers. Maybe you're between two ways of being, or the scenes pulled differently. Another round will sharpen it." },
    toAll: "See it in your full profile", play: "Now play the games", hub: "All tests",
    honest: "Own items inspired by adaptive and forced-choice testing research. A mirror for reflection, not a diagnosis.",
    surely: ["still a guess", "fairly sure", "sure"],
  },
  dilemmas, gut, traits,
  unified: {
    eyebrow: "You, all in one", title: "Your combined profile",
    sub: "Your chart, tests and games, pulled into one picture. A brighter dot means we're surer about it.",
    levels: ["First sketch", "Taking shape", "Clear picture", "Sharp focus"],
    levelText: [
      "We only know a little so far. Every test or game sharpens the picture.",
      "The outline is there. A couple more sources and it will hold.",
      "Several sources agree on most of this. It's a good likeness.",
      "Many sources, mostly in agreement. This is about as sharp as we get.",
    ],
    sureLabel: "How sure we are", from: "Built from", axes, sources,
    unsure: "still unsure", mixed: "your sources disagree here",
    next: {
      deep: ["Take Deep Read", "/deep/"], play: ["Play a mini-game", "/play/"], playMore: ["Play another game", "/play/"],
      bigFive: ["Take the Big Five", "/quiz/big-five/"], bigFiveLong: ["Take the long Big Five", "/quiz/big-five-long/"],
    } as Record<NonNullable<Unified["next"]>, Pair>,
    nextLead: "Next step for a sharper picture:",
    empty: "Take Deep Read or play a game and your combined profile appears here.",
  },
  hub: { title: "Deep Read", tagline: "Hard choices, gut reactions, a test that adapts to you.", badge: "New" },
};
export type AdaptiveContent = typeof adaptive;
