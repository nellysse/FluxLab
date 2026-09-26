import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// ============================================================================
// CONSTANTS & BRAND CONFIGURATION
// ============================================================================

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const MENTOR_URL = `${API_BASE}/api/ask-mentor`;
const STARS_KEY = "fluxlab_stars_v2";
const SOUND_KEY = "fluxlab_sound_v2";
const LANG_KEY = "fluxlab_lang_v2";

const BRAND = {
  space: "#081C36", // Deep Space Background
  card: "#0D2547", // Card Container Background
  border: "rgba(53, 214, 255, 0.2)", // Glassmorphism Border
  blue: "#377DFF", // Orbit Blue (Primary Accent)
  cyan: "#35D6FF", // Ion Cyan (High-Energy Accent)
  yellow: "#FFD84D", // Core Yellow (Energy Core / Stars)
  white: "#F4F8FC", // Lab White (Primary Text)
  muted: "#A1B5D8", // Muted Text
  crimson: "#FF5353", // Danger / Burnt State
  green: "#26D07C", // Safe / Success
};

// ============================================================================
// VECTOR SVG ICONS
// ============================================================================

const ICONS = {
  activity:
    '<path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/>',
  arrow_left: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
  battery: '<path d="M22 14v-4"/><rect x="2" y="6" width="16" height="12" rx="2"/>',
  cable:
    '<path d="M17 19a1 1 0 0 1-1-1v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a1 1 0 0 1-1 1z"/><path d="M17 21v-2"/><path d="M19 14V6.5a1 1 0 0 0-7 0v11a1 1 0 0 1-7 0V10"/><path d="M21 21v-2"/><path d="M3 5V3"/><path d="M4 10a2 2 0 0 1-2-2V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a2 2 0 0 1-2 2z"/><path d="M7 5V3"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  circle_check:
    '<path d="M21.8 10A10 10 0 1 1 17 3.3"/><path d="m9 11 3 3L22 4"/>',
  flame:
    '<path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4"/>',
  lightbulb:
    '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
  sparkles:
    '<path d="M11 2.8a1 1 0 0 1 2 0l1 5.6a2 2 0 0 0 1.6 1.6l5.6 1a1 1 0 0 1 0 2l-5.6 1a2 2 0 0 0-1.6 1.6l-1 5.6a1 1 0 0 1-2 0l-1-5.6a2 2 0 0 0-1.6-1.6l-5.6-1a1 1 0 0 1 0-2l5.6-1a2 2 0 0 0 1.6-1.6z"/>',
  star: '<path d="M11.5 2.3a.5.5 0 0 1 1 0l2.3 4.7a2.1 2.1 0 0 0 1.6 1.2l5.2.7a.5.5 0 0 1 .3.9l-3.7 3.6a2.1 2.1 0 0 0-.6 1.9l.9 5.1a.5.5 0 0 1-.8.6L13 18.6a2.1 2.1 0 0 0-2 0l-4.6 2.4a.5.5 0 0 1-.8-.6l.9-5.1a2.1 2.1 0 0 0-.6-1.9L2.2 9.8a.5.5 0 0 1 .3-.9l5.2-.7a2.1 2.1 0 0 0 1.6-1.2z"/>',
  rotate_ccw:
    '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
  volume_2:
    '<path d="M11 4.7a.7.7 0 0 0-1.2-.5L6.4 7.6A1.4 1.4 0 0 1 5.4 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.4a1.4 1.4 0 0 1 1 .4l3.4 3.4a.7.7 0 0 0 1.2-.5z"/><path d="M16 9a5 5 0 0 1 0 6"/><path d="M19.4 18.4a9 9 0 0 0 0-12.8"/>',
  volume_x:
    '<path d="M11 4.7a.7.7 0 0 0-1.2-.5L6.4 7.6A1.4 1.4 0 0 1 5.4 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.4a1.4 1.4 0 0 1 1 .4l3.4 3.4a.7.7 0 0 0 1.2-.5z"/><path d="m16.5 14.5 5-5"/><path d="m16.5 9.5 5 5"/>',
  zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
  trophy:
    '<path d="M10 14.7V17a1 1 0 0 1-1 1 2 2 0 0 0-2 2v2"/><path d="M14 14.7V17a1 1 0 0 0 1 1 2 2 0 0 1 2 2v2"/><path d="M17.9 10h1.6A2.5 2.5 0 0 0 22 7.5V5a1 1 0 0 0-1-1h-3"/><path d="M4 22h16"/><path d="M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z"/><path d="M6.1 10H4.5A2.5 2.5 0 0 1 2 7.5V5a1 1 0 0 1 1-1h3"/>',
  download:
    '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  rocket:
    '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
  waves:
    '<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>',
  thermometer:
    '<path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>',
  wifi: '<path d="M12 20h.01"/><path d="M2 8.8a15 15 0 0 1 20 0"/><path d="M5 12.9a10 10 0 0 1 14 0"/><path d="M8.5 16.4a5 5 0 0 1 7 0"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.9 4.9 1.4 1.4"/><path d="m17.7 17.7 1.4 1.4"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.3 17.7-1.4 1.4"/><path d="m19.1 4.9-1.4 1.4"/>',
  wind: '<path d="M12.8 19.6A2 2 0 1 0 14 16H2"/><path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"/><path d="M9.8 4.4A2 2 0 1 1 11 8H2"/>',
  bot: '<rect width="18" height="12" x="3" y="6" rx="2"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><path d="M12 2v4"/><path d="M2 10h1"/><path d="M21 10h1"/>',
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

// ============================================================================
// AUDIO SYNTHESIZER (WEB AUDIO API)
// ============================================================================

function useAudio(soundOn) {
  const ctxRef = useRef(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      try {
        const AudioClass = window.AudioContext || window.webkitAudioContext;
        if (AudioClass) ctxRef.current = new AudioClass();
      } catch {
        /* ignore */
      }
    }
    return ctxRef.current;
  }, []);

  const playTone = useCallback(
    (freq, start, duration, type = "sine", vol = 0.12) => {
      if (!soundOn) return;
      const ctx = getCtx();
      if (!ctx) return;
      try {
        if (ctx.state === "suspended") ctx.resume();
        const t0 = ctx.currentTime + start;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, t0);
        gain.gain.setValueAtTime(0, t0);
        gain.gain.linearRampToValueAtTime(vol, t0 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t0);
        osc.stop(t0 + duration + 0.02);
      } catch {
        /* ignore */
      }
    },
    [soundOn, getCtx]
  );

  return useMemo(
    () => ({
      click: () => playTone(880, 0, 0.04, "square", 0.04),
      nav: () => {
        playTone(550, 0, 0.04, "sine", 0.06);
        playTone(820, 0.04, 0.08, "sine", 0.06);
      },
      success: () => {
        playTone(523.25, 0, 0.12, "sine");
        playTone(659.25, 0.08, 0.12, "sine");
        playTone(783.99, 0.16, 0.24, "sine");
        playTone(1046.5, 0.24, 0.35, "sine");
      },
      fail: () => {
        playTone(220, 0, 0.14, "sawtooth", 0.08);
        playTone(146.8, 0.1, 0.28, "sawtooth", 0.09);
      },
      sim: () => {
        playTone(330, 0, 0.08, "triangle", 0.07);
        playTone(660, 0.08, 0.12, "sine", 0.07);
      },
    }),
    [playTone]
  );
}

// ============================================================================
// BILINGUAL LOCALIZATION (RU / KY)
// ============================================================================

