import type { Sign } from "@/engine/zodiac";
import type { AttachStyle } from "@/engine/quizzes";
/** The "personal voice" layer: sentence templates that always name the data they come from. */
export const chironTheme: Record<Sign, string> = {
  aries: "your right to take up space", taurus: "feeling safe and having enough", gemini: "being heard and taken seriously", cancer: "belonging and being looked after",
  leo: "being seen without shame", virgo: "being good enough as you are", libra: "keeping yourself inside a relationship", scorpio: "trusting closeness",
  sagittarius: "finding meaning you can trust", capricorn: "rest without having to earn it", aquarius: "belonging while staying different", pisces: "keeping your edges while you feel everything",
};
export const attachLens: Record<AttachStyle, string> = {
  secure: "your mostly secure attachment", anxious: "your anxious-leaning attachment", avoidant: "your avoidant-leaning attachment", fearful: "your push-pull attachment pattern",
};
export const attachNervous: Record<AttachStyle, string> = {
  secure: "Your nervous system mostly reads closeness as safe. That's a resource you can lend to others.",
  anxious: "Your nervous system learned to scan for distance, which made sense once. A slow breath out, longer than the breath in, can help it stand down before you reply.",
  avoidant: "Your nervous system learned that relying on yourself was safest. Space helps you settle; saying when you'll come back keeps others settled too.",
  fearful: "Part of you reaches for people and part of you braces. Both parts are trying to protect you. Naming which one is talking can take the heat out.",
};
type Lvl = "low" | "mid" | "high";
export const voice = {
  why: "Why we say this",
  whyClose: "Hide",
  whyLead: "This sentence comes from:",
  opener: (name: string, sun: string, sunEss: string, moon: string, moonEss: string) => `${name}, your Sun is in ${sun}, ${sunEss}, and your Moon is in ${moon}, ${moonEss}.`,
  chironAttach: (sign: string, attach: string, theme: string) => `Your Chiron in ${sign} and ${attach} point to the same tender place: ${theme}.`,
  chironMoon: (sign: string, moon: string, theme: string) => `Your Chiron in ${sign} sits beside a Moon in ${moon}: both ask for care around ${theme}.`,
  echoLikert: (item: string, strong: boolean) => (strong ? `You said "${item}" is very true of you. We take that seriously.` : `You said "${item}" isn't like you at all. That tells us something too.`),
  echoAura: (weather: string, wish: string) => `When we asked about your emotional weather you chose "${weather}", and what you wanted more of was "${wish}".`,
  echoAuraCare: (weatherKey: string) => (["stormy", "foggy", "cloudy"].includes(weatherKey) ? "Go gently with yourself today. Rough weather passes, and you don't have to fix it alone." : "Notice what helped you feel this way, so you can find it again."),
  nodeValidate: (sign: string, trait: string) => `Your North Node in ${sign} asks for ${trait}, and your answers show you already have that muscle. Use it on purpose this month.`,
  nodeChallenge: (sign: string, trait: string, step: string) => `Your North Node in ${sign} asks for ${trait}, which your answers say doesn't come easily. That's the point of a growth edge. Start tiny: ${step}`,
  nodePlain: (sign: string, north: string) => `Your North Node is in ${sign}: ${north}`,
  compassion: (practice: string) => `Being kind to yourself here isn't letting yourself off the hook. It's what makes change stick. ${practice}`,
  traitName: { O: "curiosity and openness", C: "steady structure", E: "showing up and speaking up", A: "give and take with others", N: "a calm centre", lowC: "letting go of control" } as Record<string, string>,
  lvl: { low: "low", mid: "middle", high: "high" } as Record<Lvl, string>,
  // Why-chips
  w: {
    sun: (s: string, deg: string) => `Sun ${deg} ${s}`, moon: (s: string, deg: string) => `Moon ${deg} ${s}`, chiron: (s: string, deg: string) => `Chiron ${deg} ${s}`,
    node: (s: string) => `North Node in ${s}`, attach: (name: string, ax: number, av: number) => `Attachment quiz: ${name} (worry ${ax}, distance ${av})`,
    item: (quiz: string, ans: string) => `${quiz}: you answered "${ans}"`, aura: "Your aura check-in", trait: (t: string, v: number) => `Big Five ${t}: ${v}/100`,
    birth: (place: string) => `Birth time and place: ${place}`, noTime: "Birth time unknown (noon used)", bio: (p: number, e: number, i: number) => `Biorhythm today: body ${p}, feelings ${e}, mind ${i}`,
    feast: (f: string) => `Church and folk calendar: ${f}`, transit: (t: string) => `Sky today: ${t}`, care: (n: string, c: string) => `${n}'s care style: ${c}`,
    personalDay: (n: number) => `Personal day number ${n}`,
  },
  day: {
    bioHigh: (cycle: string) => `Your ${cycle} wave is near its top today. Use it, and don't spend it all before noon.`,
    bioLow: (cycle: string) => `Your ${cycle} wave is low today. That's a rhythm, not a verdict: plan lighter.`,
    feastToday: (f: string, custom: string) => `Today is ${f}. ${custom}`,
    nameDayToday: "It's your name day today. Let people treat you.",
    weatherEcho: (weather: string) => `Last time you checked in, your inner weather was "${weather}". Has it shifted?`,
  },
  book: {
    love: (venus: string, care?: string) => (care ? `Your Venus in ${venus} and your top care style, ${care}, describe the same thing from two sides: how love reaches you.` : `Your Venus in ${venus} is the starting point here: how you like to be loved.`),
    mind: (merc: string, extra?: string) => `You think with Mercury in ${merc}${extra ? `, and ${extra}` : ""}. This chapter is about how your mind works.`,
    shadow: (lilith: string, shadow?: string) => (shadow ? `Your Lilith in ${lilith} and your main shadow, ${shadow}, both mark the parts of you that got told to sit down. They're not flaws; they're energy waiting for a better job.` : `Your Lilith in ${lilith} marks a part of you that may have learned to hide. Read this chapter with kindness.`),
    heals: (chiron: string, theme: string) => `Healing starts where your Chiron in ${chiron} points: ${theme}.`,
    path: (node: string, lp: number) => `Your North Node in ${node} and life path ${lp} both describe direction, not destiny. You choose the road.`,
    year: (sr: string) => `Your solar return points to this theme for the year: ${sr}`,
  },
  bond: {
    care: (a: string, ca: string, b: string, cb: string) => (ca === cb ? `${a} and ${b} both picked ${ca} as the way care lands best. Easy to give each other.` : `${a} feels most cared for through ${ca}; ${b} through ${cb}. Translate, don't assume.`),
    attach: (a: string, sa: string, b: string, sb: string) => `${a} tends toward ${sa}, ${b} toward ${sb}. Knowing this turns "you always..." into "I notice I..."`,
    chiron: (a: string, ch: string, b: string, moon: string) => `${a}'s Chiron in ${ch} and ${b}'s Moon in ${moon} share an element, so ${b} may be the person who gets ${a}'s old sore spot without explanation.`,
    nodes: (a: string, node: string, b: string, sun: string) => `${a}'s North Node in ${node} sits in ${b}'s Sun sign, ${sun}. In astrology that's a "growth contact": ${b} may simply be what ${a} is learning.`,
  },
};
