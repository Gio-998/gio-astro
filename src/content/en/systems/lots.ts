import type { SysMeta } from "./meta";
import type { Sign } from "@/engine/zodiac";
/** Part of Fortune / Spirit and numerology extras: lens info, labels and one-line readings. */
export const metaExtra: Record<"arabic" | "numextra", SysMeta> = {
  arabic: { name: "Part of Fortune", short: "Lots", evidence: "astronomy",
    what: "Lots are points made from three parts of your chart. Hellenistic astrologers used them first, and Persian and Arab astrologers built on them, which is why they're called Arabic parts. Fortune is read as where life feels easy and well supplied; Spirit as what you choose to go after.",
    inputs: "Birth date, exact time and place (for the Ascendant).",
    method: "Day birth (Sun above the horizon): Fortune = Ascendant + Moon − Sun, Spirit = Ascendant + Sun − Moon. Night birth swaps them, as Vettius Valens and Paulus Alexandrinus did. Sun, Moon and Ascendant come from astronomy-engine for your birth moment.",
    sources: ["Vettius Valens, Anthology, book 2 (2nd century)", "Paulus Alexandrinus, Introduction, ch. 23 (378 CE)", "Abu Ma'shar, The Abbreviation of the Introduction to Astrology (9th century)"] },
  numextra: { name: "Numbers this month", short: "Number extras", evidence: "popular",
    what: "Three more numbers from Pythagorean numerology: your maturity number (who you grow into after about 40), your personal month and your personal day. A birthday of 13, 14, 16 or 19 is called a karmic debt day, read as a lesson that keeps coming back until you learn it.",
    inputs: "Birth date, full birth name and today's date.",
    method: "Maturity = life path + expression, reduced (11, 22 and 33 kept). Personal month = personal year + calendar month, reduced. Personal day = personal month + day of the month, reduced. All recalculated live from today's date.",
    sources: ["Matthew Oliver Goodwin, Numerology: The Complete Guide (1981)", "Hans Decoz, Numerology: Key to Your Inner Self (1994)"] },
};
export const uiExtra = {
  fortune: "Part of Fortune",
  spirit: "Part of Spirit",
  dayBirth: "Day birth: the Sun was above the horizon",
  nightBirth: "Night birth: the Sun was below the horizon",
  lotsNeedTime: "Add your exact birth time and place to see your lots.",
  lotsNeedTimeValue: "Needs birth time",
  maturity: "Maturity number",
  maturityNoName: "Add your full birth name to see your maturity number.",
  personalMonth: "Personal month",
  personalDay: "Personal day",
  karmicDebt: (n: number) => `Karmic debt day ${n}`,
  karmicDebtText: { 13: "Hard work pays only when you stop looking for the shortcut.", 14: "Freedom works best with a few fixed habits.", 16: "Pride breaks so something more honest can grow.", 19: "Doing it all alone is the lesson; asking for help is the way out." } as Record<number, string>,
  fromBirthNameDate: "your birth date, name and today's date",
};
export const fortune: Record<Sign, string> = {
  aries: "Ease comes when you start things yourself and move first.",
  taurus: "Ease comes through steady comfort, good food and things you can touch.",
  gemini: "Ease comes through talk, short trips and learning on the go.",
  cancer: "Ease comes from home, family and people who feel like family.",
  leo: "Ease comes when you're seen, creating something and having fun.",
  virgo: "Ease comes from useful work done well and a calm daily routine.",
  libra: "Ease comes through partners, fair deals and beautiful places.",
  scorpio: "Ease comes from depth: shared money, trust and real closeness.",
  sagittarius: "Ease comes with travel, study and a big picture to believe in.",
  capricorn: "Ease comes from long goals, structure and earned respect.",
  aquarius: "Ease comes through friends, groups and ideas ahead of their time.",
  pisces: "Ease comes in quiet, in art and in helping without keeping score.",
};
export const spirit: Record<Sign, string> = {
  aries: "You choose courage and want to be first.",
  taurus: "You choose to build something that lasts.",
  gemini: "You choose curiosity and many open doors.",
  cancer: "You choose to care for and protect your own.",
  leo: "You choose to lead and to make it shine.",
  virgo: "You choose to improve things, one detail at a time.",
  libra: "You choose balance and the right partner.",
  scorpio: "You choose truth, even when it costs.",
  sagittarius: "You choose meaning and wide horizons.",
  capricorn: "You choose mastery and a name you earn.",
  aquarius: "You choose change and your own way.",
  pisces: "You choose faith, kindness and imagination.",
};
