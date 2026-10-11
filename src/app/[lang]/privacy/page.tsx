import { pageMeta } from "@/lib/page-meta";
import { PageHero } from "@/components/ui";
import { PrivacyControls } from "@/components/PrivacyControls";
export const generateMetadata = pageMeta("privacy");
function PageEn() {
  return (
    <article className="prose-soft">
      <PageHero emblem="moon" img="milkyway" title={<>Privacy</>} />
      <p className="text-sm text-dim">Draft v0.1 — to be reviewed before accounts or payments are added.</p>
      <h2>Short version</h2>
      <p>Everything you enter — birth details, quiz answers, people you add, journal entries — is stored <b>only in your browser</b> (localStorage) on this device. We have no account system and no database yet, so we can't see, sell or lose your data. All calculations run on your device.</p>
      <h2>What leaves your device</h2>
      <ul>
        <li>Loading the site and the city list from our static host (standard web server logs such as IP address, kept by the host).</li>
        <li>Nothing else. No analytics cookies, no advertising trackers.</li>
      </ul>
      <h2>Sensitive answers</h2>
      <p>Quiz answers about relationships, feelings and your body can be personal. They stay on your device. Profile codes you choose to share contain your birth data and results — only share them with people you trust.</p>
      <h2>Other people</h2>
      <p>If you add someone else, their data also stays on your device. Please add people with their knowledge. They (or you) can delete them any time.</p>
      <h2>Later</h2>
      <p>If we add optional accounts (to sync between devices), we'll ask for explicit consent, host data in the EU, and give you export and delete buttons — and update this page first.</p>
      <h2>Your controls</h2>
      <PrivacyControls />
    </article>
  );
}

function PageMk() {
  return (
    <article className="prose-soft">
      <PageHero emblem="moon" img="milkyway" title={<>Приватност</>} />
      <p className="text-sm text-dim">Нацрт v0.1 — ќе се прегледа пред да се додадат сметки или плаќања.</p>
      <h2>Кратко</h2>
      <p>Сè што внесуваш — податоци за раѓање, одговори на квизови, луѓе што ги додаваш, записи во дневникот — се чува <b>само во твојот прелистувач</b> (localStorage) на овој уред. Засега немаме систем за сметки ниту база на податоци, па не можеме да ги видиме, продадеме или изгубиме твоите податоци. Сите пресметки се извршуваат на твојот уред.</p>
      <h2>Што го напушта твојот уред</h2>
      <ul>
        <li>Вчитувањето на страницата и листата на градови од нашиот статичен хостинг (стандардни дневници на веб-серверот, како IP-адреса, што ги чува хостингот).</li>
        <li>Ништо друго. Без аналитички колачиња, без рекламни следачи.</li>
      </ul>
      <h2>Чувствителни одговори</h2>
      <p>Одговорите за врски, чувства и твоето тело можат да бидат лични. Остануваат на твојот уред. Шифрите на профил што ќе одлучиш да ги споделиш содржат твои податоци за раѓање и резултати — споделувај ги само со луѓе на кои им веруваш.</p>
      <h2>Други луѓе</h2>
      <p>Ако додадеш некого друг, и неговите податоци остануваат на твојот уред. Те молиме додавај луѓе со нивно знаење. Тие (или ти) можат да ги избришат во секое време.</p>
      <h2>Подоцна</h2>
      <p>Ако додадеме незадолжителни сметки (за синхронизација меѓу уреди), ќе побараме изречна согласност, податоците ќе ги чуваме во ЕУ и ќе ти дадеме копчиња за извоз и бришење — и прво ќе ја ажурираме оваа страница.</p>
      <h2>Твоите контроли</h2>
      <PrivacyControls />
    </article>
  );
}
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return lang === "mk" ? <PageMk /> : <PageEn />;
}
