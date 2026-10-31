/**
 * Serbian text for the inline `locale === "mk" ? … : locale === "de" ? …` branches in code, which only compile once "sr" is a Locale.
 * The comment on each line names the call site, so wiring the locale in is a matter of using these values there.
 */
export const inline = {
  dateLocale: "sr-Latn-RS", // toLocaleString calls: AdminPanel, Auth, Beta, AdminPremium, story/systems, engine/rarity
  retrograde: "retrogradno", // pages/ChartPage.tsx
  pricing: "Cene", // pricing/RedirectToPricing.tsx
  timesPlaceholder: "npr. uto ili čet uveče", // premium/Checkout.tsx, session times
  rangeTo: "do", // lib/horoscope.ts, lucky window
  codeSubject: "Tvoj kod za Horoscop: {{ .Token }}", // emails/templates.ts, sign-in code subject
  bigUnits: { 1e12: "biliona", 1e9: "milijardi", 1e6: "miliona" } as Record<number, string>, // engine/rarity.ts, bigNumber
};
