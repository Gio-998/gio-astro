export const site = {
  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  weekdays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  themeOn: "My colours: on", themeOff: "My colours: off", themeHint: "Colour the whole site with your personal element palette, or switch back to the default look.",
  datePicker: { day: "Day", month: "Month", year: "Year", done: "Done", placeholder: "Choose a date", title: "Your date", timePh: "Choose a time", hour: "Hour", minute: "Minute" },
  brand: "Horoscop",
  language: "Language", languages: { en: "English", mk: "Македонски", de: "Deutsch", sr: "Srpski" } as Record<string, string>,
  hero: { title: ["See yourself and the people around you ", "in new colours."], sub: "Daily horoscopes, short personality tests and numerology in one honest place.", daily: "Read today's horoscope", perks: ["Free", "No account needed", "Tests start right away"] },
  footerCols: { astro: "Astrology", discover: "Tests and tools", trust: "About", chart: "Build your profile", quizzes: "All tests", match: "Compare two people", bond: "Bond Check for two", notes: "Today's note by sign", blurb: "Free to use, no account needed, and clear about what is research and what is tradition." },
  tagline: "An honest mirror for you and your relationships",
  description: "Free birth chart, daily horoscope, personality tests and compatibility for partners, friends and family. Free to use, no account needed.",
  footer: {
    privacy: "Privacy", terms: "Terms", promise: "Our promise", learn: "Methodology", credits: "Credits",
  },
  common: {
    start: "Add your birth date", continue: "Continue", back: "Back", next: "Next", save: "Save", cancel: "Cancel", delete: "Delete",
    edit: "Edit", loading: "Loading…", share: "Share card", download: "Download image", copy: "Copy", copied: "Copied!",
    unknownTime: "I don't know my birth time", optional: "optional", free: "Free", locked: "Not unlocked yet", unlock: "Unlock",
    minutes: (n: number) => `${n} min`, retake: "Retake", you: "You",
  },
};
