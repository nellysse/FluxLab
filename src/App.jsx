import React, { useState } from 'react';

const TRANSLATIONS = {
  ru: {
    title: "FluxLab",
    subtitle: "Интерактивная физическая лаборатория",
    stars: "Звёзды",

    // Tabs
    tabCircuits: "⚡ Электродинамика",
    tabBallistics: "🚀 Баллистика",
    tabPendulum: "⏱️ Маятники",
    tabThermodynamics: "🌡️ Термодинамика",

    // Common UI
    askAi: "Объяснить физику явления",
    aiLoading: "ИИ-Ментор анализирует параметры...",
    exportCsv: "Скачать отчёт (CSV)",
    goalTitle: "🎯 Цель эксперимента:",
    stepsTitle: "💡 Как провести опыт:",

    // Circuits Module
    circuitsIntroTitle: "Что такое Электродинамика?",
    circuitsIntroDesc: "Раздел физики, изучающий электрический ток, напряжение и способы управления потоком энергии с помощью резисторов и диодов.",
    circuitsGoal: "Преобразовать входное напряжение 24 В от солнечной панели в безопасные 12 В для питания сетевого роутера.",
    circuitsStep1: "1. Установите деталь в схему (Резистор 100 Ом).",
    circuitsStep2: "2. Нажмите 'Подать ток' и проверьте состояние роутера.",
    circuitsStep3: "3. Нажмите 'Объяснить физику' для разбора закона Ома.",
    sourceLabel: "Солнечная панель (24 В)",
    targetLabel: "Сетевой роутер (12 В)",
    resistorLabel: "Резистор 100 Ом",
    applyCurrent: "Подать ток (24 В)",

    // Ballistics Module
    ballisticsIntroTitle: "Что такое Баллистика?",
    ballisticsIntroDesc: "Раздел механики, изучающий движение тел, брошенных под углом к горизонту под действием гравитации.",
    ballisticsGoal: "Исследовать, как угол запуска α и начальная скорость v₀ влияют на максимальную высоту H и дальность полёта L.",
    ballisticsStep1: "1. Изменяйте ползунки угла запуска α и скорости v₀.",
    ballisticsStep2: "2. Отслеживайте показатели высоты, дальности и времени.",
    ballisticsStep3: "3. Узнайте у ИИ, почему угол 45° обеспечивает максимальную дальность.",
    launchAngle: "Угол запуска (α):",
    velocity: "Начальная скорость (v₀):",
    maxHeight: "Высота (H):",
    flightRange: "Дальность (L):",
    flightTime: "Время полёта (T):",

    // Pendulum Module
    pendulumIntroTitle: "Что такое Маятники и Колебания?",
    pendulumIntroDesc: "Раздел физики, изучающий повторяющиеся во времени движения и ритмические процессы.",
    pendulumGoal: "Проверить, зависит ли период колебаний T от длины нити L и ускорения свободного падения g.",
    pendulumStep1: "1. Изменяйте длину нити L и гравитацию g.",
    pendulumStep2: "2. Зафиксируйте расчитанный период колебаний T.",
    pendulumStep3: "3. Спросите ИИ, почему масса груза не влияет на период.",
    stringLength: "Длина нити (L):",
    gravity: "Ускорение своб. падения (g):",
    period: "Период колебаний (T):",

    // Thermodynamics Module
    thermoIntroTitle: "Что такое Термодинамика?",
    thermoIntroDesc: "Раздел физики, изучающий тепловые процессы, расширение газов и превращение энергии в механическую работу.",
    thermoGoal: "Рассчитать работу газа W при изменении его объема V и давления P.",
    thermoStep1: "1. Изменяйте объем V и давление P газа.",
    thermoStep2: "2. Отслеживайте работу W (площадь под кривой процесса).",
    thermoStep3: "3. Получите объяснение ИИ про Первый закон термодинамики.",
    gasVolume: "Объем газа (V):",
    gasPressure: "Давление газа (P):",
    gasWork: "Совершенная работа газа (W):"
  },
  ky: {
    title: "FluxLab",
    subtitle: "Интерактивдүү физика лабораториясы",
    stars: "Жылдыздар",

    tabCircuits: "⚡ Электродинамика",
    tabBallistics: "🚀 Баллистика",
    tabPendulum: "⏱️ Маятниктер",
    tabThermodynamics: "🌡️ Термодинамика",

    askAi: "Физикалык кубулушту түшүндүрүү",
    aiLoading: "ИИ-Ментор параметрлерди талдоодо...",
    exportCsv: "Отчётту жүктөө (CSV)",
    goalTitle: "🎯 Эксперименттин максаты:",
    stepsTitle: "💡 Тажрыйбаны кантип жүргүзүү керек:",

    circuitsIntroTitle: "Электродинамика деген эмне?",
    circuitsIntroDesc: "Электр тогун, чыңалууну жана чынжырчанын элементтери энергия агымын кантип башкарарын изилдеген физиканын бөлүмү.",
    circuitsGoal: "Күн панелинен келген 24 В чыңалууну тармак роутери үчүн коопсуз 12 В чыңалууга айландыруу.",
    circuitsStep1: "1. Схемада деталды орнотуңуз (Резистор 100 Ом).",
    circuitsStep2: "2. 'Токту берүү' баскычын басып, роутердин абалын текшериңиз.",
    circuitsStep3: "3. Ом законун түшүнүү үчүн 'Физиканы түшүндүрүү' баскычын басыңыз.",
    sourceLabel: "Күн панели (24 В)",
    targetLabel: "Тармак роутери (12 В)",
    resistorLabel: "Резистор 100 Ом",
    applyCurrent: "Токту берүү (24 В)",

    ballisticsIntroTitle: "Баллистика деген эмне?",
    ballisticsIntroDesc: "Оордук күчүнүн таасири астында бурч менен ыргытылган нерселердин кыймылын изилдеген механиканын бөлүмү.",
    ballisticsGoal: "Учуруу бурчу α жана ылдамдык v₀ бийиктикке H жана аралыкка L кантип таасир этерин изилдөө.",
    ballisticsStep1: "1. Учуруу бурчун α жана ылдамдыкты v₀ өзгөртүңүз.",
    ballisticsStep2: "2. Бийиктик, аралык жана убакыт көрсөткүчтөрүн байкаңыз.",
    ballisticsStep3: "3. Эмне үчүн 45° эң чоң аралыкты берерин ИИден сураңыз.",
    launchAngle: "Учуруу бурчу (α):",
    velocity: "Баштапкы ылдамдык (v₀):",
    maxHeight: "Бийиктиги (H):",
    flightRange: "Учуу аралыгы (L):",
    flightTime: "Учуу убактысы (T):",

    pendulumIntroTitle: "Маятниктер жана Термелүүлөр деген эмне?",
    pendulumIntroDesc: "Убакыт боюнча кайталануучу кыймылдарды жана ыргытма процесстерди изилдеген физиканын бөлүмү.",
    pendulumGoal: "Термелүү мезгили T жиптин узундугуна L жана эркин түшүүнүн ылдамдануусуна g көз каранды экенин текшерүү.",
    pendulumStep1: "1. Жиптин узундугун L жана гравитацияны g өзгөртүңүз.",
    pendulumStep2: "2. Эсептелген T термелүү мезгилин каттаңыз.",
    pendulumStep3: "3. Эмне үчүн жүктүн массасы мезгилге таасир этпей турганын ИИден сураңыз.",
    stringLength: "Жиптин узундугу (L):",
    gravity: "Эркин түшүүнүн ылдамдануусу (g):",
    period: "Термелүү мезгили (T):",

    thermoIntroTitle: "Термодинамика деген эмне?",
    thermoIntroDesc: "Жылуулук процесстерин, газдардын кеңейүүсүн жана энергиянын жумушка айлануусун изилдеген бөлүм.",
    thermoGoal: "Газдын V көлөмү жана P басымы өзгөргөндө аткарылган W жумушун эсептөө.",
    thermoStep1: "1. Газдын V көлөмүн жана P басымын өзгөртүңүз.",
    thermoStep2: "2. Аткарылган W жумушун байкаңыз.",
    thermoStep3: "3. ИИден термодинамиканын биринчи закону тууралуу сураңыз.",
    gasVolume: "Газдын көлөмү (V):",
    gasPressure: "Газдын басымы (P):",
    gasWork: "Газ тарабынан аткарылган жумуш (W):"
  }
};

