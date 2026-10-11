/** Long-form "Bond Story" content. Element-pair keys are alphabetical: "air-fire", "earth-water"… */
type PairKey = "fire-fire" | "earth-fire" | "air-fire" | "fire-water" | "earth-earth" | "air-earth" | "earth-water" | "air-air" | "air-water" | "water-water";
export type { PairKey };

export const meetPair: Record<PairKey, string> = {
  "fire-fire": "Two fires recognise each other at once. First meetings are often loud, warm and fast — jokes, plans, a sense of 'where have you been?'. You energise each other's courage. The early lesson is that two flames also need air and rest, or the evening burns out as quickly as it started.",
  "earth-fire": "Fire arrives with sparks; earth watches and decides. At first fire may find earth a little slow, and earth may find fire a little much — and yet each is quietly impressed: fire by earth's steadiness, earth by fire's nerve. When it works, fire brings the ideas and earth makes them real.",
  "air-fire": "Air and fire meet like wind and flame: instantly lively. Conversation races, ideas multiply, laughter comes easily. Air gives fire perspective and words; fire gives air warmth and direction. This is one of the most naturally exciting combinations — the work is keeping it grounded.",
  "fire-water": "Fire and water make steam. The first meeting is often intense — attraction, fascination, sometimes confusion. Fire is drawn to water's depth; water to fire's warmth and courage. You can feel very alive together, and very misunderstood. Gentleness is the bridge.",
  "earth-earth": "Two earths feel safe almost immediately. There's less fireworks and more trust: shared values, shared rhythms, a sense that this person is real. You build quickly and well together. Your early lesson is to keep a little novelty in the soil.",
  "air-earth": "Air comes with ideas; earth asks how they would work. First meetings can feel like an interesting debate. Air may find earth too cautious, earth may find air too abstract — but each fills in what the other lacks: air widens earth's horizon, earth gives air's plans legs.",
  "earth-water": "Earth and water meet like a riverbank and its river: naturally. There's a feeling of comfort and care from early on. Water feels held by earth's steadiness; earth feels softened by water's warmth. This is one of the most nurturing combinations of all.",
  "air-air": "Two airs meet in conversation and keep talking. You understand each other's minds quickly, share ideas, laugh at the same things and give each other freedom. The early question is depth: who will slow down enough to feel, not only to think?",
  "air-water": "Air thinks, water feels. At first each is intrigued by the other's world: air by water's intuition, water by air's clarity. You can teach each other a great deal — and you may also feel like you speak different languages. Patience turns this into a beautiful translation.",
  "water-water": "Two waters sense each other before a word is spoken. There's empathy, intuition and a feeling of being deeply understood. The bond can become very close very quickly. The lesson is boundaries: knowing whose feelings are whose.",
};
export const heartPair: Record<PairKey, string> = {
  "fire-fire": "Emotionally you both react fast and recover fast. Feelings are expressed directly, which keeps things honest — and can lead to sudden flare-ups. You feel loved through enthusiasm, attention and shared action.",
  "earth-fire": "One heart flares, the other steadies. Fire feels emotions quickly and loudly; earth processes them slowly and practically. Fire needs earth to respond with warmth, not only calm; earth needs fire to give it time.",
  "air-fire": "Your emotional styles are light and quick: you talk feelings through, cheer each other up and move on. The risk is skipping the deeper, slower feelings that need more than a joke.",
  "fire-water": "Fire's feelings blaze and pass; water's run deep and last. Fire may not realise how long water carries a hurt; water may not realise fire has already forgiven. Naming feelings gently — and checking in later — helps a lot.",
  "earth-earth": "Your emotional lives are steady and loyal. You show care through presence and practical help, and you rarely make drama. The risk is not saying the feelings out loud at all.",
  "air-earth": "Air understands feelings by talking about them; earth by doing something about them. Air may feel earth is silent; earth may feel air overanalyses. Both are care — in different dialects.",
  "earth-water": "Your hearts fit naturally: water feels deeply, earth holds steadily. Water needs earth to show emotion sometimes, not only stability; earth needs water to trust that calm is also love.",
  "air-air": "You process feelings through conversation and ideas. You're good at understanding each other — the edge is letting feelings be felt, not only explained.",
  "air-water": "Water feels first and explains later; air explains first and feels later. Water may experience air as distant; air may experience water as overwhelming. Translate gently: 'What I mean is…', 'What I feel is…'.",
  "water-water": "Two deep hearts: you feel each other's moods intensely and comfort each other naturally. In hard times you may both sink together; one of you needs to be the shore sometimes.",
};
export const talkPair: Record<PairKey, string> = {
  "fire-fire": "You talk fast, interrupt each other with enthusiasm and decide quickly. Great for planning adventures; less great when both need to be heard at once. Take turns.",
  "earth-fire": "Fire talks in possibilities; earth in practicalities. Fire may feel slowed down, earth may feel rushed. Agreeing 'idea time' versus 'plan time' makes you a formidable team.",
  "air-fire": "Your minds sparkle together: debates, jokes, ideas. You'll rarely be bored. Make sure the big talks end in a decision, not only in excitement.",
  "fire-water": "Fire speaks directly; water hears tone and subtext. A blunt sentence from fire can wound water, and water's hints can be missed by fire. Directness with softness is your shared language.",
  "earth-earth": "You speak plainly and mean what you say. Fewer words, more agreement. Remember to talk about dreams, not only logistics.",
  "air-earth": "Air brainstorms; earth evaluates. Done well, this is how good decisions are made. Done badly, air feels criticised and earth feels unheard. Say which mode you're in.",
  "earth-water": "Earth speaks in facts, water in feelings. You understand each other better than you think. Ask 'what do you need?' more than 'what's the problem?'.",
  "air-air": "You could talk all night — and probably do. Your communication is a pleasure. The trap is talking about everything except the one uncomfortable thing.",
  "air-water": "Air uses logic, water uses intuition. You can complement each other beautifully if air listens for the feeling under the words and water risks saying things plainly.",
  "water-water": "You often understand without speaking. That's a gift — and a trap, because assumptions replace questions. Say the obvious things anyway.",
};
export const desirePair: Record<PairKey, string> = {
  "fire-fire": "Attraction between two fires is immediate and playful — challenge, chase and laughter. Keep it alive with adventure.",
  "earth-fire": "Fire brings boldness, earth brings sensuality and patience. The chemistry grows slowly and can surprise you both.",
  "air-fire": "Desire starts in the mind: banter, flirting and fun. Keep surprising each other.",
  "fire-water": "Magnetic and intense: fire's passion meets water's depth. Emotional safety makes the chemistry last.",
  "earth-earth": "A slow, sensual, loyal attraction. Comfort is not the enemy of desire — routine is. Plan novelty.",
  "air-earth": "Air is attracted to earth's calm presence, earth to air's lightness. Chemistry grows through shared experiences.",
  "earth-water": "Tender and sensual: touch, closeness and safety feed desire. A very nourishing chemistry.",
  "air-air": "Attraction through ideas, humour and freedom. Flirt with words — and remember the body too.",
  "air-water": "Air's lightness intrigues water; water's depth fascinates air. Chemistry needs both talk and tenderness.",
  "water-water": "Deep, emotional, almost telepathic attraction. Intimacy is built on feeling safe.",
};

