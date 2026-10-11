import type { LensId, Band, Archetype, Theme, RelType, Evidence } from "@/engine/compat";

export const lenses: Record<LensId, { name: string; short: string }> = {
  western: { name: "Western astrology", short: "Planet-to-planet links between your birth charts (synastry)." },
  vedic: { name: "Vedic 36-point match", short: "Traditional Indian Moon-star matching (Guna Milan)." },
  chinese: { name: "Chinese zodiac & five elements", short: "Your year animals and elements." },
  numerology: { name: "Numerology", short: "Life Path, Soul Urge and Expression numbers." },
  tarot: { name: "Tarot birth cards", short: "Your birth cards and shared relationship card." },
  yinyang: { name: "Yin–yang balance", short: "How your active and receptive energies balance." },
  bigfive: { name: "Big Five personality", short: "The best-researched model of personality." },
  attachment: { name: "Attachment style", short: "How you each handle closeness and distance." },
  care: { name: "Care styles", short: "How you each like to give and receive care." },
  temperament: { name: "Four temperaments", short: "The classical sanguine / choleric / phlegmatic / melancholic types." },
  nine: { name: "Nine motivations", short: "Your core motivations (nine-type model)." },
  fourletter: { name: "Four-letter style", short: "Outgoing/inward, imaginative/practical, heart/head, planned/flexible." },
  shadow: { name: "Shadow & Light", short: "Your shadows and virtues — and how they dance together." },
  dosha: { name: "Body & energy type", short: "Ayurveda-inspired constitution." },
};

export const evidence: Record<Evidence, { label: string; icon: string; text: string }> = {
  research: { label: "Research-backed", icon: "🔬", text: "Measured with tested questionnaires and supported by relationship research." },
  popular: { label: "Popular psychology", icon: "🧭", text: "Useful language for reflection; limited scientific evidence." },
  traditional: { label: "Traditional & symbolic", icon: "✨", text: "Ancient systems of meaning. Not scientifically predictive — beautiful mirrors for reflection." },
};

export const relTypes: Record<RelType, { name: string; them: string }> = {
  romantic: { name: "Romantic partner", them: "partner" },
  friend: { name: "Friend", them: "friend" },
  family: { name: "Family", them: "family member" },
  colleague: { name: "Colleague", them: "colleague" },
};

export const bands: Record<Band, { name: string; text: string }> = {
  "kindred-flow": { name: "Kindred Flow", text: "Rare ease across many lenses. Your task: don't take it for granted — keep choosing each other." },
  "natural-allies": { name: "Natural Allies", text: "A strong base with clear, workable growth edges. You make each other's lives easier." },
  "complementary-path": { name: "Complementary Path", text: "Your differences complete each other. You'll often see what the other misses." },
  "catalyst-bond": { name: "Catalyst Bond", text: "A high-growth bond. It asks for conscious skills — and rewards you with fast growth." },
  "deep-teacher": { name: "Deep Teacher Bond", text: "You can learn the most from each other here. Tools and kindness matter most — see your practices below." },
};

export const archetypes: Record<Archetype, { name: string; icon: string; text: string }> = {
  harbor: { name: "The Harbor", icon: "⚓", text: "Easy and calm — a safe place to come home to. Add a little adventure to keep it alive." },
  wildfire: { name: "The Wildfire", icon: "🔥", text: "Easy and electric — natural flow plus strong spark. Protect it with good habits." },
  forge: { name: "The Forge", icon: "⚒️", text: "Challenging and electric — you shape each other through friction into something stronger." },
  garden: { name: "The Garden", icon: "🌱", text: "Slow-growing and deepening with care — what you tend together keeps blooming." },
};

