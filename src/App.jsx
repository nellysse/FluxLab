import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// ============================================================================
// CONFIGURATION & CONSTANTS
// ============================================================================

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const MENTOR_URL = `${API_BASE}/api/ask-mentor`;
const STARS_KEY = "fluxlab_stars_v3";
const LANG_KEY = "fluxlab_lang_v3";

// Human-Centric Clean Palette (Inspired by Brilliant & Khan Academy)
const COLORS = {
  space: "#081C36",
  card: "#0D2547",
  cardBorder: "rgba(255, 255, 255, 0.08)",
  primary: "#377DFF",
  primaryHover: "#2868E0",
  accent: "#FFD84D",
  white: "#F4F8FC",
  muted: "#A1B5D8",
  danger: "#FF5353",
  success: "#26D07C",
  info: "#35D6FF",
};

// ============================================================================
// SVG ICONS (Clean & Minimalist)
// ============================================================================

const ICONS = {
  zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
  rocket:
    '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
  clock:
    '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  thermometer:
    '<path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>',
  book:
    '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  download:
    '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  alert:
    '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
  star:
    '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  rotate:
    '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
  bulb:
    '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.76.76 1.23 1.52 1.41 2.5"/>',
};

function Icon({ name, size = 18, className = "", style }) {
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
// BILINGUAL LOCALIZATION STRINGS
// ============================================================================

const STRINGS = {
  ru: {
    appTitle: "FluxLab",
    appSubtitle: "Интерактивная лаборатория физики",
    starsLabel: "звёзд",
    explainPhysics: "Объяснить физику",
    explaining: "Формулирование ответа...",
    exportCsv: "Экспорт отчёта (CSV)",
    modules: {
      circuit: {
        id: "circuit",
        title: "Электродинамика",
        subtitle: "Сборка цепи, делители напряжения и диодная защита",
        icon: "zap",
      },
      ballistics: {
        id: "ballistics",
        title: "Баллистика и Движение",
        subtitle: "Траектория, угол броска и сопротивление воздуха",
        icon: "rocket",
      },
      pendulum: {
        id: "pendulum",
        title: "Колебания и Маятник",
        subtitle: "Закон изохронизма, длина нити и затухание",
        icon: "clock",
      },
      thermodynamics: {
        id: "thermodynamics",
        title: "Молекулярная Физика",
        subtitle: "Изопроцессы идеального газа, работа и энергия ΔU",
        icon: "thermometer",
      },
    },
    circuitLab: {
      sourceLabel: "Напряжение источника (Uвх)",
      componentLabel: "Выбор компонента в цепи",
      parts: {
        resistor: "Резистор (делитель 50%)",
        stabilizer: "Стабилизатор (LM7805, 5.0 В)",
        diode: "Полупроводниковый диод",
        wire: "Прямой проводник (без защиты)",
      },
      polarityLabel: "Полярность подключения",
      polarityForward: "Прямая (нормальный режим)",
      polarityReverse: "Обратная (ночной ток / утечка)",
      testBtn: "Протестировать цепь",
      statusSafe: "Безопасный рабочий режим",
      statusBurn: "Опасно! Перегрузка по напряжению",
      statusBlocked: "Ток заблокирован диодом (защита активна)",
      multimeter: "Цифровой мультиметр",
      measuredU: "Напряжение на нагрузке (Uвых)",
      measuredI: "Сила тока (I)",
      powerP: "Мощность нагрузки (P)",
    },
    ballisticsLab: {
      controlsTitle: "Параметры запуска тела",
      v0Label: "Начальная скорость v₀",
      angleLabel: "Угол к горизонту α",
      heightLabel: "Начальная высота h₀",
      dragToggle: "Учитывать квадратичное сопротивление воздуха",
      envLabel: "Гравитационная среда",
      envs: {
        earth: "Земля (g = 9.81 м/с²)",
        mars: "Марс (g = 3.71 м/с²)",
        moon: "Луна (g = 1.62 м/с²)",
      },
      runSim: "Рассчитать траекторию",
      range: "Дальность полёта (L)",
      maxHeight: "Макс. высота (H)",
      flightTime: "Время полёта (T)",
      finalSpeed: "Скорость приземления",
    },
    pendulumLab: {
      controlsTitle: "Параметры маятника",
      lengthLabel: "Длина нити (L)",
      gravityLabel: "Ускорение свободного падения (g)",
      massLabel: "Масса груза (m) — проверьте влияние!",
      dampingLabel: "Затухание (трение среды)",
      runSim: "Рассчитать колебания",
      period: "Период колебаний (T)",
      frequency: "Частота (ν)",
      omega: "Циклическая частота (ω₀)",
      massInsight: "Масса груза не влияет на период свободных колебаний маятника.",
    },
    thermoLab: {
      controlsTitle: "Термодинамический процесс",
      processType: "Тип изопроцесса",
      types: {
        isothermal: "Изотермический (T = const)",
        isochoric: "Изохорный (V = const)",
        isobaric: "Изобарный (P = const)",
      },
      molesLabel: "Количество газа (ν)",
      initialP: "Начальное давление (P₀)",
      initialV: "Начальный объем (V₀)",
      initialT: "Начальная температура (T₀)",
      targetLabel: "Конечное значение процесса",
      runSim: "Рассчитать процесс",
      workDone: "Работа газа (W)",
      deltaU: "Изменение энергии (ΔU)",
      finalP: "Конечное давление (P₁)",
      finalT: "Конечная температура (T₁)",
    },
  },
  ky: {
    appTitle: "FluxLab",
    appSubtitle: "Интерактивдүү физика лабораториясы",
    starsLabel: "жылдыз",
    explainPhysics: "Физикасын түшүндүрүү",
    explaining: "Жооп даярдалууда...",
    exportCsv: "Отчётту жүктөө (CSV)",
    modules: {
      circuit: {
        id: "circuit",
        title: "Электродинамика",
        subtitle: "Чынжыр жыйноо, чыңалуу бөлгүчтөр жана диоддук коргоо",
        icon: "zap",
      },
      ballistics: {
        id: "ballistics",
        title: "Баллистика жана Кыймыл",
        subtitle: "Траектория, ыргытуу бурчу жана абанын каршылыгы",
        icon: "rocket",
      },
      pendulum: {
        id: "pendulum",
        title: "Термелүү жана Маятник",
        subtitle: "Изохронизм мыйзамы, жиптин узундугу жана өчүү",
        icon: "clock",
      },
      thermodynamics: {
        id: "thermodynamics",
        title: "Молекулалык Физика",
        subtitle: "Идеал газ изопроцесстери, жумуш жана энергия ΔU",
        icon: "thermometer",
      },
    },
    circuitLab: {
      sourceLabel: "Булактын чыңалуусу (Uкир)",
      componentLabel: "Чынжырдагы компонентти тандоо",
      parts: {
        resistor: "Резистор (50% бөлгүч)",
        stabilizer: "Стабилизатор (LM7805, 5.0 В)",
        diode: "Жарым өткөргүч диод",
        wire: "Түз зым (коргоо жок)",
      },
      polarityLabel: "Туташуу уюлдуулугу",
      polarityForward: "Түз багыт (нормалдуу режим)",
      polarityReverse: "Тескери багыт (тескери ток)",
      testBtn: "Чынжырды сынап көрүү",
      statusSafe: "Коопсуз нормалдуу режим",
      statusBurn: "Коркунуч! Чыңалуу өтө жогору",
      statusBlocked: "Ток диод менен бөгөлдү (коргоо иштеди)",
      multimeter: "Санариптик мультиметр",
      measuredU: "Жүктөмдөгү чыңалуу (Uчыг)",
      measuredI: "Токтун күчү (I)",
      powerP: "Жүктөмдүн кубаттуулугу (P)",
    },
    ballisticsLab: {
      controlsTitle: "Нерсени учуруу параметрлери",
      v0Label: "Баштапкы ылдамдык v₀",
      angleLabel: "Горизонтко бурч α",
      heightLabel: "Баштапкы бийиктик h₀",
      dragToggle: "Абанын аэродинамикалык каршылыгын эсепке алуу",
      envLabel: "Гравитациялык чөйрө",
      envs: {
        earth: "Жер (g = 9.81 м/с²)",
        mars: "Марс (g = 3.71 м/с²)",
        moon: "Ай (g = 1.62 м/с²)",
      },
      runSim: "Траекторияны эсептөө",
      range: "Учуу аралыгы (L)",
      maxHeight: "Макс. бийиктик (H)",
      flightTime: "Учуу убактысы (T)",
      finalSpeed: "Жерге тийүү ылдамдыгы",
    },
    pendulumLab: {
      controlsTitle: "Маятниктин параметрлери",
      lengthLabel: "Жиптин узундугу (L)",
      gravityLabel: "Эркин түшүүнүн ылдамдануусу (g)",
      massLabel: "Жүктүн массасы (m) — таасирин текшериңиз!",
      dampingLabel: "Өчүү коэффициенти (сүрүлүү)",
      runSim: "Термелүүнү эсептөө",
      period: "Термелүү мезгили (T)",
      frequency: "Жыштыгы (ν)",
      omega: "Айланма жыштыгы (ω₀)",
      massInsight: "Жүктүн массасы маятниктин эркин термелүү мезгилине таасир этпейт.",
    },
    thermoLab: {
      controlsTitle: "Термодинамикалык процесс",
      processType: "Изопроцесстин түрү",
      types: {
        isothermal: "Изотермикалык (T = const)",
        isochoric: "Изохоралык (V = const)",
        isobaric: "Изобаралык (P = const)",
      },
      molesLabel: "Газдын зат саны (ν)",
      initialP: "Баштапкы басым (P₀)",
      initialV: "Баштапкы көлөм (V₀)",
      initialT: "Баштапкы температура (T₀)",
      targetLabel: "Процесстин акыркы мааниси",
      runSim: "Процессти эсептөө",
      workDone: "Газдын жумушу (W)",
      deltaU: "Ички энергиянын өзгөрүшү (ΔU)",
      finalP: "Акыркы басым (P₁)",
      finalT: "Акыркы температура (T₁)",
    },
  },
};

// ============================================================================
// API CLIENT WITH SEAMLESS OFFLINE CAPABILITIES
// ============================================================================

async function fetchExplanation(topic, params, lang) {
  try {
    const res = await fetch(MENTOR_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, params, lang }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.answer;
    }
  } catch {
    /* fallback to local pedagogical text */
  }

  const isKy = lang === "ky";
  if (topic === "circuit") {
    return isKy
      ? "Электр чынжырында резисторлор чыңалууну бөлгүч катары иштеп (Uчыг = Uкир · R2 / (R1 + R2)), ашыкча чыңалууну жылуулукка айлантат. Стабилизатор 5 В туруктуу кармап турса, диод токту бир гана багытта өткөрүп тескери агымдан сактайт."
      : "В электрической цепи резисторы работают как делители потенциала (Uвых = Uвх · R2 / (R1 + R2)). Интегральный стабилизатор фиксирует выход на уровне ровно 5.0 В при любых скачках, а полупроводниковый диод за счёт p-n перехода защищает источник от обратного тока.";
  }
  if (topic === "ballistics") {
    return isKy
      ? "Вакуумда учуу аралыгы горизонтко 45° бурчта максималдуу болот (L = v0² sin(2α) / g). Абанын каршылыгы бар чөйрөдө ылдамдык басаңдап, максималдуу аралыкка жетүүчү оптималдуу бурч 38°-42° чейин төмөндөйт."
      : "В вакууме дальность полёта максимальна под углом 45° (L = v0² sin(2α) / g), так как горизонтальная и вертикальная скорости сбалансированы. В атмосфере квадратичное сопротивление воздуха круче тормозит тело, смещая оптимальный угол к 38°-42°.";
  }
  if (topic === "pendulum") {
    return isKy
      ? "Маятниктин термелүү мезгили T = 2π√(L/g) жиптин узундугунан жана гравитациядан гана көз каранды болуп, жүктүн массасына көз каранды эмес. Себеби оордук күчү да, инерттүүлүк да массага түз пропорционал (F=ma) болуп, массалар кыскарып кетет."
      : "Период колебаний маятника T = 2π√(L/g) зависит только от длины подвеса L и силы тяжести g, и абсолютно не зависит от массы груза. Сила тяжести и инертность одинаково пропорциональны массе (F=ma), поэтому масса взаимно сокращается.";
  }
  if (topic === "thermodynamics") {
    return isKy
      ? "Термодинамиканын биринчи башталышы боюнча (Q = ΔU + W), берилген жылуулук ички энергияга жана газдын жумушуна жумшалат. Газдын жумушу W = ∫P dV диаграммадагы P-V ийри сызыгынын астындагы аянтка барабар. Изотермикалык процессте T = const болгондуктан, ΔU = 0 болот."
      : "Согласно Первому началу термодинамики (Q = ΔU + W), тепло расходуется на нагрев и работу газа. Работа W = ∫P dV численно равна площади под кривой на P-V диаграмме. В изотермическом процессе температура постоянна, поэтому ΔU = 0 и всё тепло переходит в работу.";
  }
  return "";
}