export const attachPair: Record<string, { text: string; flag?: string }> = {
  "secure-secure": { text: "You both feel fairly safe with closeness and with space. Conflicts are uncomfortable but not catastrophic; you can repair. This is the strongest foundation research knows for long-term happiness." },
  "anxious-secure": { text: "The secure partner's steadiness can calm the anxious partner's fears over time — a truly healing combination when the secure one offers reassurance and the anxious one learns to trust it." },
  "avoidant-secure": { text: "The secure partner gives the avoidant one room without punishment, and gently invites closeness. Over time this can soften the avoidant pattern." },
  "fearful-secure": { text: "The secure partner's consistency can be deeply healing for the fearful one — if both are patient with the push-pull." },
  "anxious-anxious": { text: "You both crave closeness and reassurance. You understand each other's fears — and can trigger them. Together you need extra calm: slow responses, clear reassurance, shared self-soothing.", flag: "Two anxious hearts can spiral together. If a fight starts with 'you don't care', pause, breathe and reassure before discussing." },
  "anxious-avoidant": { text: "This is the classic pursue-withdraw dance: the more one reaches, the more the other retreats — and the more the other retreats, the more the first reaches. It's very common and very workable once you see it.", flag: "Watch the pursue–withdraw loop. The anxious one practises self-soothing; the avoidant one practises saying 'I need an hour, then I'll come back' — and coming back." },
  "anxious-fearful": { text: "Both of you long for closeness and feel worried about it. You may understand each other's pain intimately. Consistency and gentleness are essential." , flag: "Mixed signals can amplify worry on both sides. Agree simple, clear check-in habits." },
  "avoidant-avoidant": { text: "You both value independence and give each other lots of space. Calm and low-drama — and at risk of drifting apart without noticing.", flag: "Distance can grow quietly. Schedule real closeness, and talk about feelings even when it feels unnecessary." },
  "avoidant-fearful": { text: "One protects through distance, the other swings between longing and caution. Patience, clarity and small steps toward closeness help both." , flag: "When both pull back at once, nobody reaches out. Decide in advance who sends the first message after a fight." },
  "fearful-fearful": { text: "You both know how it feels to want and fear closeness. That shared understanding can be profound; it also needs a lot of gentleness and, often, outside support.", flag: "Mutual triggering is possible. Go slowly and consider support from a therapist or trusted friends." },
};

