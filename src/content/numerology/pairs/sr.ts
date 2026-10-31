import type { PairSet } from ".";
import { pairSr1 } from "./sr-1";
import { pairSr2 } from "./sr-2";
import { pairSr3 } from "./sr-3";
import { pairSr4 } from "./sr-4";
import { pairSr5 } from "./sr-5";
import { pairSr6 } from "./sr-6";
import { pairSr7 } from "./sr-7";
import { pairSr8 } from "./sr-8";
import { pairSr9 } from "./sr-9";
import { pairSr10 } from "./sr-10";
import { pairSr11 } from "./sr-11";
import { pairSr12 } from "./sr-12";
import { pairSr13 } from "./sr-13";

/** All 78 Serbian life path pair pages. The text lives in the part files because of its size. */
export const pairSr: PairSet = {
  ...pairSr1, ...pairSr2, ...pairSr3, ...pairSr4, ...pairSr5, ...pairSr6, ...pairSr7,
  ...pairSr8, ...pairSr9, ...pairSr10, ...pairSr11, ...pairSr12, ...pairSr13,
};

/** Hub copy for /numerology/compatibility/. */
export const pairHubSr = {
  title: "Kompatibilnost po životnom putu: svaki par brojeva",
  crumb: "Kompatibilnost",
  sub: "Kako se dva životna puta slažu u ljubavi, prijateljstvu i na poslu. Izaberi svoj par među 78 kombinacija brojeva.",
  intro: [
    "Svaki par životnih puteva ima svoj ritam. Izaberi par koji odgovara tebi i osobi na koju misliš, ili u kalkulatoru izračunaj oba broja iz datuma rođenja.",
    "Ovde je i ono što se obično traži kao numerološka kompatibilnost ili slaganje brojeva u ljubavi. Brojevi nisu presuda, nego ogledalo za razgovor u dvoje.",
  ],
};
