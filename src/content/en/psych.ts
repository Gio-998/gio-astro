import type { Trait, Temperament } from "@/engine/bigfive";
import type { AttachStyle, Care, Dosha, Constitution, Stance } from "@/engine/quizzes";
import type { Axis } from "@/engine/shadow";
import type { ArchetypeAnimal } from "@/engine/profile";

export const traits: Record<Trait, { name: string; plain: string; low: string; mid: string; high: string; inLove: string }> = {
  O: { name: "Openness", plain: "curiosity & imagination", low: "You like what's proven and practical; you bring groundedness.", mid: "You balance new ideas with what already works.", high: "You love ideas, art and new experiences; routine bores you fast.", inLove: "brings novelty and depth of conversation" },
  C: { name: "Conscientiousness", plain: "reliability & order", low: "You're spontaneous and flexible; plans are suggestions.", mid: "You're organised when it matters and relaxed when it doesn't.", high: "You're dependable, planned and follow through.", inLove: "brings reliability, one of the traits linked to happier relationships" },
  E: { name: "Extraversion", plain: "social energy", low: "You recharge alone and prefer deep one-to-one talks.", mid: "You enjoy people and also need your quiet.", high: "You recharge with people, talk easily and bring energy to the room.", inLove: "brings warmth, fun and shared activity" },
  A: { name: "Agreeableness", plain: "warmth & cooperation", low: "You're frank, competitive and hard to push around.", mid: "You're kind and can also stand your ground.", high: "You're warm, trusting and quick to help or forgive.", inLove: "brings kindness, which is strongly linked to relationship satisfaction" },
  N: { name: "Emotional sensitivity", plain: "how strongly stress and worry hit you", low: "You stay calm under pressure and bounce back fast.", mid: "You feel stress like most people and usually recover well.", high: "You feel worry and hurt intensely; you're also deeply aware of emotions.", inLove: "high sensitivity asks for reassurance and calming rituals: the most important trait to care for together" },
};

export const letters: Record<string, string> = {
  E: "Outgoing: energised by people", I: "Inward: energised by quiet",
  N: "Imaginative: drawn to ideas and patterns", S: "Practical: drawn to facts and the here-and-now",
  F: "Heart-led: decides with people in mind", T: "Head-led: decides with logic in mind",
  J: "Planned: likes closure and structure", P: "Flexible: likes options and going with the flow",
};

export const fourLetterStyles: Record<string, { name: string; text: string }> = {
  INTJ: { name: "The Night Planner", text: "Independent, strategic and quietly determined; sees the long game." },
  INTP: { name: "The Quiet Puzzler", text: "Curious and analytical; loves to understand how everything fits." },
  ENTJ: { name: "The Bold Organizer", text: "Decisive and driven; turns visions into plans and plans into results." },
  ENTP: { name: "The Idea Sparker", text: "Quick, inventive and playful; loves debate and new possibilities." },
  INFJ: { name: "The Deep Listener", text: "Insightful and caring; senses what people need and why." },
  INFP: { name: "The Inner Poet", text: "Idealistic and gentle; guided by values and imagination." },
  ENFJ: { name: "The Warm Rallier", text: "Encouraging and people-focused; brings others together around a cause." },
  ENFP: { name: "The Bright Explorer", text: "Enthusiastic and imaginative; sees potential in everyone." },
  ISTJ: { name: "The Steady Keeper", text: "Reliable and thorough; keeps promises and keeps things running." },
  ISFJ: { name: "The Gentle Carer", text: "Kind, loyal and attentive; remembers what matters to people." },
  ESTJ: { name: "The Clear Director", text: "Practical and organised; makes sure things get done properly." },
  ESFJ: { name: "The Social Glue", text: "Warm and sociable; keeps people connected and cared for." },
  ISTP: { name: "The Calm Fixer", text: "Hands-on and cool-headed; solves problems in the moment." },
  ISFP: { name: "The Quiet Artist", text: "Gentle and sensory; expresses themselves through beauty and action." },
  ESTP: { name: "The Quick Doer", text: "Energetic and bold; learns by jumping in." },
  ESFP: { name: "The Joy Bringer", text: "Spontaneous and fun; makes every moment livelier." },
};

