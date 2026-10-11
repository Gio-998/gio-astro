/** Human dates everywhere: "12 October 1995" (en) / "12 октомври 1995" (mk). Month names come from content. */
export function formatDate(iso: string | null | undefined, months: string[], opts: { year?: boolean; weekday?: string[] } = {}): string {
  if (!iso) return "";
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return iso;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const wd = opts.weekday ? `${opts.weekday[new Date(Date.UTC(y, mo - 1, d)).getUTCDay()]}, ` : "";
  return `${wd}${d} ${months[mo - 1]}${opts.year === false ? "" : ` ${y}`}`;
}
export const daysInMonth = (y: number, m: number) => new Date(Date.UTC(y, m, 0)).getUTCDate();
export const isoOf = (y: number, m: number, d: number) => `${String(y).padStart(4, "0")}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
/** Local calendar date of a JS Date as ISO yyyy-mm-dd. */
export const localIso = (d: Date) => isoOf(d.getFullYear(), d.getMonth() + 1, d.getDate());