export const lifePathPair: Record<"mirror" | "family" | "friendly" | "contrast", string> = {
  mirror: "You walk the same Life Path number — you understand each other's life lessons from the inside, and may also repeat each other's blind spots.",
  family: "Your Life Paths belong to the same family of numbers: your life rhythms and values tend to resonate naturally.",
  friendly: "Your Life Paths are traditional 'friends': different journeys that support each other.",
  contrast: "Your Life Paths are quite different: you'll show each other ways of living the other wouldn't choose alone — exciting and educational.",
};
export const chinesePair: Record<string, string> = {
  "six-harmony": "In Chinese tradition your animals form a 'secret friend' pair — one of the most supportive bonds on the wheel. You tend to protect and complete each other.",
  trine: "Your animals belong to the same team of four — natural allies who share a style and pace.",
  same: "You share the same animal: deep familiarity, the same strengths and the same stubborn spots.",
  neutral: "Your animals are neutral in tradition — the bond is shaped by what you build, not by fate.",
  harm: "Tradition says your animals can misunderstand each other in small ways. Clear communication solves most of it.",
  clash: "Your animals sit opposite on the wheel — a 'clash' pair. That means magnetism and friction: you see the world from opposite sides, and can learn the most from each other.",
};
export const traitPair: Record<string, { same: string; diff: string }> = {
  O: { same: "You share a similar appetite for novelty and ideas, so plans and conversations come easily.", diff: "One of you loves novelty, the other prefers the familiar: one brings adventure, the other brings roots." },
  C: { same: "You have similar standards for order and reliability — fewer arguments about chores and plans.", diff: "One plans, the other improvises. Agree on what must be planned and what can stay loose." },
  E: { same: "Your social batteries are similar — you agree on how many people and how much quiet you need.", diff: "One recharges with people, the other alone. Negotiate social time openly; neither is wrong." },
  A: { same: "You have a similar balance of softness and directness, so conflict feels familiar.", diff: "One of you is gentler, the other more direct. The gentler one needs the truth said kindly; the direct one needs the gentle one to speak up." },
  N: { same: "You react to stress in similar ways — you understand each other's worries (or calm).", diff: "One feels stress strongly, the other stays calm. The calm one can be an anchor; the sensitive one can teach emotional awareness." },
};