async function exportLabReport(topic, title, params, points, conclusions) {
  try {
    const res = await fetch(`${API_BASE}/api/v1/export/report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: "student",
        lesson_id: topic,
        lab_title: title,
        input_parameters: params,
        table_points: points.slice(0, 50),
        conclusions,
        format: "csv",
      }),
    });
    if (res.ok) {
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `FluxLab_${topic}_Report.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      return;
    }
  } catch {
    /* fallback to client CSV */
  }

  // Client fallback
  let csv = `FluxLab Report: ${title}\nDate: ${new Date().toISOString()}\n\n`;
  csv += "--- Parameters ---\n";
  for (const [k, v] of Object.entries(params)) {
    csv += `${k},${v}\n`;
  }
  csv += "\n--- Telemetry & Points ---\n";
  if (points.length > 0) {
    const headers = Object.keys(points[0]);
    csv += headers.join(",") + "\n";
    for (const p of points) {
      csv += headers.map((h) => p[h] ?? "").join(",") + "\n";
    }
  }
  csv += `\nConclusions: ${conclusions}\n`;

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `FluxLab_${topic}_Report.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================

export default function App() {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem(LANG_KEY) || "ru";
    } catch {
      return "ru";
    }
  });

  const [activeModule, setActiveModule] = useState("circuit");

  const [stars, setStars] = useState(() => {
    try {
      const saved = localStorage.getItem(STARS_KEY);
      return saved ? JSON.parse(saved) : { circuit: 1, ballistics: 1, pendulum: 1, thermodynamics: 1 };
    } catch {
      return { circuit: 1, ballistics: 1, pendulum: 1, thermodynamics: 1 };
    }
  });

  const t = STRINGS[lang];
  const totalStars = Object.values(stars).reduce((a, b) => a + b, 0);

  const toggleLang = () => {
    const next = lang === "ru" ? "ky" : "ru";
    setLang(next);
    try {
      localStorage.setItem(LANG_KEY, next);
    } catch {
      /* ignore */
    }
  };

  const markCompleted = (moduleKey) => {
    const next = { ...stars, [moduleKey]: 3 };
    setStars(next);
    try {
      localStorage.setItem(STARS_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="min-h-screen bg-[#081C36] text-[#F4F8FC] flex flex-col font-sans selection:bg-[#377DFF]/40 selection:text-[#F4F8FC]">
      {/* ==================================================================== */}
      {/* TOPBAR / HEADER */}
      {/* ==================================================================== */}
      <header className="sticky top-0 z-50 bg-[#081C36]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 transition">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="FluxLab" className="h-9 w-auto" />
            <div>
              <span className="text-xl font-bold tracking-tight text-[#F4F8FC] flex items-center gap-2">
                FluxLab
              </span>
              <p className="text-xs text-[#A1B5D8] hidden sm:block font-medium">{t.appSubtitle}</p>
            </div>
          </div>

          {/* Controls: Language & Stars */}
          <div className="flex items-center gap-3">
            {/* Stars counter badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0D2547] border border-white/10 text-xs font-semibold text-[#FFD84D]">
              <Icon name="star" size={14} style={{ fill: "#FFD84D" }} />
              <span>{totalStars} / 12 {t.starsLabel}</span>
            </div>

            {/* Language Switcher */}
            <button
              onClick={toggleLang}
              className="px-3 py-1.5 rounded-full bg-[#0D2547] hover:bg-white/5 border border-white/10 text-xs font-semibold text-[#F4F8FC] transition focus:outline-none"
            >
              {lang === "ru" ? "🇷🇺 РУС" : "🇰🇬 КЫР"}
            </button>
          </div>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* UNIFIED LAB CATALOG TABS */}
      {/* ==================================================================== */}
      <nav className="border-b border-white/10 bg-[#081C36] px-4 sm:px-8 pt-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {Object.values(t.modules).map((mod) => {
            const isActive = activeModule === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => setActiveModule(mod.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition border ${
                  isActive
                    ? "bg-[#377DFF] text-[#F4F8FC] border-[#377DFF] shadow-sm"
                    : "bg-[#0D2547] text-[#A1B5D8] hover:text-[#F4F8FC] border-white/10"
                }`}
              >
                <Icon name={mod.icon} size={16} />
                <span>{mod.title}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ==================================================================== */}
      {/* ACTIVE LAB MODULE CONTENT */}
      {/* ==================================================================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8">
        {activeModule === "circuit" && (
          <CircuitModule
            t={t}
            lang={lang}
            onComplete={() => markCompleted("circuit")}
          />
        )}

        {activeModule === "ballistics" && (
          <BallisticsModule
            t={t}
            lang={lang}
            onComplete={() => markCompleted("ballistics")}
          />
        )}

        {activeModule === "pendulum" && (
          <PendulumModule
            t={t}
            lang={lang}
            onComplete={() => markCompleted("pendulum")}
          />
        )}

        {activeModule === "thermodynamics" && (
          <ThermodynamicsModule
            t={t}
            lang={lang}
            onComplete={() => markCompleted("thermodynamics")}
          />
        )}
      </main>

      {/* ==================================================================== */}
      {/* CLEAN FOOTER */}
      {/* ==================================================================== */}
      <footer className="border-t border-white/10 py-6 px-4 sm:px-8 bg-[#081C36] text-xs text-[#A1B5D8]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#F4F8FC]">FluxLab</span>
            <span>· Открытая интерактивная лаборатория физики</span>
          </div>
          <p>© 2026 FluxLab. Образовательная платформа концептуального понимания физических законов.</p>
        </div>
      </footer>
    </div>
  );
}

