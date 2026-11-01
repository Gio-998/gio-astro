import { pageMeta } from "@/lib/page-meta";
import { PageHero } from "@/components/ui";
import { PrivacyControls } from "@/components/PrivacyControls";
import { PRIVACY_VERSION } from "@/lib/lead";
export const generateMetadata = pageMeta("privacy");
const Mail = () => <a href="mailto:contact@horoscop.si">contact@horoscop.si</a>;
function PageEn() {
  return (
    <article className="prose-soft">
      <PageHero emblem="moon" img="milkyway" title={<>Privacy</>} />
      <p className="text-sm text-dim">Draft, version {PRIVACY_VERSION}: a lawyer still has to review this text.</p>
      <h2>Short version</h2>
      <p>Your birth details, test answers, results, the people you add and your journal stay <b>in your browser</b> on this device, and the calculations run here too. <b>Accounts are optional.</b> A few things do leave your device, and this page lists every one: above all the name and email you give us to open a full test result. Your answers and results never travel with them. We never sell data.</p>
      <h2>Who is responsible</h2>
      <p>horoscop.si is responsible for the data described here. Write to <Mail /> about anything on this page.</p>
      <h2>What stays on your device</h2>
      <p>Birth details, test answers and results, people you add and journal entries sit in your browser's local storage. So does a note that you already left your details, so the form doesn't ask twice. If sending that form failed, your name and email wait there too until the next visit, then they are sent and removed from the device.</p>
      <h2>What leaves your device, and why</h2>
      <ul>
        <li><b>Your name and email, when you open a full test result.</b> We also keep your language, which tests you took, your consent choices, the version of this page and the dates. We use them to open your results, to send you the email below and to answer you if you write. Giving them is the condition for the full result, which costs no money. Legal basis: Art. 6(1)(b) GDPR, because you ask us for that result. Your answers and results are never sent.</li>
        <li><b>One email after that form.</b> It links back to the test and to your results on this device, and it contains no results. It goes out only when the bot check below is passed, at most once per test and normally no more than once in 30 days, and never to an address that has unsubscribed. It goes out through Resend. Same legal basis.</li>
        <li><b>Your IP address, for a moment, when you send that form.</b> We turn it into a keyed hash that changes every day and count requests and emails against it, to stop abuse. For IPv6 we use only the network part. We never store the address itself. Legal basis: Art. 6(1)(f) GDPR, our interest in keeping the service safe.</li>
        <li><b>News by email, only if you ask for it twice.</b> The box is optional and unticked, and your result never depends on it. If you tick it, the email above contains a confirm button, and only that click counts as consent. We keep the words next to the box and the times you ticked and confirmed, as proof. We send no newsletter yet. Legal basis: your consent, Art. 6(1)(a) GDPR.</li>
        <li><b>Usage counts.</b> When a page opens or a test is finished, we record what happened, the page, the language and, for a test, which one, with a random session number that lives in your browser tab and disappears when you close it. There are no cookies for this. If you are signed in, the record also carries your account id. Legal basis: Art. 6(1)(f) GDPR, our interest in knowing which parts of the site are used.</li>
        <li><b>Bot check.</b> The test form loads Cloudflare Turnstile once you start filling it in, and the sign-in and news forms do when the check is switched on. Turnstile reads your IP address and technical details of your browser to tell people from bots. Legal basis: Art. 6(1)(f) GDPR, keeping the forms free of abuse.</li>
        <li><b>Place search.</b> Places are looked up in a list on this site. If nothing matches, what you typed goes to Open-Meteo's search service, along with your IP address. Legal basis: Art. 6(1)(f) GDPR, finding small places.</li>
        <li><b>Premium news.</b> If you leave your email to hear when Premium opens, we keep your email, language and where you left it, so we can tell you. Legal basis: Art. 6(1)(b) GDPR.</li>
        <li><b>An account, only if you create one.</b> Your email, profile, test answers and results, the people you added, Bond Check results, journal entries and consent choices are stored with our database provider in the EU (Sweden), protected so only your signed-in account can read them. Messages you send with the feedback button are kept with the page and browser type. Sign-in emails go out through Resend. Legal basis: Art. 6(1)(b) GDPR, and for sensitive answers your explicit consent, Art. 9(2)(a) GDPR.</li>
        <li><b>Loading the site.</b> Our hosting provider and our database provider see standard technical data such as your IP address when your browser talks to them, and keep it in their logs. Legal basis: Art. 6(1)(f) GDPR, running the site.</li>
      </ul>
      <p>No analytics cookies, no advertising trackers.</p>
      <h2>How long we keep it</h2>
      <ul>
        <li>Name and email from the test form: 24 months after your last submission, then they are deleted automatically.</li>
        <li>With a confirmed yes to news: until you unsubscribe. After that we keep the entry for 24 months so we don't write to you again, then it is deleted.</li>
        <li>Hashed IP addresses: about 24 hours. Confirm links stop working after 30 days.</li>
        <li>Emails left for Premium news: 24 months. Usage counts: 14 months.</li>
        <li>Account data: until you delete your account.</li>
        <li>Hosting and database logs: as long as those providers keep them.</li>
      </ul>
      <h2>Who helps us</h2>
      <ul>
        <li><b>Supabase:</b> database, sign-in and server functions, in the EU (Sweden).</li>
        <li><b>Vercel:</b> hosting of the website and its logs.</li>
        <li><b>Resend:</b> sending email.</li>
        <li><b>Cloudflare:</b> the Turnstile bot check.</li>
        <li><b>Open-Meteo:</b> search for places that are not in our own list.</li>
      </ul>
      <p>Some of these companies are based in the United States, so your data can reach servers there.</p>
      <h2>Your rights</h2>
      <p>You can ask us for a copy of your data, and to correct, delete, limit or transfer it. You can object to anything we do on the basis of our own interest. You can withdraw a consent at any time, which doesn't affect what happened before. You can also complain to the data protection authority where you live.</p>
      <h2>How to stop or delete</h2>
      <ul>
        <li><b>News:</b> use the unsubscribe link in any of our emails, or write to <Mail />.</li>
        <li><b>Your name and email:</b> write to <Mail /> and we delete them. Clearing this device doesn't remove them from our list.</li>
        <li><b>This device:</b> use the controls below.</li>
      </ul>
      <h2>Sensitive answers</h2>
      <p>Test answers about relationships, feelings and your body can be personal. Without an account they stay on your device. With an account they are stored only after you give explicit consent, and you can withdraw it by deleting your account. Profile codes you choose to share contain your birth data and results, only share them with people you trust.</p>
      <h2>Other people</h2>
      <p>If you add someone else, their data stays on your device, and in your account if you have one. Please add people with their knowledge. They (or you) can delete them any time.</p>
      <h2>Deleting your account</h2>
      <p>On the Account page, “Delete my account” permanently removes your account and every row stored in it straight away. You can also sign out and keep or remove the copy on this device. A name and email from the test form are kept separately: write to us to remove those too.</p>
      <h2>Your controls</h2>
      <PrivacyControls />
      <h2>Contact</h2>
      <p>Questions or requests about your data? Write to <Mail />.</p>
    </article>
  );
}

