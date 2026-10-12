import type { MajorCard } from "@/engine/tarot";

export const numbers: Record<number, { name: string; essence: string; lifePath: string; expression: string; soul: string }> = {
  1: { name: "The Pioneer", essence: "independence, beginnings, will", lifePath: "Your path is to lead your own life: to start things, trust your own judgment and learn that strength includes asking for help.", expression: "You express yourself through initiative and originality.", soul: "Deep down you long to be free to choose your own way." },
  2: { name: "The Peacemaker", essence: "partnership, sensitivity, balance", lifePath: "Your path is connection. You grow through cooperation, listening and the quiet power of making people feel safe.", expression: "You express yourself through tact, care and teamwork.", soul: "Deep down you long for a true partner and a peaceful home." },
  3: { name: "The Storyteller", essence: "joy, expression, creativity", lifePath: "Your path is to express (through words, art, humour or style) and to bring lightness to others without hiding your depth.", expression: "You express yourself through words, creativity and charm.", soul: "Deep down you long to create and be enjoyed for who you are." },
  4: { name: "The Builder", essence: "order, effort, foundations", lifePath: "Your path is to build something solid and lasting, and to learn that rest is part of the structure too.", expression: "You express yourself through reliability and practical skill.", soul: "Deep down you long for stability and work that matters." },
  5: { name: "The Free Spirit", essence: "change, adventure, senses", lifePath: "Your path is freedom and experience. You grow by exploring, adapting and finding the commitments that set you free.", expression: "You express yourself through versatility and adventure.", soul: "Deep down you long for variety and room to roam." },
  6: { name: "The Nurturer", essence: "love, responsibility, home", lifePath: "Your path is love made practical: caring for people and beauty, and learning that you deserve care too.", expression: "You express yourself through care, beauty and responsibility.", soul: "Deep down you long for a loving circle where everyone is okay." },
  7: { name: "The Seeker", essence: "wisdom, solitude, depth", lifePath: "Your path is understanding: study, intuition and inner quiet bring you answers, and trust brings you people.", expression: "You express yourself through analysis, depth and insight.", soul: "Deep down you long for truth and time alone to find it." },
  8: { name: "The Powerhouse", essence: "ambition, mastery, abundance", lifePath: "Your path is to handle power and resources well: to build success and use it generously.", expression: "You express yourself through leadership and results.", soul: "Deep down you long for achievement, security and respect." },
  9: { name: "The Humanitarian", essence: "compassion, completion, wisdom", lifePath: "Your path is to serve something bigger: to give, forgive and let go gracefully.", expression: "You express yourself through compassion and broad vision.", soul: "Deep down you long to make the world kinder." },
  11: { name: "The Intuitive (master 11)", essence: "inspiration, sensitivity, vision", lifePath: "A master number: a path of heightened intuition and inspiration. You carry the gentleness of 2 with an extra charge: learning to ground it is the work.", expression: "You express yourself through inspiration and insight.", soul: "Deep down you long to awaken something in others." },
  22: { name: "The Master Builder (master 22)", essence: "vision made real", lifePath: "A master number: big dreams with the practicality of 4. Your path is to build things that help many people. One brick at a time.", expression: "You express yourself by turning vision into structure.", soul: "Deep down you long to leave something lasting." },
  33: { name: "The Master Teacher (master 33)", essence: "compassionate service", lifePath: "A master number: the loving care of 6, amplified. Your path is healing and teaching through example, with boundaries.", expression: "You express yourself through devoted care and teaching.", soul: "Deep down you long to uplift everyone around you." },
};

export const numberPairKinds: Record<string, string> = {
  mirror: "Same number: you recognise yourselves in each other and fall into an easy rhythm, but you'll need someone to bring a different angle.",
  family: "Same number family: your basic drives point in the same direction, so cooperation feels natural.",
  friendly: "A traditionally friendly pair: different but complementary. Each of you supplies something the other enjoys.",
  contrast: "Contrasting numbers: you move at different speeds and value different things. There's a lot to learn here, and patience pays off.",
};

export const families: Record<string, string> = { mind: "mind numbers (1·5·7)", heart: "heart numbers (3·6·9)", builder: "builder numbers (2·4·8)" };

export const tarot: Record<MajorCard, { name: string; keyword: string; birth: string }> = {
  fool: { name: "The Fool", keyword: "fresh start", birth: "You carry beginner's courage: trust, play and leaps into the unknown." },
  magician: { name: "The Magician", keyword: "making things happen", birth: "You have the gift of turning ideas into reality with focus and skill." },
  "high-priestess": { name: "The High Priestess", keyword: "inner knowing", birth: "You know more than you say: intuition and quiet wisdom guide you." },
  empress: { name: "The Empress", keyword: "abundance and care", birth: "You nurture, create and make life lush and welcoming." },
  emperor: { name: "The Emperor", keyword: "structure and protection", birth: "You bring order, leadership and a safe frame for others." },
  hierophant: { name: "The Hierophant", keyword: "teaching and tradition", birth: "You value meaning, learning and passing on what matters." },
  lovers: { name: "The Lovers", keyword: "choice and union", birth: "Your life is shaped by heartfelt choices and deep bonds." },
  chariot: { name: "The Chariot", keyword: "willpower", birth: "You move forward by steering strong, opposite forces in one direction." },
  strength: { name: "Strength", keyword: "gentle power", birth: "Your strength is soft and steady: courage that tames rather than forces." },
  hermit: { name: "The Hermit", keyword: "inner light", birth: "You find truth in solitude and later light the way for others." },
  wheel: { name: "Wheel of Fortune", keyword: "cycles", birth: "You're attuned to timing and change. You grow by riding the turns." },
  justice: { name: "Justice", keyword: "fairness", birth: "You live by fairness, truth and taking responsibility for choices." },
  "hanged-one": { name: "The Hanged Man", keyword: "new perspective", birth: "You see what others miss by pausing and looking from a different angle." },
  death: { name: "Death", keyword: "transformation", birth: "You're a natural at endings that make room for rebirth (it's about change, not loss)." },
  temperance: { name: "Temperance", keyword: "balance", birth: "You blend opposites patiently and heal by finding the middle way." },
  devil: { name: "The Devil", keyword: "desire and shadow", birth: "You understand attachment and temptation, and so you can help others break free." },
  tower: { name: "The Tower", keyword: "breakthrough", birth: "You clear away what's false so something truer can be built." },
  star: { name: "The Star", keyword: "hope", birth: "You carry hope and renewal. People feel lighter around you." },
  moon: { name: "The Moon", keyword: "dreams and intuition", birth: "You navigate the unclear with imagination and sensitivity." },
  sun: { name: "The Sun", keyword: "joy", birth: "You radiate warmth, vitality and a childlike joy." },
  judgement: { name: "Judgement", keyword: "awakening", birth: "You're called to rise to a purpose and to forgive the past." },
  world: { name: "The World", keyword: "wholeness", birth: "You seek completion: bringing the whole picture together." },
};
