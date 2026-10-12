import type { MoonPhase } from "@/engine/daily";

export const moonPhases: Record<MoonPhase, { name: string; icon: string; text: string }> = {
  new: { name: "New Moon", icon: "🌑", text: "A blank page. Set one quiet intention." },
  "waxing-crescent": { name: "Waxing Crescent", icon: "🌒", text: "Small first steps. Feed what you started." },
  "first-quarter": { name: "First Quarter", icon: "🌓", text: "A moment of choice: push through a little resistance." },
  "waxing-gibbous": { name: "Waxing Gibbous", icon: "🌔", text: "Refine and adjust. Almost there." },
  full: { name: "Full Moon", icon: "🌕", text: "Things come to light. Feelings run high: be gentle." },
  "waning-gibbous": { name: "Waning Gibbous", icon: "🌖", text: "Share what you've learned. Gratitude grows." },
  "last-quarter": { name: "Last Quarter", icon: "🌗", text: "Release what no longer fits." },
  "waning-crescent": { name: "Waning Crescent", icon: "🌘", text: "Rest and reflect before the next cycle." },
};

export const transitTone: Record<string, string> = {
  conjunction: "is meeting", sextile: "is gently supporting", square: "is challenging", trine: "is flowing with", opposition: "is facing",
};
export const transitMood: Record<string, string> = {
  sun: "attention and vitality", moon: "your mood of the day", mercury: "conversations and thinking", venus: "love, pleasure and beauty",
  mars: "drive and impatience", jupiter: "growth and generosity", saturn: "responsibility and limits", uranus: "surprises and freedom",
  neptune: "dreams and sensitivity", pluto: "deep change and intensity",
};
export const transitAdvice: Record<string, string> = {
  conjunction: "Focus this energy on purpose: it's strong today.",
  sextile: "A small effort brings an easy win.",
  square: "Friction is a signal for growth: pause before reacting.",
  trine: "Things flow; use it to do something you've been putting off.",
  opposition: "Look for balance: another person may mirror you.",
};

export const personalDay: Record<number, string> = {
  1: "A day to begin: say yes to a fresh start.", 2: "A day for cooperation and gentle listening.", 3: "A day to express yourself and play.",
  4: "A day to build: steady work pays off.", 5: "A day for change: try something different.", 6: "A day for care: home and loved ones.",
  7: "A day for reflection: take quiet time.", 8: "A day for ambition: make a bold, practical move.", 9: "A day to finish and let go.",
};

export const prompts: string[] = [
  "Which relationship gave me energy this week, and why?",
  "What do I need right now that I haven't asked for?",
  "When did I last feel truly understood? What made it possible?",
  "What story am I telling myself about someone close to me? Is it the whole story?",
  "What would my kindest friend say to me today?",
  "What am I holding on to that I could gently put down?",
  "Who do I feel most like myself around?",
  "What small promise can I keep to myself today?",
  "Where in my body do I feel stress, and what is it asking for?",
  "What did a recent conflict teach me about what I value?",
  "Which of my shadows showed up lately, and what gift was it hiding?",
  "What would 'enough' look like for me today?",
  "Who could I appreciate out loud this week?",
  "What am I curious about right now?",
  "What boundary would protect my peace?",
  "When do I switch to autopilot, and what would my explorer mind do instead?",
  "What made me laugh recently? How can I have more of that?",
  "Which relationship heals me, and how can I tend it?",
  "What am I afraid to want?",
  "What would I do today if I trusted myself fully?",
  "What pattern do I keep repeating in relationships? What's its purpose?",
  "What does home mean to me right now?",
  "Whose opinion of me matters too much, and whose too little?",
  "What did I learn from someone very different from me?",
  "What part of my birth chart (or profile) feels truest today?",
  "What is one thing I can forgive, in myself or someone else?",
  "What would make tomorrow lighter?",
  "Where do I give more than I receive, or the other way round?",
  "What does my inner child want to play?",
  "What am I grateful for in my body today?",
];