function PageMk() {
  return (
    <article className="prose-soft">
      <PageHero emblem="moon" img="milkyway" title={<>Приватност</>} />
      <p className="text-sm text-dim">Нацрт, верзија {PRIVACY_VERSION}: правник допрва треба да го прегледа овој текст.</p>
      <h2>Кратко</h2>
      <p>Твоите податоци за раѓање, одговорите на тестовите, резултатите, луѓето што ги додаваш и дневникот остануваат <b>во твојот прелистувач</b> на овој уред, а и пресметките се извршуваат тука. <b>Сметката е незадолжителна.</b> Некои работи сепак го напуштаат уредот и оваа страница ги наведува сите: пред сè името и е-поштата што ни ги даваш за да го отвориш целиот резултат од тест. Одговорите и резултатите никогаш не патуваат со нив. Никогаш не продаваме податоци.</p>
      <h2>Кој е одговорен</h2>
      <p>horoscop.si е одговорен за податоците опишани овде. За сè на оваа страница пиши на <Mail />.</p>
      <h2>Што останува на твојот уред</h2>
      <p>Податоците за раѓање, одговорите и резултатите од тестовите, додадените луѓе и записите во дневникот се во локалната меморија на твојот прелистувач. Таму е и белешка дека веќе ги остави своите податоци, за формуларот да не те прашува двапати. Ако испраќањето на формуларот не успеало, името и е-поштата чекаат таму до следната посета, а потоа се испраќаат и се бришат од уредот.</p>
      <h2>Што го напушта твојот уред и зошто</h2>
      <ul>
        <li><b>Твоето име и е-пошта, кога го отвораш целиот резултат од тест.</b> Чуваме и јазик, кои тестови си ги направил/а, твоите согласности, верзијата на оваа страница и датумите. Ги користиме за да ти ги отвориме резултатите, да ти ја пратиме пораката подолу и да ти одговориме ако ни пишеш. Давањето на овие податоци е услов за целиот резултат, кој не чини пари. Правна основа: чл. 6(1)(b) од GDPR, бидејќи ти го бараш тој резултат. Твоите одговори и резултати никогаш не се испраќаат.</li>
        <li><b>Една порака по тој формулар.</b> Содржи линк назад до тестот и до твоите резултати на овој уред, а не содржи резултати. Се праќа само ако е помината проверката за ботови подолу, најмногу еднаш за секој тест и обично не почесто од еднаш на 30 дена, и никогаш на адреса што се одјавила. Се праќа преку Resend. Истата правна основа.</li>
        <li><b>Твојата IP-адреса, за миг, кога го праќаш формуларот.</b> Ја претвораме во хеш со таен клуч што се менува секој ден и по него ги броиме барањата и пораките, за да спречиме злоупотреба. Кај IPv6 го користиме само мрежниот дел. Самата адреса никогаш не ја чуваме. Правна основа: чл. 6(1)(f) од GDPR, нашиот интерес услугата да остане безбедна.</li>
        <li><b>Новости на е-пошта, само ако ги побараш двапати.</b> Полето е незадолжително и не е штиклирано, а резултатот никогаш не зависи од него. Ако го штиклираш, пораката погоре содржи копче за потврда, и само тој клик се смета за согласност. Како доказ ги чуваме зборовите до полето и времето кога штиклираше и потврди. Сè уште не праќаме билтен. Правна основа: твоја согласност, чл. 6(1)(a) од GDPR.</li>
        <li><b>Бројки за користење.</b> Кога ќе се отвори страница или ќе се заврши тест, запишуваме што се случило, страницата, јазикот и, за тест, кој тест, заедно со случаен број на сесија што живее во јазичето на прелистувачот и исчезнува кога ќе го затвориш. За ова нема колачиња. Ако си најавен/а, записот ја носи и ознаката на твојата сметка. Правна основа: чл. 6(1)(f) од GDPR, нашиот интерес да знаеме кои делови од страницата се користат.</li>
        <li><b>Проверка за ботови.</b> Формуларот на тестот го вчитува Cloudflare Turnstile штом ќе почнеш да го пополнуваш, а формуларите за најава и новости кога проверката е вклучена. Turnstile ја чита твојата IP-адреса и технички податоци за прелистувачот за да разликува луѓе од ботови. Правна основа: чл. 6(1)(f) од GDPR, формуларите да останат без злоупотреба.</li>
        <li><b>Пребарување места.</b> Местата се бараат во листа на оваа страница. Ако нема совпаѓање, она што си го внел/а оди до услугата за пребарување на Open-Meteo, заедно со твојата IP-адреса. Правна основа: чл. 6(1)(f) од GDPR, наоѓање мали места.</li>
        <li><b>Новости за Premium.</b> Ако оставиш е-пошта за да дознаеш кога се отвора Premium, ја чуваме е-поштата, јазикот и местото од каде ја остави, за да ти јавиме. Правна основа: чл. 6(1)(b) од GDPR.</li>
        <li><b>Сметка, само ако создадеш.</b> Твојата е-пошта, профилот, одговорите и резултатите од тестовите, додадените луѓе, резултатите од Проверката на врската, записите во дневникот и согласностите се чуваат кај нашиот добавувач за база на податоци во ЕУ (Шведска), заштитени така што може да ги чита само твојата најавена сметка. Пораките што ги праќаш со копчето за мислење се чуваат со страницата и типот на прелистувач. Е-пораките за најава се праќаат преку Resend. Правна основа: чл. 6(1)(b) од GDPR, а за чувствителни одговори твоја изречна согласност, чл. 9(2)(a) од GDPR.</li>
        <li><b>Вчитување на страницата.</b> Нашиот хостинг и добавувачот за база гледаат стандардни технички податоци како IP-адресата кога твојот прелистувач зборува со нив и ги чуваат во своите дневници. Правна основа: чл. 6(1)(f) од GDPR, работа на страницата.</li>
      </ul>
      <p>Без аналитички колачиња, без рекламни следачи.</p>
      <h2>Колку долго чуваме</h2>
      <ul>
        <li>Име и е-пошта од формуларот на тестот: 24 месеци по твоето последно внесување, а потоа автоматски се бришат.</li>
        <li>Со потврдено да за новости: додека не се одјавиш. Потоа записот го чуваме 24 месеци за да не ти пишеме повторно, а потоа се брише.</li>
        <li>Хешираните IP-адреси: околу 24 часа. Линковите за потврда престануваат да работат по 30 дена.</li>
        <li>Е-поштите оставени за новости за Premium: 24 месеци. Бројките за користење: 14 месеци.</li>
        <li>Податоците од сметката: додека не ја избришеш сметката.</li>
        <li>Дневниците на хостингот и базата: колку што ги чуваат тие добавувачи.</li>
      </ul>
      <h2>Кој ни помага</h2>
      <ul>
        <li><b>Supabase:</b> база на податоци, најава и серверски функции, во ЕУ (Шведска).</li>
        <li><b>Vercel:</b> хостинг на страницата и нејзините дневници.</li>
        <li><b>Resend:</b> праќање е-пошта.</li>
        <li><b>Cloudflare:</b> проверката за ботови Turnstile.</li>
        <li><b>Open-Meteo:</b> пребарување места што ги нема во нашата листа.</li>
      </ul>
      <p>Некои од овие компании се од Соединетите Американски Држави, па твоите податоци може да стигнат до сервери таму.</p>
      <h2>Твоите права</h2>
      <p>Можеш да побараш копија од твоите податоци, како и да ги поправиме, избришеме, ограничиме или пренесеме. Можеш да приговориш на сè што правиме врз основа на наш интерес. Согласноста можеш да ја повлечеш во секое време, што не влијае на она што веќе се случило. Можеш да поднесеш и жалба до органот за заштита на податоци каде што живееш.</p>
      <h2>Како да запреш или избришеш</h2>
      <ul>
        <li><b>Новости:</b> користи го линкот за одјава во која било наша порака или пиши на <Mail />.</li>
        <li><b>Твоето име и е-пошта:</b> пиши на <Mail /> и ќе ги избришеме. Бришењето на овој уред не ги отстранува од нашата листа.</li>
        <li><b>Овој уред:</b> користи ги контролите подолу.</li>
      </ul>
      <h2>Чувствителни одговори</h2>
      <p>Одговорите на тестовите за врски, чувства и твоето тело можат да бидат лични. Без сметка остануваат на твојот уред. Со сметка се чуваат само по твоја изречна согласност, која можеш да ја повлечеш со бришење на сметката. Шифрите на профил што ќе одлучиш да ги споделиш содржат твои податоци за раѓање и резултати, споделувај ги само со луѓе на кои им веруваш.</p>
      <h2>Други луѓе</h2>
      <p>Ако додадеш некого друг, неговите податоци остануваат на твојот уред, и во твојата сметка ако имаш. Те молиме додавај луѓе со нивно знаење. Тие (или ти) можат да ги избришат во секое време.</p>
      <h2>Бришење на сметката</h2>
      <p>На страницата Сметка, „Избриши ја мојата сметка“ веднаш и трајно ја отстранува сметката и сè што е зачувано во неа. Можеш и да се одјавиш и да ја задржиш или отстраниш копијата на овој уред. Името и е-поштата од формуларот на тестот се чуваат одделно: пиши ни за да ги отстраниме и нив.</p>
      <h2>Твоите контроли</h2>
      <PrivacyControls />
      <h2>Контакт</h2>
      <p>Прашања или барања за твоите податоци? Пиши ни на <Mail />.</p>
    </article>
  );
}
function PageDe() {
  return (
    <article className="prose-soft" lang="de">
      <PageHero emblem="moon" img="milkyway" title={<>Datenschutz</>} />
      <p className="text-sm text-dim">Entwurf, Version {PRIVACY_VERSION}: Dieser Text muss noch anwaltlich geprüft werden.</p>
      <h2>Kurz gesagt</h2>
      <p>Deine Geburtsdaten, Testantworten, Ergebnisse, hinzugefügten Personen und dein Tagebuch bleiben <b>in deinem Browser</b> auf diesem Gerät, und auch die Berechnungen laufen hier. <b>Ein Konto ist freiwillig.</b> Ein paar Dinge verlassen dein Gerät trotzdem, und diese Seite nennt sie alle: vor allem Name und E-Mail, die du uns gibst, um ein ganzes Testergebnis zu öffnen. Deine Antworten und Ergebnisse gehen dabei nie mit. Wir verkaufen niemals Daten.</p>
      <h2>Wer verantwortlich ist</h2>
      <p>Verantwortlich für die hier beschriebenen Daten ist horoscop.si. Schreib uns zu allem auf dieser Seite an <Mail />.</p>
      <h2>Was auf deinem Gerät bleibt</h2>
      <p>Geburtsdaten, Testantworten und Ergebnisse, hinzugefügte Personen und Tagebucheinträge liegen im lokalen Speicher deines Browsers. Dort liegt auch ein Vermerk, dass du deine Angaben schon gemacht hast, damit das Formular nicht zweimal fragt. Hat das Senden nicht geklappt, warten dein Name und deine E-Mail dort bis zum nächsten Besuch, dann werden sie gesendet und vom Gerät entfernt.</p>
      <h2>Was dein Gerät verlässt und warum</h2>
      <ul>
        <li><b>Dein Name und deine E-Mail, wenn du ein ganzes Testergebnis öffnest.</b> Außerdem speichern wir deine Sprache, welche Tests du gemacht hast, deine Einwilligungen, die Version dieser Seite und die Daten dazu. Damit öffnen wir deine Ergebnisse, schicken dir die unten genannte E-Mail und antworten dir, wenn du uns schreibst. Diese Angaben sind die Bedingung für das ganze Ergebnis, das kein Geld kostet. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO, weil du dieses Ergebnis von uns möchtest. Deine Antworten und Ergebnisse werden nie gesendet.</li>
        <li><b>Eine E-Mail nach diesem Formular.</b> Sie führt zurück zum Test und zu deinen Ergebnissen auf diesem Gerät und enthält selbst keine Ergebnisse. Sie geht nur raus, wenn die Bot-Prüfung unten bestanden ist, höchstens einmal pro Test und in der Regel nicht öfter als einmal in 30 Tagen, und nie an eine Adresse, die sich abgemeldet hat. Der Versand läuft über Resend. Rechtsgrundlage wie oben.</li>
        <li><b>Deine IP-Adresse, für einen Moment, wenn du das Formular sendest.</b> Wir machen daraus einen täglich wechselnden Hash mit geheimem Schlüssel und zählen damit Anfragen und E-Mails, um Missbrauch zu stoppen. Bei IPv6 nutzen wir nur den Netzanteil. Die Adresse selbst speichern wir nie. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO, unser Interesse an einem sicheren Dienst.</li>
        <li><b>Neuigkeiten per E-Mail, nur wenn du zweimal Ja sagst.</b> Das Feld ist freiwillig und nicht angehakt, und dein Ergebnis hängt nie davon ab. Hakst du es an, enthält die E-Mail oben einen Bestätigungslink (Double-Opt-in), und erst dieser Klick zählt als Einwilligung. Als Nachweis speichern wir den Text neben dem Feld und die Zeitpunkte von Haken und Bestätigung. Einen Newsletter verschicken wir noch nicht. Rechtsgrundlage: deine Einwilligung, Art. 6 Abs. 1 lit. a DSGVO.</li>
        <li><b>Nutzungszahlen.</b> Wenn eine Seite öffnet oder ein Test fertig ist, halten wir fest, was passiert ist, die Seite, die Sprache und bei einem Test welcher, dazu eine zufällige Sitzungsnummer, die in deinem Browser-Tab liegt und verschwindet, wenn du ihn schließt. Dafür gibt es keine Cookies. Bist du angemeldet, trägt der Eintrag auch deine Konto-ID. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO, unser Interesse zu wissen, welche Teile der Seite genutzt werden.</li>
        <li><b>Bot-Prüfung.</b> Das Testformular lädt Cloudflare Turnstile, sobald du es ausfüllst, die Formulare für Anmeldung und Neuigkeiten tun das, wenn die Prüfung eingeschaltet ist. Der Dienst liest deine IP-Adresse und technische Angaben zu deinem Browser, um Menschen von Bots zu unterscheiden. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO, Schutz der Formulare vor Missbrauch.</li>
        <li><b>Ortssuche.</b> Orte suchen wir in einer Liste auf dieser Seite. Gibt es keinen Treffer, geht deine Eingabe zusammen mit deiner IP-Adresse an den Suchdienst von Open-Meteo. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO, damit auch kleine Orte auffindbar sind.</li>
        <li><b>Neuigkeiten zu Premium.</b> Wenn du deine E-Mail hinterlässt, um zu erfahren, wann Premium öffnet, speichern wir sie zusammen mit deiner Sprache und dem Ort, an dem du sie hinterlassen hast, um dir Bescheid zu geben. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.</li>
        <li><b>Ein Konto, nur wenn du eines anlegst.</b> Deine E-Mail, dein Profil, Testantworten und Ergebnisse, hinzugefügte Personen, Ergebnisse des Beziehungschecks, Tagebucheinträge und Einwilligungen liegen bei unserem Datenbank-Anbieter in der EU (Schweden) und sind so geschützt, dass nur dein angemeldetes Konto sie lesen kann. Nachrichten über den Feedback-Knopf speichern wir mit der Seite und dem Browsertyp. Anmelde-E-Mails laufen über Resend. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO, für sensible Antworten deine ausdrückliche Einwilligung, Art. 9 Abs. 2 lit. a DSGVO.</li>
        <li><b>Das Laden der Seite.</b> Unser Hoster und unser Datenbank-Anbieter sehen übliche technische Daten wie deine IP-Adresse, wenn dein Browser mit ihnen spricht, und speichern sie in ihren Logs. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO, der Betrieb der Seite.</li>
      </ul>
      <p>Keine Analyse-Cookies, keine Werbetracker.</p>
      <h2>Wie lange wir speichern</h2>
      <ul>
        <li>Name und E-Mail aus dem Testformular: 24 Monate nach deiner letzten Eingabe, danach werden sie automatisch gelöscht.</li>
        <li>Mit bestätigtem Ja zu Neuigkeiten: bis du dich abmeldest. Danach bleibt der Eintrag 24 Monate, damit wir dir nicht wieder schreiben, und wird dann gelöscht.</li>
        <li>Gehashte IP-Adressen: etwa 24 Stunden. Bestätigungslinks funktionieren 30 Tage.</li>
        <li>Für Premium-Neuigkeiten hinterlassene E-Mails: 24 Monate. Nutzungszahlen: 14 Monate.</li>
        <li>Kontodaten: bis du dein Konto löschst.</li>
        <li>Logs von Hoster und Datenbank: so lange, wie diese Anbieter sie aufbewahren.</li>
      </ul>
      <h2>Wer uns hilft</h2>
      <ul>
        <li><b>Supabase:</b> Datenbank, Anmeldung und Serverfunktionen, in der EU (Schweden).</li>
        <li><b>Vercel:</b> Hosting der Website und ihre Logs.</li>
        <li><b>Resend:</b> E-Mail-Versand.</li>
        <li><b>Cloudflare:</b> die Bot-Prüfung Turnstile.</li>
        <li><b>Open-Meteo:</b> Suche nach Orten, die nicht in unserer Liste stehen.</li>
      </ul>
      <p>Einige dieser Unternehmen sitzen in den USA, deine Daten können also auf Server dort gelangen.</p>
      <h2>Deine Rechte</h2>
      <p>Du kannst Auskunft über deine Daten verlangen, außerdem Berichtigung, Löschung, Einschränkung und Übertragung. Du kannst allem widersprechen, was wir auf unser eigenes Interesse stützen. Eine Einwilligung kannst du jederzeit widerrufen, das ändert nichts an dem, was vorher geschehen ist. Du kannst dich auch bei der Datenschutzbehörde an deinem Wohnort beschweren.</p>
      <h2>So stoppst oder löschst du</h2>
      <ul>
        <li><b>Neuigkeiten:</b> Nutze den Abmeldelink in jeder unserer E-Mails oder schreib an <Mail />.</li>
        <li><b>Dein Name und deine E-Mail:</b> Schreib an <Mail />, dann löschen wir sie. Das Löschen auf diesem Gerät entfernt sie nicht aus unserer Liste.</li>
        <li><b>Dieses Gerät:</b> Nutze die Einstellungen unten.</li>
      </ul>
      <h2>Sensible Antworten</h2>
      <p>Testantworten zu Beziehungen, Gefühlen und deinem Körper können persönlich sein. Ohne Konto bleiben sie auf deinem Gerät. Mit Konto werden sie nur nach deiner ausdrücklichen Einwilligung gespeichert, und du kannst sie widerrufen, indem du dein Konto löschst. Profilcodes, die du teilst, enthalten deine Geburtsdaten und Ergebnisse, teile sie also nur mit Menschen, denen du vertraust.</p>
      <h2>Andere Menschen</h2>
      <p>Wenn du jemanden hinzufügst, bleiben dessen Daten auf deinem Gerät und, falls vorhanden, in deinem Konto. Bitte füg Menschen nur mit ihrem Wissen hinzu. Sie (oder du) können sie jederzeit löschen.</p>
      <h2>Konto löschen</h2>
      <p>Auf der Kontoseite entfernt „Mein Konto löschen“ dein Konto und alle darin gespeicherten Daten sofort und endgültig. Du kannst dich auch abmelden und die Kopie auf diesem Gerät behalten oder entfernen. Name und E-Mail aus dem Testformular liegen getrennt davon: Schreib uns, dann entfernen wir auch sie.</p>
      <h2>Deine Einstellungen</h2>
      <PrivacyControls />
      <h2>Kontakt</h2>
      <p>Fragen oder Anliegen zu deinen Daten? Schreib an <Mail />.</p>
    </article>
  );
}
function PageSr() {
  return (
    <article className="prose-soft" lang="sr">
      <PageHero emblem="moon" img="milkyway" title={<>Privatnost</>} />
      <p className="text-sm text-dim">Nacrt, verzija {PRIVACY_VERSION}: pravnik još treba da pregleda ovaj tekst.</p>
      <h2>Ukratko</h2>
      <p>Tvoji podaci o rođenju, odgovori na testove, rezultati, ljudi koje dodaš i tvoj dnevnik ostaju <b>u tvom pregledaču</b> na ovom uređaju, a i proračuni se izvršavaju ovde. <b>Nalog nije obavezan.</b> Neke stvari ipak napuštaju tvoj uređaj i ova stranica navodi svaku od njih: pre svega ime i mejl koje nam daješ da otvoriš ceo rezultat testa. Tvoji odgovori i rezultati nikad ne idu uz njih. Podatke nikad ne prodajemo.</p>
      <h2>Ko je odgovoran</h2>
      <p>horoscop.si je odgovoran za podatke opisane ovde. Za sve u vezi sa ovom stranicom piši na <Mail />.</p>
      <h2>Šta ostaje na tvom uređaju</h2>
      <p>Podaci o rođenju, odgovori na testove i rezultati, ljudi koje dodaš i zapisi u dnevniku nalaze se u lokalnoj memoriji tvog pregledača. Tu je i beleška da su tvoji podaci već ostavljeni, da te obrazac ne bi pitao dvaput. Ako slanje tog obrasca nije uspelo, tvoje ime i mejl tu čekaju do sledeće posete, a zatim se šalju i uklanjaju sa uređaja.</p>
      <h2>Šta napušta tvoj uređaj i zašto</h2>
      <ul>
        <li><b>Tvoje ime i mejl, kad otvaraš ceo rezultat testa.</b> Čuvamo i tvoj jezik, koje testove imaš urađene, tvoje izbore o saglasnosti, verziju ove stranice i datume. Koristimo ih da ti otvorimo rezultate, da ti pošaljemo mejl opisan ispod i da ti odgovorimo ako nam pišeš. Davanje ovih podataka je uslov za ceo rezultat, koji ne košta ništa. Pravni osnov: čl. 6(1)(b) GDPR, jer od nas tražiš taj rezultat. Tvoji odgovori i rezultati se nikad ne šalju.</li>
        <li><b>Jedan mejl posle tog obrasca.</b> Vodi nazad na test i na tvoje rezultate na ovom uređaju, a sam ne sadrži rezultate. Šalje se samo ako je provera protiv botova ispod prođena, najviše jednom po testu i obično ne češće od jednom u 30 dana, i nikad na adresu koja se odjavila. Šalje se preko servisa Resend. Isti pravni osnov.</li>
        <li><b>Tvoja IP adresa, na trenutak, kad šalješ taj obrazac.</b> Pretvaramo je u heš sa ključem koji se menja svakog dana i po njemu brojimo zahteve i mejlove, da bismo sprečili zloupotrebu. Kod IPv6 koristimo samo mrežni deo. Samu adresu nikad ne čuvamo. Pravni osnov: čl. 6(1)(f) GDPR, naš interes da usluga ostane bezbedna.</li>
        <li><b>Novosti mejlom, samo ako ih zatražiš dvaput.</b> Polje nije obavezno i nije unapred označeno, a tvoj rezultat nikad ne zavisi od njega. Ako ga označiš, mejl iznad sadrži dugme za potvrdu i samo taj klik se računa kao saglasnost. Kao dokaz čuvamo tekst pored polja i vreme kada je označeno i potvrđeno. Još ne šaljemo bilten. Pravni osnov: tvoja saglasnost, čl. 6(1)(a) GDPR.</li>
        <li><b>Brojanje korišćenja.</b> Kad se stranica otvori ili test završi, beležimo šta se desilo, stranicu, jezik i, za test, koji je to test, uz nasumičan broj sesije koji živi u kartici tvog pregledača i nestaje kad je zatvoriš. Za ovo nema kolačića. Uz aktivnu prijavu, zapis nosi i oznaku tvog naloga. Pravni osnov: čl. 6(1)(f) GDPR, naš interes da znamo koji se delovi sajta koriste.</li>
        <li><b>Provera protiv botova.</b> Obrazac na testu učitava Cloudflare Turnstile čim počneš da ga popunjavaš, a obrasci za prijavu i novosti kad je provera uključena. Turnstile čita tvoju IP adresu i tehničke podatke o pregledaču da bi razlikovao ljude od botova. Pravni osnov: čl. 6(1)(f) GDPR, zaštita obrazaca od zloupotrebe.</li>
        <li><b>Pretraga mesta.</b> Mesta se traže u listi na ovom sajtu. Ako nema poklapanja, ono što ukucaš ide servisu za pretragu Open-Meteo, zajedno sa tvojom IP adresom. Pravni osnov: čl. 6(1)(f) GDPR, pronalaženje malih mesta.</li>
        <li><b>Novosti o Premiumu.</b> Ako ostaviš mejl da bi saznao kad se Premium otvara, čuvamo tvoj mejl, jezik i mesto prijave, da bismo ti javili. Pravni osnov: čl. 6(1)(b) GDPR.</li>
        <li><b>Nalog, samo ako ga napraviš.</b> Tvoj mejl, profil, odgovori na testove i rezultati, dodati ljudi, rezultati Provere veze, zapisi u dnevniku i izbori o saglasnosti čuvaju se kod našeg dobavljača baze podataka u EU (Švedska), zaštićeni tako da ih može čitati samo tvoj prijavljeni nalog. Poruke koje šalješ dugmetom za utiske čuvaju se uz stranicu i tip pregledača. Mejlovi za prijavu idu preko servisa Resend. Pravni osnov: čl. 6(1)(b) GDPR, a za osetljive odgovore tvoja izričita saglasnost, čl. 9(2)(a) GDPR.</li>
        <li><b>Učitavanje sajta.</b> Naš dobavljač hostinga i naš dobavljač baze podataka vide standardne tehničke podatke, kao što je tvoja IP adresa, kad tvoj pregledač komunicira sa njima, i čuvaju ih u svojim evidencijama. Pravni osnov: čl. 6(1)(f) GDPR, rad sajta.</li>
      </ul>
      <p>Bez analitičkih kolačića, bez reklamnih pratilaca.</p>
      <h2>Koliko dugo čuvamo</h2>
      <ul>
        <li>Ime i mejl iz obrasca na testu: 24 meseca posle tvog poslednjeg slanja, a zatim se automatski brišu.</li>
        <li>Uz potvrđeno da za novosti: dok se ne odjaviš. Posle toga zapis čuvamo 24 meseca da ti ne bismo ponovo pisali, a zatim se briše.</li>
        <li>Heširane IP adrese: oko 24 sata. Linkovi za potvrdu prestaju da rade posle 30 dana.</li>
        <li>Mejlovi ostavljeni za novosti o Premiumu: 24 meseca. Brojanje korišćenja: 14 meseci.</li>
        <li>Podaci naloga: dok ne obrišeš nalog.</li>
        <li>Evidencije hostinga i baze podataka: koliko ih ti dobavljači čuvaju.</li>
      </ul>
      <h2>Ko nam pomaže</h2>
      <ul>
        <li><b>Supabase:</b> baza podataka, prijava i serverske funkcije, u EU (Švedska).</li>
        <li><b>Vercel:</b> hosting sajta i njegove evidencije.</li>
        <li><b>Resend:</b> slanje mejlova.</li>
        <li><b>Cloudflare:</b> provera protiv botova Turnstile.</li>
        <li><b>Open-Meteo:</b> pretraga mesta kojih nema u našoj listi.</li>
      </ul>
      <p>Neke od ovih kompanija su iz Sjedinjenih Američkih Država, pa tvoji podaci mogu da stignu do servera tamo.</p>
      <h2>Tvoja prava</h2>
      <p>Možeš da zatražiš kopiju svojih podataka, kao i njihovu ispravku, brisanje, ograničenje ili prenos. Možeš da uložiš prigovor na sve što radimo na osnovu sopstvenog interesa. Saglasnost možeš da povučeš u bilo kom trenutku, što ne utiče na ono što se već desilo. Možeš da podneseš i pritužbu organu za zaštitu podataka u mestu u kom živiš.</p>
      <h2>Kako da zaustaviš ili obrišeš</h2>
      <ul>
        <li><b>Novosti:</b> koristi link za odjavu u bilo kom našem mejlu ili piši na <Mail />.</li>
        <li><b>Tvoje ime i mejl:</b> piši na <Mail /> i obrisaćemo ih. Brisanje na ovom uređaju ih ne uklanja iz naše liste.</li>
        <li><b>Ovaj uređaj:</b> koristi kontrole ispod.</li>
      </ul>
      <h2>Osetljivi odgovori</h2>
      <p>Odgovori na testove o odnosima, osećanjima i tvom telu mogu da budu lični. Bez naloga ostaju na tvom uređaju. Sa nalogom se čuvaju samo uz tvoju izričitu saglasnost, koju možeš da povučeš brisanjem naloga. Kodovi profila koje odlučiš da podeliš sadrže tvoje podatke o rođenju i rezultate, zato ih deli samo sa ljudima kojima veruješ.</p>
      <h2>Drugi ljudi</h2>
      <p>Ako dodaš nekog drugog, podaci te osobe ostaju na tvom uređaju, i u tvom nalogu ako ga imaš. Dodaj ljude samo uz njihovo znanje. Oni (ili ti) mogu da ih obrišu u bilo kom trenutku.</p>
      <h2>Brisanje naloga</h2>
      <p>Na stranici Nalog, „Obriši moj nalog“ odmah i trajno uklanja tvoj nalog i sve što je u njemu sačuvano. Možeš i da se odjaviš i da zadržiš ili ukloniš kopiju na ovom uređaju. Ime i mejl iz obrasca na testu čuvaju se odvojeno: piši nam da uklonimo i njih.</p>
      <h2>Tvoje kontrole</h2>
      <PrivacyControls />
      <h2>Kontakt</h2>
      <p>Pitanja ili zahtevi u vezi sa tvojim podacima? Piši na <Mail />.</p>
    </article>
  );
}
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return lang === "mk" ? <PageMk /> : lang === "de" ? <PageDe /> : lang === "sr" ? <PageSr /> : <PageEn />;
}
