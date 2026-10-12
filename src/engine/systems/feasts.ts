import { translit } from "../translit";
import { addDays, mdIndex, orthodoxEaster, ymd } from "./util";
/**
 * Macedonian Orthodox and folk feast days, and name days by first name.
 * Source: the calendar of the Macedonian Orthodox Church (mpc.org.mk), which keeps the Julian calendar:
 * fixed feasts fall 13 days later on the civil (Gregorian) calendar in 1900-2099 (e.g. St George, 23 April
 * Julian = 6 May). Movable feasts follow Orthodox Easter (Julian computus, Meeus ch. 8).
 * Customs vary by village and family; we list the most widely kept date for each name.
 */
export type FeastId =
  | "ignatovden" | "anastasija" | "bozhik" | "stefanovden" | "vasilica" | "vodici" | "jovanovden" | "savindan" | "atanasovden"
  | "trifun" | "simeon" | "mladenci" | "blagovec" | "gjurgjovden" | "marko" | "kiril-metodij" | "konstantin-elena" | "enovden"
  | "petrovden" | "nedela" | "ognena-marija" | "ilinden" | "magdalena" | "ana" | "pantelejmon" | "golema-bogorodica" | "krstovden"
  | "vera-nadezhda" | "petkovden" | "luka" | "mitrovden" | "arangelovden" | "filip" | "matej" | "katerina" | "kliment" | "andrej"
  | "varvara" | "nikoljden" | "todorica" | "lazarica" | "cveti" | "velikden" | "spasovden";

