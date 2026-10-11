import { PageHero } from "@/components/ui";
import { PrivacyControls } from "@/components/PrivacyControls";
export const metadata = { title: "Privacy" };
export default function Page() {
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
