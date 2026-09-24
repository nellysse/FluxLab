import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const MENTOR_URL = `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/ask-mentor`;
const STARS_KEY = "fluxlabStars";
const SOUND_KEY = "fluxlabSound";

const C = {
  deep: "#0f1a30",
  panel: "#1c2c4e",
  warm: "#ff7aa8",
  electric: "#4fe3b0",
  danger: "#ff6b4a",
  text: "#f3ecdf",
  muted: "#a9b3c9",
  gold: "#e8c77a",
  border: "rgba(244,236,224,0.14)",
};

const ICONS = {
  activity:
    '<path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/>',
  arrow_left: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
  battery: '<path d="M22 14v-4"/><rect x="2" y="6" width="16" height="12" rx="2"/>',
  cable:
    '<path d="M17 19a1 1 0 0 1-1-1v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a1 1 0 0 1-1 1z"/><path d="M17 21v-2"/><path d="M19 14V6.5a1 1 0 0 0-7 0v11a1 1 0 0 1-7 0V10"/><path d="M21 21v-2"/><path d="M3 5V3"/><path d="M4 10a2 2 0 0 1-2-2V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a2 2 0 0 1-2 2z"/><path d="M7 5V3"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  circle_check_big:
    '<path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/>',
  droplets:
    '<path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/>',
  flame:
    '<path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4"/>',
  layers:
    '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/>',
  lightbulb:
    '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
  message_circle:
    '<path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/>',
  mountain: '<path d="m8 3 4 8 5-5 5 15H2L8 3z"/>',
  move_right: '<path d="M18 8L22 12L18 16"/><path d="M2 12H22"/>',
  signal:
    '<path d="M2 20h.01"/><path d="M7 20v-4"/><path d="M12 20v-8"/><path d="M17 20V8"/><path d="M22 4v16"/>',
  sliders_horizontal:
    '<path d="M10 5H3"/><path d="M12 19H3"/><path d="M14 3v4"/><path d="M16 17v4"/><path d="M21 12h-9"/><path d="M21 19h-5"/><path d="M21 5h-7"/><path d="M8 10v4"/><path d="M8 12H3"/>',
  smartphone:
    '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>',
  sprout:
    '<path d="M14 9.536V7a4 4 0 0 1 4-4h1.5a.5.5 0 0 1 .5.5V5a4 4 0 0 1-4 4 4 4 0 0 0-4 4c0 2 1 3 1 5a5 5 0 0 1-1 3"/><path d="M4 9a5 5 0 0 1 8 4 5 5 0 0 1-8-4"/><path d="M5 21h14"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  trees:
    '<path d="M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z"/><path d="M7 16v6"/><path d="M13 19v3"/><path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5"/>',
  wifi: '<path d="M12 20h.01"/><path d="M2 8.82a15 15 0 0 1 20 0"/><path d="M5 12.859a10 10 0 0 1 14 0"/><path d="M8.5 16.429a5 5 0 0 1 7 0"/>',
  wind: '<path d="M12.8 19.6A2 2 0 1 0 14 16H2"/><path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"/><path d="M9.8 4.4A2 2 0 1 1 11 8H2"/>',
  zap: '<path d="M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z"/>',
  star: '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>',
  volume_2:
    '<path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><path d="M16 9a5 5 0 0 1 0 6"/><path d="M19.364 18.364a9 9 0 0 0 0-12.728"/>',
  volume_x:
    '<path d="M11 4.702a.7.7 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.7.7 0 0 0 11 19.298z"/><path d="m16.5 14.5 5-5"/><path d="m16.5 9.5 5 5"/>',
  trophy:
    '<path d="M10 14.66V17a1 1 0 0 1-1 1 2 2 0 0 0-2 2v2"/><path d="M14 14.66V17a1 1 0 0 0 1 1 2 2 0 0 1 2 2v2"/><path d="M17.916 10H19.5A2.5 2.5 0 0 0 22 7.5V5a1 1 0 0 0-1-1h-3"/><path d="M4 22h16"/><path d="M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z"/><path d="M6.084 10H4.5A2.5 2.5 0 0 1 2 7.5V5a1 1 0 0 1 1-1h3"/>',
  rotate_ccw:
    '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
  sparkles:
    '<path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/><path d="M20 2v4"/><path d="M22 4h-4"/><circle cx="4" cy="20" r="2"/>',
};

