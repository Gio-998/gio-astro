import type { MoonPhase } from "@/engine/daily";

export const moonPhases: Record<MoonPhase, { name: string; icon: string; text: string }> = {
  new: { name: "Mladi Mesec", icon: "🌑", text: "Prazna strana. Postavi jednu tihu nameru." },
  "waxing-crescent": { name: "Rastući srp", icon: "🌒", text: "Mali prvi koraci. Hrani ono što si započeo." },
  "first-quarter": { name: "Prva četvrt", icon: "🌓", text: "Trenutak izbora: probij se kroz malo otpora." },
  "waxing-gibbous": { name: "Rastući Mesec", icon: "🌔", text: "Doteraj i prilagodi. Skoro je gotovo." },
  full: { name: "Pun Mesec", icon: "🌕", text: "Stvari izlaze na videlo. Osećanja su jaka: budi blag." },
  "waning-gibbous": { name: "Opadajući Mesec", icon: "🌖", text: "Podeli ono što si naučio. Zahvalnost raste." },
  "last-quarter": { name: "Poslednja četvrt", icon: "🌗", text: "Pusti ono što ti više ne odgovara." },
  "waning-crescent": { name: "Opadajući srp", icon: "🌘", text: "Odmori se i razmisli pre sledećeg ciklusa." },
};

/** Bare verbs that take the accusative, so a planet name after them stays as it is (Venera is the one exception). */
export const transitTone: Record<string, string> = {
  conjunction: "susreće", sextile: "blago podržava", square: "izaziva", trine: "prati", opposition: "gleda u oči",
};
export const transitMood: Record<string, string> = {
  sun: "pažnja i vitalnost", moon: "tvoje raspoloženje za danas", mercury: "razgovori i razmišljanje", venus: "ljubav, zadovoljstvo i lepota",
  mars: "pokretačka snaga i nestrpljenje", jupiter: "rast i velikodušnost", saturn: "odgovornost i granice", uranus: "iznenađenja i sloboda",
  neptune: "snovi i osetljivost", pluto: "duboke promene i intenzitet",
};
export const transitAdvice: Record<string, string> = {
  conjunction: "Usmeri ovu energiju namerno: danas je jaka.",
  sextile: "Mali trud donosi laku pobedu.",
  square: "Trenje je signal za rast: zastani pre nego što reaguješ.",
  trine: "Stvari teku; iskoristi to za nešto što odlažeš.",
  opposition: "Traži ravnotežu: druga osoba može da ti bude ogledalo.",
};

export const personalDay: Record<number, string> = {
  1: "Dan za početak: reci da novom startu.", 2: "Dan za saradnju i blago slušanje.", 3: "Dan za izražavanje i igru.",
  4: "Dan za gradnju: uporan rad se isplati.", 5: "Dan za promenu: probaj nešto drugačije.", 6: "Dan za brigu: dom i dragi ljudi.",
  7: "Dan za razmišljanje: uzmi tiho vreme.", 8: "Dan za ambiciju: napravi smeo, praktičan potez.", 9: "Dan za završavanje i puštanje.",
};

export const prompts: string[] = [
  "Koji odnos mi je ove nedelje dao energiju i zašto?",
  "Šta mi sada treba, a to još ne tražim?",
  "Kada me je neko poslednji put stvarno razumeo? Šta je to omogućilo?",
  "Kakvu priču sebi pričam o nekome bliskom? Da li je to cela priča?",
  "Šta bi mi danas rekao moj najblaži prijatelj?",
  "Čega se držim, a mogu to polako da spustim?",
  "Pored koga se najviše osećam kao ja?",
  "Koje malo obećanje sebi mogu danas da ispunim?",
  "Gde u telu osećam stres i šta on traži?",
  "Šta me je nedavni sukob naučio o onome što cenim?",
  "Koja se moja senka nedavno pojavila i koji dar je krila?",
  "Kako bi danas za mene izgledalo „dovoljno“?",
  "Kome mogu ove nedelje naglas da kažem koliko ga cenim?",
  "Šta me sada zanima?",
  "Koja granica bi sačuvala moj mir?",
  "Kada prelazim na autopilot i šta bi umesto toga uradio moj um istraživača?",
  "Šta me je nedavno nasmejalo? Kako da toga bude više?",
  "Koji me odnos leči i kako da ga negujem?",
  "Šta se plašim da poželim?",
  "Kako bi izgledao moj dan da potpuno verujem sebi?",
  "Koji obrazac stalno ponavljam u odnosima? Čemu mi služi?",
  "Šta mi dom sada znači?",
  "Čije mišljenje o meni znači previše, a čije premalo?",
  "Šta me je naučio neko ko je veoma drugačiji od mene?",
  "Koji deo moje natalne karte (ili profila) mi danas deluje najtačnije?",
  "Šta je jedna stvar koju mogu da oprostim, sebi ili nekom drugom?",
  "Šta bi sutrašnji dan učinilo lakšim?",
  "Gde dajem više nego što primam, ili obrnuto?",
  "Šta moje unutrašnje dete želi da se igra?",
  "Za šta danas mogu da zahvalim svom telu?",
];
