import type { PlayDim, PlayFlag, PlayGameId, Emotion, CareMove } from "@/engine/play";

type Lv = { low: string; mid: string; high: string };
export interface DimText { name: string; poles: [string, string]; word: { low: string; high: string }; text: Lv; up: string; down: string; said: string }

const dims: Record<PlayDim, DimText> = {
  risk: {
    name: "Risk appetite", poles: ["Careful", "Bold"], word: { low: "careful", high: "bold" },
    text: {
      low: "You took the stone path again and again. Steady wins over shiny for you: you'd rather collect small, sure stars than gamble on glass. People trust you with the plan because you think about where the floor is.",
      mid: "You mixed it up: some rope, some stone, a little glass when the moment felt right. You weigh the prize against the drop each time, which is a good habit. You don't need risk to feel alive, and you don't run from it either.",
      high: "You went for glass. Bigger stars, bigger drop, and you kept choosing it. You like the jolt of a real bet, and you learn by trying. Just check, now and then, whether the other people on the bridge signed up for the same ride.",
    },
    up: "Your answers make you sound more careful than you played: on the bridges you went bold.",
    down: "Your answers make you sound more adventurous than you played: on the bridges you chose the safe path.",
    said: "From your Big Five: openness and how planned you are.",
  },
  resilience: {
    name: "Bounce-back", poles: ["Shaken", "Elastic"], word: { low: "tender after a fall", high: "quick to bounce back" },
    text: {
      low: "A fall stayed with you. After the bridge broke you slowed down or switched to the safest path, which is a very human way to protect yourself. It helps to know this about you: give yourself a beat after a setback before you decide what it means.",
      mid: "A fall slowed you a little, then you carried on. You took a moment, adjusted, and got back on a bridge. That pause is useful: you learn from the crack without letting it make every choice for you.",
      high: "You fell and went straight back out, often onto the same bridge. Setbacks register, but they don't steer you. That's a strength under pressure. The one thing to watch: people around you may need longer than you do to recover.",
    },
    up: "Your answers suggest setbacks rattle you, yet after a fall you got straight back on the bridge.",
    down: "Your answers suggest you stay calm under pressure, yet a fall clearly slowed you down in the game.",
    said: "From your Big Five: emotional steadiness.",
  },
  read: {
    name: "Face reading", poles: ["Misses cues", "Reads faces"], word: { low: "focused on words", high: "a sharp face reader" },
    text: {
      low: "The flashes were hard to catch, especially the subtle ones. Plenty of people read words better than faces, and that's fine. In real life, a simple \"how are you, really?\" fills the gap a quick glance misses.",
      mid: "You caught the clear expressions and some of the subtle ones. You notice more than you might think, mostly when someone's feeling is strong. The quiet ones (a tight jaw, a half smile) are where your next layer of reading lives.",
      high: "You caught even the half-second micro-expressions. You see a feeling before it's said, which makes you good company in hard moments. Remember that a reading is still a guess: check it gently before you act on it.",
    },
    up: "", down: "", said: "",
  },
  empathy: {
    name: "Attunement", poles: ["Practical", "Attuned"], word: { low: "practical", high: "attuned" },
    text: {
      low: "When a friend was struggling you reached for solutions or a change of scene. That's care too: you want the pain to stop. Sometimes, though, people need to be heard before they're helped. Try naming what they feel first, then offering the fix.",
      mid: "You switched between listening and helping. Sometimes you named the feeling, sometimes you went for a fix. Your instinct is to help in whatever way works, and you can learn which one each person needs.",
      high: "You met people where they were: you named the feeling and stayed with it before trying to fix anything. That's what makes people feel safe with you. Keep a little space for yourself too, so you don't carry everyone's weather.",
    },
    up: "Your answers sound more tough-minded than you played: in the game you went straight for the feeling.",
    down: "Your answers sound warmer than you played: in the game you reached for fixes more than feelings.",
    said: "From your Big Five: agreeableness.",
  },
  trust: {
    name: "Trust", poles: ["Guarded", "Open-handed"], word: { low: "guarded", high: "open-handed" },
    text: {
      low: "You sent Moss small amounts, and you got even more careful after Moss kept the coins once. You protect what's yours until someone earns more. That keeps you safe; it can also keep good people at arm's length a bit longer than needed.",
      mid: "You gave Moss a fair chance and adjusted when things went wrong. Trust, for you, follows evidence: open enough to let people in, careful enough to notice a pattern. After the bad round you didn't slam the door.",
      high: "You sent generously from the start and kept doing it, even after Moss kept everything once. You lead with trust, and most people rise to meet it. Just make sure the ones who don't get a second look before they get a third chance.",
    },
    up: "Your answers sound more guarded than you played: you trusted Moss with a lot.",
    down: "Your answers sound more open than you played: with coins on the line, you held back.",
    said: "From your attachment answers (or agreeableness).",
  },
  fairness: {
    name: "Fairness", poles: ["Keeps more", "Splits even"], word: { low: "self-protective", high: "fair-minded" },
    text: {
      low: "When it was your turn to share, you kept more than half. Maybe it felt like a game (it was), maybe you read Moss as a stranger. Worth noticing whether you do the same in real deals, and whether it costs you goodwill.",
      mid: "You shared, though not always half. You care about fairness and about not being taken for a ride. Most people land here.",
      high: "When it was your turn, you split evenly or better, even when you could have kept it all. Fairness matters to you even when nobody's watching, which is exactly why people want you on their side.",
    },
    up: "In the game you shared more fairly than your answers suggest.",
    down: "Your answers sound more giving than you played: when the coins were yours, you kept the bigger share.",
    said: "From your Big Five: agreeableness.",
  },
  detail: {
    name: "Memory style", poles: ["Big picture", "Fine detail"], word: { low: "big-picture", high: "detail-sharp" },
    text: {
      low: "You held the overall shape better than the small facts. You see the pattern first: the gist of a room, the arc of a story. Pair up with someone who keeps the receipts, and you'll make a great team.",
      mid: "Shapes and details came back to you about equally. You can zoom out to see the pattern and zoom in when it matters, which makes you a flexible learner.",
      high: "Colours, positions, the little triangle in the corner: you kept them. Your memory loves specifics. That's gold for work that needs precision. Now and then, step back and ask what the whole picture is saying.",
    },
    up: "", down: "", said: "",
  },
  speed: {
    name: "Tempo", poles: ["Deliberate", "Quick"], word: { low: "deliberate", high: "quick" },
    text: {
      low: "You took your time before answering. Slow and deep is a real style: you check before you commit. In fast conversations, it's fine to say \"give me a second\" and take it.",
      mid: "You answered at a steady pace, quick when you were sure and slower when you weren't. That's a healthy balance between speed and care.",
      high: "You answered fast and mostly right. Your mind moves quickly from seeing to deciding. Others may need a moment longer, so leave a little room before you fill the silence.",
    },
    up: "", down: "", said: "",
  },
  lead: {
    name: "Lead", poles: ["Follows", "Takes the lead"], word: { low: "easy-going", high: "a natural lead" },
    text: {
      low: "You let the others speak first and rarely grabbed the decision. You're comfortable letting the group find its way, which makes you easy to be around. If you have a strong preference, it's worth saying it out loud sooner.",
      mid: "Sometimes you voted first, sometimes you waited. You lead when you care about the outcome and step back when you don't. That's a flexible way to be in a group.",
      high: "You voted before the others and stepped up when the group got stuck. People can count on you to get things moving. Leave room for the quieter ones to speak too; their ideas are often the ones you'd have liked.",
    },
    up: "Your answers sound more reserved than you played: in the group you spoke up first and took the decision.",
    down: "Your answers sound more outgoing than you played: in the group you let others decide.",
    said: "From your Big Five: extraversion.",
  },
  conform: {
    name: "Group pull", poles: ["Independent", "Goes with the group"], word: { low: "independent", high: "in tune with the group" },
    text: {
      low: "When the whole group picked the wrong line, you trusted your own eyes. You hold your view under social pressure. That's valuable, especially when the room is about to make a mistake.",
      mid: "Sometimes you went with your own eyes, sometimes with the group. That's honest: in the classic line studies, most people go along at least once. You can feel the pull, and you don't always give in to it.",
      high: "When everyone else picked a line, you often picked it too, even when your eyes said otherwise. You value harmony and you read the room. Try this: next time you disagree, say so once, kindly, and see what happens.",
    },
    up: "Your answers sound more independent than you played: you went along with the group's wrong answer.",
    down: "Your answers sound more rule-bound than you played: you stuck to your own eyes against the whole group.",
    said: "From your Big Five: openness and how planned you are.",
  },
};

