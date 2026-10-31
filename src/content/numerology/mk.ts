import type { NumContent } from "./en";
import { chars } from "./mk-chars";
import { angel } from "./mk-angel";
import { years, karmic, explain as explain1 } from "./mk-more";
import { explain2 } from "./mk-p2";
import { days, p3, explain3 } from "./mk-p3";
import { angelSeo, lifeSeo, yearSeo } from "./mk-seo";
const explain = { ...explain1, ...explain2, ...explain3 };

const ui: NumContent["ui"] = {
  section: "Нумерологија",
  crumbHome: "Почетна",
  angelHub: "Ангелски броеви", lifePathHub: "Патека на животот", yearHub: "Лична година", calcHub: "Калкулатори", karmicHub: "Кармички долг", masterHub: "Мастер броеви",
  angelTitle: (n) => angelSeo[n].title,
  angelMeta: (n) => angelSeo[n].desc,
  lifePathTitle: (n) => lifeSeo[n].title,
  lifePathMeta: (n) => lifeSeo[n].desc,
  yearTitle: (n) => yearSeo[n].title,
  yearMeta: (n) => yearSeo[n].desc,
  number: "Број", digits: "Цифрите во бројот", digitsSum: (sum, root) => `Збирот е ${sum}, што се сведува на ${root}.`,
  sec: { mood: "Расположението на годината", scene: "Каде може да го видиш", meaning: "Што значи", love: "Во љубовта", work: "Работа и пари", act: "Што да направиш сега", why: "Зошто постојано се појавува", questions: "Прашања за размислување", faq: "Чести прашања", story: "Карактерот", gifts: "Дарови", money: "Пари", shadow: "Сенката", week: "Како изгледа во една недела", growth: "Раст", practices: "Вежби", strengths: "Силни страни", shadows: "Внимавај на", focus: "Фокус", caution: "Внимавај со", months: "Како тече годината", body: "Енергија и здравје", close: "До крајот на годината", related: "Поврзани броеви", explore: "Истражувај понатаму", also: "Уште ангелски броеви" },
  faq: {
    angelMean: (n) => `Што значи ${n} (${n} znacenje)?`, angelLove: (n) => `Што значи ${n} во љубовта?`, angelDo: (n) => `Што да направам кога го гледам ${n}?`, angelWhy: (n) => `Зошто постојано го гледам ${n}?`,
    lpMean: (n) => `Што значи патеката на животот ${n} (pateka na zivotot ${n})?`, lpLove: (n) => `Со кого е компатибилна патеката ${n}?`, lpWork: (n) => `Кои професии ѝ одговараат на патеката ${n}?`, lpCalc: (n) => `Како да знам дали мојата патека е ${n}?`,
    lpCalcA: "Собери ги сведените месец, ден и година од датумот на раѓање и сведи го збирот, со задржување на 11, 22 и 33. Бесплатниот калкулатор го покажува секој чекор.",
    yrMean: (n) => `Што е лична година ${n} (licna godina ${n})?`, yrCalc: "Како да ја најдам личната година?", yrCalcA: "Собери ги месецот и денот на раѓање со тековната година, па сведи го збирот на една цифра. Калкулаторот го прави тоа наместо тебе.",
  },
  calc: {
    birth: "Датум на раѓање", name: "Цело име", namePh: "на пр. Ана Петрова", year: "Година", go: "Пресметај", invalid: "Внеси важечки датум.", nameInvalid: "Внеси име со букви.",
    lifePath: "Твојата патека на животот", expression: "Број на изразот", soul: "Број на душата", personality: "Број на личноста", personalYear: (y) => `Твојата лична година во ${y}`,
    read: "Прочитај", steps: "Како се пресметува", tryLife: "Калкулатор за патеката", tryName: "Калкулатор за име", private: "Се пресметува на твојот уред, ништо не се зачувува.",
  },
  pickNumber: "Избери број", lifePathShort: (n) => `Патека ${n}`, yearShort: (n) => `Година ${n}`,
  prev: "Претходен", next: "Следен", allAngel: "Сите ангелски броеви", allLife: "Сите патеки", calcCta: "Најди го својот број", calcCtaSub: "Бесплатно, за десет секунди.",
  readFull: "Прочитај повеќе", see: "Отвори",
  homeEyebrow: "Нумерологија", homeTitle: "Што кажуваат твоите броеви", homeSub: "Ангелски броеви, патеката на животот и бесплатни калкулатори.",
  navTitle: "Нумерологија", navDesc: "Ангелски броеви, патека на животот, калкулатори",
  method: "Нумерологијата е традиција за размислување, а не наука. Читај ја како огледало.",
};

export const numerology: NumContent = { ui, chars, angel, years, karmic, explain, days, p3 };
