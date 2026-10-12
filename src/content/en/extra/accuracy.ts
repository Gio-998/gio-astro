export const accuracy = {
  tzGap: "Heads up: that clock time never happened there. Clocks jumped forward an hour that night, so we read it as the moment just after the jump. If your birth record says otherwise, set the UTC offset by hand.",
  tzAmbiguous: "Heads up: that clock time happened twice there, because clocks went back an hour that night. We used the first one (summer time). If you were born in the second hour, set the UTC offset by hand.",
  solarTime: (t: string) => `Hour pillar from true solar time at your birthplace (${t}).`,
  monthAmbiguous: "A solar term fell on your birthday, so your month pillar depends on the hour you were born.",
};