const games: Record<PlayGameId, { name: string; tagline: string; intro: string; how: string[]; measures: string; secs: number }> = {
  bridge: {
    name: "The Bridge", tagline: "Cross the canyon. Pick your bridge. Some will break.", secs: 75,
    intro: "Eight crossings. Stone is safe and small. Rope is a little shaky. Glass pays the most and sometimes cracks. Collect as many stars as you like; there's no wrong way to play.",
    how: ["Tap a bridge to cross", "Falling is part of the game", "You can rest and end the game at any time after a fall"],
    measures: "How much risk you take, and how you behave right after a fall.",
  },
  faces: {
    name: "Feeling Room", tagline: "Catch a feeling in half a second.", secs: 90,
    intro: "A face flashes for a moment, like a real expression in conversation. Pick the feeling you saw. Then three friends need you, and you decide how to answer.",
    how: ["Watch the face, it disappears fast", "Pick what you saw", "Answer the friends as you really would"],
    measures: "How well you read faces, and how you meet someone who is struggling.",
  },
  trust: {
    name: "Split", tagline: "Share coins with Moss. Moss decides what comes back.", secs: 80,
    intro: "Whatever you send to Moss triples. Moss then sends some back. Sometimes the roles swap and you decide what to return. Real coins, made-up stakes.",
    how: ["Pick how many coins to send", "Watch what Moss does", "Your choice, every round"],
    measures: "How much you trust, how you react to being let down, and how fairly you share.",
  },
  memory: {
    name: "Flash", tagline: "See it for a second. Then tell us what it was.", secs: 70,
    intro: "Ten quick flashes. Some ask you to remember a shape, some ask about a tiny detail. Answer as fast as you can without guessing wildly.",
    how: ["Watch the flash", "Answer the question", "Speed counts a little, accuracy counts more"],
    measures: "Whether you remember the big pattern or the small detail, and how fast you process.",
  },
  lead: {
    name: "The Group", tagline: "Three friends, seven decisions. Do you lead or follow?", secs: 70,
    intro: "Ava, Teo and Lina are deciding things together with you. Vote whenever you like: before them, after them, or not until you've seen everyone.",
    how: ["Their votes appear one by one", "Tap your answer at any moment", "Some questions have a right answer"],
    measures: "When you speak up, and how much the group's choice pulls on yours.",
  },
};