export const temperaments: Record<Temperament, { name: string; text: string; tip: string }> = {
  sanguine: { name: "Sanguine (air)", text: "Sociable, optimistic and lively. You lift the mood and live in the moment.", tip: "Follow through on one promise a day." },
  choleric: { name: "Choleric (fire)", text: "Driven, intense and decisive. You push things forward and feel strongly.", tip: "Pause for three breaths before reacting." },
  phlegmatic: { name: "Phlegmatic (water)", text: "Calm, steady and easy-going. You bring peace and patience.", tip: "Say your preference out loud, even when you could go along." },
  melancholic: { name: "Melancholic (earth)", text: "Thoughtful, deep and careful. You notice details and feel things fully.", tip: "Name one thing that went well before you sleep." },
};

export const attachment: Record<AttachStyle, { name: string; text: string; need: string; tip: string }> = {
  secure: { name: "Secure", text: "You're mostly comfortable with closeness and independence. You can ask for what you need and trust others to show up.", need: "honesty and mutual respect", tip: "Your calm is a gift: offer it, but don't carry all the repair work alone." },
  anxious: { name: "Anxious-leaning", text: "You love deeply and stay alert to signs of distance. When someone goes quiet, worry can rush in.", need: "reassurance, consistency and clear signals", tip: "Before reacting, name the fear: 'I'm feeling unsure, can you reassure me?'" },
  avoidant: { name: "Avoidant-leaning", text: "You value self-reliance and can feel crowded when someone wants a lot of closeness.", need: "space without guilt, and closeness at your own pace", tip: "Say 'I need a little time. I'll come back at 8' instead of disappearing." },
  fearful: { name: "Push-pull", text: "You long for closeness and also fear it, so you may move toward people and then away.", need: "patience, safety and very consistent kindness", tip: "Notice the pull-back moment and share it: 'part of me wants to run right now.'" },
};
export const pursueWithdraw: string = "When one person seeks closeness under stress and the other seeks space, a loop can form: the more one pursues, the more the other withdraws. It's the most common pattern couples report, and the most fixable. Agree on a time-out with a promised return time.";

export const nineStyles: Record<number, { name: string; core: string; gift: string; growth: string }> = {
  1: { name: "The Improver", core: "wants to be good and do things right", gift: "integrity and high standards", growth: "Make room for 'good enough' and for joy." },
  2: { name: "The Helper", core: "wants to be loved and needed", gift: "generosity and warmth", growth: "Ask for help as freely as you give it." },
  3: { name: "The Achiever", core: "wants to be valuable and successful", gift: "drive and adaptability", growth: "Let people see you when you're not performing." },
  4: { name: "The Individualist", core: "wants to be authentic and understood", gift: "depth, creativity and emotional honesty", growth: "Notice what's already beautiful in ordinary days." },
  5: { name: "The Observer", core: "wants to understand and be capable", gift: "insight and calm objectivity", growth: "Share your inner world before you feel fully ready." },
  6: { name: "The Loyalist", core: "wants security and trust", gift: "loyalty, preparedness and courage under fire", growth: "Trust your own inner guidance a little more each week." },
  7: { name: "The Enthusiast", core: "wants freedom and good experiences", gift: "joy, optimism and ideas", growth: "Stay with a hard feeling for five minutes before moving on." },
  8: { name: "The Protector", core: "wants strength and control over their own life", gift: "courage, directness and protectiveness", growth: "Show softness. It's strength, not weakness." },
  9: { name: "The Peacemaker", core: "wants inner and outer peace", gift: "acceptance and the ability to unite people", growth: "Your opinion matters: say it first sometimes." },
};
export const nineNote: string = "Nine-style motivations are inspired by the widely used nine-type model of personality. This is our own short quiz, not an official test.";

