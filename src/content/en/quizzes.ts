export const scale5 = ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"];
export const scaleTrue = ["Not like me", "A little", "Somewhat", "Mostly", "Very much like me"];

/** Mini-IPIP (public domain, ipip.ori.org). Wording adapted to first person. */
export const bigFive: Record<string, string> = {
  e1: "I am the life of the party.", a1: "I sympathize with others' feelings.", c1: "I get chores done right away.", n1: "I have frequent mood swings.", o1: "I have a vivid imagination.",
  e2: "I don't talk a lot.", a2: "I am not interested in other people's problems.", c2: "I often forget to put things back in their proper place.", n2: "I am relaxed most of the time.", o2: "I am not interested in abstract ideas.",
  e3: "I talk to a lot of different people at parties.", a3: "I feel others' emotions.", c3: "I like order.", n3: "I get upset easily.", o3: "I have difficulty understanding abstract ideas.",
  e4: "I keep in the background.", a4: "I am not really interested in others.", c4: "I make a mess of things.", n4: "I seldom feel blue.", o4: "I do not have a good imagination.",
};

export const attachment: Record<string, string> = {
  ax1: "I worry that people close to me don't care about me as much as I care about them.",
  av1: "I prefer not to show others how I feel deep down.",
  ax2: "I need a lot of reassurance that I matter to the people I love.",
  av2: "I find it easy to lean on people I'm close to.",
  ax3: "When someone close to me goes quiet, I fear I've done something wrong.",
  av3: "I get uncomfortable when someone wants to be very close.",
  ax4: "I rarely worry about being left or replaced.",
  av4: "I usually talk things over with the people I'm close to.",
  ax5: "I sometimes push for closeness more than the other person wants.",
};

export const nine: Record<string, string> = {
  t1: "I hold myself to high standards and notice what should be improved.", t1b: "It bothers me when things are done carelessly or unfairly.",
  t2: "I feel most myself when I'm helping someone I care about.", t2b: "I often sense what others need before they ask.",
  t3: "I'm driven to achieve and like being recognised for doing well.", t3b: "I quickly adapt to whatever a situation needs to succeed.",
  t4: "I feel things more deeply than most people around me.", t4b: "Being authentic and unique matters a lot to me.",
  t5: "I need time alone to think things through before I engage.", t5b: "I like understanding how things work, in depth.",
  t6: "I'm loyal and like knowing who and what I can rely on.", t6b: "I tend to anticipate what could go wrong and prepare for it.",
  t7: "I love new experiences, plans and possibilities.", t7b: "I'd rather keep things positive than dwell on pain.",
  t8: "I take charge and protect the people I care about.", t8b: "I say things directly and don't like being controlled.",
  t9: "Keeping the peace, inside me and around me, matters most.", t9b: "I easily see everyone's point of view and go with the flow.",
};
export const nineOrder = ["t1", "t5", "t9", "t2", "t6", "t3", "t7", "t4", "t8", "t1b", "t5b", "t9b", "t2b", "t6b", "t3b", "t7b", "t4b", "t8b"];

/** One scene per style pair. Keys are "a-b" in CARE order; [option for a, option for b]. */
export const careScenes: Record<string, { q: string; a: string; b: string }> = {
  "words-time": { q: "It's your birthday. Which part stays with you?", a: "A card where they wrote what they love about you", b: "A whole day together, just the two of you" },
  "words-gifts": { q: "You just finished a hard week. What lands best?", a: "A voice note saying they're proud of you", b: "Your favorite snack waiting on your desk" },
  "words-help": { q: "Exam or deadline tomorrow. What helps more?", a: "A text: 'You've got this, I believe in you'", b: "They cook dinner so you can keep working" },
  "words-touch": { q: "You had a rough talk with your boss. Back home you want…", a: "To hear 'you handled that so well'", b: "A long hug before anyone says a word" },
  "time-gifts": { q: "A lazy Sunday. Which would make it?", a: "Breakfast together, no rush, no screens", b: "A book they picked because it made them think of you" },
  "time-help": { q: "Moving day. Which one feels like love?", a: "They stay late just to sit with you among the boxes", b: "They show up with tape and assemble the bed" },
  "time-touch": { q: "Movie night. The best part is…", a: "That they cleared the whole evening for you", b: "Being curled up together under one blanket" },
  "gifts-help": { q: "You're sick in bed. What feels more caring?", a: "They bring you tea and a little comfort package", b: "They walk your dog and do the dishes" },
  "gifts-touch": { q: "They come back from a trip. Which greeting wins?", a: "A tiny souvenir picked just for you", b: "Running into their arms at the door" },
  "help-touch": { q: "A stressful morning before work. What saves it?", a: "They iron your shirt and make your coffee", b: "A quiet hand on your back as you rush around" },
};
export const careGive: string = "And how do YOU most naturally show care?";

