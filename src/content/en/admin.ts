/** Admin control panel + feedback button strings. */
export const admin = {
  title: "Control panel", sub: "Testers, invites, switches, numbers and feedback in one place.",
  tabs: { testers: "Testers", invites: "Invites", switches: "Switches", stats: "Stats", feedback: "Feedback" } as Record<string, string>,
  refresh: "Refresh", loading: "Loading…", empty: "Nothing here yet.", error: "Couldn't load this. Try Refresh.",
  // Testers
  joined: "Joined", lastVisit: "Last visit", never: "not yet", profile: "Profile", quizzes: "Quizzes", people: "People",
  you: "you", adminBadge: "admin",
  profileOf: (n: number, t: number) => `${n}/${t}`,
  testersCount: (n: number) => `${n} ${n === 1 ? "account" : "accounts"}`,
  // Invites
  addTitle: "Invite people", addHint: "One email per line, or paste a list.", add: "Add to invite list",
  added: (n: number) => `${n} added to the invite list.`,
  invited: "Invited", waitlist: "Waitlist", joinedOn: (d: string) => `joined ${d}`, notJoined: "hasn't signed up yet",
  invite: "Invite", inviteSend: "Invite + email", email: "Email", gmail: "Gmail", copy: "Copy message", copied: "Copied ✓",
  uninvite: "Uninvite", remove: "Remove", confirmUninvite: (e: string) => `Remove ${e} from the invite list? If they already have an account, it stays; they just can't sign up again with this invite.`,
  confirmRemove: (e: string) => `Remove ${e} from the waitlist?`,
  emailHint: "“Email” opens your own mail app with a ready message. “Gmail” opens it in Gmail on the web. Nothing is sent until you press send.",
  fromWaitlist: (d: string) => `on the waitlist since ${d}`,
  // Switches
  switches: {
    private_beta: { name: "Private beta", on: "On: the app pages need a login. The landing page, quizzes overview and legal pages stay public.", off: "Off: everyone can use the app without an account (data stays on their device)." },
    signups_open: { name: "Open sign-ups", on: "On: anyone can create an account, no invite needed.", off: "Off: only emails on the invite list can create an account." },
    captcha: { name: "Captcha (bot check)", on: "On: the app shows the Turnstile check on login and the waitlist.", off: "Off: no bot check in the app." },
  } as Record<string, { name: string; on: string; off: string }>,
  captchaWarn: "Keep this in step with the bot protection setting in the sign-in backend. If the backend requires a captcha and this is off, logins fail.",
  saved: "Saved", changedBy: (d: string) => `changed ${d}`,
  // Stats
  range: (d: number) => `Last ${d} days`,
  stat: { visits: "Visits", visits_7d: "Visits, last 7 days", visits_today: "Visits today", signed_in_visitors: "Signed-in visitors", quizzes_done: "Quizzes completed", quizzes_saved: "Quiz results saved to accounts", compat_reports: "Compatibility reports", bond_checks: "Bond Checks", shared_cards: "Cards shared", testers: "Accounts", invites: "Invites", invites_used: "Invites used", waitlist: "On the waitlist", feedback_open: "Open feedback", friend_invites_sent: "Friend invites sent", friend_invites_accepted: "Friend invites accepted" } as Record<string, string>,
  byQuiz: "Completed per quiz",
  statsNote: "Visits are counted once per browser tab session, with no cookies and no tracking across sites.",
  // Feedback inbox
  open: "Open", resolved: "Resolved", all: "All", markResolved: "Mark resolved", reopen: "Reopen", del: "Delete", confirmDelete: "Delete this feedback?",
  page: "Page", from: "From",
  // Floating button (all signed-in users)
  fbButton: "Feedback", fbTitle: "Tell us what you think", fbHint: "What do you love, what feels off, what's missing? We read every message.",
  fbPh: "Type here…", fbSend: "Send", fbThanks: "Thank you! We got it. 💫", fbClose: "Close", fbPage: (p: string) => `Sent with the page you're on: ${p}`,
  fbError: "That didn't go through. Please try again.",
};
export type Admin = typeof admin;

/** Warm bilingual invite (English first, then Macedonian). Used for the mailto link and "Copy message". */
export function inviteMessage(email: string, site = "https://horoscop.si") {
  const subject = "Your Horoscop invite ✦ Твојата покана за Horoscop";
  const body = [
    "Hi!",
    "",
    "You're invited to the private beta of Horoscop: your birth chart, Chinese sign, numbers and a few short quizzes turned into one personal reading, plus compatibility with the people you care about.",
    "",
    "How to get in:",
    `1. Open ${site}/en/account/`,
    `2. Type this email address: ${email}`,
    "3. You'll get a 6-digit code by email. Enter it and you're in. (If it doesn't arrive within a minute, check spam.)",
    "",
    "It's free while we test. There's a Feedback button on every page, so tell me what you love and what feels off.",
    "",
    "See you there ✦",
    "",
    "✦ ✦ ✦",
    "",
    "Здраво!",
    "",
    "Поканет/а си во приватната бета верзија на Horoscop: твојата натална карта, кинескиот знак, бројките и неколку кратки квизови во едно лично читање, плус компатибилност со луѓето што ти се важни.",
    "",
    "Како да влезеш:",
    `1. Отвори ${site}/mk/account/`,
    `2. Внеси ја оваа е-пошта: ${email}`,
    "3. Ќе добиеш код од 6 цифри на е-пошта. Внеси го и си внатре. (Ако не стигне за една минута, провери во спам.)",
    "",
    "Бесплатно е додека тестираме. На секоја страница има копче „Мислење“, па кажи ми што ти се допаѓа, а што не.",
    "",
    "Се гледаме таму ✦",
  ].join("\n");
  return { subject, body };
}