interface Feast { id: FeastId; date?: [number, number]; easter?: number; names: string[]; aliases?: string[]; folk?: boolean }
export const FEASTS: Feast[] = [
  { id: "ignatovden", date: [1, 2], names: ["Игнат"], aliases: ["ignatius"] },
  { id: "anastasija", date: [1, 4], names: ["Анастасија", "Анастас"], aliases: ["anastasia", "anastasios"] },
  { id: "bozhik", date: [1, 7], names: ["Христо", "Христина", "Ристо", "Риста", "Божин", "Божана"], aliases: ["hristo", "christos", "christina", "kristina", "christian", "kristijan"], folk: true },
  { id: "stefanovden", date: [1, 9], names: ["Стефан", "Стефанија", "Стефче", "Стево", "Стевче"], aliases: ["stephen", "steven", "stefan", "stephan", "stephanie", "stefanie", "stefania", "stjepan", "stevan"] },
  { id: "vasilica", date: [1, 14], names: ["Васил", "Василие", "Василка", "Васка", "Васе"], aliases: ["basil", "vasilis", "vasilij", "vasily", "vasile"], folk: true },
  { id: "vodici", date: [1, 19], names: ["Јордан", "Јорданка"], aliases: ["jordan", "iordan"], folk: true },
  { id: "jovanovden", date: [1, 20], names: ["Јован", "Јована", "Јованка", "Јоце", "Иван", "Ивана", "Иванка", "Ване", "Ванчо", "Јане", "Јанко"], aliases: ["john", "johannes", "johann", "juan", "giovanni", "ioannis", "jovan", "ivan", "ivana", "jana", "jan", "joan", "joanna", "ivo"] },
  { id: "savindan", date: [1, 27], names: ["Сава", "Савка"], aliases: ["sava", "sabbas"] },
  { id: "atanasovden", date: [1, 31], names: ["Атанас", "Атанаска", "Наце", "Танас", "Тасе", "Наско"], aliases: ["athanasios", "athanasius", "thanasis", "atanas"] },
  { id: "trifun", date: [2, 14], names: ["Трифун"], aliases: ["tryphon", "trifon"], folk: true },
  { id: "simeon", date: [2, 16], names: ["Симеон", "Симона", "Симе"], aliases: ["simeon", "simon", "simona", "simone"] },
  { id: "mladenci", date: [3, 22], names: [], folk: true },
  { id: "blagovec", date: [4, 7], names: ["Благоја", "Благица", "Благе", "Блага", "Благој"], aliases: ["blagoja", "blagica", "blagoj"], folk: true },
  { id: "gjurgjovden", date: [5, 6], names: ["Ѓорѓи", "Ѓорѓе", "Ѓорѓија", "Ѓоко", "Ѓоре", "Гоце", "Ѓурѓа", "Ѓурѓица", "Георги", "Георгина", "Ѓорѓина"], aliases: ["george", "georgios", "georg", "jorge", "giorgio", "jurgen", "gjorgi", "gjorgji", "gjorgjija", "gorgi", "giorgi", "djordje", "dorde", "dzordze", "georgi", "georgina", "georgia", "goce", "gjoko", "gjore"], folk: true },
  { id: "marko", date: [5, 8], names: ["Марко"], aliases: ["mark", "marco", "marcus", "marko", "marc"] },
  { id: "kiril-metodij", date: [5, 24], names: ["Кирил", "Методија", "Методи"], aliases: ["cyril", "kiril", "kirill", "methodius", "metodi", "metodija"] },
  { id: "konstantin-elena", date: [6, 3], names: ["Константин", "Коста", "Коце", "Кочо", "Костадин", "Костадинка", "Елена", "Лена", "Ленче"], aliases: ["constantine", "konstantin", "kostas", "constantin", "helen", "helena", "elena", "jelena", "ellen", "lena", "eleni"] },
  { id: "enovden", date: [7, 7], names: [], folk: true },
  { id: "petrovden", date: [7, 12], names: ["Петар", "Петре", "Пеце", "Петра", "Петрана", "Павле", "Павлина", "Павел"], aliases: ["peter", "pierre", "pedro", "pietro", "petar", "petros", "pavel", "paul", "paolo", "pablo", "pavle", "paula", "pavlina", "petra"] },
  { id: "nedela", date: [7, 20], names: ["Недела", "Неделчо", "Неделко", "Неделка"], aliases: ["kyriaki"] },
  { id: "ognena-marija", date: [7, 30], names: ["Марина"], aliases: ["marina"] },
  { id: "ilinden", date: [8, 2], names: ["Илија", "Иле", "Илче", "Илинка", "Илина"], aliases: ["elijah", "elias", "ilias", "ilija", "ilya", "ilia"], folk: true },
  { id: "magdalena", date: [8, 4], names: ["Магдалена", "Магда"], aliases: ["magdalena", "madeleine", "magdalene", "magda"] },
  { id: "ana", date: [8, 7], names: ["Ана", "Анче", "Анка"], aliases: ["anna", "anne", "ann", "ana", "anka"] },
  { id: "pantelejmon", date: [8, 9], names: ["Пантелејмон", "Панче", "Пантеле"], aliases: ["panteleimon"] },
  { id: "golema-bogorodica", date: [8, 28], names: ["Марија", "Мара", "Маре", "Марика"], aliases: ["mary", "maria", "marija", "mariya", "marie", "mara", "maria"], folk: true },
  { id: "krstovden", date: [9, 27], names: ["Крсте", "Крсто", "Крстина"], folk: true },
  { id: "vera-nadezhda", date: [9, 30], names: ["Вера", "Верица", "Надежда", "Нада", "Љубица", "Софија"], aliases: ["vera", "nadezhda", "nada", "ljubica", "sophia", "sofia", "sophie", "sofija", "nadia"] },
  { id: "petkovden", date: [10, 27], names: ["Петка", "Параскева", "Петкана"], aliases: ["paraskevi", "paraskeva"] },
  { id: "luka", date: [10, 31], names: ["Лука"], aliases: ["luke", "luka", "luca", "lucas", "lukas"] },
  { id: "mitrovden", date: [11, 8], names: ["Димитар", "Димитрија", "Димитра", "Митре", "Мите", "Димче", "Димо", "Митко", "Дими"], aliases: ["demetrius", "dimitri", "dimitrios", "dmitry", "dimitar", "dimitrij", "dimitra", "demetra"], folk: true },
  { id: "arangelovden", date: [11, 21], names: ["Ангел", "Ангелина", "Ангелче", "Ангеле", "Михаил", "Михајло", "Михаела", "Гаврил", "Гаврило", "Рафаел"], aliases: ["michael", "mihail", "mikhail", "michel", "miguel", "michele", "michal", "michaela", "mihaela", "gabriel", "gabriela", "gavril", "raphael", "rafael", "angel", "angela", "angelina", "angelo"] },
  { id: "filip", date: [11, 27], names: ["Филип", "Филипа"], aliases: ["philip", "phillip", "filip", "felipe", "philippe", "filippo"] },
  { id: "matej", date: [11, 29], names: ["Матеј", "Матеа"], aliases: ["matthew", "matej", "matteo", "mateo", "mateja", "matea"] },
  { id: "katerina", date: [12, 7], names: ["Катерина", "Ката", "Катица", "Катарина"], aliases: ["catherine", "katherine", "katerina", "katarina", "kate", "katharina", "caterina", "ekaterina"] },
  { id: "kliment", date: [12, 8], names: ["Климент"], aliases: ["clement", "kliment", "klement", "clemens"] },
  { id: "andrej", date: [12, 13], names: ["Андреј", "Андреа", "Андријана", "Андон"], aliases: ["andrew", "andreas", "andrea", "andrei", "andrej", "andres", "andre", "andrija", "andriana"] },
  { id: "varvara", date: [12, 17], names: ["Варвара"], aliases: ["barbara", "varvara"] },
  { id: "nikoljden", date: [12, 19], names: ["Никола", "Николина", "Нико", "Ника", "Никче", "Кољо"], aliases: ["nicholas", "nikolaos", "nikolai", "nikolaj", "nicola", "nikola", "nicolas", "niko", "nick", "nikolina", "nicole", "nika", "klaus"], folk: true },
  // movable (days from Orthodox Easter)
  { id: "todorica", easter: -43, names: ["Тодор", "Тодорка", "Тоде", "Тоше", "Теодор", "Теодора"], aliases: ["theodore", "teodor", "todor", "theodora", "teodora", "fyodor", "feodor"], folk: true },
  { id: "lazarica", easter: -8, names: ["Лазар", "Лазо", "Лазарка"], aliases: ["lazarus", "lazar", "lazaros"], folk: true },
  { id: "cveti", easter: -7, names: ["Цвета", "Цветан", "Цветанка", "Цветко", "Цвете"], aliases: ["cvetan", "cvetanka", "cvetko", "tsvetan", "cveta"], folk: true },
  { id: "velikden", easter: 0, names: [], folk: true },
  { id: "spasovden", easter: 39, names: ["Спасе", "Спасо", "Спасена", "Спаска", "Спасија"], aliases: ["spase", "spaso", "spasena"], folk: true },
];