export const shadow: Record<string, string> = {
  "pride-s": "I find it hard to admit when I'm wrong.", "pride-l": "I enjoy giving others the credit they deserve.",
  "greed-s": "I often feel I need more (money, things, status) before I can relax.", "greed-l": "I like sharing what I have, even when it costs me something.",
  "desire-s": "When I want something intensely, I struggle to wait for it.", "desire-l": "I can feel strong desire without letting it run my choices.",
  "envy-s": "Other people's success can sting, even when I'm happy for them.", "envy-l": "Seeing someone do well inspires me to grow.",
  "excess-s": "I tend to overdo pleasant things: food, scrolling, shopping, drinks.", "excess-l": "I know when I've had enough, and I stop.",
  "anger-s": "When I feel wronged, anger rises fast and strong.", "anger-l": "I can stay calm and listen even when I'm frustrated.",
  "inertia-s": "I put off things that matter until the last moment.", "inertia-l": "Once I commit to something, I follow through.",
};

export const dosha: Record<string, { q: string; options: [string, string, string] }> = {
  frame: { q: "My body frame is naturally…", options: ["light and slender", "medium and athletic", "solid and broad"] },
  skin: { q: "My skin tends to be…", options: ["dry and cool", "warm, sensitive, flushes easily", "smooth, soft, a bit oily"] },
  appetite: { q: "My appetite is…", options: ["irregular, I forget to eat", "strong, I get irritable when hungry", "steady, I can skip a meal easily"] },
  digestion: { q: "After eating, I usually feel…", options: ["variable, sometimes bloated", "fine fast, sometimes heartburn", "heavy and slow after big meals"] },
  sleep: { q: "My sleep is…", options: ["light, easily interrupted", "moderate and sound", "deep and long, hard to wake"] },
  climate: { q: "The weather I like least is…", options: ["cold and windy", "hot and humid", "damp and grey"] },
  pace: { q: "I usually work…", options: ["quickly, many things at once", "focused and purposeful", "slowly, steadily, methodically"] },
  speech: { q: "My way of speaking is…", options: ["fast, jumping between topics", "sharp, precise, persuasive", "calm, slow and warm"] },
  stress: { q: "Under stress I become…", options: ["anxious and worried", "irritated or angry", "withdrawn or stubborn"] },
  memory: { q: "When I learn something…", options: ["I learn fast and forget fast", "I remember it clearly", "I learn slowly but never forget"] },
  energy: { q: "My energy comes…", options: ["in bursts, then I crash", "strong and driven all day", "steady with great endurance, slow to start"] },
  "weather-mood": { q: "My mood is most like…", options: ["changeable wind", "a bright summer day", "a still lake"] },
};

export const explorer: Record<string, { q: string; left: string; right: string }> = {
  routine: { q: "When something new comes up, I…", left: "stick with what I know works", right: "get curious and try a new approach" },
  persistence: { q: "When a plan isn't working, I…", left: "push harder on the same plan", right: "step back and change course" },
  simplify: { q: "With complex problems, I…", left: "look for the simple answer", right: "enjoy exploring the nuances" },
  certainty: { q: "My opinions are…", left: "usually firm and clear", right: "always open to other angles" },
  evidence: { q: "I decide mostly from…", left: "what has worked before", right: "reasoning it through fresh" },
  image: { q: "I care most about…", left: "what others will think", right: "what I really think, even if it's unpopular" },
};
export const stance: Record<string, string> = {
  conf1: "In a group, I naturally take the lead.",
  conf2: "I often hold back my opinion so I don't disturb others.",
  trust1: "I feel I belong in most groups I'm part of.",
  trust2: "I prefer to stay outside groups and do my own thing.",
};

