import { pageMeta } from "@/lib/page-meta";
import { PageHero } from "@/components/ui";
export const generateMetadata = pageMeta("credits");

const IMAGES: [string, string, string][] = [
  ["Cosmic Cliffs, Carina Nebula (Webb NIRCam)", "carina_nebula", "NASA, ESA, CSA, STScI"],
  ["Chaos at the Heart of Orion", "PIA01322", "NASA/JPL-Caltech/STScI"],
  ["The Helix Nebula", "PIA15817", "NASA/JPL-Caltech"],
  ["Twin Jet Nebula (Hubble)", "GSFC_20171208_Archive_e000637", "NASA, ESA, J. Kastner (RIT)"],
  ["Pillars of Creation, infrared (Hubble)", "GSFC_20171208_Archive_e000842", "NASA, ESA, Hubble Heritage Team (STScI/AURA)"],
  ["Hubble Peers into the Storm", "GSFC_20171208_Archive_e000226", "NASA, ESA"],
  ["Mystic Mountain, infrared (Hubble)", "GSFC_20171208_Archive_e002058", "NASA, ESA, Hubble SM4 ERO Team"],
  ["Andromeda panorama (Hubble)", "GSFC_20171208_Archive_e000833", "NASA, ESA, J. Dalcanton, B.F. Williams, L.C. Johnson (UW), PHAT team, R. Gendler"],
];
const T = {
  en: { title: "Credits", images: "Space imagery", imagesNote: "From the NASA Image and Video Library. ESA/Hubble and ESA/Webb material is licensed CC BY 4.0. Images were resized and converted to WebP. No endorsement by NASA, ESA, CSA or STScI is implied.", id: "Source ID", art: "Original artwork", artText: "Zodiac illustrations, emblems, the zodiac wheel, moon art, the aura visual, logo and ornaments are original work made for Horoscop.", data: "Data and fonts", dataText: ["City data © GeoNames, licensed CC BY 4.0 (geonames.org).", "Fonts: Cormorant Garamond, Unbounded and Inter (SIL Open Font License).", "Personality items from the International Personality Item Pool (public domain)."] },
  mk: { title: "Заслуги", images: "Слики од вселената", imagesNote: "Од библиотеката на слики и видеа на NASA. Материјалите на ESA/Hubble и ESA/Webb се под лиценца CC BY 4.0. Сликите се намалени и претворени во WebP. Не се подразбира поддршка од NASA, ESA, CSA или STScI.", id: "Ознака на изворот", art: "Оригинални илустрации", artText: "Илустрациите на знаците, амблемите, зодијачкото тркало, сликите на Месечината, аурата, логото и украсите се оригинална работа направена за Horoscop.", data: "Податоци и фонтови", dataText: ["Податоци за градовите © GeoNames, под лиценца CC BY 4.0 (geonames.org).", "Фонтови: Cormorant Garamond, Unbounded и Inter (SIL Open Font License).", "Ставки за личност од International Personality Item Pool (јавна сопственост)."] },
};
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params; const t = lang === "mk" ? T.mk : T.en;
  return (
    <article className="prose-soft">
      <PageHero emblem="eye" img="milkyway" title={<>{t.title}</>} />
      <h2>{t.images}</h2>
      <p>{t.imagesNote}</p>
      <ul>{IMAGES.map(([name, id, credit]) => <li key={id}><b>{name}</b>: {credit} <span className="text-xs text-dim">({t.id}: {id})</span></li>)}</ul>
      <h2>{t.art}</h2>
      <p>{t.artText}</p>
      <h2>{t.data}</h2>
      <ul>{t.dataText.map((d) => <li key={d}>{d}</li>)}</ul>
    </article>
  );
}
