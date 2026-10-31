export const accuracy = {
  tzGap: "Pažnja: to vreme tamo nije postojalo, jer su te noći satovi pomereni sat unapred. Zato ga računamo kao trenutak odmah posle pomeranja. Ako u tvom izvodu iz matične knjige piše drugačije, ručno unesi razliku od UTC.",
  tzAmbiguous: "Pažnja: to vreme se tamo ponovilo dva puta, jer su te noći satovi vraćeni sat unazad. Uzeli smo prvo (letnje računanje vremena). Ako je rođenje bilo u drugom satu, ručno unesi razliku od UTC.",
  solarTime: (t: string) => `Stub sata je izračunat po pravom sunčevom vremenu u mestu rođenja (${t}).`,
  monthAmbiguous: "Tačno na tvoj rođendan se menja sunčev mesec, pa stub meseca zavisi od sata rođenja.",
};