export const relIntro: Record<string, (a: string, b: string) => string> = {
  romantic: (a, b) => `This is the story of ${a} and ${b} as partners — how you meet, talk, desire, argue and grow. Every bond has a weather of its own. Here is yours, read through the sky, the old calendars and your own answers.`,
  friend: (a, b) => `This is the story of ${a} and ${b} as friends — the kind of friendship you make, how you support each other, and what makes it last.`,
  family: (a, b) => `This is the story of ${a} and ${b} as family — the old patterns, the deep loyalty and the ways you can heal and lift each other.`,
  colleague: (a, b) => `This is the story of ${a} and ${b} as colleagues — how you think, decide and build together, and how to make the most of your differences.`,
};
export const archetypeLong: Record<string, string> = {
  harbor: "Long term, your bond tends to become a harbour: a safe, calm place to come home to. That is rare and precious. The risk of every harbour is that ships never leave it — keep bringing in new experiences, new conversations, new adventures, so that safety never turns into stillness.",
  wildfire: "Long term, your bond has the makings of a wildfire: easy and electric at once. You flow and you spark. Protect it with rest, kindness and honest talk, because strong fires need tending — and few bonds are this alive.",
  forge: "Long term, your bond works like a forge: heat and pressure shape you both. It isn't always easy, but it's rarely boring, and it can make you both stronger. The key is respect: friction that sharpens rather than wounds.",
  garden: "Long term, your bond is a garden: slower to bloom, deepening with every season you tend it. You grow into each other over time. Patience, small rituals and appreciation are your water and sunlight.",
};
export const rituals: Record<string, string[]> = {
  romantic: ["A weekly date with phones in another room.", "A 10-minute 'how are we?' check-in every Sunday.", "Each morning, one sentence of appreciation.", "A new experience together every month."],
  friend: ["A standing monthly meet-up you both protect.", "Send each other something that made you think of them.", "Celebrate each other's small wins out loud.", "Do one new thing together each season."],
  family: ["A regular call or meal at a fixed time.", "Share one memory or family story each visit.", "Ask about the present, not only the past.", "Thank each other for something specific."],
  colleague: ["A short weekly sync about priorities, not only tasks.", "Name each other's strengths when assigning work.", "Decide in advance how disagreements are settled.", "Celebrate finished projects together."],
};
export const flags = {
  fireWater: "Fire–water heat: arguments can boil quickly. Cool down before resolving.",
  bothLowA: "You are both fairly direct. Honesty is good — add warmth on purpose, especially in conflict.",
  bothHighN: "You both feel stress strongly. In hard weeks, agree to be gentle and take turns being the calm one.",
  careMismatch: (a: string, b: string, ga: string, gb: string) => `Care-style mismatch: ${a} gives ${ga} but most needs something else, and ${b} gives ${gb}. You may each be loving in ways the other doesn't register. Tell each other exactly what works.`,
  sameShadow: (s: string) => `You share the same main shadow (${s}). You'll understand it in each other — and may amplify it. Name it kindly when it shows.`,
  clash: "Chinese 'clash' pair: you may push each other's buttons in predictable ways — pause before reacting.",
  none: "No strong warning signs across your lenses. Keep the basics: kindness, honesty and repair after conflict.",
};
export const bondUi = {
  eyebrow: "Your bond story",
  title: (a: string, b: string) => `${a} & ${b}`,
  chapters: {
    meet: { title: "First Impressions", kicker: "How you meet and what you see in each other" },
    talk: { title: "How You Talk", kicker: "Minds, words and decisions" },
    heart: { title: "Hearts & Feelings", kicker: "Moons, attachment and emotional rhythm" },
    closeness: { title: "Closeness & Chemistry", kicker: "Desire, care and what draws you together" },
    conflict: { title: "When You Clash", kicker: "Your friction points and how to repair" },
    growth: { title: "How You Grow Each Other", kicker: "Your superpowers and growth edges" },
    path: { title: "The Long Road", kicker: "Where this bond tends to go over time" },
    flags: { title: "Watch-outs", kicker: "Honest warning signs — and what to do" },
    rituals: { title: "Rituals for Two", kicker: "Small habits that keep this bond alive" },
  } as Record<string, { title: string; kicker: string }>,
  sunsLine: (a: string, sa: string, b: string, sb: string) => `${a}'s Sun is in ${sa}; ${b}'s is in ${sb}.`,
  moonsLine: (a: string, sa: string, b: string, sb: string) => `${a}'s Moon is in ${sa}; ${b}'s is in ${sb}.`,
  mercLine: (a: string, sa: string, b: string, sb: string) => `${a} thinks with Mercury in ${sa}; ${b} with Mercury in ${sb}.`,
  venusMars: (a: string, va: string, b: string, mb: string) => `${a}'s Venus in ${va} meets ${b}'s Mars in ${mb}.`,
  aspectsTitle: "The strongest links between your charts",
  attachTitle: (a: string, sa: string, b: string, sb: string) => `${a} is ${sa}; ${b} is ${sb}.`,
  careTitle: "How you care for each other",
  careLine: (a: string, ra: string, ga: string) => `${a} feels most loved through ${ra} and naturally gives ${ga}.`,
  nineLine: (a: string, ta: string, b: string, tb: string) => `${a} is moved by the wish ${ta}; ${b} by the wish ${tb}.`,
  nineTip: "Knowing each other's deepest motivation turns many arguments into understanding: you are rarely fighting about the dishes, more often about what the dishes mean.",
  traitsTitle: "Your personalities side by side",
  superTitle: "Your superpowers together",
  edgeTitle: "Your growth edges",
  scores: (h: number, s: number) => `Across all your lenses, your Harmony is ${h} and your Spark is ${s}.`,
  needQuiz: "Take more quizzes (both of you) to deepen this chapter.",
  vedicLine: (n: number) => `Traditional Vedic matching gives you ${n} of 36 points.`,
  cardLine: (n: string, t: string) => `Your shared tarot card is ${n}: ${t}`,
};
