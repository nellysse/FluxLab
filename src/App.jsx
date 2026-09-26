import React, { useState, useEffect } from 'react';

const TRANSLATIONS = {
  ru: {
    title: "FluxLab",
    subtitle: "Интерактивная визуальная лаборатория физики",

    tabCircuits: "⚡ Электродинамика",
    tabBallistics: "🚀 Баллистика",
    tabPendulum: "⏱️ Маятники",
    tabThermodynamics: "🌡️ Термодинамика",

    askAi: "Объяснить физику явления",
    aiLoading: "ИИ-Ментор анализирует опыт...",
    goalTitle: "🎯 Цель эксперимента:",
    stepsTitle: "💡 Как провести опыт:",

    // Circuits
    circuitsIntroTitle: "Лаборатория Делителя Напряжения",
    circuitsIntroDesc: "Роутер имеет внутреннее сопротивление R_нагрузки = 100 Ом и рассчитан на 12 В. Рассчитайте и подберите дополнительное сопротивление R, чтобы снизить напряжение 24 В от солнечной панели по формуле U_вых = U_вх * (R_нагрузки / (R + R_нагрузки)).",
    circuitsGoal: "Защитить роутер от сгорания, снизив входное напряжение с 24 В до безопасных 12 В.",
    circuitsStep1: "1. Выберите компонент для установки в цепь.",
    circuitsStep2: "2. Нажмите 'Подать ток' и проверьте выходное напряжение U_вых.",
    circuitsStep3: "3. Нажмите 'Объяснить физику' для разбора закона Ома и делителя напряжения.",
    partResistor: "Резистор (100 Ом)",
    partWire: "Прямой проводник (0 Ом)",
    partDiode: "Диод (Защита)",
    sourceLabel: "Солнечная панель (24 В)",
    targetLabel: "Сетевой роутер (12 В)",
    applyCurrent: "Подать ток (24 В)",
    statusIdle: "Цепь готова к запуску",
    statusOk: "✓ Успех! Напряжение снижено до 12 В. Роутер работает стабильно!",
    statusBurn: "🔥 Опасность! Сопротивление R = 0 Ом. На роутер подано все 24 В — прибор сгорел!",

    // Ballistics
    ballisticsIntroTitle: "Интерактивная Баллистика",
    ballisticsIntroDesc: "Исследуйте движение тела под углом к горизонту. Наблюдайте за изменениями векторной траектории полёта.",
    ballisticsGoal: "Подобрать угол α и скорость v₀ для достижения максимальной дальности полёта L.",
    ballisticsStep1: "1. Меняйте угол запуска и начальную скорость.",
    ballisticsStep2: "2. Смотрите на живую параболу полёта на графике.",
    ballisticsStep3: "3. Спросите ИИ, почему 45° дает наибольшую дальность.",
    launchAngle: "Угол запуска (α):",
    velocity: "Начальная скорость (v₀):",
    maxHeight: "Высота (H):",
    flightRange: "Дальность (L):",
    flightTime: "Время полёта (T):",

    // Pendulum
    pendulumIntroTitle: "Математический Маятник",
    pendulumIntroDesc: "Наглядно проверьте закон изохронизма колебаний маятника в реальном времени.",
    pendulumGoal: "Доказать, что период колебаний T зависит только от длины нити L, а не от массы груза.",
    pendulumStep1: "1. Изменяйте длину нити ползунком.",
    pendulumStep2: "2. Наблюдайте за частотой качания маятника.",
    pendulumStep3: "3. Узнайте у ИИ физический смысл формулы Гюйгенса.",
    stringLength: "Длина нити (L):",
    gravity: "Гравитация (g):",
    period: "Период колебаний (T):",

    // Thermodynamics
    thermoIntroTitle: "Изобарный Процесс и Работа Газа",
    thermoIntroDesc: "Моделирование работы газа при расширении в поршневом цилиндре с начальным объемом V₀ = 1.0 м³ при постоянном давлении P.",
    thermoGoal: "Рассчитать работу газа W = P * (V - V₀) как площадь под кривой на P-V диаграмме.",
    thermoStep1: "1. Изменяйте объем V и давление P газа.",
    thermoStep2: "2. Смотрите на движение поршня и изменение площади на графике.",
    thermoStep3: "3. Запросите у ИИ объяснение Первого закона термодинамики.",
    gasVolume: "Объем газа (V):",
    gasPressure: "Давление газа (P):",
    gasWork: "Совершенная работа газа (W):"
  },
  ky: {
    title: "FluxLab",
    subtitle: "Интерактивдүү визуалдык физика лабораториясы",

    tabCircuits: "⚡ Электродинамика",
    tabBallistics: "🚀 Баллистика",
    tabPendulum: "⏱️ Маятниктер",
    tabThermodynamics: "🌡️ Термодинамика",

    askAi: "Физикалык кубулушту түшүндүрүү",
    aiLoading: "ИИ-Ментор тажрыйбаны талдоодо...",
    goalTitle: "🎯 Эксперименттин максаты:",
    stepsTitle: "💡 Тажрыйбаны кантип жүргүзүү керек:",

    circuitsIntroTitle: "Чыңалууну Бөлүү Лабораториясы",
    circuitsIntroDesc: "Роутердин каршылыгы R_жүк = 100 Ом. U_чыг = U_кирг * (R_жүк / (R + R_жүк)) формуласы боюнча 24 В чыңалууну 12 В чыңалууга чейин азайтуучу R каршылыгын тандаңыз.",
    circuitsGoal: "Чынжыр элементин туура тандоо менен роутерди күйүп кетүүдөн коргоо.",
    circuitsStep1: "1. Слотко орнотуу үчүн деталды тандаңыз.",
    circuitsStep2: "2. 'Токту берүү' баскычын басып, чыгуу чыңалуусун текшериңиз.",
    circuitsStep3: "3. ИИ-Ментордон Ом закону боюнча түшүндүрмө сураңыз.",
    partResistor: "Резистор (100 Ом)",
    partWire: "Түз өткөргүч (0 Ом)",
    partDiode: "Диод (Коргоо)",
    sourceLabel: "Күн панели (24 В)",
    targetLabel: "Тармак роутери (12 В)",
    applyCurrent: "Токту берүү (24 В)",
    statusIdle: "Схема ишке киргизүүгө даяр",
    statusOk: "✓ Ийгилик! Чыңалуу 12 В чейин азайтылды. Роутер туруктуу иштеп жатат!",
    statusBurn: "🔥 Коркунуч! R = 0 Ом. Роутерге 24 В чыңалуу берилип, аспап күйүп кетти!",

    ballisticsIntroTitle: "Интерактивдүү Баллистика",
    ballisticsIntroDesc: "Бурч менен ыргытылган нерсенин кыймылын изилдеңиз. Учуу траекториясынын өзгөрүшүн байкаңыз.",
    ballisticsGoal: "Эң чоң учуу аралыгына L жетүү үчүн α бурчун жана v₀ ылдамдыгын тандоо.",
    ballisticsStep1: "1. Учуруу бурчун жана баштапкы ылдамдыкты өзгөртүңүз.",
    ballisticsStep2: "2. Графикгиде учуу параболасын байкаңыз.",
    ballisticsStep3: "3. Эмне үчүн 45° эң чоң аралыкты берерин ИИден сураңыз.",
    launchAngle: "Учуруу бурчу (α):",
    velocity: "Баштапкы ылдамдык (v₀):",
    maxHeight: "Бийиктиги (H):",
    flightRange: "Учуу аралыгы (L):",
    flightTime: "Учуу убактысы (T):",

    pendulumIntroTitle: "Математикалык Маятник",
    pendulumIntroDesc: "Маятниктин термелүү законун реалдуу убакытта байкап текшериңиз.",
    pendulumGoal: "T термелүү мезгили жүктүн массасына эмес, L жиптин узундугуна гана көз каранды экенин далилдөө.",
    pendulumStep1: "1. Слайдер менен жиптин узундугун өзгөртүңүз.",
    pendulumStep2: "2. Маятниктин термелүү жыштыгын байкаңыз.",
    pendulumStep3: "3. Гюйгенс формуласынын физикалык маанисин ИИден сураңыз.",
    stringLength: "Жиптин узундугу (L):",
    gravity: "Эркин түшүүнүн ылдамдануусу (g):",
    period: "Термелүү мезгили (T):",

    thermoIntroTitle: "Изобаралык Процесс жана Газдын Жумушу",
    thermoIntroDesc: "Баштапкы көлөмү V₀ = 1.0 м³ болгон газдын туруктуу P басымында кеңейүүдөгү жумушун моделдештирүү.",
    thermoGoal: "P-V диаграммасындагы аянт катары W = P * (V - V₀) газ жумушун эсептөө.",
    thermoStep1: "1. Газдын V көлөмүн жана P басымын өзгөртүңүз.",
    thermoStep2: "2. Поршендин кыймылын жана графиктеги аянттын өзгөрүшүн байкаңыз.",
    thermoStep3: "3. ИИден термодинамиканын биринчи законун сураңыз.",
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

  // Circuits Interactive State
  const [selectedPart, setSelectedPart] = useState('resistor');
  const [circuitState, setCircuitState] = useState('idle');

  // Ballistics State
  const [angle, setAngle] = useState(45);
  const [velocity, setVelocity] = useState(30);

  // Pendulum State
  const [length, setLength] = useState(1.5);
  const [gravity, setGravity] = useState(9.8);
  const [pendulumAngle, setPendulumAngle] = useState(0);

  // Thermodynamics State
  const [volume, setVolume] = useState(2.5);
  const [pressure, setPressure] = useState(120);

  const t = TRANSLATIONS[lang];

  // Mathematical Calculations
  const rad = (angle * Math.PI) / 180;
  const maxHeight = ((velocity * Math.sin(rad)) ** 2 / (2 * 9.8)).toFixed(1);
  const flightRange = ((velocity ** 2 * Math.sin(2 * rad)) / 9.8).toFixed(1);
  const flightTime = ((2 * velocity * Math.sin(rad)) / 9.8).toFixed(1);
  const pendulumPeriod = (2 * Math.PI * Math.sqrt(length / gravity)).toFixed(2);
  const gasWork = (pressure * (volume - 1.0)).toFixed(0);

  // Animated Pendulum Loop
  useEffect(() => {
    let animationFrame;
    let startTime = Date.now();
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const currentAngle = 25 * Math.sin((2 * Math.PI * elapsed) / Number(pendulumPeriod));
      setPendulumAngle(currentAngle);
      animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [pendulumPeriod]);

  const handleTestCircuit = () => {
    if (selectedPart === 'resistor' || selectedPart === 'diode') {
      setCircuitState('ok');
    } else {
      setCircuitState('burn');
    }
  };

  const handleAskAi = async (topic) => {
    setLoadingAi(true);
    setAiText('');

    try {
      const res = await fetch('https://fluxlab-3g8h.onrender.com/api/ask-mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          lang,
          params: { angle, velocity, length, gravity, volume, pressure, selectedPart, circuitState }
        })
      });
      const data = await res.json();
      setAiText(data.answer);
    } catch {
      // Offline Fallback Engine
      if (topic === 'circuit') {
        setAiText(circuitState === 'ok'
          ? (lang === 'ru' ? "Формула U_вых = U_вх * (R_нагрузки / (R + R_нагрузки)). При R = 100 Ом напряжение делится пополам до 12 В." : "U_чыг = U_кирг * (R_жүк / (R + R_жүк)) формуласы боюнча R = 100 Ом болгондо чыңалуу 12 В чейин азаят.")
          : (lang === 'ru' ? "Внимание! При R = 0 Ом напряжение U_вых = 24 В поступает прямо на роутер без делителя, вызывая перегрузку!" : "Көңүл буруңуз! R = 0 Ом болгондо 24 В чыңалуу роутерди күйгүзүп жиберди!"));
      } else if (topic === 'ballistics') {
        setAiText(lang === 'ru'
          ? `Угол ${angle}° определяет баланс высоты и дальности. В вакууме угол 45° дает максимальную дальность (${flightRange} м).`
          : `Учуруу бурчу ${angle}° бийиктик менен аралыкты аныктайт. Вакуумда 45° бурч эң чоң аралыкты (${flightRange} м) берет.`);
      } else if (topic === 'pendulum') {
        setAiText(lang === 'ru'
          ? `Период колебаний T = ${pendulumPeriod} с зависит ТОЛЬКО от длины нити L (${length} м) и гравитации g.`
          : `Термелүү мезгили T = ${pendulumPeriod} с жиптин L узундугуна (${length} м) гана көз каранды.`);
      } else if (topic === 'thermodynamics') {
        setAiText(lang === 'ru'
          ? `При изобарном процессе работа W = ${gasWork} Дж равна площади под прямой на P-V диаграмме.`
          : `Изобаралык процессте W = ${gasWork} Дж жумушу P-V диаграммасындагы аянтка барабар.`);
      }
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#081C36] text-[#F4F8FC] font-sans antialiased">

      {/* Topbar Header */}
      <header className="bg-[#0D2547] border-b border-white/10 px-4 py-3 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/logo.svg" alt="FluxLab Logo" className="h-8 w-auto" onError={(e) => e.target.style.display = 'none'} />
            <div>
              <h1 className="text-lg font-extrabold text-[#F4F8FC]">FluxLab</h1>
              <p className="text-xs text-[#A1B5D8] hidden sm:block">{t.subtitle}</p>
            </div>
          </div>

          <div className="bg-[#081C36] p-1 rounded-lg border border-white/10 flex text-xs font-bold">
            <button onClick={() => setLang('ru')} className={`px-2.5 py-1 rounded ${lang === 'ru' ? 'bg-[#377DFF] text-white' : 'text-[#A1B5D8]'}`}>🇷🇺 РУС</button>
            <button onClick={() => setLang('ky')} className={`px-2.5 py-1 rounded ${lang === 'ky' ? 'bg-[#377DFF] text-white' : 'text-[#A1B5D8]'}`}>🇰🇬 КЫР</button>
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
              onClick={() => { setActiveTab(tab.id); setAiText(''); setCircuitState('idle'); }}
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
              <div className="bg-[#081C36] p-8 rounded-xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#377DFF]/20 border-2 border-[#377DFF] rounded-2xl flex items-center justify-center text-xl font-black text-[#35D6FF] mx-auto">24V</div>
                  <span className="text-xs font-bold text-[#A1B5D8] mt-2 block">{t.sourceLabel}</span>
                </div>

                <div className={`h-2 flex-1 w-full rounded-full ${circuitState === 'ok' ? 'bg-[#35D6FF]' : circuitState === 'burn' ? 'bg-[#FF5353]' : 'bg-white/20'}`}></div>

                <div className="p-4 bg-[#0D2547] border-2 border-dashed border-[#35D6FF] rounded-2xl text-center min-w-[160px]">
                  <span className="text-xs text-[#A1B5D8] block mb-1">Слот детали:</span>
                  <span className="text-sm font-black text-[#FFD84D]">
                    {selectedPart === 'resistor' && t.partResistor}
                    {selectedPart === 'wire' && t.partWire}
                    {selectedPart === 'diode' && t.partDiode}
                  </span>
                </div>

                <div className={`h-2 flex-1 w-full rounded-full ${circuitState === 'ok' ? 'bg-[#35D6FF]' : 'bg-white/20'}`}></div>

                <div className="text-center">
                  <div className={`w-16 h-16 border-2 rounded-2xl flex items-center justify-center text-2xl mx-auto ${circuitState === 'ok' ? 'border-[#35D6FF] bg-[#35D6FF]/20 text-[#35D6FF]' : circuitState === 'burn' ? 'border-[#FF5353] bg-[#FF5353]/20 text-[#FF5353]' : 'border-white/20 bg-[#081C36] text-white/40'}`}>
                    {circuitState === 'burn' ? '💥' : '⚡'}
                  </div>
                  <span className="text-xs font-bold text-[#A1B5D8] mt-2 block">{t.targetLabel}</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-[#A1B5D8]">Выберите деталь для установки:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'resistor', label: t.partResistor },
                    { id: 'wire', label: t.partWire },
                    { id: 'diode', label: t.partDiode }
                  ].map(part => (
                    <button
                      key={part.id}
                      onClick={() => { setSelectedPart(part.id); setCircuitState('idle'); }}
                      className={`p-3 rounded-xl text-xs font-bold border transition-all ${selectedPart === part.id ? 'bg-[#377DFF] border-[#35D6FF] text-white' : 'bg-[#081C36] border-white/10 text-[#A1B5D8] hover:text-white'}`}
                    >
                      {part.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className={`p-4 rounded-xl text-xs font-bold text-center border ${circuitState === 'ok' ? 'bg-[#35D6FF]/10 border-[#35D6FF] text-[#35D6FF]' : circuitState === 'burn' ? 'bg-[#FF5353]/10 border-[#FF5353] text-[#FF5353]' : 'bg-[#081C36] border-white/5 text-[#A1B5D8]'}`}>
                {circuitState === 'idle' && t.statusIdle}
                {circuitState === 'ok' && t.statusOk}
                {circuitState === 'burn' && t.statusBurn}
              </div>

              <div className="flex space-x-3">
                <button onClick={handleTestCircuit} className="flex-1 py-3 bg-[#377DFF] hover:bg-[#2563eb] text-white font-bold rounded-xl text-sm transition-all">{t.applyCurrent}</button>
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
              <div className="bg-[#081C36] p-4 rounded-xl border border-white/5 relative h-48 flex items-end">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 300 150">
                  <line x1="0" y1="140" x2="300" y2="140" stroke="#ffffff20" strokeWidth="2" />
                  <line x1="10" y1="0" x2="10" y2="150" stroke="#ffffff20" strokeWidth="2" />
                  <path
                    d={`M 10 140 Q ${10 + Math.min(flightRange * 2, 140)} ${140 - Math.min(maxHeight * 4, 120)} ${10 + Math.min(flightRange * 2.8, 280)} 140`}
                    fill="none"
                    stroke="#35D6FF"
                    strokeWidth="3"
                    strokeDasharray="4 2"
                  />
                  <circle cx={10 + Math.min(flightRange * 2.8, 280)} cy="140" r="6" fill="#FFD84D" />
                </svg>
                <span className="absolute bottom-2 right-4 text-[10px] font-bold text-[#FFD84D]">Цель ({flightRange} м)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 bg-[#081C36] p-4 rounded-xl border border-white/5">
                  <div>
                    <label className="text-xs text-[#A1B5D8] flex justify-between"><span>{t.launchAngle}</span><span className="font-bold text-white">{angle}°</span></label>
                    <input type="range" min="10" max="80" value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="w-full accent-[#377DFF] mt-1" />
                  </div>
                  <div>
                    <label className="text-xs text-[#A1B5D8] flex justify-between"><span>{t.velocity}</span><span className="font-bold text-white">{velocity} м/с</span></label>
                    <input type="range" min="10" max="50" value={velocity} onChange={(e) => setVelocity(Number(e.target.value))} className="w-full accent-[#377DFF] mt-1" />
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
              <div className="bg-[#081C36] p-4 rounded-xl border border-white/5 h-48 flex justify-center items-center relative overflow-hidden">
                <svg className="w-64 h-full" viewBox="0 0 200 160">
                  <rect x="70" y="10" width="60" height="6" rx="3" fill="#377DFF" />
                  <g transform={`translate(100, 13) rotate(${pendulumAngle})`}>
                    <line x1="0" y1="0" x2="0" y2={30 + length * 35} stroke="#35D6FF" strokeWidth="2" />
                    <circle cx="0" cy={30 + length * 35} r="12" fill="#FFD84D" />
                  </g>
                </svg>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 bg-[#081C36] p-4 rounded-xl border border-white/5">
                  <div>
                    <label className="text-xs text-[#A1B5D8] flex justify-between"><span>{t.stringLength}</span><span className="font-bold text-white">{length} м</span></label>
                    <input type="range" min="0.5" max="3.0" step="0.1" value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full accent-[#377DFF] mt-1" />
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
              <div className="bg-[#081C36] p-4 rounded-xl border border-white/5 h-48 flex items-center justify-around">
                <div className="w-36 h-28 border-2 border-white/20 rounded-xl relative flex items-center justify-start bg-[#0D2547] overflow-hidden">
                  <div
                    className="h-full bg-[#377DFF]/30 border-r-4 border-[#35D6FF] transition-all duration-300 flex items-center justify-center"
                    style={{ width: `${(volume / 5.0) * 100}%` }}
                  >
                    <span className="text-[10px] font-bold text-[#35D6FF] uppercase">Газ</span>
                  </div>
                </div>

                <div className="w-36 h-28 border border-white/10 rounded-xl p-2 bg-[#081C36] relative flex items-end">
                  <div
                    className="bg-[#35D6FF]/30 border border-[#35D6FF] w-full transition-all duration-300 rounded-sm"
                    style={{ height: `${(pressure / 300) * 100}%` }}
                  ></div>
                  <span className="absolute top-1 left-2 text-[9px] text-[#A1B5D8]">P-V График</span>
                </div>
              </div>

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