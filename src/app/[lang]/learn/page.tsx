import { PageHero } from "@/components/ui";
export const metadata = { title: "How it works — methods, sources and honesty", description: "How we calculate birth charts, Vedic matching, Chinese zodiac, numerology and personality scores — and what the science does and doesn't say." };
export default function Page() {
  return (
    <article className="prose-soft">
      <PageHero emblem="chart" img="orion" title={<>How it works</>} />
      <p><b>Our philosophy:</b> the stars set the scene, psychology explains the pattern, and how you treat each other writes the story. Everything here is a mirror for reflection — never a prophecy or a verdict.</p>
      <h2>What the evidence says</h2>
      <p>Controlled studies have found no predictive power for astrology on personality or on who marries whom (e.g. Carlson, <i>Nature</i> 1985; Voas's analysis of ~10 million UK marriages, 2007/2008). Numerology, tarot and similar systems have no empirical support either. We include them because they are rich, ancient languages for reflection — and we label them ✨ Traditional & symbolic.</p>
      <p>The Big Five personality traits are well researched. In couples, each partner's own emotional steadiness, warmth and reliability predict satisfaction; matching each other matters very little (Malouff et al., 2010; Dyrenforth et al., 2010). The strongest predictors of relationship quality are how partners feel about <i>this</i> relationship — appreciation, commitment, trust, repair, fun (Joel et al., 2020, PNAS). That's why we built the Bond Check. These lenses carry the 🔬 badge. 🧭 Popular-psychology lenses (temperaments, four-letter style, nine motivations, care styles, Shadow & Light) offer useful language with limited evidence.</p>
      <h2>Calculations</h2>
      <ul>
        <li><b>Planets:</b> the open-source astronomy-engine library (MIT licence, about 1 arc-minute accuracy), computed on your device. Tropical zodiac, geocentric apparent positions, mean lunar node. Ascendant and Midheaven from sidereal time and your birthplace. Whole-sign houses.</li>
        <li><b>Time zones:</b> historical offsets and daylight saving from the IANA time-zone database. Before 1900 we use local mean time from your birthplace's longitude. You can override the offset.</li>
        <li><b>Birthplaces:</b> GeoNames cities with population over 15,000 (CC BY 4.0).</li>
        <li><b>Unknown birth time:</b> we use noon, drop the rising sign, and show both Moon signs if the Moon changed sign that day.</li>
        <li><b>Vedic:</b> Lahiri ayanamsa (linear approximation), 27 nakshatras, and the traditional 36-point Guna Milan (Ashtakoota). Directional kootas (Varna, Vashya) are averaged in both directions so it works for any couple; Yoni and Vashya use a simplified table. Doshas are shown with traditional cancellations, never as warnings.</li>
        <li><b>Chinese zodiac:</b> the open-source lunar-javascript calendar (MIT). Your animal changes at <b>Lunar New Year</b> (the folk convention). We also show the Li Chun (start of spring) animal used in four-pillars astrology when it differs. Day Master and five-element balance come from the four pillars.</li>
        <li><b>Numerology:</b> Pythagorean letter values; Life Path reduces month, day and year separately and keeps master numbers 11, 22 and 33. Accents are removed (ł→l, ö→o).</li>
        <li><b>Tarot birth cards:</b> month + day + year, reduced to 22 or below (a method popularised by Mary K. Greer).</li>
        <li><b>Big Five:</b> the 20-item Mini-IPIP (Donnellan et al., 2006) from the public-domain International Personality Item Pool. Percentiles use approximate published averages. Four temperaments come from Extraversion × emotional sensitivity (Eysenck); the four-letter style from Big Five correlations (McCrae & Costa, 1989). It is not an official type test, and we are not affiliated with any type-test publisher.</li>
        <li><b>Own questionnaires:</b> attachment (anxiety and avoidance dimensions), nine motivations, care styles, Shadow & Light, body & energy type (Ayurveda-inspired), and Autopilot vs Explorer + social stance (inspired by Dr Jacques Fradin's neurocognitive and behavioural approach — not an official assessment).</li>
      </ul>
      <h2>How compatibility scores work</h2>
      <p>Every lens gives two numbers: <b>Harmony</b> (ease and flow) and <b>Spark</b> (energy, challenge, growth). Friction counts toward Spark, not against you. We ran each lens on tens of thousands of random pairs and convert your raw score into a percentile among those pairs, then display it as 45 + 55 × percentile — so the scale runs from 45 to 100 and a typical pair scores about 72. Every pairing has something to offer, so the scale starts at 45.</p>
      <p>Lenses are blended into <b>Resonance</b> with weights that depend on the relationship type (romantic, friend, family, colleague) and on confidence (for example, a missing birth time lowers the weight of astrology). The <b>research-backed-only</b> toggle shows a score from the Big Five and attachment lenses alone. There is no “incompatible” band: Kindred Flow, Natural Allies, Complementary Path, Catalyst Bond and Deep Teacher Bond. Every growth edge comes with practices.</p>
      <h2>Protecting you</h2>
      <p>We use what's known about shadows and unhealthy patterns to help you <i>notice</i> them — never to label another person, and never against you (no fear-based upsells, no fake urgency). If you feel unsafe in a relationship, please contact local emergency services or a domestic-abuse helpline.</p>
    </article>
  );
}