export const bond: Record<string, string> = {
  appreciation: "I feel appreciated by {name}.",
  trust: "I trust {name} to have my back.",
  commitment: "I feel {name} is committed to our bond.",
  repair: "When we disagree, we find our way back to each other.",
  fun: "We laugh and have fun together.",
  understood: "I feel understood by {name}.",
  safety: "I can tell {name} what I need without fear.",
  growth: "We help each other grow and try new things.",
};
export const bondDims: Record<string, { name: string; strength: string; growth: string; practice: string }> = {
  appreciation: { name: "Appreciation", strength: "You both feel valued: a powerful predictor of lasting bonds.", growth: "Appreciation may be getting lost in daily life.", practice: "Each evening this week, share one specific thing you appreciated." },
  trust: { name: "Trust", strength: "You feel safe relying on each other.", growth: "Trust may need tending.", practice: "Make one small promise and keep it visibly." },
  commitment: { name: "Commitment", strength: "You both feel the other is in it for real.", growth: "One or both of you may feel unsure where this is heading.", practice: "Talk about what you'd like this bond to look like in a year." },
  repair: { name: "Repair after conflict", strength: "You know how to come back together after friction.", growth: "Arguments may linger without repair.", practice: "Agree on a repair phrase, like 'can we start over?'" },
  fun: { name: "Fun & play", strength: "You genuinely enjoy each other.", growth: "Play may have slipped down the list.", practice: "Do something new and silly together within 7 days." },
  understood: { name: "Feeling understood", strength: "You feel seen by each other.", growth: "Feeling understood could be stronger.", practice: "Try 'what I hear you saying is…' in your next talk." },
  safety: { name: "Safety to speak", strength: "You can voice needs without fear.", growth: "Speaking up may feel risky right now.", practice: "Set a weekly 15-minute check-in where both can say anything kindly." },
  growth: { name: "Growing together", strength: "You bring out the best in each other.", growth: "You may want more shared growth.", practice: "Pick one thing to learn or try together this month." },
};

export const meta: Record<"big-five" | "attachment" | "nine" | "care" | "shadow" | "dosha" | "explorer", { title: string; tagline: string; intro: string; unlocks: string; note?: string }> = {
  "big-five": { title: "Big Five personality", tagline: "The most researched personality model: 20 quick statements.", intro: "Rate how well each statement describes you as you generally are now, not as you wish to be.", unlocks: "Big Five · four temperaments · four-letter style · yin-yang refinement", note: "Items: Mini-IPIP (Donnellan et al., 2006) from the public-domain International Personality Item Pool (ipip.ori.org)." },
  "attachment": { title: "Attachment style", tagline: "How you handle closeness and distance: 9 statements.", intro: "Think about your close relationships in general (partners, close friends or family).", unlocks: "Attachment lens · pursue-withdraw insight", note: "Our own items measuring the two well-studied dimensions (anxiety and avoidance). A short reflection tool, not a clinical test." },
  "nine": { title: "Nine motivations", tagline: "What drives you underneath it all: 18 statements.", intro: "How much is each statement like you?", unlocks: "Nine-motivation style · wing · growth & stress directions" },
  "care": { title: "Care styles", tagline: "How you like to receive and give care: 11 quick picks.", intro: "Pick the one that would mean more to you. No wrong answers.", unlocks: "Care styles · translation map in compatibility" },
  "shadow": { title: "Shadow & Light", tagline: "Seven classic shadows and their hidden gifts: 14 statements.", intro: "Be honest. This is private and for growth. Every shadow carries a gift.", unlocks: "Shadow & Light profile · shadow dance in compatibility", note: "Our own items, inspired by research on envy, greed, anger and self-control. Reflection only, never a moral verdict." },
  "dosha": { title: "Body & energy type", tagline: "Ayurveda-inspired constitution: 12 quick picks.", intro: "Choose what has been most true for you over most of your life. You can skip this one: it's optional.", unlocks: "Body & energy type · balancing rituals" },
  "explorer": { title: "Autopilot vs Explorer", tagline: "Your mind's two modes + your social stance: 10 items.", intro: "Slide toward the side that's more like you.", unlocks: "Autopilot/Explorer mind · social stance map" },
};
