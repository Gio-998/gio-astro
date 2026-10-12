import { pageMeta } from "@/lib/page-meta";
import { PageHero } from "@/components/ui";
export const generateMetadata = pageMeta("learn");
function PageEn() {
  return (
    <article className="prose-soft">
      <PageHero emblem="chart" img="orion" title={<>How it works</>} />
      <p className="text-sm text-dim">Horoscop is for self-reflection and fun. It is not psychological, medical or financial advice.</p>
      <p><b>Our philosophy:</b> the stars set the scene, psychology explains the pattern, and how you treat each other writes the story. Everything here is a mirror for reflection, never a prophecy or a verdict.</p>
      <h2>What the evidence says</h2>
      <p>Controlled studies have found no predictive power for astrology on personality or on who marries whom (e.g. Carlson, <i>Nature</i> 1985; Voas's analysis of ~10 million UK marriages, 2007/2008). Numerology, tarot and similar systems have no empirical support either. We include them because they are rich, ancient languages for reflection, and we label them ✨ Traditional & symbolic.</p>
      <p>The Big Five personality traits are well researched. In couples, each partner's own emotional steadiness, warmth and reliability predict satisfaction; matching each other matters very little (Malouff et al., 2010; Dyrenforth et al., 2010). The strongest predictors of relationship quality are how partners feel about <i>this</i> relationship: appreciation, commitment, trust, repair, fun (Joel et al., 2020, PNAS). That's why we built the Bond Check. These lenses carry the 🔬 badge. 🧭 Popular-psychology lenses (temperaments, four-letter style, nine motivations, care styles, Shadow & Light) offer useful language with limited evidence.</p>
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
        <li><b>Own questionnaires:</b> attachment (anxiety and avoidance dimensions), nine motivations, care styles, Shadow & Light, body & energy type (Ayurveda-inspired), and Autopilot vs Explorer + social stance (inspired by Dr Jacques Fradin's neurocognitive and behavioural approach, not an official assessment).</li>
      </ul>
      <h2>How compatibility scores work</h2>
      <p>Every lens gives two numbers: <b>Harmony</b> (ease and flow) and <b>Spark</b> (energy, challenge, growth). Friction counts toward Spark, not against you. We ran each lens on tens of thousands of random pairs and convert your raw score into a percentile among those pairs, then display it as 45 + 55 × percentile, so the scale runs from 45 to 100 and a typical pair scores about 72. Every pairing has something to offer, so the scale starts at 45.</p>
      <p>Lenses are blended into <b>Resonance</b> with weights that depend on the relationship type (romantic, friend, family, colleague) and on confidence (for example, a missing birth time lowers the weight of astrology). The <b>research-backed-only</b> toggle shows a score from the Big Five and attachment lenses alone. There is no “incompatible” band: Kindred Flow, Natural Allies, Complementary Path, Catalyst Bond and Deep Teacher Bond. Every growth edge comes with practices.</p>
      <h2>Protecting you</h2>
      <p>We use what's known about shadows and unhealthy patterns to help you <i>notice</i> them, never to label another person, and never against you (no fear-based upsells, no fake urgency). If you feel unsafe in a relationship, please contact local emergency services or a domestic-abuse helpline.</p>
    </article>
  );
}

function PageMk() {
  return (
    <article className="prose-soft">
      <PageHero emblem="chart" img="orion" title={<>Како функционира</>} />
      <p className="text-sm text-dim">Horoscop е за самоспознавање и забава. Не е психолошки, медицински ни финансиски совет.</p>
      <p><b>Нашата филозофија:</b> ѕвездите ја поставуваат сцената, психологијата го објаснува образецот, а начинот на кој се однесувате еден кон друг ја пишува приказната. Сè овде е огледало за размислување, никогаш пророштво или пресуда.</p>
      <h2>Што велат доказите</h2>
      <p>Контролираните студии не најдоа предвидувачка моќ на астрологијата врз личноста или врз тоа кој со кого стапува во брак (на пр. Carlson, <i>Nature</i> 1985; анализата на Voas на ~10 милиони бракови во Велика Британија, 2007/2008). Ниту нумерологијата, тарот и слични системи немаат емпириска поддршка. Ги вклучуваме затоа што се богати, древни јазици за размислување, и ги означуваме со ✨ Традиционално и симболично.</p>
      <p>Големите пет црти на личноста се добро истражени. Кај паровите, емотивната стабилност, топлината и сигурноста на секој партнер го предвидуваат задоволството; совпаѓањето меѓу нив е многу малку важно (Malouff и сор., 2010; Dyrenforth и сор., 2010). Најсилни предвесници на квалитетот на врската се чувствата на партнерите за <i>оваа</i> врска, ценење, посветеност, доверба, поправање, забава (Joel и сор., 2020, PNAS). Затоа ја направивме Проверката на врската. Овие леќи ја носат ознаката 🔬. 🧭 Леќите од популарната психологија (темпераменти, стил од четири букви, девет мотивации, начини на грижа, Сенка и светлина) нудат корисен јазик со ограничени докази.</p>
      <h2>Пресметки</h2>
      <ul>
        <li><b>Планети:</b> библиотеката со отворен код astronomy-engine (MIT лиценца, точност од околу 1 лачна минута), пресметано на твојот уред. Тропски зодијак, геоцентрични привидни положби, среден месечев јазол. Подзнак и Средина на небото од ѕвезденото време и твоето родно место. Домови по цели знаци.</li>
        <li><b>Временски зони:</b> историски отстапувања и летно сметање на времето од базата на временски зони IANA. Пред 1900 година користиме локално средно време од географската должина на родното место. Можеш рачно да го смениш отстапувањето.</li>
        <li><b>Родни места:</b> градови од GeoNames со над 15.000 жители (CC BY 4.0).</li>
        <li><b>Непознато време на раѓање:</b> користиме пладне, го изоставуваме подзнакот и ги прикажуваме двата месечеви знаци ако Месечината го сменила знакот тој ден.</li>
        <li><b>Ведска астрологија:</b> ајанамша Лахири (линеарна апроксимација), 27 накшатри и традиционалниот Гуна Милан од 36 поени (Аштакута). Насочените кути (Варна, Вашја) се просекуваат во двете насоки за да функционира за секој пар; Јони и Вашја користат поедноставена табела. Дошите се прикажуваат со традиционалните поништувања, никогаш како предупредувања.</li>
        <li><b>Кинески хороскоп:</b> календарот со отворен код lunar-javascript (MIT). Твоето животно се менува на <b>Лунарната Нова година</b> (народната конвенција). Го прикажуваме и животното според Ли Чун (почеток на пролетта), што се користи во астрологијата на четирите столба, кога се разликува. Господарот на денот и рамнотежата на петте елементи доаѓаат од четирите столба.</li>
        <li><b>Нумерологија:</b> питагорејски вредности на буквите; Животниот пат ги сведува месецот, денот и годината одделно и ги задржува мајсторските броеви 11, 22 и 33. Кирилските имиња се пресликуваат во латиница, а акцентите се отстрануваат (ł→l, ö→o).</li>
        <li><b>Тарот карти на раѓање:</b> месец + ден + година, сведени на 22 или помалку (метод популаризиран од Mary K. Greer).</li>
        <li><b>Големите пет:</b> Mini-IPIP од 20 ставки (Donnellan и сор., 2006) од јавниот International Personality Item Pool. Перцентилите користат приближни објавени просеци. Четирите темпераменти произлегуваат од Екстраверзија × емотивна чувствителност (Ајзенк); стилот од четири букви од корелациите со Големите пет (McCrae и Costa, 1989). Тоа не е официјален тест за тип и не сме поврзани со ниеден издавач на тестови за тип.</li>
        <li><b>Наши прашалници:</b> приврзаност (димензии анксиозност и избегнување), девет мотивации, начини на грижа, Сенка и светлина, тип на тело и енергија (инспирирано од Ајурведа) и Автопилот или истражувач + социјален став (инспирирано од неврокогнитивниот и бихејвиорален пристап на д-р Жак Фраден, не е официјална проценка).</li>
      </ul>
      <h2>Како функционираат резултатите за компатибилност</h2>
      <p>Секоја леќа дава два броја: <b>Хармонија</b> (леснотија и тек) и <b>Искра</b> (енергија, предизвик, раст). Триењето се брои кон Искрата, не против вас. Секоја леќа ја пуштивме врз десетици илјади случајни парови и твојот суров резултат го претвораме во перцентил меѓу тие парови, а потоа го прикажуваме како 45 + 55 × перцентил, па скалата оди од 45 до 100, а типичен пар има околу 72. Секој пар има нешто да понуди, па скалата почнува од 45.</p>
      <p>Леќите се спојуваат во <b>Резонанца</b> со тежини што зависат од видот на врската (романтична, пријателска, семејна, колегијална) и од сигурноста (на пример, непознато време на раѓање ја намалува тежината на астрологијата). Прекинувачот <b>само поткрепено со истражувања</b> покажува резултат само од леќите Големите пет и приврзаност. Не постои категорија „некомпатибилни“: Сродни души, Природни сојузници, Комплементарен пат, Врска-катализатор и Врска на длабоко учење. Секој раб за раст доаѓа со вежби.</p>
      <h2>Те штитиме</h2>
      <p>Она што се знае за сенките и нездравите обрасци го користиме за да ти помогнеме да ги <i>забележиш</i>, никогаш за да етикетираме друга личност и никогаш против тебе (без продажба преку страв, без лажна итност). Ако се чувствуваш небезбедно во врска, те молиме обрати се до локалните служби за итни случаи или до линија за помош при семејно насилство.</p>
    </article>
  );
}
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return lang === "mk" ? <PageMk /> : <PageEn />;
}