function Ico({ name, size = 20, className = "", style }) {
  const html = ICONS[name];
  if (!html) return null;
  return (
    <svg
      className={`shrink-0 ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

const STR = {
  ru: {
    common: {
      appName: "FluxLab",
      part_resistor: "Резистор",
      part_wire: "Провод",
      part_lamp: "Лампочка",
      part_battery: "Батарея",
      part_capacitor: "Конденсатор",
      part_stabilizer: "Стабилизатор",
      part_diode: "Диод",
      slotEmpty: "пусто",
      testBtn: "Подать ток",
      resetBtn: "Сброс",
      mentorBtn: "AI Ментор",
      backBtn: "Карта",
      warehouseTitle: "Склад деталей — выбери и тапни на слот",
      workbenchTitle: "Собери цепь",
      tryAgain: "Попробуй ещё раз — подумай, какая деталь решает именно эту проблему.",
      footer: "FluxLab · Naryn · Issyk-Kul · Osh",
      labReset: "Сбросить значения",
      attemptLabel: "Попытка",
      mentorLoading: "Ментор думает…",
      mentorFallbackTitle: "Локальный ментор",
    },
    welcome: {
      kicker: "FLUXLAB",
      title: "Инженер внутри тебя",
      subtitle:
        "Три реальные поломки в трёх регионах Кыргызстана. Собери схему своими руками — и спаси ситуацию.",
      startBtn: "Начать путешествие",
    },
    map: {
      title: "Выбери задание",
      subtitle: "Три региона — три разные поломки",
      progress: (n) => `${n} из 3 заданий выполнено`,
      trophyTitle: "Все миссии пройдены!",
      trophySub: (n, max) => `Ты прошёл все миссии FluxLab · ${n} из ${max} ⭐`,
    },
    missions: {
      naryn: {
        pinLabel: "Нарын",
        missionLabel: "МИССИЯ 1 · НАРЫН, ЖАЙЛОО",
        missionText:
          "У чабана на пастбище сломался интернет-роутер. Солнечная батарея даёт 24 В, а роутеру нужно ровно 12 В. Подключишь напрямую — сгорит. Собери схему и спаси связь с миром.",
        panelLabel: "Панель",
        panelVolt: "24 В",
        deviceLabel: "Роутер",
        deviceVolt: "нужно 12 В",
        successTitle: "Ура! Интернет работает",
        successBody:
          "Резистор снизил напряжение с 24 В до нужных 12 В. Связь с миром восстановлена.",
        fails: {
          empty: {
            title: "Роутер сгорел",
            body: "В цепи ничего не было. Все 24 В ударили прямо в роутер — прибор не выдержал напряжения.",
          },
          wire: {
            title: "Роутер сгорел",
            body: "Провод сам по себе не сопротивляется току — напряжение дошло до роутера таким же, каким вышло из панели: 24 В.",
          },
          lamp: {
            title: "Роутер сгорел",
            body: "Лампочка светится, но почти не снижает напряжение — до роутера всё равно дошло слишком много.",
          },
          battery: {
            title: "Роутер сгорел ещё сильнее",
            body: "Батарея добавляет своё напряжение поверх панели — стало ещё хуже, а не лучше.",
          },
          capacitor: {
            title: "Роутер сгорел",
            body: "Конденсатор накапливает заряд, а не снижает напряжение постоянно — скачок всё равно дошёл до роутера.",
          },
        },
        mentorQuestion: "Как снизить напряжение с 24V до 12V с помощью делителя?",
        labTitle: "Лаборатория: закон делителя напряжения",
        formula: (
          <>
            U<sub>out</sub> = U<sub>in</sub> × R<sub>2</sub> / (R<sub>1</sub> + R<sub>2</sub>)
          </>
        ),
        lUin: "Напряжение панели U",
        lR1: "Резистор R1",
        lR2: "Резистор R2",
        lUout: "Напряжение на роутере U",
        okMsg: "Безопасно для роутера",
        badHi: "Слишком много — сгорит",
        badLo: "Слишком мало — не запустится",
      },
      issykkul: {
        pinLabel: "Иссык-Куль",
        missionLabel: "МИССИЯ 2 · ИССЫК-КУЛЬ, ЮРТОЧНЫЙ ЛАГЕРЬ",
        missionText:
          "На берегу Иссык-Куля туристы заряжают телефоны от ветрогенератора. Ветер усиливается, и напряжение скачет до 20 В, а зарядной станции нужно стабильных 5 В. Не выровняешь напряжение — скачок сожжёт все телефоны разом.",
        panelLabel: "Ветрогенератор",
        panelVolt: "скачет до 20 В",
        deviceLabel: "Зарядная станция",
        deviceVolt: "нужно 5 В",
        successTitle: "Ура! Телефоны заряжаются",
        successBody:
          "Стабилизатор выровнял скачущее напряжение до ровных 5 В — теперь зарядка работает даже при сильном ветре.",
        fails: {
          empty: {
            title: "Станция сгорела",
            body: "В цепи ничего не было — скачок в 20 В ударил прямо по зарядной станции.",
          },
          resistor: {
            title: "Станция сгорела",
            body: "Резистор снижает напряжение только на фиксированную величину. Когда ветер усилился и скачок вырос, резистор за ним не успел — станция всё равно сгорела.",
          },
          wire: {
            title: "Станция сгорела",
            body: "Провод не меняет напряжение вообще — скачки долетели до станции без изменений.",
          },
          battery: {
            title: "Станция сгорела ещё сильнее",
            body: "Батарея добавила своё напряжение поверх генератора — стало только хуже.",
          },
          lamp: {
            title: "Станция сгорела",
            body: "Лампочка светится, но не выравнивает скачки напряжения — станция всё равно получила опасный скачок.",
          },
        },
        mentorQuestion: "Почему для скачущего напряжения нужен стабилизатор, а не резистор?",
        labTitle: "Лаборатория: резистор против стабилизатора",
        formulaResistor: (
          <>
            U<sub>out</sub> = U<sub>in</sub> − U<sub>пад</sub>, где U<sub>пад</sub> = 9 В (фиксировано)
          </>
        ),
        formulaStabilizer: (
          <>
            U<sub>out</sub> = 5 В, пока U<sub>in</sub> ≥ 5.5 В (держит постоянно)
          </>
        ),
        modeResistor: "Резистор",
        modeStabilizer: "Стабилизатор",
        lUin: "Напряжение генератора U",
        lUout: "Напряжение на станции U",
        okMsg: "Стабильные 5 В — телефоны заряжаются",
        badHi: "Скачок — сожжёт телефоны",
        badLo: "Слишком мало — не заряжает",
      },
      osh: {
        pinLabel: "Ош",
        missionLabel: "МИССИЯ 3 · ОШ, ФЕРМЕРСКАЯ ДОЛИНА",
        missionText:
          "На ферме в Ошской долине насос для полива питается от солнечной панели через аккумулятор. Ночью панель не вырабатывает ток, и заряженный аккумулятор начинает «отдавать» ток обратно в панель — это может её сжечь. Нужна деталь, которая пропускает ток только в одну сторону.",
        panelLabel: "Панель",
        panelVolt: "днём: 18 В",
        deviceLabel: "Насос",
        deviceVolt: "через акк.: 12 В",
        successTitle: "Ура! Насос защищён и поливает поле",
        successBody:
          "Диод пропускает ток только в одну сторону — днём заряжает насос, а ночью не даёт току течь обратно и портить панель.",
        fails: {
          empty: {
            title: "Панель повреждена",
            body: "Ток без всякой преграды потёк обратно ночью и повредил панель.",
          },
          resistor: {
            title: "Панель повреждена",
            body: "Резистор снижает силу тока в обе стороны одинаково — обратный ток всё равно прошёл и повредил панель, просто чуть слабее.",
          },
          wire: {
            title: "Панель повреждена",
            body: "Провод пропускает ток в любую сторону одинаково — ночью ток свободно потёк обратно.",
          },
          battery: {
            title: "Стало ещё хуже",
            body: "Ещё одна батарея добавила напряжения в цепь, но не решила проблему обратного тока.",
          },
          lamp: {
            title: "Панель повреждена",
            body: "Лампочка не управляет направлением тока — обратный поток всё равно дошёл до панели.",
          },
        },
        mentorQuestion: "Как диод защищает солнечную панель от обратного тока ночью?",
        labTitle: "Лаборатория: закон Ома и обратный ток",
        formulaDayForward: (
          <>
            I = (U<sub>панели</sub> − U<sub>акк.</sub>) / R = (18 − 12) / R
          </>
        ),
        formulaNightBlocked: <>I = 0 — диод блокирует обратный ток</>,
        formulaNightNoDiode: (
          <>
            I = U<sub>акк.</sub> / R = 12 / R (течёт назад!)
          </>
        ),
        dayBtn: "День",
        nightBtn: "Ночь",
        diodeOnBtn: "С диодом",
        diodeOffBtn: "Без диода",
        lR: "Сопротивление цепи R",
        lI: "Сила тока I",
        okDayMsg: "Ток идёт вперёд — насос заряжается",
        okNightMsg: "Диод блокирует обратный ток — панель цела",
        badMsg: "Ток течёт назад — панель повреждается",
      },
    },
  },
  ky: {
    common: {
      appName: "FluxLab",
      part_resistor: "Резистор",
      part_wire: "Зым",
      part_lamp: "Лампочка",
      part_battery: "Батарея",
      part_capacitor: "Конденсатор",
      part_stabilizer: "Стабилизатор",
      part_diode: "Диод",
      slotEmpty: "бош",
      testBtn: "Токту бер",
      resetBtn: "Баштан",
      mentorBtn: "AI Ментор",
      backBtn: "Карта",
      warehouseTitle: "Буюмдар кампасы — тандап, слотко бас",
      workbenchTitle: "Схеманы жыйна",
      tryAgain: "Дагы аракет кыл — кайсы деталь так ушул көйгөйдү чечерин ойлон.",
      footer: "FluxLab · Нарын · Ысык-Көл · Ош",
      labReset: "Маанилерди баштапкы абалга келтир",
      attemptLabel: "Аракет",
      mentorLoading: "Ментор ойлонууда…",
      mentorFallbackTitle: "Жергиликтүү ментор",
    },
    welcome: {
      kicker: "FLUXLAB",
      title: "Ичиңдеги инженер",
      subtitle:
        "Кыргызстандын үч аймагында үч реалдуу бузулуу. Схеманы өз колуң менен жыйна да, жагдайды сакта.",
      startBtn: "Саякатты баштоо",
    },
    map: {
      title: "Тапшырманы тандо",
      subtitle: "Үч аймак — үч башка бузулуу",
      progress: (n) => `${n} / 3 тапшырма аткарылды`,
      trophyTitle: "Бардык тапшырмалар аткарылды!",
      trophySub: (n, max) => `Сен FluxLab миссияларын бүтүрдүң · ${n} / ${max} ⭐`,
    },
    missions: {
      naryn: {
        pinLabel: "Нарын",
        missionLabel: "МИССИЯ 1 · НАРЫН, ЖАЙЛОО",
        missionText:
          "Жайлоодогу чабандын роутери бузулду. Күн батареясы 24 В берет, ал эми роутерге так 12 В керек. Түз туташтырсаң — күйүп кетет. Схеманы жыйна да, дүйнө менен байланышты сакта.",
        panelLabel: "Панель",
        panelVolt: "24 В",
        deviceLabel: "Роутер",
        deviceVolt: "12 В керек",
        successTitle: "Ура! Интернет иштейт",
        successBody:
          "Резистор чыңалууну 24 В дан керектүү 12 В га түшүрдү. Дүйнө менен байланыш калыбына келди.",
        fails: {
          empty: {
            title: "Роутер күйдү",
            body: "Схемага эч нерсе коюлган жок. 24 В толугу менен роутерге тийди — прибор чыдай алган жок.",
          },
          wire: {
            title: "Роутер күйдү",
            body: "Зым өзү токко каршылык көрсөтпөйт — чыңалуу панелден чыккандай эле 24 В бойдон роутерге жетти.",
          },
          lamp: {
            title: "Роутер күйдү",
            body: "Лампочка жанат, бирок чыңалууну дээрлик түшүрбөйт — роутерге дагы эле өтө көп чыңалуу жетти.",
          },
          battery: {
            title: "Роутер дагы катуу күйдү",
            body: "Батарея панелдин чыңалуусуна өзүнүкүн кошот — жакшырган жок, тескерисинче жаманыраак болду.",
          },
          capacitor: {
            title: "Роутер күйдү",
            body: "Конденсатор заряд топтойт, чыңалууну туруктуу түшүрбөйт — секирик баары бир роутерге жетет.",
          },
        },
        mentorQuestion: "Кантип 24V чыңалууну 12V чейин азайтса болот?",
        labTitle: "Лаборатория: чыңалуу бөлгүчтүн мыйзамы",
        formula: (
          <>
            U<sub>чыг.</sub> = U<sub>кир.</sub> × R<sub>2</sub> / (R<sub>1</sub> + R<sub>2</sub>)
          </>
        ),
        lUin: "Панелдин чыңалуусу U",
        lR1: "Резистор R1",
        lR2: "Резистор R2",
        lUout: "Роутердеги чыңалуу U",
        okMsg: "Роутер үчүн коопсуз",
        badHi: "Өтө көп — күйөт",
        badLo: "Өтө аз — иштебейт",
      },
      issykkul: {
        pinLabel: "Ысык-Көл",
        missionLabel: "МИССИЯ 2 · ЫСЫК-КӨЛ, БОЗ ҮЙ ЛАГЕРИ",
        missionText:
          "Ысык-Көлдүн жээгинде туристтер телефондорун шамал генераторунан кубаттайт. Шамал күчөгөндө чыңалуу 20 В чейин секирет, ал эми станцияга туруктуу 5 В керек. Чыңалууну теңдебесең, секирик бардык телефондорду өрттөп кетет.",
        panelLabel: "Шамал генератору",
        panelVolt: "20 В чейин секирет",
        deviceLabel: "Кубаттоо станциясы",
        deviceVolt: "5 В керек",
        successTitle: "Ура! Телефондор кубатталууда",
        successBody:
          "Стабилизатор секирген чыңалууну тегиз 5 В га түшүрдү — эми күчтүү шамалда да кубаттоо иштейт.",
        fails: {
          empty: {
            title: "Станция күйдү",
            body: "Схемага эч нерсе коюлган жок — 20 В секирик станцияга түз тийди.",
          },
          resistor: {
            title: "Станция күйдү",
            body: "Резистор чыңалууну бир калыпта гана азайтат. Шамал күчөп секирик өскөндө, резистор ага жетише алган жок — станция баары бир күйдү.",
          },
          wire: {
            title: "Станция күйдү",
            body: "Зым чыңалууну эч өзгөртпөйт — секирик өзгөрүүсүз станцияга жетти.",
          },
          battery: {
            title: "Станция дагы катуу күйдү",
            body: "Батарея генератордун үстүнө өз чыңалуусун кошту — жагдай жакшырган жок.",
          },
          lamp: {
            title: "Станция күйдү",
            body: "Лампочка жанат, бирок чыңалуу секиригин теңдебейт — станция коркунучтуу секирикти дагы деле алды.",
          },
        },
        mentorQuestion: "Эмне үчүн секирген чыңалууга стабилизатор керек, резистор эмес?",
        labTitle: "Лаборатория: резистор менен стабилизатор",
        formulaResistor: (
          <>
            U<sub>чыг.</sub> = U<sub>кир.</sub> − U<sub>түшүм</sub>, U<sub>түшүм</sub> = 9 В (өзгөрбөйт)
          </>
        ),
        formulaStabilizer: (
          <>
            U<sub>чыг.</sub> = 5 В, U<sub>кир.</sub> ≥ 5.5 В болсо (туруктуу кармайт)
          </>
        ),
        modeResistor: "Резистор",
        modeStabilizer: "Стабилизатор",
        lUin: "Генератордун чыңалуусу U",
        lUout: "Станциядагы чыңалуу U",
        okMsg: "Туруктуу 5 В — телефондор кубатталууда",
        badHi: "Секирик — телефондорду өрттөйт",
        badLo: "Өтө аз — кубаттабайт",
      },
      osh: {
        pinLabel: "Ош",
        missionLabel: "МИССИЯ 3 · ОШ, ФЕРМЕР ӨРӨӨНҮ",
        missionText:
          "Ош өрөөнүндөгү фермада сугаруу насосу күн панели жана аккумулятор менен иштейт. Түнү панель ток чыгарбайт, ал эми аккумулятор токту панелге тескери агыза баштайт — бул панелди бузушу мүмкүн. Токту бир гана багытта өткөрүүчү деталь керек.",
        panelLabel: "Панель",
        panelVolt: "күндүз: 18 В",
        deviceLabel: "Насос",
        deviceVolt: "акк. аркылуу: 12 В",
        successTitle: "Ура! Насос корголду жана талааны сугарууда",
        successBody:
          "Диод токту бир гана багытта өткөрөт — күндүз насосту кубаттайт, түнү токтун артка агып, панелди бузушуна жол бербейт.",
        fails: {
          empty: {
            title: "Панель бузулду",
            body: "Ток эч кандай тоскоолдуксуз түнү артка агып, панелди бузду.",
          },
          resistor: {
            title: "Панель бузулду",
            body: "Резистор токту эки багытта тең эле азайтат — тескери ток баары бир өттү, панелди бузду, жөн гана бир аз алсызыраак.",
          },
          wire: {
            title: "Панель бузулду",
            body: "Зым токту эки багытта тең бирдей өткөрөт — түнү ток эркин артка агып кетти.",
          },
          battery: {
            title: "Жагдай начарлады",
            body: "Дагы бир батарея схемага чыңалуу кошту, бирок тескери ток маселесин чечкен жок.",
          },
          lamp: {
            title: "Панель бузулду",
            body: "Лампочка токтун багытын башкарбайт — тескери агым баары бир панелге жетти.",
          },
        },
        mentorQuestion: "Диод түнкү тескери токтан күн панелин кантип коргойт?",
        labTitle: "Лаборатория: Ом мыйзамы жана тескери ток",
        formulaDayForward: (
          <>
            I = (U<sub>панель</sub> − U<sub>акк.</sub>) / R = (18 − 12) / R
          </>
        ),
        formulaNightBlocked: <>I = 0 — диод тескери токту бөгөйт</>,
        formulaNightNoDiode: (
          <>
            I = U<sub>акк.</sub> / R = 12 / R (артка агат!)
          </>
        ),
        dayBtn: "Күндүз",
        nightBtn: "Түн",
        diodeOnBtn: "Диод менен",
        diodeOffBtn: "Диодсуз",
        lR: "Схеманын каршылыгы R",
        lI: "Ток күчү I",
        okDayMsg: "Ток алга агууда — насос кубатталууда",
        okNightMsg: "Диод тескери токту бөгөйт — панель бүтүн",
        badMsg: "Ток артка агууда — панель бузулууда",
      },
    },
  },
};

const MISSIONS = [
  {
    id: "naryn",
    pinIcon: "mountain",
    color: "#ff7aa8",
    top: "46.7%",
    left: "59.9%",
    panelIcon: "sun",
    deviceIconDefault: "wifi",
    deviceIconOn: "signal",
    deviceIconOff: "flame",
    correctPart: "resistor",
    parts: ["resistor", "wire", "lamp", "battery", "capacitor"],
  },
  {
    id: "issykkul",
    pinIcon: "droplets",
    color: "#3aa0d6",
    top: "38%",
    left: "70%",
    panelIcon: "wind",
    deviceIconDefault: "smartphone",
    deviceIconOn: "smartphone",
    deviceIconOff: "flame",
    correctPart: "stabilizer",
    parts: ["stabilizer", "resistor", "wire", "battery", "lamp"],
  },
  {
    id: "osh",
    pinIcon: "trees",
    color: "#6bb84f",
    top: "61.4%",
    left: "34.2%",
    panelIcon: "sun",
    deviceIconDefault: "droplets",
    deviceIconOn: "sprout",
    deviceIconOff: "flame",
    correctPart: "diode",
    parts: ["diode", "resistor", "wire", "battery", "lamp"],
  },
];

const KG_PATH =
  "M 77.9 171.9 L 89.0 169.9 L 101.5 175.6 L 115.6 163.4 L 122.9 165.0 L 124.3 157.5 L 130.7 159.7 L 147.8 147.6 L 117.3 138.5 L 116.6 132.2 L 107.5 131.3 L 100.6 116.5 L 98.1 125.4 L 92.7 125.0 L 91.9 134.3 L 72.3 128.4 L 69.3 120.4 L 62.4 122.0 L 52.9 116.6 L 74.7 95.7 L 86.6 90.1 L 75.9 82.6 L 84.6 68.6 L 92.9 63.7 L 120.2 64.8 L 159.3 79.6 L 157.0 71.8 L 161.4 54.4 L 182.3 44.3 L 219.4 61.5 L 228.0 62.4 L 233.0 57.3 L 271.5 55.6 L 340.1 64.0 L 349.8 76.4 L 365.6 79.5 L 374.8 88.9 L 376.0 94.5 L 362.9 97.2 L 360.6 101.3 L 327.7 115.7 L 315.6 123.8 L 307.8 136.3 L 290.5 139.9 L 268.9 138.5 L 250.0 167.1 L 248.0 163.8 L 229.4 169.1 L 224.3 155.4 L 215.4 161.6 L 202.4 161.6 L 202.3 168.1 L 175.3 180.2 L 170.3 190.6 L 172.6 200.0 L 166.4 205.0 L 129.5 208.6 L 118.7 215.7 L 112.7 209.6 L 104.3 212.8 L 102.8 206.6 L 95.4 204.2 L 94.4 198.9 L 72.9 207.8 L 63.3 199.7 L 24.7 202.3 L 24.0 185.6 L 30.4 185.5 L 32.1 177.9 L 46.2 173.4 L 61.7 180.0 L 63.7 184.2 L 77.9 171.9 Z";

const PART_ICONS = {
  resistor: "activity",
  wire: "cable",
  lamp: "lightbulb",
  battery: "battery",
  capacitor: "layers",
  stabilizer: "sliders_horizontal",
  diode: "move_right",
};

const PLAYGROUND = {
  naryn: {
    uin: { min: 12, max: 30, step: 1, def: 24 },
    r1: { min: 100, max: 3000, step: 100, def: 1000 },
    r2: { min: 100, max: 3000, step: 100, def: 1000 },
    safe: [10.8, 13.2],
    range: [0, 30],
  },
  issykkul: {
    uin: { min: 5, max: 24, step: 1, def: 14 },
    drop: 9,
    safe: [4.5, 5.5],
    range: [0, 24],
  },
  osh: { r: { min: 2, max: 10, step: 1, def: 6 }, ubat: 12, upanel: 18, maxI: 6 },
};

function kgTrailPath() {
  const order = ["osh", "naryn", "issykkul"];
  const pts = order.map((id) => {
    const m = MISSIONS.find((x) => x.id === id);
    const x = parseFloat(m.left) * 4;
    const y = parseFloat(m.top) * 2.6;
    return `${x.toFixed(1)} ${y.toFixed(1)}`;
  });
  return `M ${pts.join(" L ")}`;
}

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STARS_KEY) || "{}") || {};
  } catch {
    return {};
  }
}

function saveProgress(progress) {
  try {
    localStorage.setItem(STARS_KEY, JSON.stringify(progress));
  } catch {
    /* ignore */
  }
}

function circuitStateFromPart(placedPart, correctPart) {
  if (placedPart === correctPart) return 3;
  if (!placedPart || placedPart === "wire") return 1;
  return 2;
}

function localMentorFallback(lang, missionId, circuitState) {
  const t = STR[lang].missions[missionId];
  if (circuitState === 3) return t.successBody;
  if (circuitState === 1) {
    return (t.fails.wire || t.fails.empty).body + " " + STR[lang].common.tryAgain;
  }
  return t.fails[Object.keys(t.fails).find((k) => k !== "empty" && k !== "wire")]?.body || t.fails.empty.body;
}

function StarIcon({ filled, size = 14 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color: filled ? C.gold : "rgba(244,236,224,0.25)" }}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: ICONS.star }}
    />
  );
}

function StarRow({ n, size = 14 }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3].map((i) => (
        <StarIcon key={i} filled={i <= n} size={size} />
      ))}
    </span>
  );
}

function RangeBar({ min, max, value, safeMin, safeMax, ok }) {
  const pct = (v) => Math.max(0, Math.min(100, ((v - min) / (max - min)) * 100));
  return (
    <div className="relative my-1 h-2.5 rounded-md bg-[rgba(244,236,224,0.14)]">
      <div
        className="absolute inset-y-0 rounded-md bg-[rgba(79,227,176,0.32)]"
        style={{ left: `${pct(safeMin)}%`, width: `${pct(safeMax) - pct(safeMin)}%` }}
      />
      <div
        className={`absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_0_0_3px_#1c2c4e] transition-all ${
          ok ? "bg-[#4fe3b0]" : "bg-[#ff6b4a]"
        }`}
        style={{ left: `${pct(value)}%` }}
      />
    </div>
  );
}

function SliderRow({ label, valueLabel, min, max, step, value, onChange, accent }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between text-[12.5px]">
        <span className="font-semibold text-[#a9b3c9]">{label}</span>
        <span className="font-extrabold tabular-nums text-[#f3ecdf]">{valueLabel}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="lab-range w-full cursor-pointer"
        style={{ "--thumb": accent || C.warm }}
      />
    </div>
  );
}

function ModeBtn({ active, onClick, children, accent }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-[10px] border-[1.5px] px-2 py-2 text-[12.5px] font-bold transition ${
        active
          ? "border-transparent text-[#f3ecdf]"
          : "border-[rgba(244,236,224,0.14)] bg-[#0f1a30] text-[#a9b3c9]"
      }`}
      style={
        active
          ? { borderColor: accent, background: `${accent}20` }
          : undefined
      }
    >
      {children}
    </button>
  );
}

