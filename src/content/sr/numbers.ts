import type { MajorCard } from "@/engine/tarot";

export const numbers: Record<number, { name: string; essence: string; lifePath: string; expression: string; soul: string }> = {
  1: { name: "Pionir", essence: "nezavisnost, počeci, volja", lifePath: "Tvoj put je da vodiš sopstveni život: da započinješ stvari, veruješ svom sudu i naučiš da snaga podrazumeva i traženje pomoći.", expression: "Izražavaš se kroz inicijativu i originalnost.", soul: "Duboko u sebi čezneš za slobodom da biraš svoj put." },
  2: { name: "Mirotvorac", essence: "partnerstvo, osetljivost, ravnoteža", lifePath: "Tvoj put je povezivanje. Rasteš kroz saradnju, slušanje i tihu moć da ljudima pružiš osećaj sigurnosti.", expression: "Izražavaš se kroz takt, brigu i timski rad.", soul: "Duboko u sebi čezneš za pravim partnerom i mirnim domom." },
  3: { name: "Pripovedač", essence: "radost, izražavanje, stvaralaštvo", lifePath: "Tvoj put je izražavanje (kroz reči, umetnost, humor ili stil) i donošenje lakoće drugima, a da pritom ne kriješ svoju dubinu.", expression: "Izražavaš se kroz reči, kreativnost i šarm.", soul: "Duboko u sebi čezneš da stvaraš i da drugi uživaju u tebi onakvom kakav jesi." },
  4: { name: "Graditelj", essence: "red, trud, temelji", lifePath: "Tvoj put je da izgradiš nešto čvrsto i trajno i da naučiš da je i odmor deo konstrukcije.", expression: "Izražavaš se kroz pouzdanost i praktičnu veštinu.", soul: "Duboko u sebi čezneš za stabilnošću i poslom koji nešto znači." },
  5: { name: "Slobodni duh", essence: "promena, avantura, čula", lifePath: "Tvoj put je sloboda i iskustvo. Rasteš kroz istraživanje, prilagođavanje i pronalaženje obaveza koje te oslobađaju.", expression: "Izražavaš se kroz svestranost i avanturu.", soul: "Duboko u sebi čezneš za raznovrsnošću i prostorom da lutaš." },
  6: { name: "Negovatelj", essence: "ljubav, odgovornost, dom", lifePath: "Tvoj put je ljubav pretvorena u delo: briga o ljudima i lepoti, uz učenje da i ti zaslužuješ brigu.", expression: "Izražavaš se kroz brigu, lepotu i odgovornost.", soul: "Duboko u sebi čezneš za krugom punim ljubavi u kom je svima dobro." },
  7: { name: "Tragalac", essence: "mudrost, samoća, dubina", lifePath: "Tvoj put je razumevanje: učenje, intuicija i unutrašnja tišina donose ti odgovore, a poverenje ti donosi ljude.", expression: "Izražavaš se kroz analizu, dubinu i uvid.", soul: "Duboko u sebi čezneš za istinom i vremenom nasamo da je pronađeš." },
  8: { name: "Snaga", essence: "ambicija, majstorstvo, izobilje", lifePath: "Tvoj put je da dobro upravljaš moći i resursima: da izgradiš uspeh i da ga velikodušno koristiš.", expression: "Izražavaš se kroz vođstvo i rezultate.", soul: "Duboko u sebi čezneš za ostvarenjem, sigurnošću i poštovanjem." },
  9: { name: "Humanista", essence: "saosećanje, završetak, mudrost", lifePath: "Tvoj put je da služiš nečemu većem: da daješ, opraštaš i dostojanstveno puštaš.", expression: "Izražavaš se kroz saosećanje i širok pogled.", soul: "Duboko u sebi čezneš da svet učiniš dobrijim." },
  11: { name: "Intuitivac (master 11)", essence: "inspiracija, osetljivost, vizija", lifePath: "Master broj: put pojačane intuicije i inspiracije. Nosiš blagost broja 2 sa dodatnim nabojem, a posao je da naučiš da ga prizemljiš.", expression: "Izražavaš se kroz inspiraciju i uvid.", soul: "Duboko u sebi čezneš da u drugima probudiš nešto." },
  22: { name: "Master graditelj (master 22)", essence: "vizija pretvorena u stvarnost", lifePath: "Master broj: veliki snovi sa praktičnošću broja 4. Tvoj put je da gradiš ono što pomaže mnogim ljudima. Ciglu po ciglu.", expression: "Izražavaš se pretvarajući viziju u strukturu.", soul: "Duboko u sebi čezneš da ostaviš nešto trajno." },
  33: { name: "Master učitelj (master 33)", essence: "saosećajno služenje", lifePath: "Master broj: brižna ljubav broja 6, pojačana. Tvoj put je isceljivanje i učenje drugih primerom, uz granice.", expression: "Izražavaš se kroz posvećenu brigu i podučavanje.", soul: "Duboko u sebi čezneš da podigneš sve oko sebe." },
};