const emotions: Record<Emotion, string> = { joy: "Joy", sadness: "Sadness", anger: "Anger", fear: "Fear", surprise: "Surprise", disgust: "Disgust", contempt: "Contempt", calm: "Calm" };

const scenes: { who: string; says: string; moves: Record<CareMove, string> }[] = [
  { who: "Sam", says: "I didn't get the job. I really thought I had it.", moves: { fix: "Let's polish your CV and apply to three more tonight.", name: "Oh no. That's crushing after getting your hopes up.", distract: "Forget it, let's go out and have fun!", leave: "These things happen. You'll find something.", stay: "I'm here. Want to talk about it?" } },
  { who: "Nora", says: "My mum is in hospital again.", moves: { stay: "I'm coming over. You don't have to talk.", fix: "Have you asked for a second opinion?", leave: "I'm sure she'll be fine, don't worry.", distract: "Want to watch something to take your mind off it?", name: "" } },
  { who: "Leo", says: "Everyone forgot my birthday.", moves: { distract: "Let's get cake right now, my treat!", leave: "Birthdays are overrated anyway.", name: "That really stings. Feeling forgotten hurts.", fix: "Post a reminder in the group chat.", stay: "" } },
];

export const play = {
  meta: { title: "Play Mirror", description: "Five quick mini-games that show how you actually play: risk, trust, faces, memory and leading. Behaviour, not self-report." },
  brand: "Play Mirror",
  hub: {
    eyebrow: "Play Mirror", titleA: "How you ", titleB: "actually play",
    sub: "Questionnaires show how you see yourself. These five mini-games watch what you do: your choices, your timing, what happens after a fall. About seven minutes in total.",
    honest: "A behavioural signal from a few minutes of play, not a diagnosis. Tired, distracted or just having fun? It all shows up, so play a game again whenever you like.",
    progress: (n: number) => `${n} of 5 played`,
    play: "Play", replay: "Play again", secs: (s: number) => `about ${Math.round(s / 10) * 10} s`,
    resultTitle: "How you actually play", resultEmpty: "Play your first game and your card starts to fill in.",
    playNext: "Play the next game", allDone: "All five played. This is your full card.",
    compare: "Compare with someone", compareText: "When someone else plays on your phone (or their own, on a shared profile), the Play lens shows up in your compatibility.",
    forOther: (n: string) => `Playing for ${n}`, needProfile: "Create your profile first, so your results have somewhere to live.", start: "Start",
    behaviours: "What we noticed", sayPlay: "What you say vs how you play", sayPlayIntro: "Your questionnaire answers next to what you did in the games.",
    sayPlayNone: "Take the Big Five test and this section shows where your self-image and your play agree or differ.", takeBigFive: "Take the Big Five",
    matches: (list: string) => `Your play matches what you say about: ${list}.`, saidLabel: "you say", playedLabel: "you play",
    gameTitle: "Games", detail: "Read more", flags: { erratic: "We saw a few very fast tap bursts. If you were stressed or rushing, the scores may be a bit noisy.", quit: "You chose to rest after a fall. That's a valid choice, and it shows up in Bounce-back.", rushed: "You answered very fast. If you were tapping through, play again for a truer read." } as Record<PlayFlag, string>,
    share: "Share card", backHub: "All games", levels: { low: "low", mid: "middle", high: "high" },
    headline: (w: string[]) => (w.length ? w.map((x, i) => (i === 0 ? x[0].toUpperCase() + x.slice(1) : x)).join(", ") : "Balanced across the board"),
    reduced: "Reduced motion is on, so the games use gentle fades instead of big movement.",
  },
  games, dims, emotions, scenes,
  ui: {
    begin: "Begin", next: "Next", done: "See my result", round: (i: number, n: number) => `${i} / ${n}`, stars: "stars", ready: "I'm ready",
    bridge: { names: ["Stone path", "Rope bridge", "Glass bridge"], hints: ["safe", "shaky", "may crack"], pick: "Pick a bridge", made: "Made it across!", broke: ["", "The rope snapped!", "Crack! The glass gave way."], gust: "A gust of wind knocked you off!", again: "You're back on the cliff. Pick your next bridge.", rest: "Rest here and end the game" },
    faces: { watch: "Watch the face", what: "What did you see?", scene: "Your friend writes:", how: "How do you answer?" },
    trust: { moss: "Moss", have: (n: number) => `You have ${n} coins`, send: "Send", sendQ: "How many do you send to Moss? It triples on the way.", got: (sent: number, back: number) => `You sent ${sent}. Moss got ${sent * 3} and sent back ${back}.`, kept: (sent: number) => `You sent ${sent}. Moss kept all ${sent * 3}.`, backQ: (pot: number) => `Moss sent you 4 coins. They tripled to ${pot}. How many do you send back?`, splitQ: (pot: number) => `You found ${pot} coins on the path. Moss is right there. How many do you share?`, thanks: "Moss smiles.", total: "Your coins", none: "Nothing to send? That's a choice too." },
    memory: { shape: "Remember the shape", details: "Remember the details", whichShape: "Which pattern did you see?", colourOf: (s: string) => `What colour was the ${s}?`, shapes: { circle: "circle", triangle: "triangle", square: "square", star: "star" }, colours: { gold: "Gold", rose: "Pink", aqua: "Aqua", violet: "Violet" } },
    lead: { friends: ["Ava", "Teo", "Lina"], taste: [{ q: "Movie night. What are we watching?", o: ["Comedy", "Thriller", "Documentary"] }, { q: "Weekend trip. Where to?", o: ["Mountains", "Seaside", "City"] }, { q: "Dinner tonight?", o: ["Pizza", "Sushi", "Tacos"] }], line: "Which line is the same length as the first one?", stuck: "Nobody can choose a café. Everyone looks at each other.", stuckOpts: ["Let someone else pick", "I'll decide"], volunteer: "Teo: fine, I'll pick.", you: "You", waiting: "…" },
  },
  result: { eyebrow: "Your result", nextGame: "Next game", hub: "See your full card", again: "Play again" },
  pair: {
    title: "How you both play", noteIntro: "From the mini-games:", none: "Play a few games each to see this.",
    notes: {
      bothTrust: "You both trust openly. That gives the bond a calm floor to stand on.",
      trustGap: "One of you hands out trust early, the other waits for proof. Name it, so it doesn't feel personal.",
      bothFair: "You both share fairly when it's your turn. Money and chores tend to feel even.",
      fairGap: "You split things differently. Agree early on what \"fair\" means for you two.",
      bothCare: "You both lead with feelings when someone's hurting. Hard days are softer together.",
      readGap: "One of you catches faces fast, the other needs words. Say it out loud more than feels necessary.",
      riskGap: "One of you plays bold, the other plays safe. Great for balance, tiring if nobody adjusts the pace.",
      bothBold: "You both go for glass. Expect adventure, and keep one safety net between you.",
      bothBounce: "You both bounce back fast after a fall. Arguments blow over quickly.",
      bothTender: "Setbacks stay with both of you. After a hard moment, give each other time before deciding anything.",
      twoLeaders: "You both grab the lead. Lively, and sometimes a tug of war. Take turns deciding.",
      leadFollow: "One of you steps up, the other is happy to follow. Decisions come easily.",
      tempoGap: "Different tempos: one answers fast, the other thinks first. Leave room for the slower one.",
      memoryMix: "One of you sees the big picture, the other keeps the details. A natural team.",
    } as Record<string, string>,
  },
  timing: {
    title: "How sure you were", certainty: "Certainty",
    instant: (n: number, total: number) => `${n} of ${total} answered instantly`,
    changed: (n: number) => (n === 1 ? "1 change of mind" : `${n} changes of mind`),
    instantLead: "You answered these straight away. Quick answers usually point to the clearest parts of you:",
    slowLead: "You paused longest here. Grey zones are normal, and often the most interesting part:",
    careless: "You went through this very fast. If you were tapping to reach the end, retake it later for a truer read.",
    note: "Measured on this device while you answered; stored only with your results.",
    levels: { low: "lots of grey zones", mid: "fairly sure", high: "very sure" },
  },
  share: { eyebrow: "Play Mirror", sub: "How I actually play", footer: "horoscop.si · play the games" },
  book: { title: "How you play", kicker: "What your choices showed in Play Mirror", lead: "Questionnaires show how you see yourself. The mini-games watched what you did. Here is what they noticed.", none: "Play a few Play Mirror games and this chapter fills in with what your behaviour shows.", gapTitle: "Say vs play" },
};
export type PlayContent = typeof play;