export default function App() {
  const [lang, setLang] = useState('ru');
  const [activeTab, setActiveTab] = useState('circuits');
  const [aiText, setAiText] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  // Simulation States
  const [circuitTested, setCircuitTested] = useState(false);
  const [angle, setAngle] = useState(45);
  const [velocity, setVelocity] = useState(25);
  const [length, setLength] = useState(1.0);
  const [gravity, setGravity] = useState(9.8);
  const [volume, setVolume] = useState(2.0);
  const [pressure, setPressure] = useState(100);

  const t = TRANSLATIONS[lang];

  // Calculations
  const rad = (angle * Math.PI) / 180;
  const maxHeight = ((velocity * Math.sin(rad)) ** 2 / (2 * 9.8)).toFixed(1);
  const flightRange = ((velocity ** 2 * Math.sin(2 * rad)) / 9.8).toFixed(1);
  const flightTime = ((2 * velocity * Math.sin(rad)) / 9.8).toFixed(1);
  const pendulumPeriod = (2 * Math.PI * Math.sqrt(length / gravity)).toFixed(2);
  const gasWork = (pressure * (volume - 1.0)).toFixed(0);

  const handleAskAi = async (topic) => {
    setLoadingAi(true);
    setAiText('');

    try {
      const res = await fetch('https://fluxlab-3g8h.onrender.com/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          lang,
          params: { angle, velocity, length, gravity, volume, pressure, circuitTested }
        })
      });
      const data = await res.json();
      setAiText(data.answer);
    } catch {
      // Offline Explanations
      if (topic === 'circuit') {
        setAiText(lang === 'ru'
          ? "Резистор делит напряжение 24 В ровно пополам (12 В), ограничивая силу тока по закону Ома (I = U/R) и защищая роутер от перегрева."
          : "Резистор 24 В чыңалууну Ом закону боюнча (I = U/R) дал ортосунан (12 В) бөлөт, роутерди күйүп кетүүдөн коргойт.");
      } else if (topic === 'ballistics') {
        setAiText(lang === 'ru'
          ? `Угол ${angle}° определяет соотношение высоты и дальности. В вакууме угол 45° обеспечивает максимальную дальность полёта (${flightRange} м).`
          : `Учуруу бурчу ${angle}° бийиктик менен аралыкты аныктайт. Вакуумда 45° бурч эң чоң учуу аралыгын (${flightRange} м) берет.`);
      } else if (topic === 'pendulum') {
        setAiText(lang === 'ru'
          ? `Период колебаний T = ${pendulumPeriod} с зависит ТОЛЬКО от длины нити L (${length} м) и гравитации g. Масса груза на период не влияет!`
          : `Термелүү мезгили T = ${pendulumPeriod} с жиптин L узундугуна (${length} м) гана көз каранды. Жүктүн массасы мезгилге таасир этпейт!`);
      } else if (topic === 'thermodynamics') {
        setAiText(lang === 'ru'
          ? `Совершенная газом работа W = ${gasWork} Дж равна площади под кривой процесса на P-V диаграмме.`
          : `Газ тарабынан аткарылган W = ${gasWork} Дж жумушу P-V диаграммасындагы процесс аянтына барабар.`);
      }
    } finally {
      setLoadingAi(false);
    }
  };

  const handleExportCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(
      `Module,Status,Lang\n${activeTab},Completed,${lang}`
    );
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", `FluxLab_Report_${activeTab}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#081C36] text-[#F4F8FC] font-sans antialiased">

      {/* Topbar Header */}
      <header className="bg-[#0D2547] border-b border-white/10 px-4 py-3 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/logo.svg" alt="FluxLab Logo" className="h-8 w-auto" onError={(e) => e.target.style.display = 'none'} />
            <div>
              <h1 className="text-lg font-extrabold text-[#F4F8FC]">FluxLab</h1>
              <p className="text-xs text-[#A1B5D8] hidden sm:block">{t.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button onClick={handleExportCsv} className="bg-[#081C36] hover:bg-white/5 border border-white/10 px-3 py-1 rounded-full text-xs font-bold text-[#A1B5D8]">
              📥 {t.exportCsv}
            </button>
            <div className="bg-[#081C36] px-3 py-1 rounded-full border border-white/10 text-xs font-bold text-[#FFD84D]">
              ★ 12 {t.stars}
            </div>
            <div className="bg-[#081C36] p-1 rounded-lg border border-white/10 flex text-xs font-bold">
              <button onClick={() => setLang('ru')} className={`px-2.5 py-1 rounded ${lang === 'ru' ? 'bg-[#377DFF] text-white' : 'text-[#A1B5D8]'}`}>РУС</button>
              <button onClick={() => setLang('ky')} className={`px-2.5 py-1 rounded ${lang === 'ky' ? 'bg-[#377DFF] text-white' : 'text-[#A1B5D8]'}`}>КЫР</button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* Catalog Navigation Tabs */}
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'circuits', label: t.tabCircuits },
            { id: 'ballistics', label: t.tabBallistics },
            { id: 'pendulum', label: t.tabPendulum },
            { id: 'thermodynamics', label: t.tabThermodynamics }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setAiText(''); setCircuitTested(false); }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-[#377DFF] text-white shadow-md' : 'bg-[#0D2547] text-[#A1B5D8] border border-white/5 hover:text-white'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* MODULE 1: CIRCUITS */}
        {activeTab === 'circuits' && (
          <div className="space-y-6">
            <div className="bg-[#0D2547] rounded-2xl p-6 border border-white/10 space-y-3">
              <span className="text-xs font-bold text-[#35D6FF] uppercase tracking-wider">{t.tabCircuits}</span>
              <h2 className="text-xl font-extrabold text-white">{t.circuitsIntroTitle}</h2>
              <p className="text-sm text-[#A1B5D8] leading-relaxed">{t.circuitsIntroDesc}</p>

              <div className="pt-3 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-[#081C36] p-3 rounded-xl border border-white/5">
                  <span className="font-bold text-[#FFD84D] block mb-1">{t.goalTitle}</span>
                  <span className="text-[#F4F8FC]">{t.circuitsGoal}</span>
                </div>
                <div className="bg-[#081C36] p-3 rounded-xl border border-white/5">
                  <span className="font-bold text-[#35D6FF] block mb-1">{t.stepsTitle}</span>
                  <p className="text-[#A1B5D8] space-y-0.5">
                    <span>{t.circuitsStep1}</span><br/>
                    <span>{t.circuitsStep2}</span><br/>
                    <span>{t.circuitsStep3}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#0D2547] rounded-2xl p-6 border border-white/10 space-y-6">
              <div className="bg-[#081C36] p-6 rounded-xl border border-white/5 flex items-center justify-around">
                <div className="text-center">
                  <span className="text-2xl font-black text-[#35D6FF]">24 V</span>
                  <p className="text-xs text-[#A1B5D8]">{t.sourceLabel}</p>
                </div>
                <div className={`h-1 flex-1 mx-4 transition-all ${circuitTested ? 'bg-[#35D6FF]' : 'bg-white/20'}`}></div>
                <div className="px-4 py-3 border-2 border-dashed border-[#377DFF] rounded-xl text-center bg-[#0D2547]">
                  <span className="text-sm font-bold text-[#FFD84D]">{t.resistorLabel}</span>
                </div>
                <div className={`h-1 flex-1 mx-4 transition-all ${circuitTested ? 'bg-[#35D6FF]' : 'bg-white/20'}`}></div>
                <div className="text-center">
                  <span className={`text-2xl ${circuitTested ? 'text-[#35D6FF]' : 'text-white/40'}`}>⚡</span>
                  <p className="text-xs text-[#A1B5D8]">{t.targetLabel}</p>
                </div>
              </div>

              <div className="flex space-x-3">
                <button onClick={() => setCircuitTested(true)} className="flex-1 py-3 bg-[#377DFF] hover:bg-[#2563eb] text-white font-bold rounded-xl text-sm transition-all">{t.applyCurrent}</button>
                <button onClick={() => handleAskAi('circuit')} className="flex-1 py-3 bg-[#081C36] border border-white/10 text-[#35D6FF] hover:bg-[#35D6FF]/10 font-bold rounded-xl text-sm transition-all">{t.askAi}</button>
              </div>
            </div>
          </div>
        )}

        {/* MODULE 2: BALLISTICS */}
        {activeTab === 'ballistics' && (
          <div className="space-y-6">
            <div className="bg-[#0D2547] rounded-2xl p-6 border border-white/10 space-y-3">
              <span className="text-xs font-bold text-[#35D6FF] uppercase tracking-wider">{t.tabBallistics}</span>
              <h2 className="text-xl font-extrabold text-white">{t.ballisticsIntroTitle}</h2>
              <p className="text-sm text-[#A1B5D8] leading-relaxed">{t.ballisticsIntroDesc}</p>

              <div className="pt-3 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-[#081C36] p-3 rounded-xl border border-white/5">
                  <span className="font-bold text-[#FFD84D] block mb-1">{t.goalTitle}</span>
                  <span className="text-[#F4F8FC]">{t.ballisticsGoal}</span>
                </div>
                <div className="bg-[#081C36] p-3 rounded-xl border border-white/5">
                  <span className="font-bold text-[#35D6FF] block mb-1">{t.stepsTitle}</span>
                  <p className="text-[#A1B5D8] space-y-0.5">
                    <span>{t.ballisticsStep1}</span><br/>
                    <span>{t.ballisticsStep2}</span><br/>
                    <span>{t.ballisticsStep3}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#0D2547] rounded-2xl p-6 border border-white/10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 bg-[#081C36] p-4 rounded-xl border border-white/5">
                  <div>
                    <label className="text-xs text-[#A1B5D8] flex justify-between"><span>{t.launchAngle}</span><span className="font-bold text-white">{angle}°</span></label>
                    <input type="range" min="10" max="80" value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="w-full accent-[#377DFF] mt-1" />
                  </div>
                  <div>
                    <label className="text-xs text-[#A1B5D8] flex justify-between"><span>{t.velocity}</span><span className="font-bold text-white">{velocity} м/с</span></label>
                    <input type="range" min="5" max="50" value={velocity} onChange={(e) => setVelocity(Number(e.target.value))} className="w-full accent-[#377DFF] mt-1" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-[#081C36] p-3 rounded-xl border border-white/5 text-center"><span className="text-xs text-[#A1B5D8] block">{t.maxHeight}</span><span className="text-lg font-bold text-[#35D6FF]">{maxHeight} м</span></div>
                  <div className="bg-[#081C36] p-3 rounded-xl border border-white/5 text-center"><span className="text-xs text-[#A1B5D8] block">{t.flightRange}</span><span className="text-lg font-bold text-[#FFD84D]">{flightRange} м</span></div>
                  <div className="bg-[#081C36] p-3 rounded-xl border border-white/5 text-center"><span className="text-xs text-[#A1B5D8] block">{t.flightTime}</span><span className="text-lg font-bold text-white">{flightTime} с</span></div>
                </div>
              </div>

              <button onClick={() => handleAskAi('ballistics')} className="w-full py-3 bg-[#377DFF] hover:bg-[#2563eb] text-white font-bold rounded-xl text-sm transition-all">{t.askAi}</button>
            </div>
          </div>
        )}

        {/* MODULE 3: PENDULUM */}
        {activeTab === 'pendulum' && (
          <div className="space-y-6">
            <div className="bg-[#0D2547] rounded-2xl p-6 border border-white/10 space-y-3">
              <span className="text-xs font-bold text-[#35D6FF] uppercase tracking-wider">{t.tabPendulum}</span>
              <h2 className="text-xl font-extrabold text-white">{t.pendulumIntroTitle}</h2>
              <p className="text-sm text-[#A1B5D8] leading-relaxed">{t.pendulumIntroDesc}</p>

              <div className="pt-3 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-[#081C36] p-3 rounded-xl border border-white/5">
                  <span className="font-bold text-[#FFD84D] block mb-1">{t.goalTitle}</span>
                  <span className="text-[#F4F8FC]">{t.pendulumGoal}</span>
                </div>
                <div className="bg-[#081C36] p-3 rounded-xl border border-white/5">
                  <span className="font-bold text-[#35D6FF] block mb-1">{t.stepsTitle}</span>
                  <p className="text-[#A1B5D8] space-y-0.5">
                    <span>{t.pendulumStep1}</span><br/>
                    <span>{t.pendulumStep2}</span><br/>
                    <span>{t.pendulumStep3}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#0D2547] rounded-2xl p-6 border border-white/10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 bg-[#081C36] p-4 rounded-xl border border-white/5">
                  <div>
                    <label className="text-xs text-[#A1B5D8] flex justify-between"><span>{t.stringLength}</span><span className="font-bold text-white">{length} м</span></label>
                    <input type="range" min="0.2" max="3.0" step="0.1" value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full accent-[#377DFF] mt-1" />
                  </div>
                  <div>
                    <label className="text-xs text-[#A1B5D8] flex justify-between"><span>{t.gravity}</span><span className="font-bold text-white">{gravity} м/с²</span></label>
                    <input type="range" min="1.6" max="25" step="0.1" value={gravity} onChange={(e) => setGravity(Number(e.target.value))} className="w-full accent-[#377DFF] mt-1" />
                  </div>
                </div>

                <div className="bg-[#081C36] p-6 rounded-xl border border-white/5 flex flex-col justify-center items-center text-center">
                  <span className="text-xs text-[#A1B5D8]">{t.period}</span>
                  <span className="text-3xl font-black text-[#FFD84D] mt-1">{pendulumPeriod} с</span>
                </div>
              </div>

              <button onClick={() => handleAskAi('pendulum')} className="w-full py-3 bg-[#377DFF] hover:bg-[#2563eb] text-white font-bold rounded-xl text-sm transition-all">{t.askAi}</button>
            </div>
          </div>
        )}

        {/* MODULE 4: THERMODYNAMICS */}
        {activeTab === 'thermodynamics' && (
          <div className="space-y-6">
            <div className="bg-[#0D2547] rounded-2xl p-6 border border-white/10 space-y-3">
              <span className="text-xs font-bold text-[#35D6FF] uppercase tracking-wider">{t.tabThermodynamics}</span>
              <h2 className="text-xl font-extrabold text-white">{t.thermoIntroTitle}</h2>
              <p className="text-sm text-[#A1B5D8] leading-relaxed">{t.thermoIntroDesc}</p>

              <div className="pt-3 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-[#081C36] p-3 rounded-xl border border-white/5">
                  <span className="font-bold text-[#FFD84D] block mb-1">{t.goalTitle}</span>
                  <span className="text-[#F4F8FC]">{t.thermoGoal}</span>
                </div>
                <div className="bg-[#081C36] p-3 rounded-xl border border-white/5">
                  <span className="font-bold text-[#35D6FF] block mb-1">{t.stepsTitle}</span>
                  <p className="text-[#A1B5D8] space-y-0.5">
                    <span>{t.thermoStep1}</span><br/>
                    <span>{t.thermoStep2}</span><br/>
                    <span>{t.thermoStep3}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#0D2547] rounded-2xl p-6 border border-white/10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 bg-[#081C36] p-4 rounded-xl border border-white/5">
                  <div>
                    <label className="text-xs text-[#A1B5D8] flex justify-between"><span>{t.gasVolume}</span><span className="font-bold text-white">{volume} м³</span></label>
                    <input type="range" min="1.0" max="5.0" step="0.1" value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="w-full accent-[#377DFF] mt-1" />
                  </div>
                  <div>
                    <label className="text-xs text-[#A1B5D8] flex justify-between"><span>{t.gasPressure}</span><span className="font-bold text-white">{pressure} кПа</span></label>
                    <input type="range" min="50" max="300" step="10" value={pressure} onChange={(e) => setPressure(Number(e.target.value))} className="w-full accent-[#377DFF] mt-1" />
                  </div>
                </div>

                <div className="bg-[#081C36] p-6 rounded-xl border border-white/5 flex flex-col justify-center items-center text-center">
                  <span className="text-xs text-[#A1B5D8]">{t.gasWork}</span>
                  <span className="text-3xl font-black text-[#35D6FF] mt-1">{gasWork} Дж</span>
                </div>
              </div>

              <button onClick={() => handleAskAi('thermodynamics')} className="w-full py-3 bg-[#377DFF] hover:bg-[#2563eb] text-white font-bold rounded-xl text-sm transition-all">{t.askAi}</button>
            </div>
          </div>
        )}

        {/* AI EXPLAINER RESPONSE CARD */}
        {(loadingAi || aiText) && (
          <div className="bg-[#0D2547] border border-[#377DFF]/40 rounded-2xl p-5 shadow-lg">
            <h4 className="text-xs font-bold text-[#35D6FF] uppercase tracking-wider mb-2">🤖 ИИ-Ментор FluxLab</h4>
            {loadingAi ? <p className="text-sm text-[#A1B5D8] animate-pulse">{t.aiLoading}</p> : <p className="text-sm text-[#F4F8FC] leading-relaxed font-medium">{aiText}</p>}
          </div>
        )}

      </main>
    </div>
  );
}