// ============================================================================
// MODULE 1: ⚡ ЭЛЕКТРОДИНАМИКА (CIRCUIT BUILDER)
// ============================================================================

function CircuitModule({ t, lang, onComplete }) {
  const lab = t.circuitLab;
  const [uin, setUin] = useState(16);
  const [component, setComponent] = useState("stabilizer");
  const [polarity, setPolarity] = useState("forward");
  const [explanation, setExplanation] = useState(null);
  const [explaining, setExplaining] = useState(false);

  // Physical calculations
  let uout = 0;
  let status = "safe";

  if (polarity === "reverse") {
    if (component === "diode") {
      uout = 0.0;
      status = "blocked";
    } else {
      uout = -uin;
      status = "burn";
    }
  } else {
    if (component === "resistor") {
      uout = uin * 0.5; // Voltage divider with equal resistors
      status = uout >= 4.5 && uout <= 12.5 ? "safe" : "burn";
    } else if (component === "stabilizer") {
      uout = uin >= 6.5 ? 5.0 : Math.max(0, uin - 1.5);
      status = "safe";
    } else if (component === "diode") {
      uout = Math.max(0, uin - 0.7);
      status = uout > 14 ? "burn" : "safe";
    } else {
      uout = uin; // Direct wire
      status = uin > 12 ? "burn" : "safe";
    }
  }

  const loadR = 10; // Ohms
  const current = Math.abs(uout) / loadR;
  const power = Math.abs(uout * current);

  const fetchExplain = async () => {
    setExplaining(true);
    const exp = await fetchExplanation(
      "circuit",
      { uin, component, polarity, uout, current },
      lang
    );
    setExplanation(exp);
    setExplaining(false);
  };

  const handleExport = () => {
    exportLabReport(
      "circuit",
      t.modules.circuit.title,
      { input_voltage: uin, component, polarity },
      [{ uout: uout.toFixed(2), current: current.toFixed(2), power: power.toFixed(2) }],
      `Статус цепи: ${status}`
    );
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#F4F8FC]">{t.modules.circuit.title}</h2>
          <p className="text-sm text-[#A1B5D8]">{t.modules.circuit.subtitle}</p>
        </div>
        <button
          onClick={handleExport}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0D2547] hover:bg-white/5 border border-white/10 text-xs font-semibold text-[#A1B5D8] hover:text-[#F4F8FC] transition"
        >
          <Icon name="download" size={15} />
          <span>{t.exportCsv}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interactive Circuit Schematic & Multimeter */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-[#0D2547] border border-white/10">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#A1B5D8] mb-4">
              Схема электрической цепи
            </h3>

            {/* Schematic Board */}
            <div className="p-6 rounded-xl bg-[#081C36] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Power Source */}
              <div className="flex flex-col items-center p-4 rounded-xl bg-[#0D2547] border border-white/10 w-36 text-center">
                <span className="text-xs font-semibold text-[#A1B5D8] mb-1">Источник питания</span>
                <span className="text-2xl font-bold text-[#F4F8FC] tabular-nums">{uin} В</span>
                <span className="text-[11px] text-[#377DFF] font-medium mt-1">
                  {polarity === "forward" ? "+ / − (Прямая)" : "− / + (Обратная)"}
                </span>
              </div>

              {/* Connecting line */}
              <div className="h-1 flex-1 w-full sm:w-auto bg-white/10 rounded-full" />

              {/* Component Slot */}
              <div className="p-4 rounded-xl bg-[#0D2547] border border-white/20 text-center min-w-[160px]">
                <span className="text-xs font-semibold text-[#A1B5D8] mb-1 block">Установленный элемент</span>
                <span className="text-sm font-bold text-[#FFD84D] block">{lab.parts[component]}</span>
              </div>

              {/* Connecting line */}
              <div className="h-1 flex-1 w-full sm:w-auto bg-white/10 rounded-full" />

              {/* Load Device */}
              <div className="flex flex-col items-center p-4 rounded-xl bg-[#0D2547] border border-white/10 w-36 text-center">
                <span className="text-xs font-semibold text-[#A1B5D8] mb-1">Потребитель (10 Ом)</span>
                <span className="text-2xl font-bold tabular-nums text-[#F4F8FC]">
                  {uout.toFixed(1)} В
                </span>
                <span
                  className={`text-[11px] font-semibold mt-1 ${
                    status === "safe"
                      ? "text-[#26D07C]"
                      : status === "blocked"
                      ? "text-[#35D6FF]"
                      : "text-[#FF5353]"
                  }`}
                >
                  {status === "safe"
                    ? "В норме"
                    : status === "blocked"
                    ? "Заблокирован"
                    : "Перегрузка"}
                </span>
              </div>
            </div>

            {/* Multimeter Telemetry Cards */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="p-3.5 rounded-xl bg-[#081C36] border border-white/10">
                <span className="text-xs text-[#A1B5D8] block mb-1">{lab.measuredU}</span>
                <span className="text-xl font-bold text-[#F4F8FC] tabular-nums">{uout.toFixed(2)} В</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#081C36] border border-white/10">
                <span className="text-xs text-[#A1B5D8] block mb-1">{lab.measuredI}</span>
                <span className="text-xl font-bold text-[#35D6FF] tabular-nums">{current.toFixed(2)} А</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#081C36] border border-white/10">
                <span className="text-xs text-[#A1B5D8] block mb-1">{lab.powerP}</span>
                <span className="text-xl font-bold text-[#FFD84D] tabular-nums">{power.toFixed(1)} Вт</span>
              </div>
            </div>
          </div>

          {/* AI Explainer Card */}
          <ExplainerCard
            explanation={explanation}
            loading={explaining}
            onExplain={fetchExplain}
            t={t}
          />
        </div>

        {/* Right Column: Controls */}
        <div className="p-6 rounded-2xl bg-[#0D2547] border border-white/10 space-y-5">
          <h3 className="font-bold text-base text-[#F4F8FC]">Параметры эксперимента</h3>

          {/* Voltage Slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className="text-[#A1B5D8]">{lab.sourceLabel}</span>
              <span className="text-[#F4F8FC] tabular-nums">{uin} В</span>
            </div>
            <input
              type="range"
              min={4}
              max={24}
              value={uin}
              onChange={(e) => setUin(Number(e.target.value))}
              className="w-full accent-[#377DFF] bg-[#081C36]"
            />
          </div>

          {/* Polarity Buttons */}
          <div>
            <span className="text-xs font-semibold text-[#A1B5D8] block mb-2">{lab.polarityLabel}</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setPolarity("forward")}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                  polarity === "forward"
                    ? "bg-[#377DFF] text-[#F4F8FC] border-[#377DFF]"
                    : "bg-[#081C36] text-[#A1B5D8] border-white/10"
                }`}
              >
                {lab.polarityForward}
              </button>
              <button
                onClick={() => setPolarity("reverse")}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                  polarity === "reverse"
                    ? "bg-[#377DFF] text-[#F4F8FC] border-[#377DFF]"
                    : "bg-[#081C36] text-[#A1B5D8] border-white/10"
                }`}
              >
                {lab.polarityReverse}
              </button>
            </div>
          </div>

          {/* Component Selection */}
          <div>
            <span className="text-xs font-semibold text-[#A1B5D8] block mb-2">{lab.componentLabel}</span>
            <div className="space-y-2">
              {Object.entries(lab.parts).map(([key, name]) => {
                const isSelected = component === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setComponent(key);
                      onComplete();
                    }}
                    className={`w-full p-3 rounded-xl text-left text-xs font-semibold border transition flex items-center justify-between ${
                      isSelected
                        ? "bg-[#377DFF]/15 border-[#377DFF] text-[#F4F8FC]"
                        : "bg-[#081C36] border-white/10 text-[#A1B5D8] hover:text-[#F4F8FC]"
                    }`}
                  >
                    <span>{name}</span>
                    {isSelected && <Icon name="check" size={15} className="text-[#377DFF]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MODULE 2: 🚀 БАЛЛИСТИКА И ДВИЖЕНИЕ (KINEMATICS SIMULATOR)
// ============================================================================

function BallisticsModule({ t, lang, onComplete }) {
  const lab = t.ballisticsLab;
  const [v0, setV0] = useState(35);
  const [angle, setAngle] = useState(45);
  const [h0, setH0] = useState(0);
  const [drag, setDrag] = useState(false);
  const [env, setEnv] = useState("earth");

  const [explanation, setExplanation] = useState(null);
  const [explaining, setExplaining] = useState(false);

  const gravity = env === "moon" ? 1.62 : env === "mars" ? 3.71 : 9.81;

  // Real-time Numerical Integration
  const trajectoryData = useMemo(() => {
    const rad = (angle * Math.PI) / 180;
    let vx = v0 * Math.cos(rad);
    let vy = v0 * Math.sin(rad);
    let x = 0;
    let y = h0;
    let tCur = 0;
    const dt = 0.02;
    const points = [];
    let maxH = y;

    while (y >= 0 && points.length < 1000) {
      points.push({ x, y, t: tCur });
      maxH = Math.max(maxH, y);
      const speed = Math.hypot(vx, vy);
      const dragForce = drag ? 0.0025 * speed * speed : 0;
      const ax = -dragForce * (vx / (speed || 1));
      const ay = -gravity - dragForce * (vy / (speed || 1));
      vx += ax * dt;
      vy += ay * dt;
      x += vx * dt;
      y += vy * dt;
      tCur += dt;
    }

    return {
      points,
      range: x,
      maxHeight: maxH,
      flightTime: tCur,
      finalSpeed: Math.hypot(vx, vy),
    };
  }, [v0, angle, h0, drag, gravity]);

  const fetchExplain = async () => {
    setExplaining(true);
    const exp = await fetchExplanation(
      "ballistics",
      { v0, angle, h0, drag, env, range: trajectoryData.range.toFixed(1) },
      lang
    );
    setExplanation(exp);
    setExplaining(false);
  };

  const handleExport = () => {
    exportLabReport(
      "ballistics",
      t.modules.ballistics.title,
      { v0, angle, h0, drag, gravity },
      trajectoryData.points.slice(0, 50).map((p) => ({
        x: p.x.toFixed(2),
        y: p.y.toFixed(2),
        t: p.t.toFixed(2),
      })),
      `Дальность: ${trajectoryData.range.toFixed(1)} м, Макс. высота: ${trajectoryData.maxHeight.toFixed(1)} м`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#F4F8FC]">{t.modules.ballistics.title}</h2>
          <p className="text-sm text-[#A1B5D8]">{t.modules.ballistics.subtitle}</p>
        </div>
        <button
          onClick={handleExport}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0D2547] hover:bg-white/5 border border-white/10 text-xs font-semibold text-[#A1B5D8] hover:text-[#F4F8FC] transition"
        >
          <Icon name="download" size={15} />
          <span>{t.exportCsv}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Vector SVG Chart & Telemetry */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-[#0D2547] border border-white/10">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#A1B5D8] mb-4">
              Траектория движения тела y(x)
            </h3>

            {/* Trajectory Canvas */}
            <TrajectorySvg points={trajectoryData.points} />

            {/* Telemetry Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              <div className="p-3.5 rounded-xl bg-[#081C36] border border-white/10">
                <span className="text-xs text-[#A1B5D8] block mb-1">{lab.range}</span>
                <span className="text-xl font-bold text-[#35D6FF] tabular-nums">
                  {trajectoryData.range.toFixed(1)} м
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#081C36] border border-white/10">
                <span className="text-xs text-[#A1B5D8] block mb-1">{lab.maxHeight}</span>
                <span className="text-xl font-bold text-[#FFD84D] tabular-nums">
                  {trajectoryData.maxHeight.toFixed(1)} м
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#081C36] border border-white/10">
                <span className="text-xs text-[#A1B5D8] block mb-1">{lab.flightTime}</span>
                <span className="text-xl font-bold text-[#26D07C] tabular-nums">
                  {trajectoryData.flightTime.toFixed(1)} с
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#081C36] border border-white/10">
                <span className="text-xs text-[#A1B5D8] block mb-1">{lab.finalSpeed}</span>
                <span className="text-xl font-bold text-[#F4F8FC] tabular-nums">
                  {trajectoryData.finalSpeed.toFixed(1)} м/с
                </span>
              </div>
            </div>
          </div>

          <ExplainerCard
            explanation={explanation}
            loading={explaining}
            onExplain={fetchExplain}
            t={t}
          />
        </div>

        {/* Right Column: Controls */}
        <div className="p-6 rounded-2xl bg-[#0D2547] border border-white/10 space-y-5">
          <h3 className="font-bold text-base text-[#F4F8FC]">{lab.controlsTitle}</h3>

          {/* Velocity slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className="text-[#A1B5D8]">{lab.v0Label}</span>
              <span className="text-[#F4F8FC] tabular-nums">{v0} м/с</span>
            </div>
            <input
              type="range"
              min={10}
              max={80}
              value={v0}
              onChange={(e) => {
                setV0(Number(e.target.value));
                onComplete();
              }}
              className="w-full accent-[#377DFF] bg-[#081C36]"
            />
          </div>

          {/* Angle slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className="text-[#A1B5D8]">{lab.angleLabel}</span>
              <span className="text-[#FFD84D] tabular-nums">{angle}°</span>
            </div>
            <input
              type="range"
              min={10}
              max={85}
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              className="w-full accent-[#FFD84D] bg-[#081C36]"
            />
          </div>

          {/* Initial height slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className="text-[#A1B5D8]">{lab.heightLabel}</span>
              <span className="text-[#F4F8FC] tabular-nums">{h0} м</span>
            </div>
            <input
              type="range"
              min={0}
              max={40}
              value={h0}
              onChange={(e) => setH0(Number(e.target.value))}
              className="w-full accent-[#377DFF] bg-[#081C36]"
            />
          </div>

          {/* Air drag toggle */}
          <div className="pt-2 border-t border-white/10">
            <label className="flex items-center gap-2.5 text-xs font-semibold text-[#F4F8FC] cursor-pointer">
              <input
                type="checkbox"
                checked={drag}
                onChange={(e) => setDrag(e.target.checked)}
                className="w-4 h-4 rounded text-[#377DFF] accent-[#377DFF]"
              />
              <span>{lab.dragToggle}</span>
            </label>
          </div>

          {/* Environment selection */}
          <div>
            <span className="text-xs font-semibold text-[#A1B5D8] block mb-2">{lab.envLabel}</span>
            <div className="space-y-1.5">
              {[
                { id: "earth", name: lab.envs.earth },
                { id: "mars", name: lab.envs.mars },
                { id: "moon", name: lab.envs.moon },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setEnv(item.id)}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold border transition text-left ${
                    env === item.id
                      ? "bg-[#377DFF]/15 border-[#377DFF] text-[#F4F8FC]"
                      : "bg-[#081C36] border-white/10 text-[#A1B5D8] hover:text-[#F4F8FC]"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MODULE 3: ⏱️ КОЛЕБАНИЯ И МАЯТНИК (PENDULUM SIMULATOR)
// ============================================================================

function PendulumModule({ t, lang, onComplete }) {
  const lab = t.pendulumLab;
  const [length, setLength] = useState(1.5);
  const [mass, setMass] = useState(1.0);
  const [gravity, setGravity] = useState(9.81);
  const [damping, setDamping] = useState(0.1);

  const [explanation, setExplanation] = useState(null);
  const [explaining, setExplaining] = useState(false);

  // Period T = 2 * pi * sqrt(L / g)
  const omega0 = Math.sqrt(gravity / length);
  const gamma = damping / (2 * mass);
  const omegaD = gamma < omega0 ? Math.sqrt(omega0 * omega0 - gamma * gamma) : 0;
  const period = omegaD > 0 ? (2 * Math.PI) / omegaD : 0;
  const frequency = period > 0 ? 1 / period : 0;

  // Wave points
  const points = useMemo(() => {
    const list = [];
    const dt = 0.04;
    const duration = 10;
    let tCur = 0;
    let x = 0.5;
    let v = 0;

    while (tCur <= duration) {
      list.push({ t: tCur, x });
      const a = -2 * gamma * v - omega0 * omega0 * x;
      v += a * dt;
      x += v * dt;
      tCur += dt;
    }
    return list;
  }, [length, mass, gravity, damping, gamma, omega0]);

  const fetchExplain = async () => {
    setExplaining(true);
    const exp = await fetchExplanation(
      "pendulum",
      { length, mass, gravity, damping, period: period.toFixed(2) },
      lang
    );
    setExplanation(exp);
    setExplaining(false);
  };

  const handleExport = () => {
    exportLabReport(
      "pendulum",
      t.modules.pendulum.title,
      { length, mass, gravity, damping },
      points.slice(0, 50).map((p) => ({ t: p.t.toFixed(2), displacement: p.x.toFixed(3) })),
      `Период T: ${period.toFixed(2)} с, Частота: ${frequency.toFixed(2)} Гц`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#F4F8FC]">{t.modules.pendulum.title}</h2>
          <p className="text-sm text-[#A1B5D8]">{t.modules.pendulum.subtitle}</p>
        </div>
        <button
          onClick={handleExport}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0D2547] hover:bg-white/5 border border-white/10 text-xs font-semibold text-[#A1B5D8] hover:text-[#F4F8FC] transition"
        >
          <Icon name="download" size={15} />
          <span>{t.exportCsv}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-[#0D2547] border border-white/10">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#A1B5D8] mb-4">
              График смещения во времени x(t)
            </h3>

            <WaveSvg points={points} />

            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="p-3.5 rounded-xl bg-[#081C36] border border-white/10">
                <span className="text-xs text-[#A1B5D8] block mb-1">{lab.period}</span>
                <span className="text-xl font-bold text-[#35D6FF] tabular-nums">
                  {period.toFixed(2)} с
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#081C36] border border-white/10">
                <span className="text-xs text-[#A1B5D8] block mb-1">{lab.frequency}</span>
                <span className="text-xl font-bold text-[#FFD84D] tabular-nums">
                  {frequency.toFixed(2)} Гц
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#081C36] border border-white/10">
                <span className="text-xs text-[#A1B5D8] block mb-1">{lab.omega}</span>
                <span className="text-xl font-bold text-[#26D07C] tabular-nums">
                  {omega0.toFixed(2)} рад/с
                </span>
              </div>
            </div>

            <p className="text-xs text-[#A1B5D8] mt-4 flex items-center gap-2">
              <Icon name="alert" size={14} className="text-[#FFD84D]" />
              <span>{lab.massInsight}</span>
            </p>
          </div>

          <ExplainerCard
            explanation={explanation}
            loading={explaining}
            onExplain={fetchExplain}
            t={t}
          />
        </div>

        {/* Right Column: Controls */}
        <div className="p-6 rounded-2xl bg-[#0D2547] border border-white/10 space-y-5">
          <h3 className="font-bold text-base text-[#F4F8FC]">{lab.controlsTitle}</h3>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className="text-[#A1B5D8]">{lab.lengthLabel}</span>
              <span className="text-[#35D6FF] tabular-nums">{length.toFixed(1)} м</span>
            </div>
            <input
              type="range"
              min={0.2}
              max={4.0}
              step={0.1}
              value={length}
              onChange={(e) => {
                setLength(Number(e.target.value));
                onComplete();
              }}
              className="w-full accent-[#35D6FF] bg-[#081C36]"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className="text-[#A1B5D8]">{lab.massLabel}</span>
              <span className="text-[#FFD84D] tabular-nums">{mass.toFixed(1)} кг</span>
            </div>
            <input
              type="range"
              min={0.2}
              max={5.0}
              step={0.2}
              value={mass}
              onChange={(e) => setMass(Number(e.target.value))}
              className="w-full accent-[#FFD84D] bg-[#081C36]"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className="text-[#A1B5D8]">{lab.gravityLabel}</span>
              <span className="text-[#F4F8FC] tabular-nums">{gravity.toFixed(2)} м/с²</span>
            </div>
            <input
              type="range"
              min={1.6}
              max={15.0}
              step={0.2}
              value={gravity}
              onChange={(e) => setGravity(Number(e.target.value))}
              className="w-full accent-[#377DFF] bg-[#081C36]"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className="text-[#A1B5D8]">{lab.dampingLabel}</span>
              <span className="text-[#F4F8FC] tabular-nums">{damping.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={0.8}
              step={0.05}
              value={damping}
              onChange={(e) => setDamping(Number(e.target.value))}
              className="w-full accent-[#377DFF] bg-[#081C36]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MODULE 4: 🌡️ МОЛЕКУЛЯРНАЯ ФИЗИКА (GAS LAWS)
// ============================================================================

function ThermodynamicsModule({ t, lang, onComplete }) {
  const lab = t.thermoLab;
  const [proc, setProc] = useState("isothermal");
  const [moles, setMoles] = useState(1.0);
  const [t0, setT0] = useState(300);
  const [vTarget, setVTarget] = useState(0.04);

  const [explanation, setExplanation] = useState(null);
  const [explaining, setExplaining] = useState(false);

  const R = 8.314;
  const v0 = 0.02; // Initial volume, m^3
  const p0 = (moles * R * t0) / v0; // Initial pressure, Pa

  // Thermodynamics calculation
  const sim = useMemo(() => {
    const steps = 30;
    const pts = [];
    let work = 0;
    let deltaU = 0;
    let finalP = p0;
    let finalT = t0;

    if (proc === "isothermal") {
      for (let i = 0; i <= steps; i++) {
        const v = v0 + ((vTarget - v0) * i) / steps;
        const p = (moles * R * t0) / v;
        pts.push({ v: v * 1000, p: p / 1000 });
      }
      work = moles * R * t0 * Math.log(vTarget / v0);
      deltaU = 0;
      finalP = (moles * R * t0) / vTarget;
    } else if (proc === "isochoric") {
      const targetT = t0 + (vTarget - 0.02) * 5000;
      for (let i = 0; i <= steps; i++) {
        const temp = t0 + ((targetT - t0) * i) / steps;
        const p = (moles * R * temp) / v0;
        pts.push({ v: v0 * 1000, p: p / 1000 });
      }
      work = 0;
      deltaU = moles * 1.5 * R * (targetT - t0);
      finalP = (moles * R * targetT) / v0;
      finalT = targetT;
    } else {
      // Isobaric
      for (let i = 0; i <= steps; i++) {
        const v = v0 + ((vTarget - v0) * i) / steps;
        pts.push({ v: v * 1000, p: p0 / 1000 });
      }
      work = p0 * (vTarget - v0);
      finalT = (p0 * vTarget) / (moles * R);
      deltaU = moles * 1.5 * R * (finalT - t0);
      finalP = p0;
    }

    return {
      points: pts,
      work,
      deltaU,
      finalP,
      finalT,
    };
  }, [proc, moles, t0, vTarget, p0]);

  const fetchExplain = async () => {
    setExplaining(true);
    const exp = await fetchExplanation(
      "thermodynamics",
      { process_type: proc, moles, initial_t: t0, work: sim.work.toFixed(0) },
      lang
    );
    setExplanation(exp);
    setExplaining(false);
  };

  const handleExport = () => {
    exportLabReport(
      "thermodynamics",
      t.modules.thermodynamics.title,
      { process: proc, moles, initial_t: t0, v_target: vTarget },
      sim.points.map((p) => ({ volume_L: p.v.toFixed(2), pressure_kPa: p.p.toFixed(2) })),
      `Работа W: ${sim.work.toFixed(1)} Дж, ΔU: ${sim.deltaU.toFixed(1)} Дж`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#F4F8FC]">{t.modules.thermodynamics.title}</h2>
          <p className="text-sm text-[#A1B5D8]">{t.modules.thermodynamics.subtitle}</p>
        </div>
        <button
          onClick={handleExport}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0D2547] hover:bg-white/5 border border-white/10 text-xs font-semibold text-[#A1B5D8] hover:text-[#F4F8FC] transition"
        >
          <Icon name="download" size={15} />
          <span>{t.exportCsv}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-[#0D2547] border border-white/10">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#A1B5D8] mb-4">
              P-V Диаграмма (Площадь под кривой = Работа газа W)
            </h3>

            <PvSvg points={sim.points} />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              <div className="p-3.5 rounded-xl bg-[#081C36] border border-white/10">
                <span className="text-xs text-[#A1B5D8] block mb-1">{lab.workDone}</span>
                <span className="text-xl font-bold text-[#35D6FF] tabular-nums">
                  {sim.work.toFixed(0)} Дж
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#081C36] border border-white/10">
                <span className="text-xs text-[#A1B5D8] block mb-1">{lab.deltaU}</span>
                <span className="text-xl font-bold text-[#FFD84D] tabular-nums">
                  {sim.deltaU.toFixed(0)} Дж
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#081C36] border border-white/10">
                <span className="text-xs text-[#A1B5D8] block mb-1">{lab.finalP}</span>
                <span className="text-xl font-bold text-[#26D07C] tabular-nums">
                  {(sim.finalP / 1000).toFixed(0)} кПа
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#081C36] border border-white/10">
                <span className="text-xs text-[#A1B5D8] block mb-1">{lab.finalT}</span>
                <span className="text-xl font-bold text-[#F4F8FC] tabular-nums">
                  {Math.round(sim.finalT)} К
                </span>
              </div>
            </div>
          </div>

          <ExplainerCard
            explanation={explanation}
            loading={explaining}
            onExplain={fetchExplain}
            t={t}
          />
        </div>

        {/* Right Column: Controls */}
        <div className="p-6 rounded-2xl bg-[#0D2547] border border-white/10 space-y-5">
          <h3 className="font-bold text-base text-[#F4F8FC]">{lab.controlsTitle}</h3>

          {/* Process selection */}
          <div>
            <span className="text-xs font-semibold text-[#A1B5D8] block mb-2">{lab.processType}</span>
            <div className="space-y-1.5">
              {Object.entries(lab.types).map(([key, name]) => (
                <button
                  key={key}
                  onClick={() => {
                    setProc(key);
                    onComplete();
                  }}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold border transition text-left ${
                    proc === key
                      ? "bg-[#377DFF]/15 border-[#377DFF] text-[#F4F8FC]"
                      : "bg-[#081C36] border-white/10 text-[#A1B5D8] hover:text-[#F4F8FC]"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className="text-[#A1B5D8]">{lab.molesLabel}</span>
              <span className="text-[#F4F8FC] tabular-nums">{moles.toFixed(1)} моль</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={3.0}
              step={0.1}
              value={moles}
              onChange={(e) => setMoles(Number(e.target.value))}
              className="w-full accent-[#377DFF] bg-[#081C36]"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className="text-[#A1B5D8]">{lab.initialT}</span>
              <span className="text-[#FFD84D] tabular-nums">{t0} К</span>
            </div>
            <input
              type="range"
              min={200}
              max={500}
              step={10}
              value={t0}
              onChange={(e) => setT0(Number(e.target.value))}
              className="w-full accent-[#FFD84D] bg-[#081C36]"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className="text-[#A1B5D8]">{lab.targetLabel}</span>
              <span className="text-[#35D6FF] tabular-nums">{(vTarget * 1000).toFixed(0)} л</span>
            </div>
            <input
              type="range"
              min={0.015}
              max={0.06}
              step={0.002}
              value={vTarget}
              onChange={(e) => setVTarget(Number(e.target.value))}
              className="w-full accent-[#35D6FF] bg-[#081C36]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// CLEAN SVG VISUALIZERS (No Neon, Crisp Technical Lines)
// ============================================================================

function TrajectorySvg({ points }) {
  if (!points || points.length === 0) return null;
  const maxX = Math.max(...points.map((p) => p.x), 10);
  const maxY = Math.max(...points.map((p) => p.y), 10);

  const w = 600;
  const h = 220;
  const pad = 35;

  const toX = (x) => pad + (x / maxX) * (w - pad * 2);
  const toY = (y) => h - pad - (y / maxY) * (h - pad * 2);

  const d = points.reduce((acc, p, idx) => `${acc} ${idx === 0 ? "M" : "L"} ${toX(p.x)} ${toY(p.y)}`, "");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-56 bg-[#081C36] rounded-xl border border-white/10">
      {/* Grid Lines */}
      <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
      <line x1={pad} y1={pad} x2={pad} y2={h - pad} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />

      {/* Trajectory */}
      <path d={d} fill="none" stroke="#377DFF" strokeWidth={2.5} />

      {/* Markers */}
      <text x={pad} y={h - 10} fill="#A1B5D8" fontSize={10} fontFamily="sans-serif">
        0 м
      </text>
      <text x={w - pad - 30} y={h - 10} fill="#A1B5D8" fontSize={10} fontFamily="sans-serif">
        {Math.round(maxX)} м
      </text>
    </svg>
  );
}

function WaveSvg({ points }) {
  if (!points || points.length === 0) return null;
  const w = 600;
  const h = 200;
  const pad = 35;

  const maxT = Math.max(...points.map((p) => p.t), 5);
  const maxD = Math.max(...points.map((p) => Math.abs(p.x)), 0.1);

  const toX = (t) => pad + (t / maxT) * (w - pad * 2);
  const toY = (x) => h / 2 - (x / maxD) * (h / 2 - pad);

  const d = points.reduce((acc, p, idx) => `${acc} ${idx === 0 ? "M" : "L"} ${toX(p.t)} ${toY(p.x)}`, "");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-56 bg-[#081C36] rounded-xl border border-white/10">
      <line x1={pad} y1={h / 2} x2={w - pad} y2={h / 2} stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" />
      <path d={d} fill="none" stroke="#FFD84D" strokeWidth={2} />
    </svg>
  );
}

function PvSvg({ points }) {
  if (!points || points.length === 0) return null;
  const w = 600;
  const h = 200;
  const pad = 40;

  const maxV = Math.max(...points.map((p) => p.v));
  const minV = Math.min(...points.map((p) => p.v));
  const maxP = Math.max(...points.map((p) => p.p));
  const minP = Math.min(...points.map((p) => p.p));

  const toX = (v) => pad + ((v - minV) / (maxV - minV || 1)) * (w - pad * 2);
  const toY = (p) => h - pad - ((p - minP) / (maxP - minP || 1)) * (h - pad * 2);

  const curveD = points.reduce((acc, p, idx) => `${acc} ${idx === 0 ? "M" : "L"} ${toX(p.v)} ${toY(p.p)}`, "");
  const fillD = `${curveD} L ${toX(points[points.length - 1].v)} ${h - pad} L ${toX(points[0].v)} ${h - pad} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-56 bg-[#081C36] rounded-xl border border-white/10">
      {/* Area shaded for work */}
      <path d={fillD} fill="rgba(55, 125, 255, 0.15)" />
      <path d={curveD} fill="none" stroke="#377DFF" strokeWidth={2.5} />

      <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
      <line x1={pad} y1={pad} x2={pad} y2={h - pad} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />

      <text x={w - pad - 20} y={h - 15} fill="#A1B5D8" fontSize={10}>
        V (л)
      </text>
      <text x={10} y={pad + 10} fill="#A1B5D8" fontSize={10}>
        P (кПа)
      </text>
    </svg>
  );
}

// ============================================================================
// PEDAGOGICAL EXPLAINER COMPONENT (Present in Every Module)
// ============================================================================

function ExplainerCard({ explanation, loading, onExplain, t }) {
  return (
    <div className="p-5 rounded-2xl bg-[#0D2547] border border-white/10">
      <div className="flex items-start gap-3.5">
        <div className="w-8 h-8 rounded-lg bg-[#377DFF]/15 text-[#377DFF] flex items-center justify-center shrink-0 mt-0.5">
          <Icon name="bulb" size={17} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-bold text-[#F4F8FC]">{t.explainPhysics}</span>
            <button
              onClick={onExplain}
              disabled={loading}
              className="text-xs font-semibold text-[#377DFF] hover:underline focus:outline-none"
            >
              {loading ? t.explaining : t.explainPhysics}
            </button>
          </div>
          <p className="text-xs text-[#A1B5D8] leading-relaxed">
            {loading
              ? t.explaining
              : explanation ||
                "Нажмите 'Объяснить физику', чтобы получить краткое концептуальное объяснение физического закона."}
          </p>
        </div>
      </div>
    </div>
  );
}
