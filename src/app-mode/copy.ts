/** Text used only inside the store app (tabs, morning reminder, widget). Macedonian stays gender-neutral, without slash forms. */
export type AppCopy = {
  tabs: { today: string; horoscope: string; tests: string; bonds: string; profile: string; aria: string };
  reminder: {
    title: string; sub: string; toggle: string; time: string; sign: string; save: string; saved: string; off: string;
    denied: string; notifTitle: (sign: string) => string;
    promptTitle: string; promptBody: string; promptAllow: string; promptLater: string;
  };
  widget: { empty: string };
};

export const APP_COPY: Record<"en" | "mk" | "de" | "sr", AppCopy> = {
  en: {
    tabs: { today: "Today", horoscope: "Horoscope", tests: "Tests", bonds: "Bonds", profile: "Profile", aria: "Main sections" },
    reminder: {
      title: "Morning horoscope", sub: "A short insight every morning at the time you choose. It works offline, too.",
      toggle: "Daily reminder", time: "Time", sign: "Sign", save: "Save", saved: "Reminder set for every morning.", off: "Reminder is off.",
      denied: "Notifications are blocked. You can allow them in the phone settings.", notifTitle: (s) => `${s} · today`,
      promptTitle: "A horoscope each morning",
      promptBody: "Horoscop can show a short morning reading at the time you choose. It stays on this phone and works without the internet. Next, the phone will ask for permission to show notifications.",
      promptAllow: "Turn on the reminder", promptLater: "Not now",
    },
    widget: { empty: "Open Horoscop to choose your sign" },
  },
  mk: {
    tabs: { today: "Денес", horoscope: "Хороскоп", tests: "Тестови", bonds: "Врски", profile: "Профил", aria: "Главни делови" },
    reminder: {
      title: "Утрински хороскоп", sub: "Краток увид секое утро во избраното време. Работи и без интернет.",
      toggle: "Дневен потсетник", time: "Време", sign: "Знак", save: "Зачувај", saved: "Потсетникот е вклучен за секое утро.", off: "Потсетникот е исклучен.",
      denied: "Известувањата се блокирани. Може да се дозволат во поставките на телефонот.", notifTitle: (s) => `${s} · денес`,
      promptTitle: "Хороскоп секое утро",
      promptBody: "Horoscop може да покаже краток утрински увид во избраното време. Останува на овој телефон и работи без интернет. Потоа телефонот ќе побара дозвола за известувања.",
      promptAllow: "Вклучи го потсетникот", promptLater: "Не сега",
    },
    widget: { empty: "Отвори го Horoscop за избор на знак" },
  },
  de: {
    tabs: { today: "Heute", horoscope: "Horoskop", tests: "Tests", bonds: "Bindungen", profile: "Profil", aria: "Hauptbereiche" },
    reminder: {
      title: "Morgen-Horoskop", sub: "Jeden Morgen ein kurzer Impuls zur gewählten Uhrzeit. Funktioniert auch offline.",
      toggle: "Tägliche Erinnerung", time: "Uhrzeit", sign: "Sternzeichen", save: "Speichern", saved: "Erinnerung für jeden Morgen gesetzt.", off: "Erinnerung ist aus.",
      denied: "Mitteilungen sind blockiert. Du kannst sie in den Einstellungen des Telefons erlauben.", notifTitle: (s) => `${s} · heute`,
      promptTitle: "Jeden Morgen ein Horoskop",
      promptBody: "Horoscop kann zur gewählten Uhrzeit eine kurze Morgenlektüre zeigen. Sie bleibt auf diesem Telefon und funktioniert ohne Internet. Als Nächstes fragt das Telefon nach der Erlaubnis für Mitteilungen.",
      promptAllow: "Erinnerung einschalten", promptLater: "Jetzt nicht",
    },
    widget: { empty: "Öffne Horoscop und wähle dein Sternzeichen" },
  },
  sr: {
    tabs: { today: "Danas", horoscope: "Horoskop", tests: "Testovi", bonds: "Veze", profile: "Profil", aria: "Glavni delovi" },
    reminder: {
      title: "Jutarnji horoskop", sub: "Kratak uvid svakog jutra u izabrano vreme. Radi i bez interneta.",
      toggle: "Dnevni podsetnik", time: "Vreme", sign: "Znak", save: "Sačuvaj", saved: "Podsetnik je uključen za svako jutro.", off: "Podsetnik je isključen.",
      denied: "Obaveštenja su blokirana. Možeš ih dozvoliti u podešavanjima telefona.", notifTitle: (s) => `${s} · danas`,
      promptTitle: "Horoskop svakog jutra",
      promptBody: "Horoscop može da pokaže kratak jutarnji uvid u izabrano vreme. Ostaje na ovom telefonu i radi bez interneta. Zatim će telefon da zatraži dozvolu za obaveštenja.",
      promptAllow: "Uključi podsetnik", promptLater: "Ne sada",
    },
    widget: { empty: "Otvori Horoscop i izaberi znak" },
  },
};
export const appCopy = (locale: string): AppCopy => APP_COPY[locale as keyof typeof APP_COPY] ?? APP_COPY.en;