export const care: Record<Care, { name: string; text: string; tip: string }> = {
  words: { name: "Kind words", text: "Appreciation, encouragement and 'I'm proud of you' fill your cup.", tip: "Send one specific compliment today." },
  time: { name: "Time together", text: "Undivided attention (phones away, eyes up) means the most.", tip: "Plan 20 distraction-free minutes." },
  gifts: { name: "Thoughtful gifts", text: "A small token that shows 'I thought of you' feels like love made visible.", tip: "Bring back a tiny something from your day." },
  help: { name: "Helpful actions", text: "Help with a task, a solved problem or a cup of tea made without asking feels caring.", tip: "Take one chore off their list." },
  touch: { name: "Physical affection", text: "Hugs, a hand on the shoulder, sitting close: touch says it best (always with consent).", tip: "A long hug: at least 20 seconds." },
};
export const careNote: string = "Research suggests most people value all five ways of caring, and 'matching' matters less than learning each other's favourites. Use this as a translation guide.";

export const shadowAxes: Record<Axis, { classical: string; virtue: string; shadow: string; gift: string; practice: string }> = {
  pride: { classical: "Pride", virtue: "Humility", shadow: "Hard to admit mistakes; needing to be right.", gift: "Self-respect and the courage to stand tall.", practice: "Say 'you were right about that' once this week." },
  greed: { classical: "Greed", virtue: "Generosity", shadow: "Feeling it's never enough; holding on tight.", gift: "Ambition and the ability to provide.", practice: "Give something away without telling anyone." },
  desire: { classical: "Lust", virtue: "Self-control", shadow: "Wanting intensely and acting on impulse.", gift: "Passion, vitality and knowing what you want.", practice: "When a strong urge hits, wait ten minutes, then decide." },
  envy: { classical: "Envy", virtue: "Admiration", shadow: "Others' success stings.", gift: "A signal showing what you truly want for yourself.", practice: "Turn one envy into a goal: 'what step can I take toward that?'" },
  excess: { classical: "Gluttony", virtue: "Temperance", shadow: "Overdoing pleasant things: food, screens, shopping.", gift: "A big capacity for enjoyment.", practice: "Practise 'enough': stop at satisfied once a day." },
  anger: { classical: "Wrath", virtue: "Patience", shadow: "Anger rising fast and strong.", gift: "A passion for justice and protecting what matters.", practice: "Name the hurt under the anger before you speak." },
  inertia: { classical: "Sloth", virtue: "Diligence", shadow: "Putting off what matters.", gift: "The ability to rest and not burn out.", practice: "Do the most important task for just 10 minutes." },
};
export const shadowDances: Record<string, string> = {
  "power-struggle": "Two proud hearts: you both like to be right. Take turns being the first to soften.",
  "chase-stonewall": "When one heats up and the other shuts down, both feel unheard. Agree a cool-down and a return time.",
  competition: "Comparison can sneak in. Celebrate each other's wins out loud.",
  "double-fire": "Two quick tempers make sparks fly. Use a safe word to pause arguments.",
  scarcity: "You can both slip into 'not enough' thinking. Make a shared generosity ritual.",
  "double-indulgence": "You enable each other's treats. Build fun that isn't consumption.",
  "stuck-together": "Comfort can turn into drift. Pick one shared goal per season.",
  "comparison-loop": "Watch for comparing yourselves with others. Gratitude lists help.",
  "no-backing-down": "Anger meets pride: no one blinks. Practise the 'repair phrase' early.",
  "high-heat": "Two strong desires. Lots of passion, so keep agreements clear and kind.",
};

export const doshas: Record<Dosha, { name: string; element: string; text: string; balance: string }> = {
  vata: { name: "Vata", element: "air & space", text: "Quick, creative and light. You thrive on inspiration but can scatter or worry when out of balance.", balance: "warmth, routine, grounding food and enough sleep" },
  pitta: { name: "Pitta", element: "fire & water", text: "Focused, sharp and driven. You lead well but can overheat into irritation.", balance: "cooling foods, play without competition, time in nature" },
  kapha: { name: "Kapha", element: "earth & water", text: "Steady, calm and loving. You endure and nurture but can get stuck or sluggish.", balance: "movement, variety, lighter meals and new experiences" },
};
export const constitutions: Record<Constitution, string> = {
  vata: "Mostly Vata: airy and creative.", pitta: "Mostly Pitta: fiery and focused.", kapha: "Mostly Kapha: earthy and steady.",
  "vata-pitta": "Vata-Pitta: quick and driven.", "pitta-kapha": "Pitta-Kapha: strong and steady.", "vata-kapha": "Vata-Kapha: gentle and creative.",
  tridoshic: "Balanced (tridoshic): a little of each.",
};
export const doshaNote: string = "Inspired by traditional Ayurvedic ideas, for self-reflection and wellbeing routines only. Not medical advice.";