const STR = {
  ru: {
    nav: {
      tagline: "Онлайн-лаборатория по физике",
      questsTab: "9 класс: Квесты",
      advancedTab: "10–11 класс: Лаборатории",
      stars: "звёзд",
    },
    welcome: {
      kicker: "FLUXLAB · СИЛА ФИЗИКИ В ДЕЙСТВИИ",
      tagline: "SEE IT. TEST IT. GET IT.",
      title: "Инженер внутри тебя",
      desc: "Интерактивная физическая лаборатория нового поколения. Спасай инфраструктуру в регионах Кыргызстана и исследуй законы природы на продвинутых вычислительных симуляторах FastAPI.",
      startBtn: "Начать эксперимент",
      advBtn: "Продвинутые симуляции (10–11 класс)",
      badges: [
        { icon: "zap", title: "Электродинамика", desc: "Делители напряжения, стабилизаторы и вентильные диоды" },
        { icon: "rocket", title: "Баллистика", desc: "Численное интегрирование движения тел с аэродинамикой" },
        { icon: "waves", title: "Колебания и волны", desc: "Маятники, затухание и построение фазовых портретов" },
        { icon: "thermometer", title: "Молекулярная физика", desc: "Изопроцессы идеального газа, работа и энергия ΔU" },
      ],
    },
    map: {
      title: "Инженерные миссии Кыргызстана",
      subtitle: "Три региона — три реальные поломки. Собери цепь и восстанови работу техники.",
      progress: (n) => `${n} из 3 миссий завершено`,
      btnStart: "Перейти к верстаку",
      done: "Пройдено",
    },
    missions: {
      naryn: {
        region: "Нарын",
        location: "Жайлоо Сон-Куль",
        title: "Защита интернет-роутера чабана",
        desc: "Солнечная панель выдаёт 24 В, а роутеру для питания связи нужно ровно 12 В. При прямом подключении роутер сгорит от перенапряжения. Подбери деталь в цепь!",
        sourceName: "Солнечная батарея",
        sourceSpec: "24 В (пост. ток)",
        deviceName: "Спутниковый роутер",
        deviceSpec: "Требуется 12 В",
        correctPart: "resistor",
        successTitle: "Связь восстановлена!",
        successBody: "Резисторный делитель снизил напряжение с 24 В до безопасных 12 В. Роутер запущен, чабан онлайн!",
        fails: {
          empty: { title: "Роутер сгорел!", body: "В цепи пусто — все 24 В ударили напрямую в электронику роутера." },
          wire: { title: "Роутер сгорел!", body: "Провод обладает нулевым сопротивлением — напряжение не снизилось." },
          lamp: { title: "Перегрузка!", body: "Лампочка горит, но её падения напряжения недостаточно для защиты роутера." },
          battery: { title: "Взрыв цепи!", body: "Дополнительная батарея добавила лишние вольты — роутер мгновенно сгорел." },
          capacitor: { title: "Роутер сгорел!", body: "Конденсатор накапливает заряд, но не обеспечивает постоянное деление напряжения." },
        },
        labTitle: "Формула делителя напряжения",
        lUin: "Напряжение панели (Uin)",
        lR1: "Резистор R1",
        lR2: "Резистор R2",
        lUout: "Напряжение на роутере (Uout)",
        safeMsg: "Безопасно: 11.5 - 12.5 В",
        highMsg: "Опасно высоко — сгорит!",
        lowMsg: "Слишком мало — не включится",
      },
      issykkul: {
        region: "Иссык-Куль",
        location: "Юрточный лагерь",
        title: "Стабилизация питания ветрогенератора",
        desc: "На побережье туристы заряжают гаджеты от ветряка. Порывы ветра разгоняют генератор до 20 В, а зарядной станции строго нужно 5 В. Без стабилизации скачок напряжения спалит телефоны!",
        sourceName: "Ветрогенератор",
        sourceSpec: "Скачки до 20 В",
        deviceName: "Зарядная станция",
        deviceSpec: "Строго 5.0 В",
        correctPart: "stabilizer",
        successTitle: "Телефоны в безопасности!",
        successBody: "Интегральный стабилизатор удерживает ровные 5 В даже при резких шквалах ветра до 20 В.",
        fails: {
          empty: { title: "Станция сгорела!", body: "Импульс 20 В уничтожил микросхемы контроллеров заряда." },
          resistor: { title: "Скачок сжёг телефоны!", body: "Резистор гасит лишь фиксированную разницу — при порыве ветра напряжение пробило защиту." },
          wire: { title: "Станция сгорела!", body: "Провод пропустил весь скачок без изменений." },
          lamp: { title: "Станция сгорела!", body: "Лампа не стабилизирует вольтаж." },
          battery: { title: "Двойная перегрузка!", body: "Батарея лишь усугубила бросок напряжения." },
        },
        labTitle: "Резистор против Стабилизатора",
        lUin: "Напряжение генератора (Uin)",
        modeResistor: "Обычный резистор",
        modeStabilizer: "Стабилизатор 7805",
        safeMsg: "Стабильные 5.0 В: зарядка идёт",
        highMsg: "Скачок напряжения: телефоны сгорят!",
        lowMsg: "Напряжение ниже 5 В: нет заряда",
      },
      osh: {
        region: "Ош",
        location: "Фермерская долина",
        title: "Защита солнечной панели от обратного тока",
        desc: "Насос полива питается от солнечной панели и аккумулятора 12 В. Ночью панель не генерирует ток, и заряженный аккумулятор начинает разряжаться обратно в панель, нагревая её. Нужен односторонний клапан для тока!",
        sourceName: "Солнечная панель",
        sourceSpec: "День: 18 В / Ночь: 0 В",
        deviceName: "Поливочный насос",
        deviceSpec: "Аккумулятор 12 В",
        correctPart: "diode",
        successTitle: "Панель спасена!",
        successBody: "Диод пропускает ток заряда днём и намертво блокирует обратную утечку ночью.",
        fails: {
          empty: { title: "Панель повреждена!", body: "Ночью ток потёк обратно в панель, вызвав перегрев фотоэлементов." },
          resistor: { title: "Обратный ток продолжается!", body: "Резистор симметричен — ток течёт в обе стороны одинаково." },
          wire: { title: "Панель повреждена!", body: "Провод свободно пропустил обратный разряд аккумулятора." },
          lamp: { title: "Панель перегрета!", body: "Лампа горит за счёт аккумулятора, разряжая его в панель." },
          battery: { title: "Короткое замыкание!", body: "Два несогласованных источника повредили систему." },
        },
        labTitle: "Закон Ома и односторонняя проводимость",
        dayBtn: "Дневной режим (18 В)",
        nightBtn: "Ночной режим (0 В)",
        diodeOn: "С диодом",
        diodeOff: "Без диода",
        lR: "Сопротивление нагрузки R",
        lI: "Сила тока в цепи (I)",
        safeDay: "Ток идёт на насос (+I)",
        safeNight: "Диод блокирует обратный ток (I = 0)",
        badNight: "Опасность! Ток течёт назад в панель (-I)",
      },
    },
    workbench: {
      backBtn: "К карте миссий",
      warehouseTitle: "Склад радиодеталей — нажми для установки в слот",
      sourceTitle: "Источник энергии",
      slotTitle: "Монтажный слот",
      consumerTitle: "Потребитель",
      emptySlot: "Слот пуст",
      testBtn: "Подать ток (Тест)",
      resetBtn: "Сбросить цепь",
      mentorTitle: "AI Ментор FluxLab",
      mentorThinking: "Ментор анализирует схему...",
      askMentorBtn: "Спросить совет ментора",
      parts: {
        resistor: "Резистор (1 кОм)",
        wire: "Проводник",
        lamp: "Лампа накаливания",
        capacitor: "Конденсатор (100 мкФ)",
        stabilizer: "Стабилизатор (5 В)",
        diode: "Диод Шоттки",
      },
    },
    advanced: {
      title: "Продвинутая физическая лаборатория",
      subtitle: "Математические симуляторы на базе FastAPI, Pydantic v2 и NumPy с экспортом отчетов.",
      tabProjectile: "1. Баллистика и кинематика",
      tabPendulum: "2. Маятники и волны",
      tabGas: "3. Изопроцессы газа (МКТ)",
      runBtn: "Запустить симуляцию",
      calculating: "Вычисление модели...",
      exportBtn: "📥 Скачать отчёт лаборатории (CSV)",
      offlineBadge: "Автономный режим (локальный расчет)",
      onlineBadge: "FastAPI Backend Online",
      projectile: {
        v0: "Начальная скорость v₀ (м/с)",
        angle: "Угол к горизонту α (°)",
        h0: "Начальная высота h₀ (м)",
        drag: "Аэродинамическое сопротивление воздуха",
        env: "Среда симуляции",
        envEarth: "Земля (g=9.81, ρ=1.225)",
        envMars: "Марс (g=3.71, ρ=0.020)",
        envMoon: "Луна (g=1.62, вакуум)",
        envWater: "Вода (g=9.81, ρ=1000)",
        telemetry: {
          range: "Дальность полёта L (м)",
          height: "Макс. высота H (м)",
          time: "Время полёта T (с)",
          finalSpeed: "Конечная скорость v (м/с)",
          energy: "Кинетическая энергия Eₖ (Дж)",
        },
      },
      pendulum: {
        type: "Тип колебательной системы",
        typeSimple: "Математический маятник (нить)",
        typeSpring: "Пружинный маятник (k)",
        length: "Длина нити L (м)",
        k: "Жесткость пружины k (Н/м)",
        mass: "Масса груза m (кг)",
        amp: "Начальная амплитуда x₀ (м)",
        damping: "Коэффициент затухания β",
        telemetry: {
          period: "Период колебаний T (с)",
          freq: "Частота ν (Гц)",
          omega: "Циклическая частота ω₀ (рад/с)",
          damping: "Режим колебаний",
        },
      },
      gas: {
        process: "Термодинамический изопроцесс",
        pIsoT: "Изотермический (T = const)",
        pIsoV: "Изохорный (V = const)",
        pIsoP: "Изобарный (P = const)",
        moles: "Количество вещества ν (моль)",
        p0: "Начальное давление P₀ (кПа)",
        v0: "Начальный объем V₀ (л)",
        t0: "Начальная температура T₀ (К)",
        target: "Конечный параметр (V₁ или T₁)",
        telemetry: {
          work: "Работа газа W (Дж)",
          deltaU: "Изменение энергии ΔU (Дж)",
          finalP: "Конечное давление P₁ (кПа)",
          finalT: "Конечная температура T₁ (К)",
        },
      },
    },
  },
  ky: {
    nav: {
      tagline: "Физика боюнча онлайн-лаборатория",
      questsTab: "9-класс: Тапшырмалар",
      advancedTab: "10–11-класс: Лабораториялар",
      stars: "жылдыз",
    },
    welcome: {
      kicker: "FLUXLAB · ФИЗИКАНЫН КҮЧҮ ИШ ҮСТҮНДӨ",
      tagline: "SEE IT. TEST IT. GET IT.",
      title: "Ичиңдеги инженер",
      desc: "Жаңы муундагы интерактивдүү физика лабораториясы. Кыргызстандын аймактарындагы реалдуу инженердик бузулууларды чеч жана FastAPI эсептөө симуляторлорунда жаратылыш мыйзамдарын изилде.",
      startBtn: "Экспериментти баштоо",
      advBtn: "Өркүндөтүлгөн симуляциялар (10–11-класс)",
      badges: [
        { icon: "zap", title: "Электродинамика", desc: "Чыңалуу бөлгүчтөр, стабилизаторлор жана диоддор" },
        { icon: "rocket", title: "Баллистика", desc: "Аэродинамика менен нерселердин кыймылын сандык эсептөө" },
        { icon: "waves", title: "Термелүүлөр жана толкундар", desc: "Маятниктер, өчүү жана фазалык портреттер" },
        { icon: "thermometer", title: "Молекулалык физика", desc: "Идеал газ изопроцесстери, жумуш жана ички энергия ΔU" },
      ],
    },
    map: {
      title: "Кыргызстандын инженердик миссиялары",
      subtitle: "Үч аймак — үч реалдуу бузулуу. Схеманы жыйнап, техниканын ишин калыбына келтир.",
      progress: (n) => `${n} / 3 тапшырма аткарылды`,
      btnStart: "Верстакка өтүү",
      done: "Аткарылды",
    },
    missions: {
      naryn: {
        region: "Нарын",
        location: "Соң-Көл жайлоосу",
        title: "Чабандын интернет-роутерин сактоо",
        desc: "Күн батареясы 24 В берет, ал эми роутерге так 12 В керек. Түз туташтырсаң роутер күйүп кетет. Чынжырга ылайыктуу деталды кой!",
        sourceName: "Күн батареясы",
        sourceSpec: "24 В (туруктуу ток)",
        deviceName: "Спутник роутери",
        deviceSpec: "12 В керек",
        correctPart: "resistor",
        successTitle: "Байланыш калыбына келди!",
        successBody: "Резистор чыңалууну 24 В дан керектүү 12 В га түшүрдү. Роутер иштеди, чабан байланышта!",
        fails: {
          empty: { title: "Роутер күйдү!", body: "Схемага эч нерсе коюлган жок — 24 В роутерге түз тийди." },
          wire: { title: "Роутер күйдү!", body: "Зымдын каршылыгы жок — чыңалуу түшкөн жок." },
          lamp: { title: "Ашыкча чыңалуу!", body: "Лампочка күйөт, бирок чыңалууну жетиштүү азайтпайт." },
          battery: { title: "Жарылуу коркунучу!", body: "Кошумча батарея вольтту көбөйтүп, роутерди өрттөп салды." },
          capacitor: { title: "Роутер күйдү!", body: "Конденсатор заряд топтойт, бирок чыңалууну туруктуу бөлбөйт." },
        },
        labTitle: "Чыңалуу бөлгүчтүн формуласы",
        lUin: "Панелдин чыңалуусу (Uin)",
        lR1: "Резистор R1",
        lR2: "Резистор R2",
        lUout: "Роутердеги чыңалуу (Uout)",
        safeMsg: "Коопсуз: 11.5 - 12.5 В",
        highMsg: "Өтө жогору — күйөт!",
        lowMsg: "Өтө аз — иштебейт",
      },
      issykkul: {
        region: "Ысык-Көл",
        location: "Боз үй лагери",
        title: "Шамал генераторунун чыңалуусун турукташтыруу",
        desc: "Жээктеги туристтер телефондорун шамал генераторунан кубаттайт. Шамал күчөгөндө чыңалуу 20 В чейин секирет, ал эми станцияга так 5 В керек. Турукташтырбасаң секирик телефондорду күйгүзөт!",
        sourceName: "Шамал генератору",
        sourceSpec: "20 В чейин секирет",
        deviceName: "Кубаттоо станциясы",
        deviceSpec: "Так 5.0 В керек",
        correctPart: "stabilizer",
        successTitle: "Телефондор коопсуздукта!",
        successBody: "Интегралдык стабилизатор 20 В чейинки катуу шамалда да так 5 В чыңалууну кармап турат.",
        fails: {
          empty: { title: "Станция күйдү!", body: "20 В секирик контроллер микросхемаларын өрттөп кетти." },
          resistor: { title: "Телефондор күйдү!", body: "Резистор туруктуу гана төмөндөтөт — шамал күчөгөндө чыңалуу секиригин кармай алган жок." },
          wire: { title: "Станция күйдү!", body: "Зым секирикти өзгөртүүсүз түз өткөрдү." },
          lamp: { title: "Станция күйдү!", body: "Лампочка чыңалууну турукташтырбайт." },
          battery: { title: "Кош ашыкча чыңалуу!", body: "Батарея чыңалуу секиригин ого бетер күчөттү." },
        },
        labTitle: "Резистор менен Стабилизатордун айырмасы",
        lUin: "Генератордун чыңалуусу (Uin)",
        modeResistor: "Жөнөкөй резистор",
        modeStabilizer: "Стабилизатор 7805",
        safeMsg: "Туруктуу 5.0 В: кубаттоо жүрүүдө",
        highMsg: "Чыңалуу секирди: телефондор күйөт!",
        lowMsg: "5 В дан төмөн: кубатталбайт",
      },
      osh: {
        region: "Ош",
        location: "Фермерлер өрөөнү",
        title: "Күн панелин тескери токдон коргоо",
        desc: "Сугаруучу насос күн панелинен жана 12 В аккумулятордон иштейт. Түнкүсүн күн жок болгондо заряддалган аккумулятор токту кайра панелге берип, аны ысытып күйгүзүшү мүмкүн. Бир жактуу клапан керек!",
        sourceName: "Күн панели",
        sourceSpec: "Күндүз: 18 В / Түндө: 0 В",
        deviceName: "Сугаруу насосу",
        deviceSpec: "Аккумулятор 12 В",
        correctPart: "diode",
        successTitle: "Панель корголду!",
        successBody: "Диод күндүз кубаттоо тогун өткөрөт, ал эми түнкүсүн тескери агымды толугу менен бөгөйт.",
        fails: {
          empty: { title: "Панель бузулду!", body: "Түнкүсүн ток кайра панелге агып, фотоэлементтерди ысытты." },
          resistor: { title: "Тескери ток токтогон жок!", body: "Резистор токту эки тарапка тең бирдей өткөрөт." },
          wire: { title: "Панель бузулду!", body: "Зым тескери токту тоскоолдуксуз өткөрүп жиберди." },
          lamp: { title: "Панель ысып кетти!", body: "Лампочка аккумулятордун эсебинен күйүп, аны түгөтөт." },
          battery: { title: "Кыска туташуу!", body: "Эки булак бири-бирин бузуп салды." },
        },
        labTitle: "Ом мыйзамы жана бир жактуу өткөрүмдүүлүк",
        dayBtn: "Күндүзгү режим (18 В)",
        nightBtn: "Түнкү режим (0 В)",
        diodeOn: "Диод менен",
        diodeOff: "Диодсуз",
        lR: "Жүктөмдүн каршылыгы R",
        lI: "Чынжырдагы токтун күчү (I)",
        safeDay: "Ток насоско барууда (+I)",
        safeNight: "Диод тескери токту бөгөйт (I = 0)",
        badNight: "Коркунуч! Ток кайра панелге агууда (-I)",
      },
    },
    workbench: {
      backBtn: "Тапшырмалар картасына",
      warehouseTitle: "Буюмдар кампасы — слотко коюу үчүн бас",
      sourceTitle: "Энергия булагы",
      slotTitle: "Орнотуу слоту",
      consumerTitle: "Прибор",
      emptySlot: "Слот бош",
      testBtn: "Токту бер (Сыноо)",
      resetBtn: "Чынжырды тазалоо",
      mentorTitle: "FluxLab AI Ментору",
      mentorThinking: "Ментор схеманы талдоодо...",
      askMentorBtn: "Ментордон кеңеш суроо",
      parts: {
        resistor: "Резистор (1 кОм)",
        wire: "Өткөргүч зым",
        lamp: "Ысытуу лампасы",
        capacitor: "Конденсатор (100 мкФ)",
        stabilizer: "Стабилизатор (5 В)",
        diode: "Шоттки диоду",
      },
    },
    advanced: {
      title: "Өркүндөтүлгөн физика лабораториясы",
      subtitle: "FastAPI, Pydantic v2 жана NumPy негизиндеги эсептөө симуляторлору жана отчетту экспорттоо.",
      tabProjectile: "1. Баллистика жана кинематика",
      tabPendulum: "2. Маятниктер жана толкундар",
      tabGas: "3. Газ изопроцесстери (МКТ)",
      runBtn: "Симуляцияны баштоо",
      calculating: "Модель эсептелүүдө...",
      exportBtn: "📥 Лабораториялык отчетту жүктөө (CSV)",
      offlineBadge: "Автономдуу режим (жергиликтүү эсеп)",
      onlineBadge: "FastAPI Backend Online",
      projectile: {
        v0: "Баштапкы ылдамдык v₀ (м/с)",
        angle: "Горизонтко бурч α (°)",
        h0: "Баштапкы бийиктик h₀ (м)",
        drag: "Абанын аэродинамикалык каршылыгы",
        env: "Симуляция чөйрөсү",
        envEarth: "Жер (g=9.81, ρ=1.225)",
        envMars: "Марс (g=3.71, ρ=0.020)",
        envMoon: "Ай (g=1.62, вакуум)",
        envWater: "Суу (g=9.81, ρ=1000)",
        telemetry: {
          range: "Учуу аралыгы L (м)",
          height: "Макс. бийиктик H (м)",
          time: "Учуу убактысы T (с)",
          finalSpeed: "Акыркы ылдамдык v (м/с)",
          energy: "Кинетикалык энергия Eₖ (Ж)",
        },
      },
      pendulum: {
        type: "Термелүү системасынын түрү",
        typeSimple: "Математикалык маятник (жип)",
        typeSpring: "Пружиналуу маятник (k)",
        length: "Жиптин узундугу L (м)",
        k: "Пружинанын катуулугу k (Н/м)",
        mass: "Жүктүн салмагы m (кг)",
        amp: "Баштапкы амплитуда x₀ (м)",
        damping: "Өчүү коэффициенти β",
        telemetry: {
          period: "Термелүү мезгили T (с)",
          freq: "Жыштыгы ν (Гц)",
          omega: "Айланма жыштыгы ω₀ (рад/с)",
          damping: "Термелүү режими",
        },
      },
      gas: {
        process: "Термодинамикалык изопроцесс",
        pIsoT: "Изотермикалык (T = const)",
        pIsoV: "Изохоралык (V = const)",
        pIsoP: "Изобаралык (P = const)",
        moles: "Заттын саны ν (моль)",
        p0: "Баштапкы басым P₀ (кПа)",
        v0: "Баштапкы көлөм V₀ (л)",
        t0: "Баштапкы температура T₀ (К)",
        target: "Акыркы параметр (V₁ же T₁)",
        telemetry: {
          work: "Газдын жумушу W (Ж)",
          deltaU: "Ички энергиянын өзгөрүшү ΔU (Ж)",
          finalP: "Акыркы басым P₁ (кПа)",
          finalT: "Акыркы температура T₁ (К)",
        },
      },
    },
  },
};

