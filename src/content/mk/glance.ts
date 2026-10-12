import type { Glance } from "../en/glance";

export const glance: Glance = {
  levels: { vlow: "многу ниско", low: "ниско", mid: "балансирано", high: "високо", vhigh: "многу високо" },
  words: {
    O: { hi: "љубопитност", lo: "приземјеност" },
    C: { hi: "сигурност", lo: "спонтаност" },
    E: { hi: "дружељубивост", lo: "внатрешен мир" },
    A: { hi: "топлина", lo: "искреност" },
    N: { hi: "силни чувства", lo: "смиреност под притисок" },
  },
  short: { O: "Отвореност", C: "Сигурност", E: "Социјална енергија", A: "Топлина", N: "Чувствителност" },
  headline: (w: string[]) => {
    if (!w.length) return "Балансирано во сè: се прилагодуваш на просторот во кој си.";
    const s = w.length === 1 ? w[0] : `${w.slice(0, -1).join(", ")} и ${w[w.length - 1]}`;
    return s.charAt(0).toUpperCase() + s.slice(1) + ".";
  },
  shapeLabel: "Обликот на твојата личност",
  tapTrait: "Допри црта за да видиш што значи за тебе.",
  inLove: "Во врските:",
  showMore: "Прикажи детали", showLess: "Скриј детали",
  showNumbers: "Прикажи точни резултати", hideNumbers: "Скриј точни резултати",
  closeness: "блискост", distance: "простор", calm: "мир", worry: "грижа",
  attachMap: "Каде си: грижа за блискоста (горе) и потреба од простор (десно).",
  nineWing: (t: number, w: number) => `Тип ${t}, со допир од ${w}`,
  nineArrows: (g: number, s: number) => `Растеш кон ${g} · стресот те влече кон ${s}`,
  careHead: (a: string, b: string) => `Се чувствуваш сакан/а преку: ${a.toLowerCase()} и ${b.toLowerCase()}.`,
  careGives: (g: string) => `Љубовта ја покажуваш со: ${g.toLowerCase()}.`,
  shadowHead: (light: string, shadow: string) => `Твојата светлина: ${light.toLowerCase()}. Сенката со која треба да се спријателиш: ${shadow.toLowerCase()}.`,
  doshaMix: "Твојата мешавина",
  explorerHead: { low: "Повеќе си на автопилот", mid: "Се менуваш меѓу двата режима", high: "Повеќе си истражувач" },
  pairHead: (sp: string, gr: string) => `Најсилни сте заедно во: ${sp.toLowerCase()}. Растете во: ${gr.toLowerCase()}.`,
  pairDetails: "Силни страни и простор за раст", pairLenses: "Леќа по леќа",
};
