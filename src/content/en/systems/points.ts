import type { Sign } from "@/engine/zodiac";
type BySign<T> = Record<Sign, T>;

/** Chiron by sign: the sore spot, the gift that grows from tending it, one practice. Our own text. */
export const chiron: BySign<{ wound: string; gift: string; practice: string }> = {
  aries: { wound: "A quiet doubt about your right to take up space, to want things first, to simply be here without earning it.", gift: "You help other people find their nerve, because you know from the inside how much courage a small first step costs.", practice: "Once a day, do one thing first: speak first, choose first, ask first. Notice that nothing breaks." },
  taurus: { wound: "Worry about having enough, being enough, or being safe in your own body. Comfort can feel either out of reach or impossible to put down.", gift: "You teach steadiness. People relax around you because you know how to build safety slowly and for real.", practice: "Before a money or food decision, put a hand on your belly and take three slow breaths. Then decide." },
  gemini: { wound: "Feeling that your words or your mind are too much, too scattered or not clever enough, often from being corrected or not listened to.", gift: "You become the person who explains things kindly, and who makes others feel smart instead of small.", practice: "Write one honest sentence a day that nobody will grade. Keep it." },
  cancer: { wound: "An old ache around belonging and being looked after. You may have learned to care for others so you wouldn't have to ask for care.", gift: "You know how to make a home for people, a room, a meal, a voice that says: you can rest here.", practice: "Let one person look after you this week, in a small way, without paying it back the same day." },
  leo: { wound: "Fear that you will not be seen, or that being seen will bring shame. Shining can feel risky.", gift: "You notice the quiet ones and give them a stage. Your warmth makes other people brave.", practice: "Share one thing you made or did, before it feels finished, and let the response be whatever it is." },
  virgo: { wound: "A feeling that you are only acceptable when useful or flawless. Mistakes can feel like proof of something.", gift: "Precise, gentle help. You can fix what's broken without making anyone feel broken.", practice: "Leave one task at good enough on purpose. Write down what actually happened afterwards." },
  libra: { wound: "Losing yourself to keep the peace, or feeling that love is only safe when you agree.", gift: "You can hold two sides fairly, and you teach others that a kind 'no' can protect a relationship.", practice: "When asked what you want, answer within three seconds. You can still change your mind later." },
  scorpio: { wound: "Trust that was broken, or a sense that closeness leads to loss. You may guard your depths very carefully.", gift: "You can sit with people in their hardest moments without flinching. You know crisis is survivable.", practice: "Tell one safe person one true thing you usually keep hidden. Start small." },
  sagittarius: { wound: "Doubt about what to believe or where you're going, sometimes after a faith, teacher or plan let you down.", gift: "You help people find meaning that is their own, not borrowed. Honest hope, not slogans.", practice: "Write down three things you know from your own experience, not from anyone else." },
  capricorn: { wound: "Feeling you had to grow up early, carry too much, or prove you are worthy through achievement.", gift: "You become the kind of authority that protects people, firm and fair, with room for rest.", practice: "Put rest in your calendar like a meeting, and keep it like a promise." },
  aquarius: { wound: "Feeling like the odd one out, or that you have to choose between belonging and being yourself.", gift: "You build groups where different people fit. You make weirdness feel safe.", practice: "Find one place, online or real, where your odd interest is normal. Show up twice." },
  pisces: { wound: "Feeling everything at once with weak edges, so other people's moods flood in. Escape can seem like the only door.", gift: "Deep compassion with boundaries: you can be kind without drowning, and you show others how.", practice: "After a draining talk, wash your hands slowly and name three things you can see. That's your edge coming back." },
};