function FormulaLab({ missionId, lang, accent }) {
  const t = STR[lang].missions[missionId];
  const cfg = PLAYGROUND[missionId];
  const common = STR[lang].common;

  const [uin, setUin] = useState(cfg.uin?.def ?? 14);
  const [r1, setR1] = useState(cfg.r1?.def ?? 1000);
  const [r2, setR2] = useState(cfg.r2?.def ?? 1000);
  const [r, setR] = useState(cfg.r?.def ?? 6);
  const [issyMode, setIssyMode] = useState("resistor");
  const [day, setDay] = useState(true);
  const [diode, setDiode] = useState(true);

  useEffect(() => {
    setUin(cfg.uin?.def ?? 14);
    setR1(cfg.r1?.def ?? 1000);
    setR2(cfg.r2?.def ?? 1000);
    setR(cfg.r?.def ?? 6);
    setIssyMode("resistor");
    setDay(true);
    setDiode(true);
  }, [missionId, cfg]);

  let result = null;
  let formulaNode = null;

  if (missionId === "naryn") {
    const uout = (uin * r2) / (r1 + r2);
    const ok = uout >= cfg.safe[0] && uout <= cfg.safe[1];
    const statusText = ok ? t.okMsg : uout > cfg.safe[1] ? t.badHi : t.badLo;
    formulaNode = t.formula;
    result = (
      <>
        <div className="flex items-center gap-3 rounded-[14px] bg-[#0f1a30] px-3.5 py-3">
          <span className="text-[26px] font-extrabold tabular-nums">{uout.toFixed(1)}</span>
          <span className="text-[13px] font-semibold text-[#a9b3c9]">В</span>
          <span
            className={`ml-auto flex max-w-[150px] items-center gap-1.5 text-right text-xs font-bold ${
              ok ? "text-[#4fe3b0]" : "text-[#ff6b4a]"
            }`}
          >
            <Ico name={ok ? "circle_check_big" : "flame"} size={16} />
            <span>{statusText}</span>
          </span>
        </div>
        <RangeBar
          min={cfg.range[0]}
          max={cfg.range[1]}
          value={uout}
          safeMin={cfg.safe[0]}
          safeMax={cfg.safe[1]}
          ok={ok}
        />
      </>
    );
  } else if (missionId === "issykkul") {
    const uout =
      issyMode === "resistor"
        ? Math.max(0, uin - cfg.drop)
        : uin >= 5.5
          ? 5
          : Math.max(0, uin - 0.5);
    const ok = uout >= cfg.safe[0] && uout <= cfg.safe[1];
    const statusText = ok ? t.okMsg : uout > cfg.safe[1] ? t.badHi : t.badLo;
    formulaNode = issyMode === "resistor" ? t.formulaResistor : t.formulaStabilizer;
    result = (
      <>
        <div className="flex items-center gap-3 rounded-[14px] bg-[#0f1a30] px-3.5 py-3">
          <span className="text-[26px] font-extrabold tabular-nums">{uout.toFixed(1)}</span>
          <span className="text-[13px] font-semibold text-[#a9b3c9]">В</span>
          <span
            className={`ml-auto flex max-w-[150px] items-center gap-1.5 text-right text-xs font-bold ${
              ok ? "text-[#4fe3b0]" : "text-[#ff6b4a]"
            }`}
          >
            <Ico name={ok ? "circle_check_big" : "flame"} size={16} />
            <span>{statusText}</span>
          </span>
        </div>
        <RangeBar
          min={cfg.range[0]}
          max={cfg.range[1]}
          value={uout}
          safeMin={cfg.safe[0]}
          safeMax={cfg.safe[1]}
          ok={ok}
        />
      </>
    );
  } else if (missionId === "osh") {
    let current;
    let ok;
    let statusText;
    let dirIcon;
    if (day) {
      current = (cfg.upanel - cfg.ubat) / r;
      ok = true;
      statusText = t.okDayMsg;
      formulaNode = t.formulaDayForward;
      dirIcon = "move_right";
    } else if (diode) {
      current = 0;
      ok = true;
      statusText = t.okNightMsg;
      formulaNode = t.formulaNightBlocked;
      dirIcon = "circle_check_big";
    } else {
      current = cfg.ubat / r;
      ok = false;
      statusText = t.badMsg;
      formulaNode = t.formulaNightNoDiode;
      dirIcon = "arrow_left";
    }
    result = (
      <>
        <div className="flex items-center gap-3 rounded-[14px] bg-[#0f1a30] px-3.5 py-3">
          <Ico name={dirIcon} size={20} className={ok ? "text-[#4fe3b0]" : "text-[#ff6b4a]"} />
          <span className="text-[26px] font-extrabold tabular-nums">{current.toFixed(2)}</span>
          <span className="text-[13px] font-semibold text-[#a9b3c9]">А</span>
          <span
            className={`ml-auto flex max-w-[150px] items-center gap-1.5 text-right text-xs font-bold ${
              ok ? "text-[#4fe3b0]" : "text-[#ff6b4a]"
            }`}
          >
            <Ico name={ok ? "circle_check_big" : "flame"} size={16} />
            <span>{statusText}</span>
          </span>
        </div>
        <RangeBar min={0} max={cfg.maxI} value={current} safeMin={0} safeMax={ok ? cfg.maxI : 0.01} ok={ok} />
      </>
    );
  }

  return (
    <section className="flex flex-col gap-3.5 rounded-2xl border border-[rgba(244,236,224,0.1)] bg-[#1c2c4e] p-4 sm:p-5">
      <div className="flex items-center gap-2">
        <Ico name="sliders_horizontal" size={18} style={{ color: accent }} className="text-[var(--accent)]" />
        <h3 className="m-0 text-sm font-extrabold" style={{ color: accent }}>
          {t.labTitle}
        </h3>
      </div>

      {missionId === "issykkul" && (
        <div className="flex gap-2">
          <ModeBtn active={issyMode === "resistor"} onClick={() => setIssyMode("resistor")} accent={accent}>
            {t.modeResistor}
          </ModeBtn>
          <ModeBtn active={issyMode === "stabilizer"} onClick={() => setIssyMode("stabilizer")} accent={accent}>
            {t.modeStabilizer}
          </ModeBtn>
        </div>
      )}

      {missionId === "osh" && (
        <>
          <div className="flex gap-2">
            <ModeBtn active={day} onClick={() => setDay(true)} accent={accent}>
              {t.dayBtn}
            </ModeBtn>
            <ModeBtn active={!day} onClick={() => setDay(false)} accent={accent}>
              {t.nightBtn}
            </ModeBtn>
          </div>
          <div className="flex gap-2">
            <ModeBtn active={diode} onClick={() => setDiode(true)} accent={accent}>
              {t.diodeOnBtn}
            </ModeBtn>
            <ModeBtn active={!diode} onClick={() => setDiode(false)} accent={accent}>
              {t.diodeOffBtn}
            </ModeBtn>
          </div>
        </>
      )}

      <div className="rounded-xl border border-[rgba(244,236,224,0.14)] bg-[#0f1a30] px-3.5 py-3 text-center text-[15px] font-bold tracking-wide text-[#f3ecdf]">
        {formulaNode}
      </div>

      {missionId === "naryn" && (
        <>
          <SliderRow
            label={t.lUin}
            valueLabel={`${uin} В`}
            min={cfg.uin.min}
            max={cfg.uin.max}
            step={cfg.uin.step}
            value={uin}
            onChange={setUin}
            accent={accent}
          />
          <SliderRow
            label={t.lR1}
            valueLabel={`${r1} Ом`}
            min={cfg.r1.min}
            max={cfg.r1.max}
            step={cfg.r1.step}
            value={r1}
            onChange={setR1}
            accent={accent}
          />
          <SliderRow
            label={t.lR2}
            valueLabel={`${r2} Ом`}
            min={cfg.r2.min}
            max={cfg.r2.max}
            step={cfg.r2.step}
            value={r2}
            onChange={setR2}
            accent={accent}
          />
          <button
            type="button"
            className="flex items-center gap-1.5 self-start bg-transparent p-0 text-xs font-bold text-[#a9b3c9]"
            onClick={() => {
              setUin(cfg.uin.def);
              setR1(cfg.r1.def);
              setR2(cfg.r2.def);
            }}
          >
            <Ico name="rotate_ccw" size={14} />
            {common.labReset}
          </button>
        </>
      )}

      {missionId === "issykkul" && (
        <>
          <SliderRow
            label={t.lUin}
            valueLabel={`${uin} В`}
            min={cfg.uin.min}
            max={cfg.uin.max}
            step={cfg.uin.step}
            value={uin}
            onChange={setUin}
            accent={accent}
          />
          <button
            type="button"
            className="flex items-center gap-1.5 self-start bg-transparent p-0 text-xs font-bold text-[#a9b3c9]"
            onClick={() => {
              setUin(cfg.uin.def);
              setIssyMode("resistor");
            }}
          >
            <Ico name="rotate_ccw" size={14} />
            {common.labReset}
          </button>
        </>
      )}

      {missionId === "osh" && (
        <SliderRow
          label={t.lR}
          valueLabel={`${r} Ом`}
          min={cfg.r.min}
          max={cfg.r.max}
          step={cfg.r.step}
          value={r}
          onChange={setR}
          accent={accent}
        />
      )}

      <div className="flex flex-col gap-2">{result}</div>
    </section>
  );
}