export const nameKey = (s: string) => translit(s.trim().split(/\s+/)[0] ?? "").toLowerCase().replace(/đ/g, "dj").replace(/ǵ/g, "gj").replace(/ḱ/g, "kj").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "");
const INDEX = new Map<string, FeastId>();
for (const f of FEASTS) { for (const n of f.names) INDEX.set(nameKey(n), f.id); for (const a of f.aliases ?? []) if (!INDEX.has(a)) INDEX.set(a, f.id); }

export function feastDate(id: FeastId, year: number): { m: number; d: number } {
  const f = FEASTS.find((x) => x.id === id)!;
  if (f.date) return { m: f.date[0], d: f.date[1] };
  const e = orthodoxEaster(year); const r = addDays(year, e.m, e.d, f.easter!); return { m: r.m, d: r.d };
}
export interface NameDay { feast: FeastId; matched: string; date: { m: number; d: number }; year: number; daysUntil: number }
/** Name day for the first word of a name (Cyrillic or Latin), for the given calendar year (date of the next occurrence). */
export function nameDay(name: string | undefined, today = new Date()): NameDay | null {
  if (!name) return null;
  const k = nameKey(name); const id = INDEX.get(k); if (!id) return null;
  const y = today.getFullYear();
  let date = feastDate(id, y), year = y;
  const t0 = Date.UTC(y, today.getMonth(), today.getDate());
  let t = Date.UTC(y, date.m - 1, date.d);
  if (t < t0) { year = y + 1; date = feastDate(id, year); t = Date.UTC(year, date.m - 1, date.d); }
  return { feast: id, matched: k, date, year, daysUntil: Math.round((t - t0) / 86400000) };
}
/** The folk feast closest to a birthday (same year), within 20 days either side. */
export function birthFeast(date: string): { feast: FeastId; offset: number } | null {
  const [y, m, d] = ymd(date); const k = mdIndex(m, d);
  let best: { feast: FeastId; offset: number } | null = null;
  for (const f of FEASTS) {
    if (!f.folk) continue;
    const fd = feastDate(f.id, y); let off = mdIndex(fd.m, fd.d) - k;
    if (off > 183) off -= 366; if (off < -183) off += 366;
    if (Math.abs(off) <= 20 && (!best || Math.abs(off) < Math.abs(best.offset))) best = { feast: f.id, offset: off };
  }
  return best;
}

/** Feast falling on a given civil date (for Your Day), if any. */
export function feastOn(on: Date): FeastId | null {
  const y = on.getFullYear(), m = on.getMonth() + 1, d = on.getDate();
  for (const f of FEASTS) { const fd = feastDate(f.id, y); if (fd.m === m && fd.d === d) return f.id; }
  return null;
}