export const numberPairKinds: Record<string, string> = {
  mirror: "Isti broj: prepoznajete se jedno u drugom i lako upadate u zajednički ritam, ali treba vam neko ko će doneti drugačiji ugao.",
  family: "Ista porodica brojeva: osnovni pokretači vam vode u istom smeru, pa saradnja deluje prirodno.",
  friendly: "Tradicionalno prijateljski par: različiti ste, ali se dopunjujete. Svako donosi nešto u čemu drugo uživa.",
  contrast: "Suprotni brojevi: krećete se različitim brzinama i cenite različite stvari. Ovde ima mnogo toga za učenje, a strpljenje se isplati.",
};

export const families: Record<string, string> = { mind: "brojevi uma (1·5·7)", heart: "brojevi srca (3·6·9)", builder: "brojevi graditelja (2·4·8)" };

export const tarot: Record<MajorCard, { name: string; keyword: string; birth: string }> = {
  fool: { name: "Luda", keyword: "nov početak", birth: "Nosiš hrabrost početnika: poverenje, igru i skokove u nepoznato." },
  magician: { name: "Mag", keyword: "ostvarivanje stvari", birth: "Imaš dar da ideje pretvaraš u stvarnost pomoću fokusa i veštine." },
  "high-priestess": { name: "Prvosveštenica", keyword: "unutrašnje znanje", birth: "Znaš više nego što kažeš: vode te intuicija i tiha mudrost." },
  empress: { name: "Carica", keyword: "izobilje i briga", birth: "Neguješ, stvaraš i činiš život bogatim i gostoljubivim." },
  emperor: { name: "Car", keyword: "struktura i zaštita", birth: "Donosiš red, vođstvo i siguran okvir za druge." },
  hierophant: { name: "Prvosveštenik", keyword: "učenje i tradicija", birth: "Ceniš smisao, učenje i prenošenje onoga što je važno." },
  lovers: { name: "Ljubavnici", keyword: "izbor i sjedinjenje", birth: "Tvoj život oblikuju izbori iz srca i duboke veze." },
  chariot: { name: "Kočija", keyword: "snaga volje", birth: "Krećeš se napred tako što snažne, suprotne sile usmeravaš u jednom pravcu." },
  strength: { name: "Snaga", keyword: "blaga moć", birth: "Tvoja snaga je meka i postojana: hrabrost koja ukroti umesto da prisiljava." },
  hermit: { name: "Pustinjak", keyword: "unutrašnje svetlo", birth: "Istinu nalaziš u samoći, a kasnije drugima osvetljavaš put." },
  wheel: { name: "Točak sreće", keyword: "ciklusi", birth: "Imaš osećaj za pravi trenutak i promene. Rasteš tako što pratiš okrete." },
  justice: { name: "Pravda", keyword: "pravičnost", birth: "Živiš po pravičnosti i istini i preuzimaš odgovornost za izbore." },
  "hanged-one": { name: "Obešeni", keyword: "nova perspektiva", birth: "Vidiš ono što drugi propuste jer zastaneš i pogledaš iz drugog ugla." },
  death: { name: "Smrt", keyword: "preobražaj", birth: "Prirodno ti idu završeci koji prave mesta za novo rađanje (radi se o promeni, ne o gubitku)." },
  temperance: { name: "Umerenost", keyword: "ravnoteža", birth: "Strpljivo spajaš suprotnosti i lečiš pronalaženjem srednjeg puta." },
  devil: { name: "Đavo", keyword: "želja i senka", birth: "Razumeš vezanost i iskušenje, pa možeš da pomogneš drugima da se oslobode." },
  tower: { name: "Kula", keyword: "proboj", birth: "Raščišćavaš ono što je lažno da bi moglo da se izgradi nešto istinitije." },
  star: { name: "Zvezda", keyword: "nada", birth: "Nosiš nadu i obnovu. Ljudima je pored tebe lakše." },
  moon: { name: "Mesec", keyword: "snovi i intuicija", birth: "Kroz nejasno nalaziš put pomoću mašte i osetljivosti." },
  sun: { name: "Sunce", keyword: "radost", birth: "Zračiš toplinom, životnom snagom i dečjom radošću." },
  judgement: { name: "Sud", keyword: "buđenje", birth: "Pozvan si da se uzdigneš ka svrsi i da oprostiš prošlosti." },
  world: { name: "Svet", keyword: "celovitost", birth: "Tražiš dovršenje: spajanje cele slike u jedno." },
};
