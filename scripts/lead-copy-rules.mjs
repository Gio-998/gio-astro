// Retired promises. The full result of a test now sits behind a name and email form, so no page may promise "no email",
// and the private beta is over, so no page may talk about a waitlist or an invitation to get in.
// Used by check:copy on every string in src and by check:site on the text visitors really get in the built pages.
// Staying allowed on purpose, and tested in tests/lead-copy.test.ts:
//   "No account needed" is true, an account is optional and the form is not one.
//   "Invite" alone: the friend invite is a feature, and horoscopes say "invite someone over".
//   A waiting list in a story: "the centre has a waitlist for volunteers", "six customers on his waitlist".
// JavaScript's \b only knows ASCII, so the Macedonian and Serbian patterns do not use it.
export const LEAD_RULES = [
  // English
  [/\bno[- ]e-?mail\b(?! address)/i, "promises no email"],
  [/\be-?mail[- ](?:wall|gate)\b/i, "promises no email wall"],
  [/\bwithout (?:an? |your |giving |leaving |entering )*e-?mail\b/i, "promises no email"],
  [/(?<!\b(?:a|his|her|their|its) )\bwait[- ]?list/i, "mentions a waitlist"],
  [/\binvit(?:e|ation)[- ]only\b|\bby invitation\b|\binvite code\b/i, "says access is by invite"],
  [/\b(?:send|sent) you an? invit|\b(?:request|get|receive|waiting for) an? invit(?:e|ation)\b/i, "says access is by invite"],
  [/\b(?:private|closed) beta\b|\bduring the beta\b|\bbeta (?:access|testers?|invite)\b|\bjoin the beta\b/i, "mentions the private beta"],
  // German
  [/\bkeine? E-?Mail(?:-Adresse)? (?:nötig|erforderlich|notwendig)|\bohne (?:deine |eine )?E-?Mail\b|\bE-?Mail-Pflicht\b/i, "promises no email"],
  [/(?<!\b(?:eine[rm]?|seine[rm]?|ihre[rm]?) )\bWarteliste/i, "mentions a waitlist"],
  [/\b(?:nur|bloß) (?:mit|auf|per) Einladung\b|\bEinladungscode\b|\bum dir eine Einladung zu schicken\b/i, "says access is by invite"],
  [/\b(?:private[nr]?|geschlossene[nr]?) Beta\b|\bwährend der Beta\b|\bBeta-(?:Zugang|Einladung)/i, "mentions the private beta"],
  // Macedonian
  [/без (?:барање (?:на )?)?(?:е-?пошта|е-?мејл|мејл|имејл|email)/iu, "promises no email"],
  [/лист\p{L}* на чекање(?! (?:за|од) )/iu, "mentions a waitlist"],
  [/само со покана|код за покана|(?:пратиме|испратиме) покана/iu, "says access is by invite"],
  [/(?:приватна|затворена)(?:та)? бета|додека трае бетата/iu, "mentions the private beta"],
  // Serbian
  [/bez (?:traženja )?(?:e-?pošte|e-?mejla|e-?maila|mejla|imejla)/iu, "promises no email"],
  [/list\p{L}* čekanja(?! (?:za|od) )/iu, "mentions a waitlist"],
  [/samo uz poziv|kod za poziv|posla\p{L}* pozivnicu/iu, "says access is by invite"],
  [/(?:privatn|zatvoren)\p{L}* bet\p{L}*|tokom bete/iu, "mentions the private beta"],
];

/** The first rule a text breaks, as [matched words, reason], or null. */
export function leadCopyProblem(text) {
  for (const [rx, msg] of LEAD_RULES) { const m = text.match(rx); if (m) return [m[0], msg]; }
  return null;
}
