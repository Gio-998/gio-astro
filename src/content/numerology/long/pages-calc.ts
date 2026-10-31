import type { AngelLong } from "./types";

/** Guide sections for the numerology calculator pages. tests/calculators-overlap.test.ts recomputes every worked example with the engine. */
export const pagesCalc: Record<string, AngelLong> = {
  en: {
    "calculator/life-path": [
      { title: "A full worked example, step by step", paras: [
        "Take a birth date of 23 July 1985. All you need is the date and a little patience. The life path comes from reducing each part of the date to a single digit, then adding those digits and reducing once more.",
        "Step one is the month. July is the seventh month, so the month gives 7, and that is already a single digit.",
        "Step two is the day. The 23rd has two digits, and 2 plus 3 is 5.",
        "Step three is the year. 1 plus 9 plus 8 plus 5 is 23. That is still two digits, so 2 plus 3 gives 5.",
        "Step four brings the parts together. 7 plus 5 plus 5 is 17, and 1 plus 7 is 8. This person has life path 8. The calculator at the top of this page does exactly these steps and shows you the same working, so you can check any date by hand.",
      ] },
      { title: "How master numbers change the sum", paras: [
        "Numerology treats 11, 22 and 33 as special, so they are kept whole. They never get reduced on the way through, and the only time you see them shrink is when you read their root number afterwards.",
        "Take 29 November 1987. The month is 11, and it stays 11. The day 29 gives 2 plus 9, which is 11 again, so that stays too. The year gives 1 plus 9 plus 8 plus 7, which is 25, then 7. Adding the three parts gives 11 plus 11 plus 7, which is 29, and 2 plus 9 brings you to 11. The result is life path 11.",
        "Now 11 September 2000, which shows why the order of work matters. In parts, the month is 9, the day stays 11 and the year is 2. These add up to 22, a master number. If you add every digit in one long line instead, you get 1 plus 1 plus 0 plus 9 plus 2, which is 13, and then 4. Both routes share the root 4, yet only the first one shows the 22. That is why this calculator reduces each part on its own.",
      ] },
      { title: "What your result does and does not tell you", paras: [
        "In numerology the life path is read as the long theme of a life: the kind of situations you keep meeting, the strengths that come easily and the lessons that return until you deal with them. A life path 8, like the example above, tends to deal with power, money and responsibility. That can mean running a company. It can just as well mean learning when to stop being in charge at home.",
        "It does not forecast events, and it cannot tell you whom to marry or which job to take. Think of it as a prompt for honest questions. Read the page for your number, notice what fits and what irritates you, and look for the pattern across several years of your life. Single events prove very little.",
        "If you want more than one number, the name calculator adds your expression, soul urge and personality numbers, and the personal year calculator shows the theme of your current year.",
      ] },
      { title: "Mistakes people make when they work it out by hand", paras: [
        "The most common one is reducing a master number too early, turning 11 into 2 halfway through. A close second is using only the day of birth, which gives the birthday number, a different and smaller part of a reading.",
        "Use the whole year as well. In the example above, 1985 gives 5, while a shortened 85 gives 13 and then 4, and the result would slip from 8 to 7. If you were born just after midnight, use the date on your birth certificate. Your birth time and birth place play no part here, so you can leave those aside.",
      ] },
    ],
  },
  de: {
    "calculator/life-path": [
      { title: "Lebenszahl berechnen: ein Beispiel Schritt für Schritt", paras: [
        "Nehmen wir den 23. Juli 1985. Im Grunde bildest du eine Quersumme aus deinem Geburtsdatum, nur in Teilen: erst für Monat, Tag und Jahr einzeln, dann für das Ergebnis.",
        "Schritt eins ist der Monat. Der Juli ist der siebte Monat, das ergibt 7, und das ist schon eine einstellige Zahl.",
        "Schritt zwei ist der Tag. Die 23 hat zwei Ziffern, und 2 plus 3 ergibt 5.",
        "Schritt drei ist das Jahr. 1 plus 9 plus 8 plus 5 ergibt 23. Das sind noch zwei Ziffern, also 2 plus 3 gleich 5.",
        "Schritt vier führt alles zusammen. 7 plus 5 plus 5 ergibt 17, und 1 plus 7 ergibt 8. Die Lebenszahl ist also 8. Der Rechner oben auf dieser Seite geht genau diese Schritte und zeigt dir denselben Rechenweg, sodass du jedes Datum von Hand prüfen kannst.",
      ] },
      { title: "Was Meisterzahlen an der Rechnung ändern", paras: [
        "In der Numerologie gelten 11, 22 und 33 als Meisterzahlen. Sie bleiben ganz und werden unterwegs nicht weiter reduziert. Nur beim Lesen schaut man zusätzlich auf ihre Wurzel 2, 4 oder 6.",
        "Ein Beispiel ist der 29. November 1987. Der Monat ist 11 und bleibt 11. Der Tag 29 ergibt 2 plus 9, also wieder 11, auch das bleibt stehen. Das Jahr ergibt 1 plus 9 plus 8 plus 7, das sind 25, dann 7. Zusammen macht das 11 plus 11 plus 7 gleich 29, und 2 plus 9 führt zur 11. Das Ergebnis ist die Lebenszahl 11.",
        "Der 11. September 2000 zeigt, warum die Reihenfolge zählt. In Teilen ist der Monat 9, der Tag bleibt 11, das Jahr ergibt 2. Zusammen sind das 22, eine Meisterzahl. Addierst du dagegen alle Ziffern in einer langen Reihe, kommst du auf 1 plus 1 plus 0 plus 9 plus 2 gleich 13 und dann auf 4. Beide Wege teilen die Wurzel 4, aber nur der erste zeigt die 22. Deshalb reduziert dieser Rechner jeden Teil für sich.",
      ] },
      { title: "Was dir deine Lebenszahl sagt und was nicht", paras: [
        "Die Lebenszahl heißt je nach Buch auch Lebensweg oder Schicksalszahl. Gelesen wird sie als das große Thema eines Lebens: welche Situationen dir immer wieder begegnen, was dir leichtfällt und welche Lektionen zurückkommen, bis du dich ihnen stellst. Eine 8 wie im Beispiel oben hat oft mit Macht, Geld und Verantwortung zu tun. Das kann die eigene Firma sein, aber genauso gut die Frage, wann du zu Hause mal nicht das Sagen haben musst.",
        "Ereignisse sagt sie nicht voraus, und sie verrät dir auch nicht, wen du heiraten oder welchen Job du nehmen sollst. Nimm sie als Anstoß für ehrliche Fragen. Lies die Seite zu deiner Zahl, achte darauf, was passt und was dich ärgert, und such das Muster über mehrere Jahre. Ein einzelnes Ereignis beweist wenig.",
        "Wenn du mehr als eine Zahl möchtest, ergänzt der Namensrechner deine Ausdruckszahl, Seelenzahl und Persönlichkeitszahl, und der Rechner fürs persönliche Jahr zeigt das Thema deines laufenden Jahres.",
      ] },
      { title: "Typische Fehler beim Rechnen von Hand", paras: [
        "Am häufigsten wird eine Meisterzahl zu früh reduziert, aus der 11 wird unterwegs eine 2. Fast genauso oft wird nur der Geburtstag genommen. Das ergibt die Geburtstagszahl, einen anderen und kleineren Teil der Deutung.",
        "Nimm auch das ganze Jahr. Im Beispiel oben ergibt 1985 die 5, ein abgekürztes 85 dagegen 13 und dann 4, und aus der Lebenszahl 8 würde eine 7. Bist du kurz nach Mitternacht geboren, nimm das Datum aus deiner Geburtsurkunde. Uhrzeit und Geburtsort spielen hier keine Rolle, die kannst du beiseitelassen.",
      ] },
    ],
  },
  mk: {
    "calculator/life-path": [
      { title: "Цел пример, чекор по чекор", paras: [
        "Да земеме датум на раѓање 23 јули 1985. Ти треба само датумот и малку трпение. Патеката на животот се добива кога секој дел од датумот се сведува на една цифра, потоа тие цифри се собираат и збирот уште еднаш се сведува.",
        "Прв чекор е месецот. Јули е седмиот месец, значи месецот дава 7, а тоа веќе е една цифра.",
        "Втор чекор е денот. Бројот 23 има две цифри, а 2 плус 3 е 5.",
        "Трет чекор е годината. 1 плус 9 плус 8 плус 5 е 23. Тоа се уште две цифри, па 2 плус 3 дава 5.",
        "Четврт чекор ги спојува деловите. 7 плус 5 плус 5 е 17, а 1 плус 7 е 8. Овој човек има патека на животот 8. Калкулаторот на врвот на страницата ги прави токму овие чекори и ти ја покажува истата пресметка, па секој датум можеш да го провериш и рачно.",
      ] },
      { title: "Како мастер броевите ја менуваат пресметката", paras: [
        "Нумерологијата ги смета 11, 22 и 33 за посебни, па тие остануваат цели. Не се сведуваат успат, а нивниот корен го гледаш дури кога го читаш значењето.",
        "Земи го 29 ноември 1987. Месецот е 11 и останува 11. Денот 29 дава 2 плус 9, што е повторно 11, и тоа останува. Годината дава 1 плус 9 плус 8 плус 7, што е 25, па 7. Збирот на трите дела е 11 плус 11 плус 7, што е 29, а 2 плус 9 те носи до 11. Резултатот е патека на животот 11.",
        "Сега 11 септември 2000, кој покажува зошто е важен редот на работа. По делови, месецот е 9, денот останува 11, а годината е 2. Тоа заедно е 22, мастер број. Ако ги собереш сите цифри во еден ред, добиваш 1 плус 1 плус 0 плус 9 плус 2, што е 13, па 4. Двата пата го делат коренот 4, но само првиот ја покажува 22. Затоа овој калкулатор го сведува секој дел посебно.",
      ] },
      { title: "Што ти кажува резултатот, а што не", paras: [
        "Во нумерологијата патеката на животот се чита како долга тема на еден живот: какви ситуации постојано среќаваш, што ти оди лесно и кои лекции се враќаат додека не се справиш со нив. Патека 8, како во примерот погоре, често се врти околу моќ, пари и одговорност. Тоа може да значи водење фирма. Може да значи и да научиш кога дома да престанеш да командуваш.",
        "Таа не предвидува настани и не може да ти каже со кого да се венчаш или која работа да ја земеш. Гледај ја како повод за искрени прашања. Прочитај ја страницата за твојот број, забележи што одговара и што те нервира, и барај шема низ неколку години од животот. Еден настан докажува малку.",
        "Ако сакаш повеќе од еден број, калкулаторот за име ги додава бројот на изразот, бројот на душата и бројот на личноста, а калкулаторот за лична година ја покажува темата на тековната година.",
      ] },
      { title: "Грешки при рачно пресметување", paras: [
        "Најчеста е прерано да се сведе мастер број, па 11 успат да стане 2. Веднаш потоа доаѓа користењето само на денот на раѓање, што го дава бројот на роденденот, друг и помал дел од читањето.",
        "Земи ја и целата година. Во примерот погоре 1985 дава 5, а скратеното 85 дава 13, па 4, и резултатот би паднал од 8 на 7. Ако си роден веднаш по полноќ, земи го датумот од изводот од матичната книга. Часот и местото на раѓање овде не играат улога, па можеш да ги оставиш настрана.",
      ] },
    ],
  },
};
