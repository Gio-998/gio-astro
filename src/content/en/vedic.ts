import type { Nakshatra } from "@/engine/vedic";

export const nakshatras: Record<Nakshatra, { name: string; symbol: string; text: string }> = {
  ashwini: { name: "Ashwini", symbol: "horse's head", text: "swift healer, quick to start and to help" },
  bharani: { name: "Bharani", symbol: "womb", text: "carrier of life, intense and responsible" },
  krittika: { name: "Krittika", symbol: "blade / flame", text: "sharp, purifying, honest to the point of cutting" },
  rohini: { name: "Rohini", symbol: "chariot", text: "fertile, charming, loves beauty and comfort" },
  mrigashira: { name: "Mrigashira", symbol: "deer's head", text: "searching, gentle, curious" },
  ardra: { name: "Ardra", symbol: "teardrop", text: "stormy renewal, depth through difficulty" },
  punarvasu: { name: "Punarvasu", symbol: "quiver of arrows", text: "return of the light, optimism, home" },
  pushya: { name: "Pushya", symbol: "cow's udder", text: "nourishing, protective, devoted" },
  ashlesha: { name: "Ashlesha", symbol: "coiled serpent", text: "perceptive, hypnotic, protective of what it loves" },
  magha: { name: "Magha", symbol: "throne", text: "regal, honours ancestors and tradition" },
  "purva-phalguni": { name: "Purva Phalguni", symbol: "front legs of a bed", text: "pleasure, rest, creativity and romance" },
  "uttara-phalguni": { name: "Uttara Phalguni", symbol: "back legs of a bed", text: "loyal partnership and generous support" },
  hasta: { name: "Hasta", symbol: "hand", text: "skilful, clever with hands, humorous" },
  chitra: { name: "Chitra", symbol: "bright jewel", text: "artistic, brilliant, builds beautiful things" },
  swati: { name: "Swati", symbol: "young shoot in the wind", text: "independent, flexible, diplomatic" },
  vishakha: { name: "Vishakha", symbol: "triumphal arch", text: "determined, goal-focused, passionate" },
  anuradha: { name: "Anuradha", symbol: "lotus", text: "devoted friendship, blooms in hard places" },
  jyeshtha: { name: "Jyeshtha", symbol: "earring / umbrella", text: "protective elder, responsible, proud" },
  mula: { name: "Mula", symbol: "tied roots", text: "goes to the root, seeker of truth" },
  "purva-ashadha": { name: "Purva Ashadha", symbol: "fan", text: "invincible enthusiasm, persuasive" },
  "uttara-ashadha": { name: "Uttara Ashadha", symbol: "elephant tusk", text: "lasting victory, principled" },
  shravana: { name: "Shravana", symbol: "ear", text: "listener and learner, connects people" },
  dhanishta: { name: "Dhanishta", symbol: "drum", text: "rhythmic, musical, generous" },
  shatabhisha: { name: "Shatabhisha", symbol: "empty circle", text: "healer, independent, mysterious" },
  "purva-bhadrapada": { name: "Purva Bhadrapada", symbol: "front of a funeral cot", text: "intense idealist, transformative" },
  "uttara-bhadrapada": { name: "Uttara Bhadrapada", symbol: "back of a funeral cot", text: "deep calm, wisdom, self-control" },
  revati: { name: "Revati", symbol: "fish / drum", text: "gentle guide, compassionate, safe journeys" },
};

export const kootas: Record<string, { name: string; plain: string }> = {
  varna: { name: "Varna", plain: "spiritual temperament and ego match" },
  vashya: { name: "Vashya", plain: "natural attraction and influence" },
  tara: { name: "Tara", plain: "birth-star luck and wellbeing together" },
  yoni: { name: "Yoni", plain: "instinctive and physical affinity" },
  maitri: { name: "Graha Maitri", plain: "friendship of the Moon signs' rulers — mental wavelength" },
  gana: { name: "Gana", plain: "nature: gentle, human or fierce" },
  bhakoot: { name: "Bhakoot", plain: "emotional and family harmony from Moon-sign distance" },
  nadi: { name: "Nadi", plain: "energy constitution — traditionally weighted most" },
};

export const vedicCautions: Record<string, string> = {
  nadi: "Tradition notes a 'same Nadi' pattern — read symbolically as two similar energies that need conscious variety and care for each other's health and rest.",
  bhakoot: "Tradition notes a Moon-sign distance that asks for extra patience in family and money matters.",
  manglik: "Tradition notes Mars emphasis in only one chart (Manglik). It's read as a difference in intensity — channel it into shared physical activity and clear agreements.",
};
export const vedicCancellations: Record<string, string> = {
  "nadi-different-pada": "Traditional cancellation: same birth star but different quarter (pada).",
  "nadi-same-sign": "Traditional cancellation: same Moon sign with different birth stars.",
  "bhakoot-friendly-lords": "Traditional cancellation: the Moon-sign rulers are friends or the same.",
  "manglik-both": "Traditional cancellation: both charts are Manglik, which tradition says balances out.",
};
export const vedicNote = "Vedic (sidereal) astrology uses the Lahiri zodiac, about 24° behind the Western one, so your Vedic Moon sign may differ. Guna Milan is a traditional 36-point system; tradition reads 18+ as acceptable, 25+ good and 32+ excellent. Symbolic only.";