const MISSIONS_LIST = [
  { id: "naryn", key: "naryn", color: "#377DFF", icon: "wifi", grade: 9 },
  { id: "issykkul", key: "issykkul", color: "#35D6FF", icon: "wind", grade: 9 },
  { id: "osh", key: "osh", color: "#FFD84D", icon: "sun", grade: 9 },
];

// ============================================================================
// API CLIENT WITH COMPLETE OFFLINE ENGINE FALLBACKS
// ============================================================================

async function fetchAskMentor({ question, circuit_state, lang }) {
  try {
    const res = await fetch(MENTOR_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, circuit_state, lang }),
    });
    if (res.ok) {
      const data = await res.json();
      return { answer: data.answer, source: data.source || "gemini" };
    }
  } catch {
    /* Fallback */
  }

  // Fallback offline logic
  const isKy = lang === "ky";
  if (circuit_state === 3) {
    return {
      answer: isKy
        ? "Азаматсың! Чынжыр эң сонун жыйналды. Бардык параметрлер коопсуз чекте жана прибор корголгон."
        : "Отличная работа! Цепь замкнута идеально: напряжение и ток находятся в безопасных пределах, элемент выполняет свою защитную функцию.",
      source: "expert_fallback",
    };
  }
  return {
    answer: isKy
      ? "Көңүл бур! Схемага коргоочу же чыңалууну бөлүүчү деталды койбосоң прибор күйүп кетет. Ом мыйзамын эсиңе тут!"
      : "Внимание: прибор перегружен или не защищён! Подбери компонент с нужным сопротивлением или вентильными свойствами.",
    source: "expert_fallback",
  };
}

async function fetchSimulateProjectile(params) {
  try {
    const res = await fetch(`${API_BASE}/api/v1/labs/kinematics/projectile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    if (res.ok) return await res.json();
  } catch {
    /* fallback to local math */
  }

  // Local client Euler simulation fallback
  const { initial_velocity: v0, angle_deg, initial_height = 0, gravity = 9.807, air_resistance = false, dt = 0.02 } = params;
  const rad = (angle_deg * Math.PI) / 180;
  let vx = v0 * Math.cos(rad);
  let vy = v0 * Math.sin(rad);
  let x = 0;
  let y = initial_height;
  let t = 0;
  const points = [];
  let maxH = y;

  while (y >= 0 && points.length < 1500) {
    points.push({ t: Math.round(t * 100) / 100, x: Math.round(x * 100) / 100, y: Math.round(Math.max(0, y) * 100) / 100 });
    maxH = Math.max(maxH, y);
    const speed = Math.hypot(vx, vy);
    const drag = air_resistance ? 0.002 * speed * speed : 0;
    const ax = -drag * (vx / (speed || 1));
    const ay = -gravity - drag * (vy / (speed || 1));
    vx += ax * dt;
    vy += ay * dt;
    x += vx * dt;
    y += vy * dt;
    t += dt;
  }

  return {
    points,
    flight_time: Math.round(t * 100) / 100,
    max_height: Math.round(maxH * 100) / 100,
    max_range: Math.round(x * 100) / 100,
    final_speed: Math.round(Math.hypot(vx, vy) * 100) / 100,
    initial_kinetic_energy: Math.round(0.5 * 1.0 * v0 * v0 * 100) / 100,
  };
}

async function fetchSimulatePendulum(params) {
  try {
    const res = await fetch(`${API_BASE}/api/v1/labs/waves/pendulum`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    if (res.ok) return await res.json();
  } catch {
    /* fallback */
  }

  const { pendulum_type = "simple", length = 1.0, spring_constant = 20.0, mass = 1.0, amplitude = 0.5, damping_coefficient = 0.2, gravity = 9.807, duration = 8.0, dt = 0.04 } = params;
  const omega0 = pendulum_type === "simple" ? Math.sqrt(gravity / length) : Math.sqrt(spring_constant / mass);
  const gamma = damping_coefficient / (2 * mass);
  const omega_d = gamma < omega0 ? Math.sqrt(omega0 * omega0 - gamma * gamma) : 0;
  const period = omega_d > 0 ? (2 * Math.PI) / omega_d : 0;

  const points = [];
  const steps = Math.floor(duration / dt);
  let x = amplitude;
  let v = 0;
  let t = 0;

  for (let i = 0; i <= steps; i++) {
    points.push({ t: Math.round(t * 100) / 100, displacement: Math.round(x * 1000) / 1000, velocity: Math.round(v * 1000) / 1000 });
    const a = -2 * gamma * v - omega0 * omega0 * x;
    v += a * dt;
    x += v * dt;
    t += dt;
  }

  return {
    period: Math.round(period * 100) / 100,
    frequency: period > 0 ? Math.round((1 / period) * 100) / 100 : 0,
    angular_frequency: Math.round(omega0 * 100) / 100,
    displacement_graph: points,
  };
}

async function fetchSimulateGasLaws(params) {
  try {
    const res = await fetch(`${API_BASE}/api/v1/labs/particles/gas-laws`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    if (res.ok) return await res.json();
  } catch {
    /* fallback */
  }

  const { process_type, moles = 1.0, initial_pressure = 101325, initial_volume = 0.024, initial_temperature = 293, target_value = 0.048 } = params;
  const R = 8.314;
  const steps = 25;
  const points = [];
  let totalW = 0;
  let totalDU = 0;

  if (process_type === "isothermal") {
    const v1 = target_value;
    for (let i = 0; i < steps; i++) {
      const v = initial_volume + ((v1 - initial_volume) * i) / (steps - 1);
      const p = (moles * R * initial_temperature) / v;
      points.push({ volume: Math.round(v * 10000) / 10000, pressure: Math.round(p / 100) / 10, temperature: initial_temperature });
    }
    totalW = moles * R * initial_temperature * Math.log(v1 / initial_volume);
    totalDU = 0;
  } else if (process_type === "isochoric") {
    const t1 = target_value;
    for (let i = 0; i < steps; i++) {
      const t = initial_temperature + ((t1 - initial_temperature) * i) / (steps - 1);
      const p = (moles * R * t) / initial_volume;
      points.push({ volume: Math.round(initial_volume * 10000) / 10000, pressure: Math.round(p / 100) / 10, temperature: Math.round(t) });
    }
    totalW = 0;
    totalDU = moles * 1.5 * R * (t1 - initial_temperature);
  } else {
    const v1 = target_value;
    for (let i = 0; i < steps; i++) {
      const v = initial_volume + ((v1 - initial_volume) * i) / (steps - 1);
      const t = (initial_pressure * v) / (moles * R);
      points.push({ volume: Math.round(v * 10000) / 10000, pressure: Math.round(initial_pressure / 100) / 10, temperature: Math.round(t) });
    }
    totalW = initial_pressure * (v1 - initial_volume);
    const finalT = (initial_pressure * v1) / (moles * R);
    totalDU = moles * 1.5 * R * (finalT - initial_temperature);
  }

  return {
    points,
    total_work: Math.round(totalW * 10) / 10,
    total_internal_energy_change: Math.round(totalDU * 10) / 10,
    final_state: points[points.length - 1],
  };
}

async function triggerReportExport(reportPayload) {
  try {
    const res = await fetch(`${API_BASE}/api/v1/export/report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...reportPayload, format: "csv" }),
    });
    if (res.ok) {
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `FluxLab_Report_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      return true;
    }
  } catch {
    /* fallback to client CSV */
  }

  // Client-side CSV generation
  let csv = `Report: ${reportPayload.lab_title || "FluxLab Experiment"}\n`;
  csv += `User: ${reportPayload.user_id}\nDate: ${new Date().toISOString()}\n\n`;
  csv += "--- Parameters ---\n";
  for (const [k, v] of Object.entries(reportPayload.input_parameters || {})) {
    csv += `${k},${v}\n`;
  }
  csv += "\n--- Data Points ---\n";
  if (reportPayload.table_points && reportPayload.table_points.length > 0) {
    const headers = Object.keys(reportPayload.table_points[0]);
    csv += headers.join(",") + "\n";
    for (const pt of reportPayload.table_points) {
      csv += headers.map((h) => pt[h] ?? "").join(",") + "\n";
    }
  }
  csv += `\n--- Conclusions ---\n${reportPayload.conclusions || "Success"}\n`;

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `FluxLab_Report_${Date.now()}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  return true;
}

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

