import { describe, it, expect } from "vitest";
import { leadCopyProblem } from "../scripts/lead-copy-rules.mjs";
import { checkLeadCopy } from "../scripts/check-copy.mjs";

/** The rules also run over the built pages in check:site. This pins what they catch and what they must leave alone. */
describe("lead copy rules", () => {
  it.each([
    // The promises the lead form retired.
    "No email wall", "no email needed", "See your result with no email", "No-email results", "Results without an email", "email gate",
    "Keine E-Mail-Pflicht", "Keine E-Mail nötig", "Ergebnis ohne E-Mail", "Без барање е-пошта", "без е-пошта", "bez mejla", "bez e-pošte",
    // The old privacy page, word for word.
    "and the sign-in and waitlist forms do when the check is switched on", "The waitlist. If you join it", "to send you an invite", "Waitlist entries: 24 months.",
    "die Formulare für Anmeldung und Warteliste tun das", "Die Warteliste.", "um dir eine Einladung zu schicken", "Einträge auf der Warteliste: 24 Monate.",
    "а формуларите за најава и листата на чекање кога", "Листата на чекање.", "за да ти пратиме покана", "Записите на листата на чекање: 24 месеци.",
    "a obrasci za prijavu i listu čekanja kad je", "Lista čekanja.", "da bismo ti poslali pozivnicu", "Zapisi na listi čekanja: 24 meseca.",
    // Getting in by invite, and the beta itself.
    "Join the waitlist", "wait list", "invite-only", "invite code", "by invitation", "request an invite", "private beta", "During the beta everything is free",
    "nur mit Einladung", "Einladungscode", "Während der Beta ist alles", "само со покана", "Додека трае бетата", "samo uz poziv", "Tokom bete sve",
  ])("catches: %s", (text) => { expect(leadCopyProblem(text)).not.toBeNull(); });

  it.each([
    // True, and staying.
    "No account needed", "Free, no sign-up.", "Kein Konto nötig", "Без сметка", "Bez naloga",
    // Other meanings of the same words, all live on the site.
    "No emails to write, no phone calls", "No email address here: start again.", "Invite a friend", "A personal invite", "Share my link",
    "Venus warms the home. Invite someone over.", "Two weeks later, no one has sent an invitation.", "Sag Ja zur Einladung, auch wenn du müde bist.", "Кажи да на поканата",
    "Today the centre owns its building and has a waitlist for volunteers.", "es hat eine Warteliste für Freiwillige", "standen sechs Kunden auf seiner Warteliste",
    "während die eigenen Wünsche auf einer Warteliste stehen", "има листа на чекање за волонтери", "имаше листа на чекање од шест купувачи", "svoju zgradu i listu čekanja za volontere", "imao listu čekanja od šest mušterija",
  ])("leaves alone: %s", (text) => { expect(leadCopyProblem(text)).toBeNull(); });
});

describe("the site's own copy", () => {
  it("breaks no lead copy rule in any language", () => { expect(checkLeadCopy()).toEqual([]); });
});
