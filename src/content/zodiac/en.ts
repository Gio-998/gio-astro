import type { ZodiacLang } from "./types";
import { aries } from "./en/aries";
import { taurus } from "./en/taurus";
import { gemini } from "./en/gemini";
import { cancer } from "./en/cancer";
import { leo } from "./en/leo";
import { virgo } from "./en/virgo";
import { libra } from "./en/libra";
import { scorpio } from "./en/scorpio";
import { sagittarius } from "./en/sagittarius";
import { capricorn } from "./en/capricorn";
import { aquarius } from "./en/aquarius";
import { pisces } from "./en/pisces";

export const en: ZodiacLang = {
  hub: {
    metaTitle: "Zodiac Signs: Dates, Traits and Elements of All 12",
    description: "All 12 zodiac signs with their dates and elements, plus a short guide to fire, earth, air and water, and how to find your own sign.",
    h1: "The 12 zodiac signs: dates, elements and traits",
    crumb: "Zodiac signs",
    lead: "Twelve signs, four elements, three ways of getting things done. Find yours, then see what is behind it.",
    intro: [
      "The zodiac divides the year into twelve equal parts, and the Sun spends about a month in each. Your sign tells you which part the Sun was in on the day you were born. The list above runs in order from Aries to Pisces, with the dates and element of each. Every name leads to a full profile: personality, strengths and sore spots, love, the man and the woman of the sign, friendship, work and money, and the signs that tend to suit it best or ask for the most effort.",
      "We treat the signs as mirrors, a shared language for thinking about yourself and the people you love. They do not predict your life or pass judgment on it. Keep whatever helps you understand something, and leave the rest.",
    ],
    elementsTitle: "The four elements: what drives a sign",
    elementsIntro: "Every sign belongs to one of four elements, three signs to each, spaced evenly around the year. The element tells you what fuels a sign and how it reacts before it has had time to think.",
    elements: {
      fire: "quick, warm and made for action. Fire signs think on the move, get their energy from beginnings, and sag when nothing is happening.",
      earth: "practical, patient and physical. Earth signs trust what can be touched, counted and built, and they need time and reliability to do their best.",
      air: "curious, talkative and light on their feet. Air signs see links between people and ideas, and they recharge by swapping thoughts with others.",
      water: "sensitive, loyal and blessed with long memories. Water signs read a mood before anyone speaks, and they need closeness they can trust.",
    },
    modalitiesTitle: "The three modalities: how a sign gets things done",
    modalitiesIntro: "If the element is the kind of energy, the modality is what it does over time. Each of the three appears four times, once per element, and it follows the seasons: cardinal signs open a season, fixed signs hold the middle of it, and mutable signs carry it over into the next.",
    modalities: {
      cardinal: "open the seasons and begin things. They move first and set the direction, and they may leave the finishing to someone else.",
      fixed: "sit at the height of each season and hold on. They are loyal and they last, and the same quality makes them very hard to shift.",
      mutable: "close the seasons and adapt. They change plans easily and connect people, and they often find it harder to settle on one thing.",
    },
    more: [
      { title: "Why the dates of a sign can shift by a day", paras: [
        "A year does not last exactly 365 days, so the Sun does not reach the border between two signs at the same hour each year. That is why the dates on these pages are approximate, and why magazines often print slightly different ones. Being born near the change does not give you a mixed sign. The Sun was either still in one sign or already in the next. A birth chart with your year, time and place will show which.",
      ] },
      { title: "Your Sun sign is only the start", paras: [
        "When someone asks your sign, they are asking about your Sun. Your Moon shows what you feel and what makes you feel safe. Your rising sign shows how people meet you, and the other planets each add a theme of their own. That is why two Capricorns can be so unlike each other. If a description does not fit you at all, the answer may well lie in those other layers, and the rising sign and Moon sign calculators will show you them in a few minutes.",
      ] },
    ],
    faq: [
      ["What are the 12 zodiac signs in order?", "Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius and Pisces. The order starts with Aries because the Sun enters that sign at the spring equinox in the northern hemisphere, the traditional start of the astrological year."],
      ["How do I find my zodiac sign?", "Look for your birthday in the list at the top of this page. That is your Sun sign, which is what most people mean by “my sign.” If your birthday falls right at the change between two signs, enter your year, time and place into the birth chart calculator."],
      ["Is Ophiuchus the 13th zodiac sign?", "Ophiuchus is a real constellation, and the Sun does pass through it each year. Western astrology uses the tropical zodiac, though, which divides the year into twelve equal parts tied to the seasons and not to the constellations. A sign and a constellation are two different things, so your sign stays the same."],
      ["What is the difference between a Sun sign and a rising sign?", "Your Sun sign depends on your birth date and describes your core self. Your rising sign depends on your exact time and place of birth, and it describes the first impression you make and how you approach new things. The two can be in completely different signs."],
      ["Which zodiac signs go well together?", "Signs of the same element usually find each other easiest, and fire and air, or earth and water, tend to help each other along. There is usually more friction between signs three places apart, and that friction can be useful. Our compatibility pages look at each pair on its own."],
      ["Does my zodiac sign decide my personality?", "No. A sign is an image to think with, not a scientific description of a person. Your family, your experiences and your choices shape you far more. Many people use astrology because it gives them easier ways to talk about themselves, and that is the spirit we offer it in."],
    ],
  },
  labels: {
    to: "to",
    factsTitle: (name) => `${name} at a glance`,
    dates: "Dates",
    element: "Element",
    modality: "Modality",
    ruler: "Ruling planet",
    opposite: "Opposite sign",
    traditional: "traditional",
    modern: "modern",
    bestMatch: "Best match",
    hardestMatch: "Hardest match",
    profileLink: (name) => `${name}: traits, love and work`,
    daily: (name) => `${name} daily horoscope`,
    weekly: (name) => `${name} weekly horoscope`,
    monthly: (name) => `${name} monthly horoscope`,
    yearly: (name) => `${name} horoscope 2027`,
    compatHub: "Zodiac compatibility",
    compatHubSub: "Every sign paired with every sign",
    dailyHub: "Daily horoscope",
    dailyHubSub: "A fresh reading for each sign",
    rising: "Rising sign calculator",
    risingSub: "How other people see you",
    moon: "Moon sign calculator",
    moonSub: "What makes you feel safe",
    chart: "Birth chart calculator",
    chartSub: "Every planet on the day you were born",
    numerology: "Numerology",
    numerologySub: "Life path, personal year, angel numbers",
  },
  signs: { aries, taurus, gemini, cancer, leo, virgo, libra, scorpio, sagittarius, capricorn, aquarius, pisces },
};