export default function App() {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem(LANG_KEY) || "ru";
    } catch {
      return "ru";
    }
  });

  const [soundOn, setSoundOn] = useState(() => {
    try {
      return localStorage.getItem(SOUND_KEY) !== "0";
    } catch {
      return true;
    }
  });

  const [stars, setStars] = useState(() => {
    try {
      const saved = localStorage.getItem(STARS_KEY);
      return saved ? JSON.parse(saved) : { naryn: 0, issykkul: 0, osh: 0 };
    } catch {
      return { naryn: 0, issykkul: 0, osh: 0 };
    }
  });

  const [screen, setScreen] = useState("welcome"); // 'welcome' | 'map' | 'mission' | 'advanced'
  const [activeMissionId, setActiveMissionId] = useState("naryn");
  const [activeAdvTab, setActiveAdvTab] = useState("projectile"); // 'projectile' | 'pendulum' | 'gas'

  // Workbench state
  const [selectedPart, setSelectedPart] = useState(null);
  const [placedPart, setPlacedPart] = useState(null);
  const [circuitVisual, setCircuitVisual] = useState("idle"); // 'idle' | 'success' | 'burnt'
  const [mentorData, setMentorData] = useState(null);
  const [mentorLoading, setMentorLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Advanced Labs State
  const [projectileParams, setProjectileParams] = useState({
    initial_velocity: 32,
    angle_deg: 45,
    initial_height: 0,
    gravity: 9.807,
    air_resistance: false,
    drag_coefficient: 0.47,
    cross_section_area: 0.05,
    air_density: 1.225,
  });
  const [projectileResult, setProjectileResult] = useState(null);

  const [pendulumParams, setPendulumParams] = useState({
    pendulum_type: "simple",
    length: 1.5,
    spring_constant: 25.0,
    mass: 1.2,
    amplitude: 0.4,
    damping_coefficient: 0.15,
    gravity: 9.807,
  });
  const [pendulumResult, setPendulumResult] = useState(null);

  const [gasParams, setGasParams] = useState({
    process_type: "isothermal",
    moles: 1.0,
    initial_pressure: 101325,
    initial_volume: 0.024,
    initial_temperature: 293.15,
    target_value: 0.048,
    steps: 25,
  });
  const [gasResult, setGasResult] = useState(null);
  const [advLoading, setAdvLoading] = useState(false);

  const sfx = useAudio(soundOn);
  const t = STR[lang];

  // Save state
  const toggleLang = () => {
    sfx.click();
    const next = lang === "ru" ? "ky" : "ru";
    setLang(next);
    try {
      localStorage.setItem(LANG_KEY, next);
    } catch {
      /* ignore */
    }
  };

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    try {
      localStorage.setItem(SOUND_KEY, next ? "1" : "0");
    } catch {
      /* ignore */
    }
  };

  const totalStars = Object.values(stars).reduce((a, b) => a + b, 0);

  // Open Mission
  const openMission = (id) => {
    sfx.nav();
    setActiveMissionId(id);
    setSelectedPart(null);
    setPlacedPart(null);
    setCircuitVisual("idle");
    setFeedback(null);
    setMentorData(null);
    setScreen("mission");
  };

  // Test Circuit Handler
  const handleTestCircuit = async () => {
    sfx.sim();
    const currentMission = t.missions[activeMissionId];
    const isCorrect = placedPart === currentMission.correctPart;

    if (isCorrect) {
      setCircuitVisual("success");
      sfx.success();
      const currentStar = stars[activeMissionId] || 0;
      const nextStars = { ...stars, [activeMissionId]: Math.max(currentStar, 3) };
      setStars(nextStars);
      try {
        localStorage.setItem(STARS_KEY, JSON.stringify(nextStars));
      } catch {
        /* ignore */
      }

      setFeedback({
        kind: "success",
        title: currentMission.successTitle,
        body: currentMission.successBody,
      });

      // Ask mentor automatically
      setMentorLoading(true);
      const mentorResp = await fetchAskMentor({
        question: currentMission.title,
        circuit_state: 3,
        lang,
      });
      setMentorData(mentorResp);
      setMentorLoading(false);
    } else {
      setCircuitVisual("burnt");
      sfx.fail();
      const failInfo = currentMission.fails[placedPart || "empty"] || currentMission.fails.empty;
      setFeedback({
        kind: "fail",
        title: failInfo.title,
        body: failInfo.body,
      });

      setMentorLoading(true);
      const mentorResp = await fetchAskMentor({
        question: `${currentMission.title}: выбран ${placedPart || "пусто"}`,
        circuit_state: 1,
        lang,
      });
      setMentorData(mentorResp);
      setMentorLoading(false);
    }
  };

  const handleResetCircuit = () => {
    sfx.click();
    setSelectedPart(null);
    setPlacedPart(null);
    setCircuitVisual("idle");
    setFeedback(null);
    setMentorData(null);
  };

  // Run Advanced Sim
  const runAdvancedSim = async (tab = activeAdvTab) => {
    sfx.sim();
    setAdvLoading(true);
    if (tab === "projectile") {
      const res = await fetchSimulateProjectile(projectileParams);
      setProjectileResult(res);
    } else if (tab === "pendulum") {
      const res = await fetchSimulatePendulum(pendulumParams);
      setPendulumResult(res);
    } else if (tab === "gas") {
      const res = await fetchSimulateGasLaws(gasParams);
      setGasResult(res);
    }
    setAdvLoading(false);
  };

  // Run initial simulation for advanced lab
  useEffect(() => {
    if (screen === "advanced") {
      if (activeAdvTab === "projectile" && !projectileResult) runAdvancedSim("projectile");
      if (activeAdvTab === "pendulum" && !pendulumResult) runAdvancedSim("pendulum");
      if (activeAdvTab === "gas" && !gasResult) runAdvancedSim("gas");
    }
  }, [screen, activeAdvTab]);

  return (
    <div className="min-h-screen bg-[#081C36] text-[#F4F8FC] flex flex-col font-sans selection:bg-[#35D6FF]/30 selection:text-[#F4F8FC]">
      {/* ==================================================================== */}
      {/* TOPBAR / HEADER */}
      {/* ==================================================================== */}
      <header className="sticky top-0 z-50 bg-[#0D2547]/90 backdrop-blur-md border-b border-[#35D6FF]/20 px-4 sm:px-6 py-3 transition">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Logo & Brand */}
          <button
            onClick={() => {
              sfx.nav();
              setScreen("welcome");
            }}
            className="flex items-center gap-3 text-left focus:outline-none group"
          >
            <img src="/logo.svg" alt="FluxLab" className="h-9 w-auto mr-1 transition-transform group-hover:scale-105" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-wider bg-gradient-to-r from-[#F4F8FC] via-[#35D6FF] to-[#377DFF] bg-clip-text text-transparent">
                  FluxLab
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#35D6FF]/15 text-[#35D6FF] border border-[#35D6FF]/30 hidden sm:inline-block">
                  2.0
                </span>
              </div>
              <p className="text-[11px] font-medium text-[#A1B5D8] hidden md:block">{t.nav.tagline}</p>
            </div>
          </button>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 bg-[#081C36]/80 p-1 rounded-xl border border-[#35D6FF]/20">
            <button
              onClick={() => {
                sfx.click();
                setScreen("map");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition ${
                screen === "map" || screen === "mission"
                  ? "bg-[#377DFF] text-[#F4F8FC] shadow-lg shadow-[#377DFF]/30"
                  : "text-[#A1B5D8] hover:text-[#F4F8FC]"
              }`}
            >
              <Ico name="zap" size={15} />
              <span>{t.nav.questsTab}</span>
            </button>
            <button
              onClick={() => {
                sfx.click();
                setScreen("advanced");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition ${
                screen === "advanced"
                  ? "bg-[#377DFF] text-[#F4F8FC] shadow-lg shadow-[#377DFF]/30"
                  : "text-[#A1B5D8] hover:text-[#F4F8FC]"
              }`}
            >
              <Ico name="activity" size={15} />
              <span>{t.nav.advancedTab}</span>
            </button>
          </div>

          {/* Controls: Stars, Lang, Audio */}
          <div className="flex items-center gap-2">
            {/* Stars counter */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#081C36]/90 border border-[#FFD84D]/30 text-[#FFD84D] text-xs sm:text-sm font-extrabold shadow-inner">
              <Ico name="star" size={16} style={{ color: "#FFD84D", fill: "#FFD84D" }} />
              <span>{totalStars} / 9</span>
            </div>

            {/* Language toggle */}
            <button
              onClick={toggleLang}
              className="px-2.5 py-1.5 rounded-xl bg-[#081C36] hover:bg-[#35D6FF]/10 border border-[#35D6FF]/30 text-xs font-bold text-[#F4F8FC] transition focus:outline-none"
              title="Котормо / Перевод"
            >
              {lang === "ru" ? "🇷🇺 РУС" : "🇰🇬 КЫР"}
            </button>

            {/* Sound toggle */}
            <button
              onClick={toggleSound}
              className="p-2 rounded-xl bg-[#081C36] hover:bg-[#35D6FF]/10 border border-[#35D6FF]/20 text-[#A1B5D8] hover:text-[#35D6FF] transition"
              title="Звук"
            >
              <Ico name={soundOn ? "volume_2" : "volume_x"} size={17} />
            </button>
          </div>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* SCREEN 1: WELCOME & HERO */}
      {/* ==================================================================== */}
      {screen === "welcome" && (
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 flex flex-col justify-center">
          <div className="text-center max-w-3xl mx-auto">
            {/* Logo Orbital Emblem */}
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 rounded-full bg-[#35D6FF]/20 blur-2xl animate-pulse" />
              <img
                src="/logo.svg"
                alt="FluxLab"
                className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto drop-shadow-[0_0_25px_rgba(53,214,255,0.4)]"
              />
            </div>

            <p className="text-xs sm:text-sm font-black tracking-widest text-[#35D6FF] uppercase mb-2">
              {t.welcome.kicker}
            </p>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#F4F8FC] mb-4">
              <span className="bg-gradient-to-r from-[#F4F8FC] via-[#35D6FF] to-[#377DFF] bg-clip-text text-transparent">
                {t.welcome.tagline}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#A1B5D8] leading-relaxed mb-8 max-w-2xl mx-auto">
              {t.welcome.desc}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
              <button
                onClick={() => {
                  sfx.nav();
                  setScreen("map");
                }}
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#377DFF] to-[#35D6FF] text-[#081C36] font-extrabold text-base shadow-xl shadow-[#377DFF]/40 hover:scale-105 active:scale-95 transition"
              >
                <Ico name="zap" size={20} />
                <span>{t.welcome.startBtn}</span>
              </button>

              <button
                onClick={() => {
                  sfx.nav();
                  setScreen("advanced");
                }}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#0D2547] hover:bg-[#35D6FF]/10 text-[#F4F8FC] border border-[#35D6FF]/30 font-bold text-base transition"
              >
                <Ico name="activity" size={20} className="text-[#35D6FF]" />
                <span>{t.welcome.advBtn}</span>
              </button>
            </div>
          </div>

          {/* 4 Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {t.welcome.badges.map((b, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#0D2547]/80 border border-[#35D6FF]/20 backdrop-blur-sm hover:border-[#35D6FF]/40 transition group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#377DFF]/15 border border-[#377DFF]/30 text-[#35D6FF] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Ico name={b.icon} size={22} />
                </div>
                <h3 className="font-bold text-[#F4F8FC] text-base mb-1">{b.title}</h3>
                <p className="text-xs text-[#A1B5D8] leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* ==================================================================== */}
      {/* SCREEN 2: REGIONAL QUEST MAP (9th GRADE PHYSICS) */}
      {/* ==================================================================== */}
      {screen === "map" && (
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-[#35D6FF] text-xs font-bold uppercase tracking-wider mb-1">
                <Ico name="zap" size={16} />
                <span>9-класс · Практикалык схемотехника</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#F4F8FC]">{t.map.title}</h2>
              <p className="text-sm text-[#A1B5D8]">{t.map.subtitle}</p>
            </div>

            <div className="px-4 py-2.5 rounded-2xl bg-[#0D2547] border border-[#35D6FF]/20 flex items-center gap-3">
              <Ico name="trophy" size={20} className="text-[#FFD84D]" />
              <div>
                <p className="text-xs font-medium text-[#A1B5D8]">{t.map.progress(Object.values(stars).filter((v) => v > 0).length)}</p>
                <div className="w-32 bg-[#081C36] h-1.5 rounded-full overflow-hidden mt-1 border border-[#35D6FF]/20">
                  <div
                    className="bg-gradient-to-r from-[#377DFF] to-[#35D6FF] h-full transition-all"
                    style={{
                      width: `${(Object.values(stars).filter((v) => v > 0).length / 3) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3 Regional Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MISSIONS_LIST.map((m) => {
              const data = t.missions[m.key];
              const starCount = stars[m.key] || 0;
              const isCompleted = starCount > 0;

              return (
                <div
                  key={m.id}
                  className="rounded-3xl bg-[#0D2547] border border-[#35D6FF]/25 overflow-hidden flex flex-col justify-between hover:border-[#35D6FF]/60 hover:shadow-2xl hover:shadow-[#081C36] transition group"
                >
                  {/* Card Visual Header */}
                  <div className="relative h-44 bg-gradient-to-br from-[#081C36] to-[#0D2547] p-5 flex flex-col justify-between overflow-hidden">
                    <div className="absolute -right-6 -bottom-6 w-36 h-36 rounded-full bg-[#35D6FF]/10 blur-xl group-hover:scale-150 transition-transform" />

                    <div className="flex items-center justify-between relative z-10">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#081C36]/80 text-[#35D6FF] border border-[#35D6FF]/30 backdrop-blur-sm">
                        {data.location}
                      </span>
                      <div className="flex gap-1">
                        {[1, 2, 3].map((s) => (
                          <Ico
                            key={s}
                            name="star"
                            size={16}
                            style={{
                              color: s <= starCount ? "#FFD84D" : "rgba(161, 181, 216, 0.2)",
                              fill: s <= starCount ? "#FFD84D" : "none",
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="relative z-10">
                      <h3 className="text-2xl font-black text-[#F4F8FC] mb-0.5">{data.region}</h3>
                      <p className="text-xs font-semibold text-[#FFD84D]">{data.deviceName}</p>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-[#F4F8FC] mb-2">{data.title}</h4>
                      <p className="text-xs text-[#A1B5D8] leading-relaxed mb-4">{data.desc}</p>

                      <div className="space-y-1.5 mb-5 text-[11px]">
                        <div className="flex justify-between p-2 rounded-xl bg-[#081C36]/60 border border-[#35D6FF]/10">
                          <span className="text-[#A1B5D8]">{data.sourceName}:</span>
                          <span className="font-bold text-[#FF5353]">{data.sourceSpec}</span>
                        </div>
                        <div className="flex justify-between p-2 rounded-xl bg-[#081C36]/60 border border-[#35D6FF]/10">
                          <span className="text-[#A1B5D8]">{data.deviceName}:</span>
                          <span className="font-bold text-[#35D6FF]">{data.deviceSpec}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => openMission(m.key)}
                      className="w-full py-3 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 bg-[#377DFF] hover:bg-[#35D6FF] hover:text-[#081C36] text-[#F4F8FC] shadow-lg shadow-[#377DFF]/25 transition"
                    >
                      <Ico name="zap" size={16} />
                      <span>{isCompleted ? t.map.done : t.map.btnStart}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      )}

      {/* ==================================================================== */}
      {/* SCREEN 3: INTERACTIVE WORKBENCH & FORMULA LAB (MISSION SCREEN) */}
      {/* ==================================================================== */}
      {screen === "mission" && (
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full">
          {/* Top Bar with Back Button */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => {
                sfx.nav();
                setScreen("map");
              }}
              className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#A1B5D8] hover:text-[#35D6FF] transition"
            >
              <Ico name="arrow_left" size={18} />
              <span>{t.workbench.backBtn}</span>
            </button>

            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-[#35D6FF]/15 text-[#35D6FF] border border-[#35D6FF]/30">
              {t.missions[activeMissionId].region} · {t.missions[activeMissionId].location}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Circuit Workbench & AI Mentor */}
            <div className="lg:col-span-2 space-y-6">
              {/* Mission Header */}
              <div className="p-6 rounded-3xl bg-[#0D2547] border border-[#35D6FF]/20 shadow-xl">
                <h2 className="text-xl sm:text-2xl font-black text-[#F4F8FC] mb-2">
                  {t.missions[activeMissionId].title}
                </h2>
                <p className="text-sm text-[#A1B5D8] leading-relaxed">{t.missions[activeMissionId].desc}</p>
              </div>

              {/* Circuit Board Visualizer */}
              <div className="p-6 rounded-3xl bg-[#0D2547] border border-[#35D6FF]/30 relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#A1B5D8]">
                    Схема электрической цепи
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block w-2.5 h-2.5 rounded-full ${
                        circuitVisual === "success"
                          ? "bg-[#26D07C] shadow-[0_0_8px_#26D07C]"
                          : circuitVisual === "burnt"
                          ? "bg-[#FF5353] shadow-[0_0_8px_#FF5353]"
                          : "bg-[#A1B5D8]"
                      }`}
                    />
                    <span className="text-xs font-bold uppercase text-[#A1B5D8]">{circuitVisual}</span>
                  </div>
                </div>

                {/* The Interactive Schematic Circuit */}
                <div className="relative py-8 px-4 flex flex-col sm:flex-row items-center justify-between gap-6 bg-[#081C36]/80 rounded-2xl border border-[#35D6FF]/15">
                  {/* Node 1: Power Source */}
                  <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-[#0D2547] border border-[#35D6FF]/30 w-36">
                    <div className="w-12 h-12 rounded-xl bg-[#377DFF]/20 text-[#35D6FF] flex items-center justify-center mb-2">
                      <Ico name={activeMissionId === "issykkul" ? "wind" : "sun"} size={26} />
                    </div>
                    <span className="text-xs font-bold text-[#F4F8FC]">{t.missions[activeMissionId].sourceName}</span>
                    <span className="text-[11px] font-extrabold text-[#FFD84D]">
                      {t.missions[activeMissionId].sourceSpec}
                    </span>
                  </div>

                  {/* Wire 1: Source to Slot */}
                  <div className="flex-1 h-1.5 w-full sm:w-auto relative bg-[#0D2547] rounded-full overflow-hidden">
                    <div
                      className={`h-full w-full transition-all duration-500 ${
                        circuitVisual === "success"
                          ? "bg-[#35D6FF] shadow-[0_0_10px_#35D6FF]"
                          : circuitVisual === "burnt"
                          ? "bg-[#FF5353] shadow-[0_0_10px_#FF5353]"
                          : "bg-[#377DFF]/40"
                      }`}
                    />
                  </div>

                  {/* Node 2: Component Slot */}
                  <div
                    onClick={() => {
                      if (selectedPart) {
                        sfx.click();
                        setPlacedPart(selectedPart);
                      }
                    }}
                    className={`cursor-pointer flex flex-col items-center justify-center p-4 rounded-2xl min-w-[130px] min-h-[110px] border-2 border-dashed transition-all ${
                      placedPart
                        ? "border-[#35D6FF] bg-[#35D6FF]/10 shadow-[0_0_20px_rgba(53,214,255,0.2)]"
                        : "border-[#35D6FF]/40 hover:border-[#35D6FF] bg-[#0D2547]/60"
                    }`}
                  >
                    <span className="text-[10px] font-bold text-[#A1B5D8] uppercase mb-1">
                      {t.workbench.slotTitle}
                    </span>
                    {placedPart ? (
                      <div className="flex flex-col items-center">
                        <Ico name="zap" size={24} className="text-[#FFD84D] mb-1" />
                        <span className="text-xs font-extrabold text-[#F4F8FC] text-center">
                          {t.workbench.parts[placedPart]}
                        </span>
                      </div>
                    ) : (
                      <div className="text-center">
                        <span className="text-xs text-[#A1B5D8] font-bold block">{t.workbench.emptySlot}</span>
                        <span className="text-[10px] text-[#35D6FF] mt-1 block">Нажми деталь ниже</span>
                      </div>
                    )}
                  </div>

                  {/* Wire 2: Slot to Consumer */}
                  <div className="flex-1 h-1.5 w-full sm:w-auto relative bg-[#0D2547] rounded-full overflow-hidden">
                    <div
                      className={`h-full w-full transition-all duration-500 ${
                        circuitVisual === "success"
                          ? "bg-[#35D6FF] shadow-[0_0_10px_#35D6FF]"
                          : circuitVisual === "burnt"
                          ? "bg-[#FF5353] shadow-[0_0_10px_#FF5353]"
                          : "bg-[#377DFF]/40"
                      }`}
                    />
                  </div>

                  {/* Node 3: Consumer Device */}
                  <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-[#0D2547] border border-[#35D6FF]/30 w-36">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 transition-all ${
                        circuitVisual === "success"
                          ? "bg-[#26D07C]/25 text-[#26D07C] shadow-[0_0_15px_#26D07C]"
                          : circuitVisual === "burnt"
                          ? "bg-[#FF5353]/25 text-[#FF5353] shadow-[0_0_15px_#FF5353]"
                          : "bg-[#377DFF]/20 text-[#A1B5D8]"
                      }`}
                    >
                      <Ico name={circuitVisual === "burnt" ? "flame" : "wifi"} size={26} />
                    </div>
                    <span className="text-xs font-bold text-[#F4F8FC]">{t.missions[activeMissionId].deviceName}</span>
                    <span className="text-[11px] font-extrabold text-[#35D6FF]">
                      {t.missions[activeMissionId].deviceSpec}
                    </span>
                  </div>
                </div>

                {/* Circuit Test Buttons */}
                <div className="mt-6 flex flex-wrap gap-3 items-center justify-between">
                  <div className="flex gap-3">
                    <button
                      onClick={handleTestCircuit}
                      className="px-6 py-3 rounded-2xl font-extrabold text-sm bg-gradient-to-r from-[#377DFF] to-[#35D6FF] text-[#081C36] shadow-lg shadow-[#377DFF]/30 hover:scale-105 active:scale-95 transition flex items-center gap-2"
                    >
                      <Ico name="zap" size={17} />
                      <span>{t.workbench.testBtn}</span>
                    </button>
                    <button
                      onClick={handleResetCircuit}
                      className="px-5 py-3 rounded-2xl font-bold text-sm bg-[#081C36] hover:bg-[#35D6FF]/10 text-[#A1B5D8] border border-[#35D6FF]/20 transition flex items-center gap-2"
                    >
                      <Ico name="rotate_ccw" size={16} />
                      <span>{t.workbench.resetBtn}</span>
                    </button>
                  </div>

                  {feedback && (
                    <div
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border ${
                        feedback.kind === "success"
                          ? "bg-[#26D07C]/15 border-[#26D07C]/40 text-[#26D07C]"
                          : "bg-[#FF5353]/15 border-[#FF5353]/40 text-[#FF5353]"
                      }`}
                    >
                      <Ico name={feedback.kind === "success" ? "circle_check" : "flame"} size={16} />
                      <span>{feedback.title}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Warehouse / Palette of Parts */}
              <div className="p-6 rounded-3xl bg-[#0D2547] border border-[#35D6FF]/20">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#A1B5D8] mb-3">
                  {t.workbench.warehouseTitle}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(t.workbench.parts).map(([key, name]) => {
                    const isSelected = selectedPart === key;
                    const isPlaced = placedPart === key;
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          sfx.click();
                          setSelectedPart(key);
                          setPlacedPart(key);
                        }}
                        className={`p-3.5 rounded-2xl border text-left transition flex items-center gap-3 ${
                          isPlaced
                            ? "bg-[#35D6FF]/20 border-[#35D6FF] text-[#F4F8FC] shadow-lg shadow-[#35D6FF]/20"
                            : isSelected
                            ? "bg-[#377DFF]/25 border-[#377DFF] text-[#F4F8FC]"
                            : "bg-[#081C36]/80 border-[#35D6FF]/15 text-[#A1B5D8] hover:border-[#35D6FF]/40 hover:text-[#F4F8FC]"
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isPlaced ? "bg-[#35D6FF] text-[#081C36]" : "bg-[#0D2547] text-[#35D6FF]"
                          }`}
                        >
                          <Ico name="zap" size={18} />
                        </div>
                        <span className="text-xs font-bold leading-snug">{name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* AI Mentor Banner */}
              <div className="p-5 rounded-3xl bg-gradient-to-r from-[#0D2547] to-[#081C36] border border-[#35D6FF]/30 shadow-lg relative overflow-hidden">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#377DFF] to-[#35D6FF] text-[#081C36] flex items-center justify-center shrink-0 shadow-md">
                    <Ico name="bot" size={22} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-[#F4F8FC]">{t.workbench.mentorTitle}</span>
                        {mentorLoading && (
                          <span className="w-2 h-2 rounded-full bg-[#35D6FF] animate-ping" />
                        )}
                      </div>
                      {mentorData?.source && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#35D6FF]/15 text-[#35D6FF] border border-[#35D6FF]/30 uppercase">
                          {mentorData.source}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#A1B5D8] leading-relaxed">
                      {mentorLoading
                        ? t.workbench.mentorThinking
                        : mentorData?.answer ||
                          "Собери схему и нажми 'Подать ток', или нажми на кнопку ниже, чтобы получить совет AI-наставника."}
                    </p>
                    <button
                      onClick={async () => {
                        sfx.click();
                        setMentorLoading(true);
                        const cur = t.missions[activeMissionId];
                        const resp = await fetchAskMentor({
                          question: `Подскажи физический принцип для миссии: ${cur.title}`,
                          circuit_state: placedPart === cur.correctPart ? 3 : 1,
                          lang,
                        });
                        setMentorData(resp);
                        setMentorLoading(false);
                      }}
                      className="mt-3 text-xs font-extrabold text-[#35D6FF] hover:underline flex items-center gap-1.5"
                    >
                      <Ico name="sparkles" size={14} />
                      <span>{t.workbench.askMentorBtn}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: Interactive Formula Laboratory */}
            <div className="space-y-6">
              <FormulaPlayground
                missionId={activeMissionId}
                lang={lang}
                t={t.missions[activeMissionId]}
                sfx={sfx}
              />
            </div>
          </div>
        </main>
      )}

      {/* ==================================================================== */}
      {/* SCREEN 4: ADVANCED PHYSICS LABS (10–11th GRADE FASTAPI INTEGRATION) */}
      {/* ==================================================================== */}
      {screen === "advanced" && (
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-[#35D6FF] text-xs font-bold uppercase tracking-wider mb-1">
                <Ico name="activity" size={16} />
                <span>10–11-класс · FastAPI & NumPy Compute Engine</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#F4F8FC]">{t.advanced.title}</h2>
              <p className="text-sm text-[#A1B5D8]">{t.advanced.subtitle}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={async () => {
                  sfx.click();
                  let payload = {};
                  if (activeAdvTab === "projectile") {
                    payload = {
                      user_id: "student_flux",
                      lesson_id: "projectile-01",
                      lab_title: "Кинематика и баллистика",
                      input_parameters: projectileParams,
                      table_points: (projectileResult?.points || []).slice(0, 50),
                      conclusions: `Максимальная высота: ${projectileResult?.max_height}м, Дальность: ${projectileResult?.max_range}м`,
                    };
                  } else if (activeAdvTab === "pendulum") {
                    payload = {
                      user_id: "student_flux",
                      lesson_id: "pendulum-01",
                      lab_title: "Колебания и маятники",
                      input_parameters: pendulumParams,
                      table_points: (pendulumResult?.displacement_graph || []).slice(0, 50),
                      conclusions: `Период: ${pendulumResult?.period}с, Частота: ${pendulumResult?.frequency}Гц`,
                    };
                  } else {
                    payload = {
                      user_id: "student_flux",
                      lesson_id: "gas-laws-01",
                      lab_title: "Изопроцессы идеального газа",
                      input_parameters: gasParams,
                      table_points: gasResult?.points || [],
                      conclusions: `Работа газа: ${gasResult?.total_work} Дж, Изменение энергии: ${gasResult?.total_internal_energy_change} Дж`,
                    };
                  }
                  await triggerReportExport(payload);
                }}
                className="px-4 py-2.5 rounded-2xl bg-[#0D2547] hover:bg-[#35D6FF]/15 text-[#35D6FF] border border-[#35D6FF]/40 text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-lg transition"
              >
                <Ico name="download" size={17} />
                <span>{t.advanced.exportBtn}</span>
              </button>
            </div>
          </div>

          {/* Subtabs for 3 Labs */}
          <div className="flex flex-wrap gap-2 mb-6 border-b border-[#35D6FF]/20 pb-4">
            {[
              { id: "projectile", title: t.advanced.tabProjectile, icon: "rocket" },
              { id: "pendulum", title: t.advanced.tabPendulum, icon: "waves" },
              { id: "gas", title: t.advanced.tabGas, icon: "thermometer" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  sfx.click();
                  setActiveAdvTab(tab.id);
                }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition ${
                  activeAdvTab === tab.id
                    ? "bg-[#377DFF] text-[#F4F8FC] shadow-lg shadow-[#377DFF]/30"
                    : "bg-[#0D2547] text-[#A1B5D8] hover:text-[#F4F8FC] border border-[#35D6FF]/15"
                }`}
              >
                <Ico name={tab.icon} size={17} />
                <span>{tab.title}</span>
              </button>
            ))}
          </div>

          {/* LAB 1: PROJECTILE MOTION */}
          {activeAdvTab === "projectile" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Controls Column */}
              <div className="p-6 rounded-3xl bg-[#0D2547] border border-[#35D6FF]/20 space-y-4">
                <h3 className="font-black text-base text-[#F4F8FC] mb-4">Параметры броска</h3>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-[#A1B5D8]">{t.advanced.projectile.v0}</span>
                    <span className="text-[#35D6FF]">{projectileParams.initial_velocity} м/с</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={80}
                    step={1}
                    value={projectileParams.initial_velocity}
                    onChange={(e) =>
                      setProjectileParams({ ...projectileParams, initial_velocity: Number(e.target.value) })
                    }
                    className="w-full accent-[#35D6FF]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-[#A1B5D8]">{t.advanced.projectile.angle}</span>
                    <span className="text-[#FFD84D]">{projectileParams.angle_deg}°</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={85}
                    step={1}
                    value={projectileParams.angle_deg}
                    onChange={(e) =>
                      setProjectileParams({ ...projectileParams, angle_deg: Number(e.target.value) })
                    }
                    className="w-full accent-[#FFD84D]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-[#A1B5D8]">{t.advanced.projectile.h0}</span>
                    <span className="text-[#F4F8FC]">{projectileParams.initial_height} м</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={50}
                    step={1}
                    value={projectileParams.initial_height}
                    onChange={(e) =>
                      setProjectileParams({ ...projectileParams, initial_height: Number(e.target.value) })
                    }
                    className="w-full accent-[#377DFF]"
                  />
                </div>

                <div className="pt-2 border-t border-[#35D6FF]/15">
                  <label className="flex items-center gap-2 text-xs font-bold text-[#F4F8FC] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={projectileParams.air_resistance}
                      onChange={(e) =>
                        setProjectileParams({ ...projectileParams, air_resistance: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-[#377DFF] accent-[#35D6FF]"
                    />
                    <span>{t.advanced.projectile.drag}</span>
                  </label>
                </div>

                <div>
                  <span className="text-xs font-bold text-[#A1B5D8] block mb-2">{t.advanced.projectile.env}</span>
                  <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                    {[
                      { name: "Земля", g: 9.807, rho: 1.225 },
                      { name: "Марс", g: 3.711, rho: 0.02 },
                      { name: "Луна", g: 1.62, rho: 0.0 },
                      { name: "Вода", g: 9.807, rho: 1000 },
                    ].map((env) => (
                      <button
                        key={env.name}
                        onClick={() =>
                          setProjectileParams({ ...projectileParams, gravity: env.g, air_density: env.rho })
                        }
                        className={`p-2 rounded-xl border text-center transition ${
                          projectileParams.gravity === env.g && projectileParams.air_density === env.rho
                            ? "bg-[#35D6FF]/20 border-[#35D6FF] text-[#F4F8FC]"
                            : "bg-[#081C36] border-[#35D6FF]/15 text-[#A1B5D8]"
                        }`}
                      >
                        {env.name}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => runAdvancedSim("projectile")}
                  disabled={advLoading}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#377DFF] to-[#35D6FF] text-[#081C36] font-black text-sm shadow-xl shadow-[#377DFF]/30 hover:scale-105 active:scale-95 transition mt-4"
                >
                  {advLoading ? t.advanced.calculating : t.advanced.runBtn}
                </button>
              </div>

              {/* SVG Visualization & Telemetry */}
              <div className="lg:col-span-2 space-y-6">
                <div className="p-6 rounded-3xl bg-[#0D2547] border border-[#35D6FF]/25">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#A1B5D8] mb-3">
                    Траектория полёта y(x)
                  </h4>
                  <TrajectoryCanvas points={projectileResult?.points || []} />
                </div>

                {/* Telemetry Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <TelemetryCard
                    label={t.advanced.projectile.telemetry.range}
                    value={projectileResult?.max_range ?? "--"}
                    unit="м"
                    color="#35D6FF"
                  />
                  <TelemetryCard
                    label={t.advanced.projectile.telemetry.height}
                    value={projectileResult?.max_height ?? "--"}
                    unit="м"
                    color="#FFD84D"
                  />
                  <TelemetryCard
                    label={t.advanced.projectile.telemetry.time}
                    value={projectileResult?.flight_time ?? "--"}
                    unit="с"
                    color="#26D07C"
                  />
                  <TelemetryCard
                    label={t.advanced.projectile.telemetry.energy}
                    value={projectileResult?.initial_kinetic_energy ?? "--"}
                    unit="Дж"
                    color="#377DFF"
                  />
                </div>
              </div>
            </div>
          )}

          {/* LAB 2: PENDULUM OSCILLATIONS */}
          {activeAdvTab === "pendulum" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Controls Column */}
              <div className="p-6 rounded-3xl bg-[#0D2547] border border-[#35D6FF]/20 space-y-4">
                <h3 className="font-black text-base text-[#F4F8FC] mb-4">Параметры маятника</h3>

                <div>
                  <span className="text-xs font-bold text-[#A1B5D8] block mb-2">{t.advanced.pendulum.type}</span>
                  <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                    <button
                      onClick={() => setPendulumParams({ ...pendulumParams, pendulum_type: "simple" })}
                      className={`p-2.5 rounded-xl border transition ${
                        pendulumParams.pendulum_type === "simple"
                          ? "bg-[#35D6FF]/20 border-[#35D6FF] text-[#F4F8FC]"
                          : "bg-[#081C36] border-[#35D6FF]/15 text-[#A1B5D8]"
                      }`}
                    >
                      {t.advanced.pendulum.typeSimple}
                    </button>
                    <button
                      onClick={() => setPendulumParams({ ...pendulumParams, pendulum_type: "spring" })}
                      className={`p-2.5 rounded-xl border transition ${
                        pendulumParams.pendulum_type === "spring"
                          ? "bg-[#35D6FF]/20 border-[#35D6FF] text-[#F4F8FC]"
                          : "bg-[#081C36] border-[#35D6FF]/15 text-[#A1B5D8]"
                      }`}
                    >
                      {t.advanced.pendulum.typeSpring}
                    </button>
                  </div>
                </div>

                {pendulumParams.pendulum_type === "simple" ? (
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-[#A1B5D8]">{t.advanced.pendulum.length}</span>
                      <span className="text-[#35D6FF]">{pendulumParams.length} м</span>
                    </div>
                    <input
                      type="range"
                      min={0.2}
                      max={5.0}
                      step={0.1}
                      value={pendulumParams.length}
                      onChange={(e) => setPendulumParams({ ...pendulumParams, length: Number(e.target.value) })}
                      className="w-full accent-[#35D6FF]"
                    />
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-[#A1B5D8]">{t.advanced.pendulum.k}</span>
                      <span className="text-[#35D6FF]">{pendulumParams.spring_constant} Н/м</span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={100}
                      step={1}
                      value={pendulumParams.spring_constant}
                      onChange={(e) =>
                        setPendulumParams({ ...pendulumParams, spring_constant: Number(e.target.value) })
                      }
                      className="w-full accent-[#35D6FF]"
                    />
                  </div>
                )}

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-[#A1B5D8]">{t.advanced.pendulum.mass}</span>
                    <span className="text-[#FFD84D]">{pendulumParams.mass} кг</span>
                  </div>
                  <input
                    type="range"
                    min={0.1}
                    max={10.0}
                    step={0.1}
                    value={pendulumParams.mass}
                    onChange={(e) => setPendulumParams({ ...pendulumParams, mass: Number(e.target.value) })}
                    className="w-full accent-[#FFD84D]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-[#A1B5D8]">{t.advanced.pendulum.damping}</span>
                    <span className="text-[#F4F8FC]">{pendulumParams.damping_coefficient}</span>
                  </div>
                  <input
                    type="range"
                    min={0.0}
                    max={1.5}
                    step={0.05}
                    value={pendulumParams.damping_coefficient}
                    onChange={(e) =>
                      setPendulumParams({ ...pendulumParams, damping_coefficient: Number(e.target.value) })
                    }
                    className="w-full accent-[#377DFF]"
                  />
                </div>

                <button
                  onClick={() => runAdvancedSim("pendulum")}
                  disabled={advLoading}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#377DFF] to-[#35D6FF] text-[#081C36] font-black text-sm shadow-xl shadow-[#377DFF]/30 hover:scale-105 active:scale-95 transition mt-4"
                >
                  {advLoading ? t.advanced.calculating : t.advanced.runBtn}
                </button>
              </div>

              {/* Wave Plot & Telemetry */}
              <div className="lg:col-span-2 space-y-6">
                <div className="p-6 rounded-3xl bg-[#0D2547] border border-[#35D6FF]/25">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#A1B5D8] mb-3">
                    График затухающих колебаний x(t)
                  </h4>
                  <WaveCanvas points={pendulumResult?.displacement_graph || []} />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <TelemetryCard
                    label={t.advanced.pendulum.telemetry.period}
                    value={pendulumResult?.period ?? "--"}
                    unit="с"
                    color="#35D6FF"
                  />
                  <TelemetryCard
                    label={t.advanced.pendulum.telemetry.freq}
                    value={pendulumResult?.frequency ?? "--"}
                    unit="Гц"
                    color="#FFD84D"
                  />
                  <TelemetryCard
                    label={t.advanced.pendulum.telemetry.omega}
                    value={pendulumResult?.angular_frequency ?? "--"}
                    unit="рад/с"
                    color="#26D07C"
                  />
                </div>
              </div>
            </div>
          )}

          {/* LAB 3: GAS LAWS (THERMODYNAMICS) */}
          {activeAdvTab === "gas" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Controls Column */}
              <div className="p-6 rounded-3xl bg-[#0D2547] border border-[#35D6FF]/20 space-y-4">
                <h3 className="font-black text-base text-[#F4F8FC] mb-4">Параметры газа</h3>

                <div>
                  <span className="text-xs font-bold text-[#A1B5D8] block mb-2">{t.advanced.gas.process}</span>
                  <div className="grid grid-cols-3 gap-1.5 text-[11px] font-bold">
                    <button
                      onClick={() => setGasParams({ ...gasParams, process_type: "isothermal", target_value: 0.048 })}
                      className={`p-2 rounded-xl border text-center transition ${
                        gasParams.process_type === "isothermal"
                          ? "bg-[#35D6FF]/20 border-[#35D6FF] text-[#F4F8FC]"
                          : "bg-[#081C36] border-[#35D6FF]/15 text-[#A1B5D8]"
                      }`}
                    >
                      T = const
                    </button>
                    <button
                      onClick={() => setGasParams({ ...gasParams, process_type: "isochoric", target_value: 450 })}
                      className={`p-2 rounded-xl border text-center transition ${
                        gasParams.process_type === "isochoric"
                          ? "bg-[#35D6FF]/20 border-[#35D6FF] text-[#F4F8FC]"
                          : "bg-[#081C36] border-[#35D6FF]/15 text-[#A1B5D8]"
                      }`}
                    >
                      V = const
                    </button>
                    <button
                      onClick={() => setGasParams({ ...gasParams, process_type: "isobaric", target_value: 0.048 })}
                      className={`p-2 rounded-xl border text-center transition ${
                        gasParams.process_type === "isobaric"
                          ? "bg-[#35D6FF]/20 border-[#35D6FF] text-[#F4F8FC]"
                          : "bg-[#081C36] border-[#35D6FF]/15 text-[#A1B5D8]"
                      }`}
                    >
                      P = const
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-[#A1B5D8]">{t.advanced.gas.moles}</span>
                    <span className="text-[#35D6FF]">{gasParams.moles} моль</span>
                  </div>
                  <input
                    type="range"
                    min={0.5}
                    max={5.0}
                    step={0.1}
                    value={gasParams.moles}
                    onChange={(e) => setGasParams({ ...gasParams, moles: Number(e.target.value) })}
                    className="w-full accent-[#35D6FF]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-[#A1B5D8]">{t.advanced.gas.t0}</span>
                    <span className="text-[#FFD84D]">{Math.round(gasParams.initial_temperature)} К</span>
                  </div>
                  <input
                    type="range"
                    min={200}
                    max={600}
                    step={5}
                    value={gasParams.initial_temperature}
                    onChange={(e) => setGasParams({ ...gasParams, initial_temperature: Number(e.target.value) })}
                    className="w-full accent-[#FFD84D]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-[#A1B5D8]">{t.advanced.gas.target}</span>
                    <span className="text-[#26D07C]">
                      {gasParams.process_type === "isochoric"
                        ? `${Math.round(gasParams.target_value)} К`
                        : `${(gasParams.target_value * 1000).toFixed(1)} л`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={gasParams.process_type === "isochoric" ? 250 : 0.015}
                    max={gasParams.process_type === "isochoric" ? 800 : 0.08}
                    step={gasParams.process_type === "isochoric" ? 10 : 0.002}
                    value={gasParams.target_value}
                    onChange={(e) => setGasParams({ ...gasParams, target_value: Number(e.target.value) })}
                    className="w-full accent-[#26D07C]"
                  />
                </div>

                <button
                  onClick={() => runAdvancedSim("gas")}
                  disabled={advLoading}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#377DFF] to-[#35D6FF] text-[#081C36] font-black text-sm shadow-xl shadow-[#377DFF]/30 hover:scale-105 active:scale-95 transition mt-4"
                >
                  {advLoading ? t.advanced.calculating : t.advanced.runBtn}
                </button>
              </div>

              {/* PV Diagram & Telemetry */}
              <div className="lg:col-span-2 space-y-6">
                <div className="p-6 rounded-3xl bg-[#0D2547] border border-[#35D6FF]/25">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#A1B5D8] mb-3">
                    Диаграмма процесса P-V (Работа газа = площадь под кривой)
                  </h4>
                  <PvDiagramCanvas points={gasResult?.points || []} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <TelemetryCard
                    label={t.advanced.gas.telemetry.work}
                    value={gasResult?.total_work ?? "--"}
                    unit="Дж"
                    color="#35D6FF"
                  />
                  <TelemetryCard
                    label={t.advanced.gas.telemetry.deltaU}
                    value={gasResult?.total_internal_energy_change ?? "--"}
                    unit="Дж"
                    color="#FFD84D"
                  />
                  <TelemetryCard
                    label={t.advanced.gas.telemetry.finalP}
                    value={gasResult?.final_state?.pressure ? Math.round(gasResult.final_state.pressure / 1000) : "--"}
                    unit="кПа"
                    color="#26D07C"
                  />
                  <TelemetryCard
                    label={t.advanced.gas.telemetry.finalT}
                    value={gasResult?.final_state?.temperature ? Math.round(gasResult.final_state.temperature) : "--"}
                    unit="К"
                    color="#377DFF"
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      )}

      {/* ==================================================================== */}
      {/* FOOTER */}
      {/* ==================================================================== */}
      <footer className="mt-auto border-t border-[#35D6FF]/15 py-6 px-4 sm:px-6 bg-[#081C36] text-xs text-[#A1B5D8]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="FluxLab" className="h-5 w-auto" />
            <span className="font-bold text-[#F4F8FC]">FluxLab</span>
            <span>· Кыргызстан (Нарын · Ысык-Көл · Ош)</span>
          </div>
          <p>© 2026 FluxLab. Production-grade Physics Simulator & Fast Learning Environment.</p>
        </div>
      </footer>
    </div>
  );
}

// ============================================================================
// HELPER COMPONENTS & VISUALIZERS
// ============================================================================

function TelemetryCard({ label, value, unit, color }) {
  return (
    <div className="p-4 rounded-2xl bg-[#081C36]/90 border border-[#35D6FF]/15 flex flex-col justify-between">
      <span className="text-[11px] font-bold text-[#A1B5D8] mb-1">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className="text-xl sm:text-2xl font-black tabular-nums" style={{ color }}>
          {value}
        </span>
        <span className="text-xs font-bold text-[#A1B5D8]">{unit}</span>
      </div>
    </div>
  );
}

function TrajectoryCanvas({ points }) {
  if (!points || points.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-[#A1B5D8] bg-[#081C36]/60 rounded-2xl border border-dashed border-[#35D6FF]/20">
        Нажмите "Запустить симуляцию" для построения баллистической траектории
      </div>
    );
  }

  const maxX = Math.max(...points.map((p) => p.x), 10);
  const maxY = Math.max(...points.map((p) => p.y), 10);

  const w = 600;
  const h = 240;
  const pad = 35;

  const toX = (x) => pad + (x / maxX) * (w - pad * 2);
  const toY = (y) => h - pad - (y / maxY) * (h - pad * 2);

  const pathD = points.reduce((acc, p, idx) => {
    return `${acc} ${idx === 0 ? "M" : "L"} ${toX(p.x)} ${toY(p.y)}`;
  }, "");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-64 bg-[#081C36]/90 rounded-2xl border border-[#35D6FF]/20">
      {/* Grid lines */}
      <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="rgba(53,214,255,0.4)" strokeWidth={2} />
      <line x1={pad} y1={pad} x2={pad} y2={h - pad} stroke="rgba(53,214,255,0.4)" strokeWidth={2} />

      {/* Trajectory */}
      <path d={pathD} fill="none" stroke="#35D6FF" strokeWidth={3} strokeLinecap="round" />

      {/* Peak Point */}
      {points.length > 0 && (
        <circle
          cx={toX(points.reduce((max, p) => (p.y > max.y ? p : max), points[0]).x)}
          cy={toY(Math.max(...points.map((p) => p.y)))}
          r={5}
          fill="#FFD84D"
        />
      )}

      {/* Text labels */}
      <text x={pad} y={h - 10} fill="#A1B5D8" fontSize={10} fontWeight="bold">
        0 м
      </text>
      <text x={w - pad - 30} y={h - 10} fill="#A1B5D8" fontSize={10} fontWeight="bold">
        {Math.round(maxX)} м
      </text>
      <text x={10} y={pad + 10} fill="#A1B5D8" fontSize={10} fontWeight="bold">
        {Math.round(maxY)} м
      </text>
    </svg>
  );
}

function WaveCanvas({ points }) {
  if (!points || points.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-[#A1B5D8] bg-[#081C36]/60 rounded-2xl border border-dashed border-[#35D6FF]/20">
        Нажмите "Запустить симуляцию" для построения волновой функции
      </div>
    );
  }

  const w = 600;
  const h = 240;
  const pad = 35;

  const maxT = Math.max(...points.map((p) => p.t), 5);
  const maxDisp = Math.max(...points.map((p) => Math.abs(p.displacement)), 0.1);

  const toX = (t) => pad + (t / maxT) * (w - pad * 2);
  const toY = (x) => h / 2 - (x / maxDisp) * (h / 2 - pad);

  const pathD = points.reduce((acc, p, idx) => {
    return `${acc} ${idx === 0 ? "M" : "L"} ${toX(p.t)} ${toY(p.displacement)}`;
  }, "");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-64 bg-[#081C36]/90 rounded-2xl border border-[#35D6FF]/20">
      {/* Zero line */}
      <line x1={pad} y1={h / 2} x2={w - pad} y2={h / 2} stroke="rgba(161,181,216,0.3)" strokeDasharray="4 4" />
      <line x1={pad} y1={pad} x2={pad} y2={h - pad} stroke="rgba(53,214,255,0.4)" strokeWidth={2} />

      {/* Wave Path */}
      <path d={pathD} fill="none" stroke="#FFD84D" strokeWidth={2.5} />
    </svg>
  );
}

function PvDiagramCanvas({ points }) {
  if (!points || points.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-[#A1B5D8] bg-[#081C36]/60 rounded-2xl border border-dashed border-[#35D6FF]/20">
        Нажмите "Запустить симуляцию" для построения P-V диаграммы
      </div>
    );
  }

  const w = 600;
  const h = 240;
  const pad = 40;

  const maxV = Math.max(...points.map((p) => p.volume));
  const minV = Math.min(...points.map((p) => p.volume));
  const maxP = Math.max(...points.map((p) => p.pressure));
  const minP = Math.min(...points.map((p) => p.pressure));

  const toX = (v) => pad + ((v - minV) / (maxV - minV || 1)) * (w - pad * 2);
  const toY = (p) => h - pad - ((p - minP) / (maxP - minP || 1)) * (h - pad * 2);

  const curveD = points.reduce((acc, p, idx) => {
    return `${acc} ${idx === 0 ? "M" : "L"} ${toX(p.volume)} ${toY(p.pressure)}`;
  }, "");

  const fillD = `${curveD} L ${toX(points[points.length - 1].volume)} ${h - pad} L ${toX(points[0].volume)} ${h - pad} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-64 bg-[#081C36]/90 rounded-2xl border border-[#35D6FF]/20">
      {/* Shaded Work Area */}
      <path d={fillD} fill="rgba(53,214,255,0.15)" />

      {/* Process curve */}
      <path d={curveD} fill="none" stroke="#35D6FF" strokeWidth={3} />

      {/* Axes */}
      <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="rgba(53,214,255,0.5)" strokeWidth={2} />
      <line x1={pad} y1={pad} x2={pad} y2={h - pad} stroke="rgba(53,214,255,0.5)" strokeWidth={2} />

      <text x={w - pad - 20} y={h - 15} fill="#A1B5D8" fontSize={11} fontWeight="bold">
        V (л)
      </text>
      <text x={10} y={pad + 10} fill="#A1B5D8" fontSize={11} fontWeight="bold">
        P (кПа)
      </text>
    </svg>
  );
}

// ============================================================================
// INTERACTIVE FORMULA PLAYGROUND (MISSION-SPECIFIC)
// ============================================================================

function FormulaPlayground({ missionId, lang, t, sfx }) {
  // Naryn: Voltage divider
  const [uin, setUin] = useState(24);
  const [r1, setR1] = useState(1000);
  const [r2, setR2] = useState(1000);

  // Issyk-Kul: Wind generator
  const [windUin, setWindUin] = useState(16);
  const [stabMode, setStabMode] = useState("stabilizer");

  // Osh: Solar & reverse current
  const [isDay, setIsDay] = useState(true);
  const [hasDiode, setHasDiode] = useState(true);
  const [loadR, setLoadR] = useState(6);

  if (missionId === "naryn") {
    const uout = (uin * r2) / (r1 + r2);
    const isSafe = uout >= 11.5 && uout <= 12.5;

    return (
      <div className="p-6 rounded-3xl bg-[#0D2547] border border-[#35D6FF]/20 space-y-4">
        <h3 className="font-black text-sm text-[#F4F8FC] uppercase tracking-wider">{t.labTitle}</h3>
        <div className="p-3 rounded-2xl bg-[#081C36] border border-[#35D6FF]/20 font-mono text-xs text-[#35D6FF] text-center">
          U_out = U_in × R₂ / (R₁ + R₂)
        </div>

        <div>
          <div className="flex justify-between text-xs font-bold mb-1">
            <span className="text-[#A1B5D8]">{t.lUin}</span>
            <span className="text-[#F4F8FC]">{uin} В</span>
          </div>
          <input
            type="range"
            min={12}
            max={36}
            value={uin}
            onChange={(e) => setUin(Number(e.target.value))}
            className="w-full accent-[#35D6FF]"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-bold mb-1">
            <span className="text-[#A1B5D8]">{t.lR1}</span>
            <span className="text-[#F4F8FC]">{r1} Ом</span>
          </div>
          <input
            type="range"
            min={100}
            max={4000}
            step={100}
            value={r1}
            onChange={(e) => setR1(Number(e.target.value))}
            className="w-full accent-[#377DFF]"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-bold mb-1">
            <span className="text-[#A1B5D8]">{t.lR2}</span>
            <span className="text-[#F4F8FC]">{r2} Ом</span>
          </div>
          <input
            type="range"
            min={100}
            max={4000}
            step={100}
            value={r2}
            onChange={(e) => setR2(Number(e.target.value))}
            className="w-full accent-[#FFD84D]"
          />
        </div>

        <div className="p-4 rounded-2xl bg-[#081C36] border border-[#35D6FF]/20 text-center">
          <span className="text-xs text-[#A1B5D8] font-bold block mb-1">{t.lUout}</span>
          <span
            className={`text-3xl font-black tabular-nums ${
              isSafe ? "text-[#26D07C]" : uout > 12.5 ? "text-[#FF5353]" : "text-[#FFD84D]"
            }`}
          >
            {uout.toFixed(1)} В
          </span>
          <p
            className={`text-xs font-bold mt-1 ${
              isSafe ? "text-[#26D07C]" : uout > 12.5 ? "text-[#FF5353]" : "text-[#FFD84D]"
            }`}
          >
            {isSafe ? t.safeMsg : uout > 12.5 ? t.highMsg : t.lowMsg}
          </p>
        </div>
      </div>
    );
  }

  if (missionId === "issykkul") {
    const outputU = stabMode === "stabilizer" ? (windUin >= 6.5 ? 5.0 : Math.max(0, windUin - 1.5)) : windUin - 9.0;
    const isSafe = outputU >= 4.8 && outputU <= 5.2;

    return (
      <div className="p-6 rounded-3xl bg-[#0D2547] border border-[#35D6FF]/20 space-y-4">
        <h3 className="font-black text-sm text-[#F4F8FC] uppercase tracking-wider">{t.labTitle}</h3>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              sfx.click();
              setStabMode("resistor");
            }}
            className={`p-2.5 rounded-xl text-xs font-bold border transition ${
              stabMode === "resistor"
                ? "bg-[#377DFF] text-[#F4F8FC] border-[#377DFF]"
                : "bg-[#081C36] text-[#A1B5D8] border-[#35D6FF]/15"
            }`}
          >
            {t.modeResistor}
          </button>
          <button
            onClick={() => {
              sfx.click();
              setStabMode("stabilizer");
            }}
            className={`p-2.5 rounded-xl text-xs font-bold border transition ${
              stabMode === "stabilizer"
                ? "bg-[#35D6FF] text-[#081C36] border-[#35D6FF]"
                : "bg-[#081C36] text-[#A1B5D8] border-[#35D6FF]/15"
            }`}
          >
            {t.modeStabilizer}
          </button>
        </div>

        <div>
          <div className="flex justify-between text-xs font-bold mb-1">
            <span className="text-[#A1B5D8]">{t.lUin}</span>
            <span className="text-[#F4F8FC]">{windUin} В</span>
          </div>
          <input
            type="range"
            min={5}
            max={24}
            value={windUin}
            onChange={(e) => setWindUin(Number(e.target.value))}
            className="w-full accent-[#35D6FF]"
          />
        </div>

        <div className="p-4 rounded-2xl bg-[#081C36] border border-[#35D6FF]/20 text-center">
          <span className="text-xs text-[#A1B5D8] font-bold block mb-1">Выход на зарядку (5.0 В)</span>
          <span
            className={`text-3xl font-black tabular-nums ${
              isSafe ? "text-[#26D07C]" : outputU > 5.2 ? "text-[#FF5353]" : "text-[#FFD84D]"
            }`}
          >
            {outputU.toFixed(1)} В
          </span>
          <p
            className={`text-xs font-bold mt-1 ${
              isSafe ? "text-[#26D07C]" : outputU > 5.2 ? "text-[#FF5353]" : "text-[#FFD84D]"
            }`}
          >
            {isSafe ? t.safeMsg : outputU > 5.2 ? t.highMsg : t.lowMsg}
          </p>
        </div>
      </div>
    );
  }

  // Osh
  const currentI = isDay ? (18 - 12) / loadR : hasDiode ? 0 : -12 / loadR;
  const isSafe = currentI >= 0;

  return (
    <div className="p-6 rounded-3xl bg-[#0D2547] border border-[#35D6FF]/20 space-y-4">
      <h3 className="font-black text-sm text-[#F4F8FC] uppercase tracking-wider">{t.labTitle}</h3>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => {
            sfx.click();
            setIsDay(true);
          }}
          className={`p-2.5 rounded-xl text-xs font-bold border transition ${
            isDay
              ? "bg-[#FFD84D] text-[#081C36] border-[#FFD84D]"
              : "bg-[#081C36] text-[#A1B5D8] border-[#35D6FF]/15"
          }`}
        >
          {t.dayBtn}
        </button>
        <button
          onClick={() => {
            sfx.click();
            setIsDay(false);
          }}
          className={`p-2.5 rounded-xl text-xs font-bold border transition ${
            !isDay
              ? "bg-[#377DFF] text-[#F4F8FC] border-[#377DFF]"
              : "bg-[#081C36] text-[#A1B5D8] border-[#35D6FF]/15"
          }`}
        >
          {t.nightBtn}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => {
            sfx.click();
            setHasDiode(true);
          }}
          className={`p-2 rounded-xl text-xs font-bold border transition ${
            hasDiode
              ? "bg-[#35D6FF] text-[#081C36] border-[#35D6FF]"
              : "bg-[#081C36] text-[#A1B5D8] border-[#35D6FF]/15"
          }`}
        >
          {t.diodeOn}
        </button>
        <button
          onClick={() => {
            sfx.click();
            setHasDiode(false);
          }}
          className={`p-2 rounded-xl text-xs font-bold border transition ${
            !hasDiode
              ? "bg-[#FF5353] text-[#F4F8FC] border-[#FF5353]"
              : "bg-[#081C36] text-[#A1B5D8] border-[#35D6FF]/15"
          }`}
        >
          {t.diodeOff}
        </button>
      </div>

      <div>
        <div className="flex justify-between text-xs font-bold mb-1">
          <span className="text-[#A1B5D8]">{t.lR}</span>
          <span className="text-[#F4F8FC]">{loadR} Ом</span>
        </div>
        <input
          type="range"
          min={2}
          max={20}
          value={loadR}
          onChange={(e) => setLoadR(Number(e.target.value))}
          className="w-full accent-[#35D6FF]"
        />
      </div>

      <div className="p-4 rounded-2xl bg-[#081C36] border border-[#35D6FF]/20 text-center">
        <span className="text-xs text-[#A1B5D8] font-bold block mb-1">{t.lI}</span>
        <span
          className={`text-3xl font-black tabular-nums ${
            isSafe ? (currentI > 0 ? "text-[#26D07C]" : "text-[#35D6FF]") : "text-[#FF5353]"
          }`}
        >
          {currentI.toFixed(2)} А
        </span>
        <p
          className={`text-xs font-bold mt-1 ${
            isSafe ? (currentI > 0 ? "text-[#26D07C]" : "text-[#35D6FF]") : "text-[#FF5353]"
          }`}
        >
          {isDay ? t.safeDay : hasDiode ? t.safeNight : t.badNight}
        </p>
      </div>
    </div>
  );
}
