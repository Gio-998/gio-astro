import { chars } from "./en-chars";
import { angel } from "./en-angel";
import { years, karmic, explain as explain1 } from "./en-more";
import { explain2 } from "./en-p2";
import { days, p3, explain3 } from "./en-p3";
const explain = { ...explain1, ...explain2, ...explain3 };

const ui = {
  section: "Numerology",
  crumbHome: "Home",
  angelHub: "Angel numbers", lifePathHub: "Life path", yearHub: "Personal year", calcHub: "Calculators", karmicHub: "Karmic debt", masterHub: "Master numbers",
  angelTitle: (n: string) => `Angel number ${n}: meaning in love and life`,
  angelMeta: (n: string, tag: string) => `What ${n} means when you keep seeing it: ${tag.toLowerCase()}. Love, work, what to do next and frequent questions.`,
  lifePathTitle: (n: number) => `Life path number ${n}: meaning, love and work`,
  lifePathMeta: (n: number, name: string) => `Life path ${n}, ${name}: character, strengths, shadow side, love, career and questions to ask yourself.`,
  yearTitle: (n: number) => `Personal year ${n}: what the year asks of you`,
  yearMeta: (n: number) => `Personal year ${n} in numerology: themes, love, work, health and how the months tend to unfold.`,
  number: "Number", digits: "The digits inside", digitsSum: (sum: string, root: number) => `Added together: ${sum}, which reduces to ${root}.`,
  sec: { mood: "The mood of the year", scene: "Where you might see it", meaning: "What it means", love: "In love", work: "Work and money", act: "What to do now", why: "Why it keeps appearing", questions: "Questions to sit with", faq: "Frequent questions", story: "The character", gifts: "Gifts", money: "Money", shadow: "The shadow side", week: "How it shows up in a week", growth: "Growth", practices: "Practices", strengths: "Strengths", shadows: "Watch for", focus: "Focus", caution: "Be careful with", months: "How the year unfolds", body: "Energy and health", close: "By the end of the year", related: "Related numbers", explore: "Keep exploring", also: "More angel numbers" },
  faq: {
    angelMean: (n: string) => `What does ${n} mean?`, angelLove: (n: string) => `What does ${n} mean in love?`, angelDo: (n: string) => `What should I do when I see ${n}?`, angelWhy: (n: string) => `Why do I keep seeing ${n}?`,
    lpMean: (n: number) => `What does life path ${n} mean?`, lpLove: (n: number) => `Who is life path ${n} compatible with?`, lpWork: (n: number) => `What careers suit life path ${n}?`, lpCalc: (n: number) => `How do I know if my life path is ${n}?`,
    lpCalcA: "Add the reduced month, day and year of your birth date and reduce the total, keeping 11, 22 and 33. Our free calculator shows each step.",
    yrMean: (n: number) => `What is a personal year ${n}?`, yrCalc: "How do I find my personal year?", yrCalcA: "Add your birth month and day to the current year, then reduce the total to one digit. The calculator does it for you.",
  },
  calc: {
    birth: "Birth date", name: "Full name", namePh: "e.g. Ana Petrova", year: "Year", go: "Calculate", invalid: "Please enter a valid date.", nameInvalid: "Please enter a name with letters.",
    lifePath: "Your life path number", expression: "Expression", soul: "Soul urge", personality: "Personality", personalYear: (y: number) => `Your personal year in ${y}`,
    read: "Read the meaning", steps: "How it was calculated", tryLife: "Life path calculator", tryName: "Name calculator", private: "Calculated on your device, nothing is saved.",
  },
  pickNumber: "Pick a number", lifePathShort: (n: number) => `Life path ${n}`, yearShort: (n: number) => `Year ${n}`,
  prev: "Previous", next: "Next", allAngel: "All angel numbers", allLife: "All life paths", calcCta: "Find your own number", calcCtaSub: "Free, takes ten seconds.",
  readFull: "Read more", see: "Open",
  homeEyebrow: "Numerology", homeTitle: "What your numbers say", homeSub: "Angel numbers, your life path and free calculators.",
  navTitle: "Numerology", navDesc: "Angel numbers, life path and calculators",
  method: "Numerology is a reflective tradition, not a science. Read it as a mirror.",
};

export const numerology = { ui, chars, angel, years, karmic, explain, days, p3 };
export type NumContent = typeof numerology;
