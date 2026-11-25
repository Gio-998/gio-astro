import type { CapacitorConfig } from "@capacitor/cli";

// Store app shell. The web content is the slim static export from `npm run build:app` (out-app/), packed into the app: it starts instantly,
// works offline and computes the daily text on the device. See docs/MOBILE.md.
const config: CapacitorConfig = {
  appId: "si.horoscop.app",
  appName: "Horoscop",
  webDir: "out-app",
  server: {
    // Android serves the bundle from https://localhost (secure context for crypto.subtle / PKCE); iOS from capacitor://localhost.
    androidScheme: "https",
    iosScheme: "capacitor",
    hostname: "localhost",
  },
  ios: { contentInset: "never", scheme: "App" },
  plugins: {
    SplashScreen: { launchAutoHide: false, launchShowDuration: 3000, backgroundColor: "#0e0b26", showSpinner: false, androidScaleType: "CENTER_CROP" },
    StatusBar: { style: "DARK", backgroundColor: "#0e0b26", overlaysWebView: true },
    LocalNotifications: { smallIcon: "ic_stat_moon", iconColor: "#e9c78a" },
  },
};

export default config;