export const explorer = {
  name: "Autopilot vs Explorer mind",
  text: "Inspired by Dr Jacques Fradin's neurocognitive approach: we all switch between an 'autopilot' mode (routine, certainty, what worked before) and an 'explorer' mode (curiosity, nuance, adapting). Stress often means autopilot is trying to handle something that needs the explorer.",
  low: "You lean on autopilot: efficient, consistent, reliable. When stressed, try asking 'what's one thing here I don't know yet?'",
  mid: "You switch between both modes. Notice which one shows up under stress.",
  high: "You lean explorer: curious, flexible, comfortable with grey areas. Remember that routines can free your mind too.",
  dims: { routine: "Routine ↔ Curiosity", persistence: "Persistence ↔ Flexibility", simplify: "Simplicity ↔ Nuance", certainty: "Certainty ↔ Openness", evidence: "Experience ↔ Fresh reasoning", image: "Others' opinion ↔ Own view" } as Record<string, string>,
  note: "Own short questionnaire inspired by published ideas; not an official assessment.",
};
export const stances: Record<Stance, { name: string; text: string }> = {
  "steady-leader": { name: "Steady leader", text: "Confident and at home in groups. You take the lead and bring people with you. Watch that quieter voices get room." },
  "lone-pathfinder": { name: "Lone pathfinder", text: "Confident and independent. You trust your own way more than the crowd's. Allies multiply your strength." },
  "warm-supporter": { name: "Warm supporter", text: "You belong easily and support others generously. Your opinion deserves the same space you give everyone else." },
  "quiet-observer": { name: "Quiet observer", text: "You watch from the edge and see what others miss. Small, safe steps of self-expression will build confidence." },
};

export const archetypeAnimals: Record<ArchetypeAnimal, { name: string; text: string }> = {
  lion: { name: "Lion", text: "Radiant courage. You protect and lead with a big heart." },
  hawk: { name: "Hawk", text: "Clear vision and swift action. You see the target and go." },
  "horse-wild": { name: "Wild Horse", text: "Free spirit with deep stamina. You run toward what you love." },
  fox: { name: "Fox", text: "Quiet fire and clever warmth. You move gracefully through any situation." },
  stag: { name: "Stag", text: "Proud, steady strength. You stand your ground with dignity." },
  bear: { name: "Bear", text: "Protective, warm and powerful: the safe place others run to." },
  elephant: { name: "Elephant", text: "Memory, loyalty and gentle power. You never forget kindness." },
  tortoise: { name: "Tortoise", text: "Patient wisdom: slow, steady and always arriving." },
  eagle: { name: "Eagle", text: "The big picture. You rise above to see where everything leads." },
  hummingbird: { name: "Hummingbird", text: "Bright joy and quick mind. You find sweetness everywhere." },
  raven: { name: "Raven", text: "Clever and mysterious. You understand more than you show." },
  dolphin: { name: "Dolphin", text: "Playful intelligence and harmony. You connect people effortlessly." },
  otter: { name: "Otter", text: "Joyful and loving. You play, care and hold hands while you float." },
  wolf: { name: "Wolf", text: "Loyal instinct: devoted to your pack and your own path." },
  whale: { name: "Whale", text: "Deep feeling and ancient calm. Your song travels far." },
  owl: { name: "Owl", text: "Night wisdom. You see in the dark and speak when it matters." },
};
export const archetypeNote: string = "Your archetype animal is a symbol drawn from your strongest element and your yin-yang balance: a poetic mirror, not a spiritual claim on any tradition.";