/** Lunar nodes keyed by the North Node sign. South Node is always the opposite sign. */
export const nodes: BySign<{ north: string; south: string; step: string }> = {
  aries: { north: "Growing toward independence: deciding for yourself and acting without waiting for permission.", south: "Familiar ground is pleasing others and keeping balance, sometimes at the cost of your own wishes.", step: "Make one choice this week without polling anyone." },
  taurus: { north: "Growing toward simple, steady values: your body, your pace, what is really yours.", south: "Familiar ground is intensity and crisis, merging with other people's needs and money.", step: "Pick one calm daily habit and keep it for nine days." },
  gemini: { north: "Growing toward curiosity and conversation: asking, listening, staying with many small truths.", south: "Familiar ground is being sure, having the big answer and moving on before the details.", step: "In your next disagreement, ask two questions before giving your view." },
  cancer: { north: "Growing toward softness and home: feelings, family (chosen or given) and being cared for.", south: "Familiar ground is control, status and holding everything together alone.", step: "Say 'I feel' instead of 'I think' once today, out loud." },
  leo: { north: "Growing toward joy and visible self-expression: creating, playing, being the one in the light.", south: "Familiar ground is blending into the group and keeping a cool distance.", step: "Make something just for fun and show it to one person." },
  virgo: { north: "Growing toward practical care: routines, health, useful work done well.", south: "Familiar ground is drifting, dreaming and escaping when life gets heavy.", step: "Choose one small daily task and finish it at the same time each day." },
  libra: { north: "Growing toward partnership: compromise, listening and letting others matter as much as you.", south: "Familiar ground is going it alone and acting fast on your own terms.", step: "Ask someone close to you what they need this week, and act on it." },
  scorpio: { north: "Growing toward depth: honest intimacy, shared resources and letting old things end.", south: "Familiar ground is comfort, holding on and keeping life safe and predictable.", step: "Let go of one object or habit you keep only out of habit." },
  sagittarius: { north: "Growing toward meaning: big questions, travel of body or mind, trusting your own compass.", south: "Familiar ground is gathering facts and opinions without ever choosing one.", step: "Name one belief you live by. Write why it's yours." },
  capricorn: { north: "Growing toward responsibility in the world: goals, structure and being someone others can lean on.", south: "Familiar ground is staying inside the family nest and its moods.", step: "Set one public goal with a date, and tell one person." },
  aquarius: { north: "Growing toward community and the future: friendships, causes, your own odd ideas.", south: "Familiar ground is needing applause and taking everything personally.", step: "Join or help one group effort where you are not the star." },
  pisces: { north: "Growing toward surrender and compassion: intuition, rest, art and trusting what you can't control.", south: "Familiar ground is worry, fixing and perfecting every detail.", step: "Spend twenty minutes a day with no plan and no phone." },
};

/** Black Moon Lilith by sign: what you may have learned to hide, and how to own it. */
export const lilith: BySign<{ text: string; reclaim: string }> = {
  aries: { text: "Your anger and your appetite to go first may have been called 'too much'.", reclaim: "Own your fire: say a clear 'no' and a clear 'I want', without apologising." },
  taurus: { text: "Pleasure, comfort and wanting nice things may carry a hint of guilt.", reclaim: "Enjoy your body and your senses on purpose. Rest counts." },
  gemini: { text: "Your sharp tongue, your questions or your many interests may have been hushed.", reclaim: "Speak the true sentence, kindly. Keep three hobbies if you want three." },
  cancer: { text: "Your needs and moods may have felt like a burden to others.", reclaim: "Needing care is human. Ask for it plainly." },
  leo: { text: "Wanting attention and admiration may have been treated as vanity.", reclaim: "Let yourself be seen. Wanting applause is allowed." },
  virgo: { text: "Your standards, or your messy imperfect side, may have been judged.", reclaim: "Keep your standards and drop the shame. Both can live together." },
  libra: { text: "Your wish to be loved and your talent for charm may have been called fake.", reclaim: "Beauty and harmony are real needs. Choose them for yourself, not only for others." },
  scorpio: { text: "Your intensity, sexuality and need for truth may scare people, including you.", reclaim: "Depth is not danger. Find people who can meet it." },
  sagittarius: { text: "Your wildness, bluntness and wish for freedom may have been tamed early.", reclaim: "Keep a bit of the map blank. Go somewhere new, alone, sometimes." },
  capricorn: { text: "Your ambition and wish for power may have been seen as cold.", reclaim: "Want success openly. Lead with fairness and keep your warmth." },
  aquarius: { text: "Your strangeness and refusal to fit in may have been punished.", reclaim: "Be the outlier on purpose, with friends who like you for it." },
  pisces: { text: "Your sensitivity, fantasies and spiritual side may have been dismissed as unreal.", reclaim: "Give your inner world a form: music, art, prayer, a notebook." },
};

/** Solar return themes: rising sign of the return chart, or (no time) the return Moon sign. */
export const solarYear: BySign<string> = {
  aries: "A year of new starts and bold moves. Begin before you feel ready.",
  taurus: "A year for building something steady: money, body, home comforts. Slow is fine.",
  gemini: "A year of learning, messages and short trips. Say yes to conversations.",
  cancer: "A year centred on home, family and feelings. Tend your nest.",
  leo: "A year to create and be seen. Let joy lead at least once a week.",
  virgo: "A year of routines, health and better systems. Small fixes add up.",
  libra: "A year about partnership and balance. Who you choose matters.",
  scorpio: "A year of depth and change. Something ends so something truer can grow.",
  sagittarius: "A year of wider horizons: travel, study, beliefs you test for real.",
  capricorn: "A year of work, goals and responsibility. Your effort shows.",
  aquarius: "A year of friends, groups and future plans. Find your people.",
  pisces: "A year of rest, imagination and letting go. Listen to your quieter side.",
};
