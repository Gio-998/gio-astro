import { pageMeta } from "@/lib/page-meta";
import { PageHero } from "@/components/ui";
import { PrivacyControls } from "@/components/PrivacyControls";
export const generateMetadata = pageMeta("privacy");
function PageEn() {
  return (
    <article className="prose-soft">
      <PageHero emblem="moon" img="milkyway" title={<>Privacy</>} />
      <p className="text-sm text-dim">Draft v0.2 (October 2026): to be reviewed by a lawyer before payments are added.</p>
      <h2>Short version</h2>
      <p>Everything you enter (birth details, quiz answers, people you add, journal entries) is stored <b>in your browser</b> (localStorage) on this device, and all calculations run on your device. <b>Accounts are optional.</b> Without one, nothing is uploaded. If you create an account, we store a copy in our database so it syncs between your devices, but only after you tick the consent boxes.</p>
      <h2>What leaves your device</h2>
      <ul>
        <li>Loading the site and the city list from our static host (standard web server logs such as IP address, kept by the host).</li>
        <li>Only if you have an account: your email, profile, quiz results and answers, the people you added, Bond Check results, journal entries and your consent choices. These are stored with our database provider Supabase in the EU (Stockholm, Sweden), protected so only your signed-in account can read them. Sign-in emails are sent by Supabase.</li>
        <li>Nothing else. No analytics cookies, no advertising trackers. We never sell data.</li>
      </ul>
      <h2>Sensitive answers</h2>
      <p>Quiz answers about relationships, feelings and your body can be personal. Without an account they stay on your device. With an account they are stored only after you give explicit consent, and you can withdraw it by deleting your account. Profile codes you choose to share contain your birth data and results, only share them with people you trust.</p>
      <h2>Other people</h2>
      <p>If you add someone else, their data stays on your device, and in your account if you have one. Please add people with their knowledge. They (or you) can delete them any time.</p>
      <h2>Deleting your account</h2>
      <p>On the Account page, “Delete my account” permanently removes your account and every row stored in it straight away. You can also sign out and keep or remove the copy on this device.</p>
      <h2>Your controls</h2>
      <PrivacyControls />
      <h2>Contact</h2>
      <p>Questions or requests about your data? Write to <a href="mailto:contact@horoscop.si">contact@horoscop.si</a>.</p>
    </article>
  );
}

function PageMk() {
  return (
    <article className="prose-soft">
      <PageHero emblem="moon" img="milkyway" title={<>Приватност</>} />
      <p className="text-sm text-dim">Нацрт v0.2 (октомври 2026). Правник ќе го прегледа пред да се додадат плаќања.</p>
      <h2>Кратко</h2>
      <p>Сè што внесуваш (податоци за раѓање, одговори на квизови, луѓе што ги додаваш, записи во дневникот) се чува <b>во твојот прелистувач</b> (localStorage) на овој уред, и сите пресметки се извршуваат на твојот уред. <b>Сметката е незадолжителна.</b> Без неа ништо не се испраќа. Ако создадеш сметка, чуваме копија во нашата база за да се синхронизира меѓу твоите уреди, но само откако ќе ги штиклираш полињата за согласност.</p>
      <h2>Што го напушта твојот уред</h2>
      <ul>
        <li>Вчитувањето на страницата и листата на градови од нашиот статичен хостинг (стандардни дневници на веб-серверот, како IP-адреса, што ги чува хостингот).</li>
        <li>Само ако имаш сметка: твојата е-пошта, профилот, резултатите и одговорите од квизовите, додадените луѓе, резултатите од Проверката на врската, записите во дневникот и твоите согласности. Се чуваат кај нашиот добавувач на база Supabase во ЕУ (Стокхолм, Шведска), заштитени така што може да ги чита само твојата најавена сметка. Е-пораките за најава ги испраќа Supabase.</li>
        <li>Ништо друго. Без аналитички колачиња, без рекламни следачи. Никогаш не продаваме податоци.</li>
      </ul>
      <h2>Чувствителни одговори</h2>
      <p>Одговорите за врски, чувства и твоето тело можат да бидат лични. Без сметка остануваат на твојот уред. Со сметка се чуваат само по твоја изречна согласност, која можеш да ја повлечеш со бришење на сметката. Шифрите на профил што ќе одлучиш да ги споделиш содржат твои податоци за раѓање и резултати, споделувај ги само со луѓе на кои им веруваш.</p>
      <h2>Други луѓе</h2>
      <p>Ако додадеш некого друг, неговите податоци остануваат на твојот уред, и во твојата сметка ако имаш. Те молиме додавај луѓе со нивно знаење. Тие (или ти) можат да ги избришат во секое време.</p>
      <h2>Бришење на сметката</h2>
      <p>На страницата Сметка, „Избриши ја мојата сметка“ веднаш и трајно ја отстранува сметката и сè што е зачувано во неа. Можеш и да се одјавиш и да ја задржиш или отстраниш копијата на овој уред.</p>
      <h2>Твоите контроли</h2>
      <PrivacyControls />
      <h2>Контакт</h2>
      <p>Прашања или барања за твоите податоци? Пиши ни на <a href="mailto:contact@horoscop.si">contact@horoscop.si</a>.</p>
    </article>
  );
}
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return lang === "mk" ? <PageMk /> : <PageEn />;
}