function SceneBanner({ id }) {
  if (id === "naryn") {
    return (
      <svg viewBox="0 0 400 160" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="skyN" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2a3f68" />
            <stop offset="1" stopColor="#12203d" />
          </linearGradient>
        </defs>
        <rect width="400" height="160" fill="url(#skyN)" />
        <circle cx="330" cy="36" r="16" fill="#ffb3cf" opacity="0.9">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="3.5s" repeatCount="indefinite" />
        </circle>
        <path d="M0 120 L60 60 L110 100 L160 45 L220 110 L270 70 L330 120 L400 90 L400 160 L0 160 Z" fill="#1c2c4e" />
        <path d="M120 100 L160 45 L200 100 Z" fill="#233a63" />
        <g transform="translate(80,108)">
          <ellipse cx="0" cy="18" rx="26" ry="16" fill="#ff7aa8" />
          <path d="M-26 18 A26 16 0 0 1 26 18 Z" fill="#d97a49" />
          <rect x="-3" y="-6" width="6" height="10" fill="#12203d" />
        </g>
      </svg>
    );
  }
  if (id === "issykkul") {
    return (
      <svg viewBox="0 0 400 160" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="skyI" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#264a68" />
            <stop offset="1" stopColor="#0f2438" />
          </linearGradient>
          <linearGradient id="lakeI" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2f8fc2" />
            <stop offset="1" stopColor="#12354a" />
          </linearGradient>
        </defs>
        <rect width="400" height="160" fill="url(#skyI)" />
        <path d="M0 90 L70 50 L130 85 L190 40 L250 90 L320 55 L400 85 L400 100 L0 100 Z" fill="#1c3350" opacity="0.9" />
        <rect y="100" width="400" height="60" fill="url(#lakeI)" />
        <g transform="translate(250,118)">
          <path d="M-18 6 L18 6 L12 16 L-12 16 Z" fill="#f3ecdf" opacity="0.9" />
          <line x1="0" y1="6" x2="0" y2="-16" stroke="#f3ecdf" strokeWidth="2" />
          <path d="M0 -16 L14 -6 L0 -2 Z" fill="#ff7aa8" />
        </g>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 400 160" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="skyO" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#33553f" />
          <stop offset="1" stopColor="#12291f" />
        </linearGradient>
      </defs>
      <rect width="400" height="160" fill="url(#skyO)" />
      <circle cx="70" cy="34" r="14" fill="#e8c77a" opacity="0.9" />
      <path d="M0 100 L400 100 L400 118 L0 128 Z" fill="#3f7a3f" />
      <path d="M0 118 L400 108 L400 134 L0 145 Z" fill="#356a37" />
      <path d="M0 138 L400 128 L400 160 L0 160 Z" fill="#2b562e" />
      <g transform="translate(190,130)">
        <path d="M-14 4 L14 4 L10 -10 L-10 -10 Z" fill="#ff7aa8" opacity="0.9" />
        <rect x="-10" y="4" width="20" height="10" fill="#5a3a8c" />
      </g>
    </svg>
  );
}

function useSfx(soundOn) {
  const ctxRef = useRef(null);
  const ensure = useCallback(() => {
    if (!ctxRef.current) {
      try {
        ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      } catch {
        /* ignore */
      }
    }
    return ctxRef.current;
  }, []);

  const playTone = useCallback(
    (freq, start, duration, type, vol) => {
      if (!soundOn) return;
      const ctx = ensure();
      if (!ctx) return;
      const t0 = ctx.currentTime + start;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type || "sine";
      osc.frequency.setValueAtTime(freq, t0);
      gain.gain.setValueAtTime(0, t0);
      gain.gain.linearRampToValueAtTime(vol || 0.14, t0 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + duration + 0.02);
    },
    [soundOn, ensure]
  );

  return useMemo(
    () => ({
      click: () => playTone(880, 0, 0.045, "square", 0.045),
      nav: () => {
        playTone(660, 0, 0.05, "sine", 0.06);
        playTone(880, 0.05, 0.09, "sine", 0.06);
      },
      success: () => {
        playTone(523.25, 0, 0.14, "sine");
        playTone(659.25, 0.09, 0.14, "sine");
        playTone(783.99, 0.18, 0.26, "sine");
      },
      fail: () => {
        playTone(196, 0, 0.16, "sawtooth", 0.1);
        playTone(146.8, 0.11, 0.3, "sawtooth", 0.1);
      },
    }),
    [playTone]
  );
}

async function askMentorApi({ question, circuit_state, lang }) {
  const res = await fetch(MENTOR_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, circuit_state, lang }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [lang, setLang] = useState("ru");
  const [missionId, setMissionId] = useState(null);
  const [progress, setProgress] = useState(loadProgress);
  const [soundOn, setSoundOn] = useState(() => {
    try {
      const s = localStorage.getItem(SOUND_KEY);
      return s === null ? true : s === "1";
    } catch {
      return true;
    }
  });

  const [selectedPart, setSelectedPart] = useState(null);
  const [placedPart, setPlacedPart] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [circuitVisual, setCircuitVisual] = useState("idle");
  const [slotPulse, setSlotPulse] = useState(false);
  const [wbFx, setWbFx] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [particles, setParticles] = useState([]);
  const [xpPop, setXpPop] = useState(null);

  const [mentorLoading, setMentorLoading] = useState(false);
  const [mentorBanner, setMentorBanner] = useState(null);

  const sfx = useSfx(soundOn);
  const strings = STR[lang];
  const total = useMemo(
    () => Object.values(progress).reduce((a, b) => a + b, 0),
    [progress]
  );
  const doneCount = useMemo(
    () => Object.keys(progress).filter((id) => progress[id] > 0).length,
    [progress]
  );
  const allDone = MISSIONS.every((m) => progress[m.id] > 0);
  const mission = MISSIONS.find((m) => m.id === missionId);
  const accent = mission?.color || C.warm;

  const persistProgress = useCallback((next) => {
    setProgress(next);
    saveProgress(next);
  }, []);

  const toggleSound = () => {
    setSoundOn((v) => {
      const n = !v;
      try {
        localStorage.setItem(SOUND_KEY, n ? "1" : "0");
      } catch {
        /* ignore */
      }
      return n;
    });
  };

  const resetMissionLocal = () => {
    setSelectedPart(null);
    setPlacedPart(null);
    setAttempts(0);
    setCircuitVisual("idle");
    setFeedback(null);
    setParticles([]);
    setXpPop(null);
    setWbFx("");
    setMentorBanner(null);
  };

  const openMission = (id) => {
    sfx.nav();
    setMissionId(id);
    resetMissionLocal();
    setScreen("mission");
  };

  const fetchMentor = useCallback(
    async (circuit_state, questionOverride) => {
      if (!missionId) return;
      const question =
        questionOverride || strings.missions[missionId].mentorQuestion;
      setMentorLoading(true);
      setMentorBanner(null);
      try {
        const data = await askMentorApi({
          question,
          circuit_state,
          lang: lang === "ky" ? "ky" : "ru",
        });
        setMentorBanner({
          answer: data.answer,
          source: data.source || "api",
          circuit_state: data.circuit_state ?? circuit_state,
          fallback: false,
        });
      } catch {
        setMentorBanner({
          answer: localMentorFallback(lang, missionId, circuit_state),
          source: "fallback",
          circuit_state,
          fallback: true,
        });
      } finally {
        setMentorLoading(false);
      }
    },
    [missionId, lang, strings]
  );

  const spawnParticles = (kind, count, attemptsNow) => {
    const list = Array.from({ length: count }, (_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const dist = 30 + Math.random() * 70;
      return {
        id: `${Date.now()}-${i}`,
        kind,
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist - 20,
      };
    });
    setParticles(list);
    if (kind === "success") {
      const xp = attemptsNow <= 1 ? 30 : attemptsNow === 2 ? 20 : 10;
      setXpPop(`+${xp} XP`);
      setTimeout(() => setXpPop(null), 1100);
    }
    setTimeout(() => setParticles([]), 1000);
  };

  const onTestCircuit = () => {
    if (!mission) return;
    setWbFx("");
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    const state = circuitStateFromPart(placedPart, mission.correctPart);
    const t = strings.missions[missionId];

    if (state === 3) {
      setCircuitVisual("success");
      spawnParticles("success", 14, nextAttempts);
      const starsEarned = nextAttempts <= 1 ? 3 : nextAttempts === 2 ? 2 : 1;
      setFeedback({
        kind: "success",
        title: t.successTitle,
        body: t.successBody,
        stars: starsEarned,
        tryAgain: false,
      });
      const next = {
        ...progress,
        [missionId]: Math.max(progress[missionId] || 0, starsEarned),
      };
      persistProgress(next);
      sfx.success();
      requestAnimationFrame(() => setWbFx("flash"));
      fetchMentor(3);
      return;
    }

    setCircuitVisual("burnt");
    spawnParticles("fail", 12, nextAttempts);
    const key = placedPart || "empty";
    const fail = t.fails[key] || t.fails.empty;
    setFeedback({
      kind: "fail",
      title: fail.title,
      body: fail.body,
      stars: 0,
      tryAgain: true,
    });
    sfx.fail();
    requestAnimationFrame(() => setWbFx("shake"));
    fetchMentor(state);
  };

  const onReset = () => {
    sfx.click();
    setSelectedPart(null);
    setPlacedPart(null);
    setCircuitVisual("idle");
    setFeedback(null);
    setParticles([]);
    setXpPop(null);
    setWbFx("");
  };

  const onAskMentor = () => {
    sfx.click();
    const state = circuitStateFromPart(placedPart, mission?.correctPart);
    fetchMentor(state);
  };

  const deviceIcon =
    circuitVisual === "success"
      ? mission?.deviceIconOn
      : circuitVisual === "burnt"
        ? mission?.deviceIconOff
        : mission?.deviceIconDefault;

  return (
    <div
      className="min-h-screen w-full text-[#f3ecdf] antialiased"
      style={{
        background: C.deep,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        ["--accent"]: accent,
      }}
    >
      <style>{`
        .lab-range{-webkit-appearance:none;appearance:none;height:26px;background:transparent;margin:0}
        .lab-range::-webkit-slider-runnable-track{height:6px;border-radius:4px;background:rgba(244,236,224,0.14)}
        .lab-range::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:var(--thumb,#ff7aa8);border:3px solid #0f1a30;margin-top:-7px}
        .lab-range::-moz-range-track{height:6px;border-radius:4px;background:rgba(244,236,224,0.14)}
        .lab-range::-moz-range-thumb{width:20px;height:20px;border-radius:50%;background:var(--thumb,#ff7aa8);border:3px solid #0f1a30}
        @keyframes pinFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
        @keyframes pulseWire{0%,100%{opacity:.75}50%{opacity:1}}
        @keyframes shakeSlot{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
        @keyframes hardShake{0%,100%{transform:translateX(0)}15%{transform:translateX(-6px)}30%{transform:translateX(5px)}45%{transform:translateX(-4px)}60%{transform:translateX(3px)}}
        @keyframes flashGreen{0%{box-shadow:0 0 0 0 rgba(79,227,176,0)}30%{box-shadow:0 0 0 6px rgba(79,227,176,.18)}100%{box-shadow:0 0 0 0 rgba(79,227,176,0)}}
        @keyframes xpFloat{0%{opacity:0;transform:translate(-50%,10px) scale(.8)}20%{opacity:1;transform:translate(-50%,-6px) scale(1.05)}75%{opacity:1;transform:translate(-50%,-34px)}100%{opacity:0;transform:translate(-50%,-46px)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes trophyPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
        @keyframes mentorPulse{0%,100%{opacity:.55}50%{opacity:1}}
        .pin-float{animation:pinFloat 3s ease-in-out infinite}
        .wire-pulse{animation:pulseWire 1s ease-in-out infinite}
        .slot-shake{animation:shakeSlot .4s ease}
        .wb-shake{animation:hardShake .45s ease}
        .wb-flash{animation:flashGreen .6s ease}
        .xp-anim{animation:xpFloat 1.1s ease forwards}
        .fade-enter{animation:fadeUp .3s ease}
      `}</style>

      <div className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col md:max-w-4xl">
        {/* Topbar */}
        <header className="flex items-center justify-between gap-2.5 px-4 pb-2.5 pt-4 sm:px-5">
          <div className="flex min-w-0 items-center gap-2.5">
            <div
              className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full text-[#3a2166] shadow-[0_0_16px_rgba(255,122,168,0.45)]"
              style={{
                background:
                  "radial-gradient(circle at 35% 30%, #ffb3cf, #ff7aa8 60%, #5a3a8c 100%)",
              }}
            >
              <Ico name="zap" size={16} />
            </div>
            <div className="min-w-0">
              <h1 className="m-0 truncate text-[17px] font-extrabold tracking-tight">
                {strings.common.appName}
              </h1>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => {
                toggleSound();
                if (!soundOn) sfx.click();
              }}
              className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-[rgba(244,236,224,0.14)] bg-[#1c2c4e] text-[#a9b3c9]"
              aria-label="sound"
            >
              <Ico name={soundOn ? "volume_2" : "volume_x"} size={16} />
            </button>
            <div className="flex h-8 items-center gap-1 rounded-[10px] border border-[rgba(244,236,224,0.14)] bg-[#1c2c4e] px-2.5 text-[12.5px] font-extrabold tabular-nums text-[#e8c77a]">
              <StarIcon filled size={14} />
              <span>
                {total}/9
              </span>
            </div>
            <div className="flex overflow-hidden rounded-[10px] border border-[rgba(244,236,224,0.14)] bg-[#1c2c4e]">
              {[
                { id: "ru", label: "РУС" },
                { id: "ky", label: "КЫР" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    sfx.click();
                    setLang(opt.id);
                  }}
                  className={`px-2.5 py-1.5 text-[12.5px] font-bold transition sm:px-3 ${
                    lang === opt.id
                      ? "bg-[#ff7aa8] text-[#3a2166]"
                      : "bg-transparent text-[#a9b3c9]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-4 px-4 pb-10 pt-1.5 sm:px-5">
          {/* WELCOME */}
          {screen === "welcome" && (
            <div className="fade-enter flex flex-1 flex-col items-center justify-center gap-[18px] px-1 pb-2 pt-6 text-center">
              <div className="h-24 w-24">
                <svg viewBox="0 0 100 100" className="h-full w-full">
                  <circle cx="50" cy="50" r="46" fill="none" stroke="#ff7aa8" strokeWidth="2" opacity="0.5" />
                  <circle cx="50" cy="50" r="8" fill="#ff7aa8" />
                  <g stroke="#ffb3cf" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="50" y1="50" x2="50" y2="10" />
                    <line x1="50" y1="50" x2="50" y2="90" />
                    <line x1="50" y1="50" x2="10" y2="50" />
                    <line x1="50" y1="50" x2="90" y2="50" />
                    <line x1="50" y1="50" x2="21" y2="21" />
                    <line x1="50" y1="50" x2="79" y2="79" />
                    <line x1="50" y1="50" x2="21" y2="79" />
                    <line x1="50" y1="50" x2="79" y2="21" />
                  </g>
                </svg>
              </div>
              <div className="text-[12.5px] font-bold tracking-[0.06em] text-[#ff7aa8]">
                {strings.welcome.kicker}
              </div>
              <h2 className="m-0 text-[27px] font-extrabold leading-tight tracking-tight">
                {strings.welcome.title}
              </h2>
              <p className="m-0 max-w-sm text-[15px] leading-relaxed text-[#a9b3c9]">
                {strings.welcome.subtitle}
              </p>
              <button
                type="button"
                onClick={() => {
                  sfx.nav();
                  setScreen("map");
                }}
                className="mt-2 flex w-full max-w-[280px] items-center justify-center gap-2 rounded-[14px] bg-[#ff7aa8] px-5 py-[15px] text-[15.5px] font-extrabold text-[#3a2166] transition active:scale-[0.97]"
              >
                <Ico name="zap" size={18} />
                <span>{strings.welcome.startBtn}</span>
              </button>
              <footer className="text-[11.5px] text-[#a9b3c9] opacity-70">
                {strings.common.footer}
              </footer>
            </div>
          )}

          {/* MAP */}
          {screen === "map" && (
            <div className="fade-enter flex flex-col gap-4">
              <div>
                <h2 className="m-0 text-[21px] font-extrabold">{strings.map.title}</h2>
                <p className="mt-1 text-[13.5px] text-[#a9b3c9]">{strings.map.subtitle}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className={`h-[7px] w-[7px] rounded-full ${
                          i < doneCount ? "bg-[#4fe3b0]" : "bg-[rgba(244,236,224,0.14)]"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-[#a9b3c9]">
                    {strings.map.progress(doneCount)}
                  </span>
                </div>
              </div>

              {allDone && (
                <div className="flex items-center gap-3 rounded-2xl border border-[rgba(232,199,122,0.4)] bg-gradient-to-br from-[rgba(232,199,122,0.18)] to-[rgba(201,96,58,0.12)] px-4 py-3.5">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[rgba(232,199,122,0.2)] text-[#e8c77a]"
                    style={{ animation: "trophyPulse 2.4s ease-in-out infinite" }}
                  >
                    <Ico name="trophy" size={20} />
                  </div>
                  <div>
                    <b className="block text-sm text-[#f3ecdf]">{strings.map.trophyTitle}</b>
                    <div className="mt-0.5 text-[12.5px] text-[#a9b3c9]">
                      {strings.map.trophySub(total, 9)}
                    </div>
                  </div>
                </div>
              )}

              <div className="relative aspect-[400/260] w-full overflow-hidden rounded-[20px] border border-[rgba(244,236,224,0.14)] bg-gradient-to-b from-[#182642] to-[#101b34]">
                <svg
                  className="absolute inset-0 h-full w-full"
                  viewBox="0 0 400 260"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    <linearGradient id="mapsky" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#182642" />
                      <stop offset="1" stopColor="#0f1b30" />
                    </linearGradient>
                    <radialGradient id="kgfill" cx="35%" cy="30%" r="90%">
                      <stop offset="0" stopColor="#2a3f68" />
                      <stop offset="1" stopColor="#1c2c4e" />
                    </radialGradient>
                    <pattern id="grid" width="26" height="26" patternUnits="userSpaceOnUse">
                      <path d="M26 0H0V26" fill="none" stroke="rgba(244,236,224,0.05)" />
                    </pattern>
                  </defs>
                  <rect width="400" height="260" fill="url(#mapsky)" />
                  <rect width="400" height="260" fill="url(#grid)" />
                  <path
                    d={KG_PATH}
                    fill="url(#kgfill)"
                    stroke="rgba(244,236,224,0.4)"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d={kgTrailPath()}
                    fill="none"
                    stroke="rgba(244,236,224,0.35)"
                    strokeWidth="1.5"
                    strokeDasharray="3 7"
                    strokeLinecap="round"
                  />
                </svg>

                {MISSIONS.map((m, idx) => {
                  const stars = progress[m.id] || 0;
                  const done = stars > 0;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => openMission(m.id)}
                      className="absolute flex -translate-x-1/2 -translate-y-full flex-col items-center gap-1 bg-transparent p-0"
                      style={{ top: m.top, left: m.left }}
                    >
                      <div
                        className={`pin-float relative flex h-[46px] w-[46px] items-center justify-center rounded-full border-2 bg-[#1c2c4e] ${
                          done ? "text-[#0f1a30]" : ""
                        }`}
                        style={{
                          borderColor: m.color,
                          color: done ? "#0f1a30" : m.color,
                          background: done ? m.color : C.panel,
                          animationDelay: `${idx * 0.4}s`,
                        }}
                      >
                        <Ico name={m.pinIcon} size={20} />
                        {done && (
                          <div className="absolute -right-1 -top-1 flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 border-[#0f1a30] bg-[#4fe3b0] text-[#0f1a30]">
                            <Ico name="check" size={11} />
                          </div>
                        )}
                      </div>
                      <span className="whitespace-nowrap rounded-lg bg-[rgba(15,26,48,0.85)] px-2 py-0.5 text-[11.5px] font-bold">
                        {strings.missions[m.id].pinLabel}
                      </span>
                      {done && (
                        <span className="inline-flex rounded-md bg-[rgba(15,26,48,0.85)] px-1.5 py-0.5">
                          <StarRow n={stars} size={10} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <footer className="text-center text-[11px] text-[#a9b3c9] opacity-65">
                {strings.common.footer}
              </footer>
            </div>
          )}

          {/* MISSION */}
          {screen === "mission" && mission && (
            <div className="fade-enter flex flex-col gap-4">
              <button
                type="button"
                onClick={() => {
                  sfx.nav();
                  setScreen("map");
                }}
                className="flex items-center gap-1.5 self-start bg-transparent p-1 text-[13px] font-bold text-[#a9b3c9]"
              >
                <Ico name="arrow_left" size={16} />
                {strings.common.backBtn}
              </button>

              <div className="relative h-40 overflow-hidden rounded-[18px] border border-[rgba(244,236,224,0.14)] md:h-48">
                <SceneBanner id={missionId} />
              </div>

              <div>
                <div className="text-[11.5px] font-bold tracking-wide" style={{ color: accent }}>
                  {strings.missions[missionId].missionLabel}
                </div>
                <p className="mt-1.5 text-[14.5px] leading-relaxed text-[#f3ecdf]">
                  {strings.missions[missionId].missionText}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-start">
                {/* Workbench column */}
                <div className="flex flex-col gap-4">
                  <div
                    className={`relative rounded-[18px] border border-[rgba(244,236,224,0.14)] bg-[#1c2c4e] px-3.5 pb-[22px] pt-5 sm:px-4 ${
                      wbFx === "shake" ? "wb-shake" : wbFx === "flash" ? "wb-flash" : ""
                    }`}
                  >
                    <div className="mb-3.5 flex items-center justify-between">
                      <p className="m-0 text-[13px] font-semibold text-[#a9b3c9]">
                        {strings.common.workbenchTitle}
                      </p>
                      <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(244,236,224,0.14)] bg-[#0f1a30] px-2.5 py-1 text-[11.5px] font-bold text-[#a9b3c9]">
                        {progress[missionId] ? (
                          <StarRow n={progress[missionId]} size={12} />
                        ) : (
                          `${strings.common.attemptLabel} ${attempts}`
                        )}
                      </span>
                    </div>

                    <div className="relative flex items-center gap-0">
                      <div className="flex w-[76px] shrink-0 flex-col items-center justify-center gap-1 rounded-[14px] border-[1.5px] border-[rgba(244,236,224,0.14)] bg-[#0f1a30] px-1 py-2.5 text-center text-[11px] font-bold sm:w-[86px]">
                        <Ico name={mission.panelIcon} size={22} className="text-[#a9b3c9]" />
                        <span>{strings.missions[missionId].panelLabel}</span>
                        <span className="text-[10.5px] font-semibold text-[#a9b3c9]">
                          {strings.missions[missionId].panelVolt}
                        </span>
                      </div>

                      <div
                        className={`h-1 min-w-[10px] flex-1 rounded-sm ${
                          circuitVisual === "success"
                            ? "wire-pulse bg-[#4fe3b0] shadow-[0_0_10px_1px_#4fe3b0]"
                            : circuitVisual === "burnt"
                              ? "bg-[#ff6b4a] shadow-[0_0_10px_1px_#ff6b4a]"
                              : "bg-[rgba(244,236,224,0.14)]"
                        }`}
                      />

                      <button
                        type="button"
                        onClick={() => {
                          setCircuitVisual("idle");
                          setFeedback(null);
                          if (placedPart) {
                            sfx.click();
                            setPlacedPart(null);
                            return;
                          }
                          if (selectedPart) {
                            sfx.click();
                            setPlacedPart(selectedPart);
                            setSelectedPart(null);
                          } else {
                            setSlotPulse(true);
                            setTimeout(() => setSlotPulse(false), 400);
                          }
                        }}
                        className={`flex h-[74px] w-[74px] shrink-0 flex-col items-center justify-center gap-0.5 rounded-[14px] border-2 text-[10.5px] font-semibold transition ${
                          placedPart
                            ? "border-solid text-[#f3ecdf]"
                            : "border-dashed border-[rgba(244,236,224,0.14)] bg-[rgba(255,255,255,0.02)] text-[#a9b3c9]"
                        } ${slotPulse ? "slot-shake" : ""}`}
                        style={
                          placedPart
                            ? {
                                borderColor: accent,
                                background: `${accent}24`,
                              }
                            : undefined
                        }
                      >
                        <Ico
                          name={placedPart ? PART_ICONS[placedPart] : "layers"}
                          size={placedPart ? 20 : 18}
                        />
                        <span>
                          {placedPart
                            ? strings.common[`part_${placedPart}`]
                            : strings.common.slotEmpty}
                        </span>
                      </button>

                      <div
                        className={`h-1 min-w-[10px] flex-1 rounded-sm ${
                          circuitVisual === "success"
                            ? "wire-pulse bg-[#4fe3b0] shadow-[0_0_10px_1px_#4fe3b0]"
                            : circuitVisual === "burnt"
                              ? "bg-[#ff6b4a] shadow-[0_0_10px_1px_#ff6b4a]"
                              : "bg-[rgba(244,236,224,0.14)]"
                        }`}
                      />

                      <div
                        className={`flex w-[76px] shrink-0 flex-col items-center justify-center gap-1 rounded-[14px] border-[1.5px] bg-[#0f1a30] px-1 py-2.5 text-center text-[11px] font-bold transition sm:w-[86px] ${
                          circuitVisual === "success"
                            ? "border-[#4fe3b0] shadow-[0_0_18px_2px_rgba(79,227,176,0.45)]"
                            : circuitVisual === "burnt"
                              ? "border-[#ff6b4a] shadow-[0_0_18px_2px_rgba(255,107,74,0.4)]"
                              : "border-[rgba(244,236,224,0.14)]"
                        }`}
                      >
                        <Ico
                          name={deviceIcon}
                          size={22}
                          className={
                            circuitVisual === "success"
                              ? "text-[#4fe3b0]"
                              : circuitVisual === "burnt"
                                ? "text-[#ff6b4a]"
                                : "text-[#a9b3c9]"
                          }
                        />
                        <span>{strings.missions[missionId].deviceLabel}</span>
                        <span className="text-[10.5px] font-semibold text-[#a9b3c9]">
                          {strings.missions[missionId].deviceVolt}
                        </span>
                      </div>

                      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[18px]">
                        {particles.map((p) => (
                          <span
                            key={p.id}
                            className={`absolute left-1/2 top-[46%] h-1.5 w-1.5 rounded-full ${
                              p.kind === "success" ? "bg-[#4fe3b0]" : "bg-[#ff6b4a]"
                            }`}
                            style={{
                              transform: "translate(-50%,-50%)",
                              animation: "none",
                              transition: "transform .9s cubic-bezier(.2,.7,.3,1), opacity .9s ease-out",
                              opacity: 1,
                              ["--dx"]: `${p.dx}px`,
                              ["--dy"]: `${p.dy}px`,
                            }}
                            ref={(el) => {
                              if (el) {
                                requestAnimationFrame(() => {
                                  el.style.transform = `translate(calc(-50% + ${p.dx}px), calc(-50% + ${p.dy}px))`;
                                  setTimeout(() => {
                                    el.style.opacity = "0";
                                  }, 550);
                                });
                              }
                            }}
                          />
                        ))}
                        {xpPop && (
                          <div className="xp-anim absolute left-1/2 top-0 -translate-x-1/2 text-[15px] font-extrabold text-[#e8c77a]">
                            {xpPop}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2.5 ml-0.5 text-[13px] font-semibold text-[#a9b3c9]">
                      {strings.common.warehouseTitle}
                    </h3>
                    <div className="flex gap-2.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {mission.parts.map((pid) => {
                        const sel = selectedPart === pid;
                        return (
                          <button
                            key={pid}
                            type="button"
                            onClick={() => {
                              sfx.click();
                              setSelectedPart((cur) => (cur === pid ? null : pid));
                            }}
                            className={`flex w-[78px] shrink-0 flex-col items-center justify-center gap-1.5 rounded-[14px] border-[1.5px] bg-[#1c2c4e] px-1.5 py-3 text-[10.5px] font-semibold transition active:scale-95 ${
                              sel
                                ? "border-[#4fe3b0] text-[#f3ecdf] shadow-[inset_0_0_0_1px_#4fe3b0]"
                                : "border-[rgba(244,236,224,0.14)] text-[#a9b3c9]"
                            }`}
                          >
                            <Ico
                              name={PART_ICONS[pid]}
                              size={22}
                              className={sel ? "text-[#4fe3b0]" : "text-[#a9b3c9]"}
                            />
                            <span>{strings.common[`part_${pid}`]}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    <button
                      type="button"
                      onClick={onTestCircuit}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3.5 py-3 text-sm font-extrabold text-[#3a2166] transition active:scale-[0.97]"
                      style={{ background: accent }}
                    >
                      <Ico name="zap" size={17} />
                      {strings.common.testBtn}
                    </button>
                    <button
                      type="button"
                      onClick={onReset}
                      className="flex items-center justify-center gap-1.5 rounded-xl border-[1.5px] border-[rgba(244,236,224,0.14)] bg-transparent px-3.5 py-3 text-sm font-extrabold text-[#a9b3c9] transition active:scale-[0.97]"
                    >
                      <Ico name="rotate_ccw" size={15} />
                      {strings.common.resetBtn}
                    </button>
                    <button
                      type="button"
                      onClick={onAskMentor}
                      disabled={mentorLoading}
                      className="flex items-center justify-center gap-1.5 rounded-xl border-[1.5px] border-[rgba(244,236,224,0.14)] bg-transparent px-3.5 py-3 text-sm font-extrabold text-[#a9b3c9] transition active:scale-[0.97] disabled:opacity-60"
                    >
                      <Ico name="sparkles" size={16} />
                      {strings.common.mentorBtn}
                    </button>
                  </div>

                  {(mentorLoading || mentorBanner) && (
                    <div
                      className={`rounded-2xl border px-4 py-3.5 text-[13.5px] leading-relaxed ${
                        mentorBanner?.fallback
                          ? "border-[rgba(244,236,224,0.14)] bg-[#1c2c4e]"
                          : "border-[rgba(79,227,176,0.35)] bg-[rgba(31,79,67,0.55)]"
                      }`}
                    >
                      <div className="mb-1.5 flex items-center gap-2 text-xs font-bold text-[#a9b3c9]">
                        <Ico name="message_circle" size={16} style={{ color: accent }} />
                        {mentorLoading ? (
                          <span style={{ animation: "mentorPulse 1.2s ease-in-out infinite" }}>
                            {strings.common.mentorLoading}
                          </span>
                        ) : (
                          <span>
                            AI Ментор
                            {mentorBanner?.source ? ` · ${mentorBanner.source}` : ""}
                            {mentorBanner?.fallback
                              ? ` · ${strings.common.mentorFallbackTitle}`
                              : ""}
                          </span>
                        )}
                      </div>
                      {!mentorLoading && mentorBanner && (
                        <p className="m-0 text-[#f3ecdf]">{mentorBanner.answer}</p>
                      )}
                      {mentorLoading && (
                        <div className="mt-2 h-2 w-2/3 animate-pulse rounded bg-[rgba(244,236,224,0.12)]" />
                      )}
                    </div>
                  )}

                  {feedback && (
                    <div
                      className={`fade-enter flex gap-2.5 rounded-2xl border px-4 py-3.5 text-[13.5px] leading-relaxed ${
                        feedback.kind === "success"
                          ? "border-[#4fe3b0] bg-[#1f4f43]"
                          : "border-[#ff6b4a] bg-[#3a2030]"
                      }`}
                    >
                      <Ico
                        name={feedback.kind === "success" ? "circle_check_big" : "flame"}
                        size={20}
                        className={
                          feedback.kind === "success" ? "text-[#4fe3b0]" : "text-[#ff6b4a]"
                        }
                      />
                      <div>
                        <div className="mb-1 flex flex-wrap items-center gap-2 text-sm font-extrabold">
                          {feedback.title}
                          {feedback.stars > 0 && <StarRow n={feedback.stars} size={14} />}
                        </div>
                        <div>{feedback.body}</div>
                        {feedback.tryAgain && (
                          <div className="mt-2 text-[12.5px] text-[#a9b3c9]">
                            {strings.common.tryAgain}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Formula lab column */}
                <FormulaLab missionId={missionId} lang={lang} accent={accent} />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
