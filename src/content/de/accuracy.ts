export const accuracy = {
  tzGap: "Achtung: Diese Uhrzeit gab es dort nie. In der Nacht wurde die Uhr eine Stunde vorgestellt, also lesen wir sie als den Moment direkt nach dem Sprung. Steht in deiner Geburtsurkunde etwas anderes, stell die Abweichung von der Weltzeit von Hand ein.",
  tzAmbiguous: "Achtung: Diese Uhrzeit gab es dort zweimal, weil die Uhr in der Nacht eine Stunde zurückgestellt wurde. Wir nehmen die erste (Sommerzeit). Bist du in der zweiten Stunde geboren, stell die Abweichung von der Weltzeit von Hand ein.",
  solarTime: (t: string) => `Stundensäule nach wahrer Sonnenzeit an deinem Geburtsort (${t}).`,
  monthAmbiguous: "An deinem Geburtstag lag ein Sonnenabschnitt, deshalb hängt deine Monatssäule von deiner Geburtsstunde ab.",
};
