import type { Animal, WuXing, AnimalRelation, ElementRelation } from "@/engine/chinese";

export const animals: Record<Animal, { name: string; essence: string; gifts: string; edge: string }> = {
  rat: { name: "Rat", essence: "Quick-witted, resourceful and charming. You spot opportunities before others see the door.", gifts: "cleverness, adaptability, loyalty to your circle", edge: "worry and over-planning" },
  ox: { name: "Ox", essence: "Patient, dependable and strong. You win by steady effort and keep your word.", gifts: "reliability, endurance, honesty", edge: "stubbornness when change is needed" },
  tiger: { name: "Tiger", essence: "Brave, passionate and magnetic. You protect the underdog and act on conviction.", gifts: "courage, charisma, generosity", edge: "impulsiveness and restlessness" },
  rabbit: { name: "Rabbit", essence: "Gentle, elegant and perceptive. You create peace and beauty wherever you settle.", gifts: "kindness, tact, good taste", edge: "avoiding conflict that needs to happen" },
  dragon: { name: "Dragon", essence: "Bold, visionary and full of life force. You dream big and inspire others to follow.", gifts: "confidence, energy, vision", edge: "impatience and pride" },
  snake: { name: "Snake", essence: "Wise, intuitive and composed. You read a room quickly and move through it with quiet grace.", gifts: "insight, calm, elegance", edge: "secrecy and suspicion" },
  horse: { name: "Horse", essence: "Free-spirited, warm and energetic. You need open space, movement and honest company.", gifts: "enthusiasm, independence, cheer", edge: "restlessness and short patience" },
  goat: { name: "Goat", essence: "Gentle, artistic and kind-hearted. You bring softness, creativity and care.", gifts: "compassion, creativity, harmony", edge: "worry and indecision" },
  monkey: { name: "Monkey", essence: "Clever, playful and inventive. You solve problems with humour and fresh ideas.", gifts: "ingenuity, wit, curiosity", edge: "restlessness and mischief" },
  rooster: { name: "Rooster", essence: "Observant, hardworking and honest. You take pride in doing things properly.", gifts: "precision, courage, candour", edge: "criticism and perfectionism" },
  dog: { name: "Dog", essence: "Loyal, fair and protective. You stand by your people and your principles.", gifts: "loyalty, honesty, a sense of justice", edge: "anxiety and pessimism" },
  pig: { name: "Pig", essence: "Generous, sincere and fun-loving. You enjoy life and want everyone at the table.", gifts: "warmth, generosity, tolerance", edge: "naivety and over-indulgence" },
};

export const wuxing: Record<WuXing, { name: string; text: string; color: string }> = {
  wood: { name: "Wood", text: "growth, kindness and planning: the energy of spring", color: "green" },
  fire: { name: "Fire", text: "passion, joy and visibility: the energy of summer", color: "red" },
  earth: { name: "Earth", text: "stability, care and trust: the energy of late summer", color: "yellow" },
  metal: { name: "Metal", text: "clarity, structure and integrity: the energy of autumn", color: "white" },
  water: { name: "Water", text: "wisdom, depth and flow: the energy of winter", color: "black/blue" },
};

export const animalRelations: Record<AnimalRelation, { name: string; text: string }> = {
  "six-harmony": { name: "Secret friends (Six Harmonies)", text: "Tradition calls this one of the six harmonious pairs: a quiet, natural alliance where each covers the other's blind spot." },
  trine: { name: "Same-team trine", text: "You belong to the same group of three that shares values and rhythm: understanding comes easily." },
  same: { name: "Mirror animals", text: "You share an animal, so you recognise each other fast: strengths and stubborn habits included." },
  neutral: { name: "Open field", text: "Tradition gives no strong pull either way. This bond is shaped mostly by what you build." },
  harm: { name: "Sensitive pair", text: "Tradition flags small misunderstandings here. Clear words and kindness about small things make the difference." },
  clash: { name: "Magnetic opposites", text: "You sit opposite each other on the zodiac wheel. That brings attraction and challenge: strong spark, and much to learn from each other's way." },
};

export const elementRelations: Record<ElementRelation, string> = {
  generating: "One element feeds the other (like wood feeding fire): a naturally supportive flow.",
  same: "You share an element: easy understanding, and the shared habits can amplify each other.",
  controlling: "One element shapes the other (like water calming fire). This gives structure and growth when respected, friction when ignored.",
};