export const themes: Record<Theme, { name: string; plus: string; minus: string; practices: [string, string] }> = {
  communication: { name: "Communication", plus: "You get each other's way of thinking and talking.", minus: "You think and speak in different 'languages'.", practices: ["Mirror back: 'What I hear you saying is…' before answering.", "Hold a weekly 20-minute talk with one rule: no fixing, only listening."] },
  emotional: { name: "Emotional depth", plus: "You sense each other's feelings and can go deep.", minus: "Feelings may be processed at different speeds.", practices: ["Daily 'rose and thorn': share one good and one hard moment.", "Name feelings with a word list — precise words calm the nervous system."] },
  passion: { name: "Passion & attraction", plus: "There's real chemistry and energy between you.", minus: "Desire and drive may run on different rhythms.", practices: ["Plan something new together — novelty rekindles attraction.", "Talk openly about what makes each of you feel wanted."] },
  stability: { name: "Stability", plus: "You build safety and reliability together.", minus: "Different needs for structure and security.", practices: ["Create one shared ritual (Sunday breakfast, Friday walk).", "Make a small promise and keep it — trust is built in small deposits."] },
  freedom: { name: "Freedom & space", plus: "You give each other room to breathe.", minus: "Different needs for space and togetherness.", practices: ["Agree on 'me time' openly, so space isn't read as rejection.", "Use a return time: 'I need an hour, I'll be back at 8.'"] },
  growth: { name: "Growth & adventure", plus: "You expand each other's world.", minus: "One may want change while the other wants rest.", practices: ["Pick one thing to learn or explore together this month.", "Ask each other: 'What's one way I could support your dream?'"] },
  nurturing: { name: "Nurturing", plus: "You naturally take care of each other.", minus: "Your ways of caring may not land — translate them.", practices: ["Ask: 'What would make you feel cared for this week?'", "Do one act of care in their style, not yours."] },
  power: { name: "Power & leadership", plus: "You lead well together and respect each other's strength.", minus: "Two strong wills can compete for the wheel.", practices: ["Divide domains: who leads what.", "Take turns making the decision on small things."] },
  play: { name: "Play & joy", plus: "You bring out each other's fun side.", minus: "You recharge and have fun in different ways.", practices: ["Make a 'fun list' with three ideas each — try one weekly.", "Laugh on purpose: share one funny thing a day."] },
  values: { name: "Shared values", plus: "Your deeper values point in the same direction.", minus: "Some priorities differ — respect makes it work.", practices: ["Each write your top 3 values and compare kindly.", "Talk about one dream for the next five years."] },
  conflict: { name: "Handling conflict", plus: "You can disagree and still feel safe.", minus: "Under stress you react in different ways.", practices: ["Use a time-out with a promised return time when things heat up.", "Start hard talks softly: 'I feel… about… and I need…'"] },
  pace: { name: "Rhythm & pace", plus: "You move through life at a compatible tempo.", minus: "One of you is faster, the other slower.", practices: ["Agree on 'decide by' times so neither feels rushed or stalled.", "Notice and thank each other for what each pace brings."] },
};

export const pairCopy = {
  disclaimer: "A mirror for reflection, not a verdict on your relationship. The stars set the scene, psychology explains the pattern, and how you treat each other writes the story.",
  scaleNote: "Scores range from 45 to 100: every pairing has something to offer, so our scale starts at 45. 72 is a typical pair. Each lens score is compared with thousands of random pairs.",
  harmony: "Harmony — how easy and natural this feels",
  spark: "Spark — how much energy, challenge and growth there is",
  resonance: "Resonance",
  evidenceOnly: "Research-backed only",
  evidenceOnlyText: "Based only on the Big Five and attachment lenses, which have real relationship research behind them.",
  evidenceOnlyMissing: "Both people need to take the Big Five and attachment quizzes to see this score.",
  superpowers: "Your superpowers",
  growthEdges: "Your growth edges",
  convergence: (n: number, names: string) => `${n} different lens${n === 1 ? "" : "es"} point here: ${names}.`,
  missing: "Unlock more lenses",
  missingText: "These lenses need quiz results from both people. Invite them to take the quizzes (or enter their result code).",
};
