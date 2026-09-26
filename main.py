"""
FluxLab Backend — Онлайн-лаборатория по физике для 9–11 классов.
Production-ready single-file FastAPI application.

Стек: Python 3.10+, FastAPI, Uvicorn, Pydantic v2, NumPy.
"""

from __future__ import annotations

import csv
import io
import json
import math
import os
import urllib.error
import urllib.request
import uuid
from datetime import datetime, timezone
from enum import Enum
from typing import Any, Dict, List, Optional

import numpy as np
from fastapi import FastAPI, HTTPException, Query, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.exceptions import RequestValidationError
from pydantic import BaseModel, Field, field_validator, model_validator



ROUND_DIGITS = 3


def r(value: float) -> float:
    """Округление до 3 знаков после запятой с защитой от NaN/inf."""
    if value is None:
        return 0.0
    if isinstance(value, (int, float)):
        if math.isnan(value) or math.isinf(value):
            return 0.0
        return round(float(value), ROUND_DIGITS)
    return value


def r_list(values) -> List[float]:
    return [r(v) for v in values]


# ============================================================================
# ГЛОБАЛЬНЫЕ ХРАНИЛИЩА (in-memory, для демо/учебных целей)
# ============================================================================

PROGRESS_DB: Dict[str, Dict[str, Any]] = {}
REPORTS_DB: Dict[str, Dict[str, Any]] = {}

# ============================================================================
# ПРЕСЕТЫ СРЕД
# ============================================================================

PRESETS = {
    "earth": {
        "id": "earth",
        "name": "Земля",
        "name_en": "Earth",
        "gravity": 9.807,
        "air_density": 1.225,
        "description": "Стандартные условия на уровне моря",
    },
    "moon": {
        "id": "moon",
        "name": "Луна",
        "name_en": "Moon",
        "gravity": 1.62,
        "air_density": 0.0,
        "description": "Отсутствие атмосферы, низкая гравитация",
    },
    "mars": {
        "id": "mars",
        "name": "Марс",
        "name_en": "Mars",
        "gravity": 3.711,
        "air_density": 0.020,
        "description": "Разреженная атмосфера CO2",
    },
    "vacuum": {
        "id": "vacuum",
        "name": "Вакуум",
        "name_en": "Vacuum",
        "gravity": 9.807,
        "air_density": 0.0,
        "description": "Земная гравитация без сопротивления среды",
    },
    "water": {
        "id": "water",
        "name": "Вода",
        "name_en": "Water",
        "gravity": 9.807,
        "air_density": 1000.0,
        "description": "Погружение в пресную воду",
    },
}

# ============================================================================
# КАТАЛОГ ЛАБОРАТОРНЫХ РАБОТ
# ============================================================================

CATALOG = [
    {
        "lesson_id": "projectile-01",
        "title": "Движение тела, брошенного под углом к горизонту",
        "module": "kinematics",
        "grade": [9, 10],
        "difficulty": "Curious",
        "graphic_language": "trajectories",
        "endpoint": "/api/v1/labs/kinematics/projectile",
        "total_tasks": 4,
    },
    {
        "lesson_id": "projectile-02",
        "title": "Баллистика с сопротивлением воздуха",
        "module": "kinematics",
        "grade": [10],
        "difficulty": "Active",
        "graphic_language": "trajectories",
        "endpoint": "/api/v1/labs/kinematics/projectile",
        "total_tasks": 5,
    },
    {
        "lesson_id": "pendulum-01",
        "title": "Математический маятник: период и частота",
        "module": "waves",
        "grade": [10],
        "difficulty": "Curious",
        "graphic_language": "waves",
        "endpoint": "/api/v1/labs/waves/pendulum",
        "total_tasks": 3,
    },
    {
        "lesson_id": "pendulum-02",
        "title": "Пружинный маятник с затуханием",
        "module": "waves",
        "grade": [11],
        "difficulty": "Active",
        "graphic_language": "waves",
        "endpoint": "/api/v1/labs/waves/pendulum",
        "total_tasks": 4,
    },
    {
        "lesson_id": "gas-boyle-01",
        "title": "Закон Бойля-Мариотта (изотермический процесс)",
        "module": "particles",
        "grade": [10],
        "difficulty": "Clear",
        "graphic_language": "particles",
        "endpoint": "/api/v1/labs/particles/gas-laws",
        "total_tasks": 3,
    },
    {
        "lesson_id": "gas-gay-lussac-01",
        "title": "Закон Гей-Люссака (изохорный процесс)",
        "module": "particles",
        "grade": [10],
        "difficulty": "Clear",
        "graphic_language": "particles",
        "endpoint": "/api/v1/labs/particles/gas-laws",
        "total_tasks": 3,
    },
    {
        "lesson_id": "gas-charles-01",
        "title": "Закон Шарля (изобарный процесс)",
        "module": "particles",
        "grade": [10, 11],
        "difficulty": "Clear",
        "graphic_language": "particles",
        "endpoint": "/api/v1/labs/particles/gas-laws",
        "total_tasks": 3,
    },
]

# ============================================================================
# МОДУЛЬ 1: МЕХАНИКА И БАЛЛИСТИКА
# ============================================================================


class ProjectileRequest(BaseModel):
    initial_velocity: float = Field(..., gt=0, le=1000, description="Начальная скорость, м/с")
    angle_deg: float = Field(..., ge=0, le=90, description="Угол к горизонту, градусы")
    initial_height: float = Field(0.0, ge=0, le=10000, description="Начальная высота, м")
    mass: float = Field(1.0, gt=0, le=10000, description="Масса тела, кг")
    gravity: float = Field(9.807, gt=0, le=50, description="Ускорение свободного падения, м/с²")
    air_resistance: bool = Field(False, description="Учитывать сопротивление воздуха")
    drag_coefficient: float = Field(0.47, ge=0, le=5, description="Коэффициент лобового сопротивления")
    cross_section_area: float = Field(0.05, gt=0, le=100, description="Площадь поперечного сечения, м²")
    air_density: float = Field(1.225, ge=0, le=1500, description="Плотность среды, кг/м³")
    dt: float = Field(0.01, gt=0.0001, le=1.0, description="Шаг интегрирования по времени, с")

    @field_validator("dt")
    @classmethod
    def validate_dt(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("dt должен быть положительным")
        return v


class TrajectoryPoint(BaseModel):
    t: float
    x: float
    y: float
    vx: float
    vy: float
    speed: float
    kinetic_energy: float
    potential_energy: float
    total_energy: float


class ProjectileResponse(BaseModel):
    lab_id: str = "projectile"
    points: List[TrajectoryPoint]
    flight_time: float
    max_height: float
    max_range: float
    max_speed: float
    initial_kinetic_energy: float
    final_speed: float
    air_resistance_used: bool
    parameters: Dict[str, Any]


def simulate_projectile(req: ProjectileRequest) -> ProjectileResponse:
    theta = math.radians(req.angle_deg)
    vx = req.initial_velocity * math.cos(theta)
    vy = req.initial_velocity * math.sin(theta)
    x, y = 0.0, req.initial_height
    g = req.gravity
    m = req.mass
    dt = req.dt

    points: List[TrajectoryPoint] = []
    t = 0.0
    max_height = y
    max_speed = req.initial_velocity

    # Коэффициент для квадратичного сопротивления воздуха: F = 0.5 * rho * Cd * A * v^2
    k = 0.5 * req.air_density * req.drag_coefficient * req.cross_section_area if req.air_resistance else 0.0

    max_iterations = 2_000_000
    iterations = 0

    while y >= 0.0 and iterations < max_iterations:
        speed = math.hypot(vx, vy)
        ke = 0.5 * m * speed ** 2
        pe = m * g * max(y, 0.0)
        points.append(
            TrajectoryPoint(
                t=r(t), x=r(x), y=r(y), vx=r(vx), vy=r(vy),
                speed=r(speed), kinetic_energy=r(ke), potential_energy=r(pe),
                total_energy=r(ke + pe),
            )
        )
        max_height = max(max_height, y)
        max_speed = max(max_speed, speed)

        if req.air_resistance and speed > 0:
            ax = -(k / m) * speed * vx
            ay = -g - (k / m) * speed * vy
        else:
            ax = 0.0
            ay = -g

        vx += ax * dt
        vy += ay * dt
        x += vx * dt
        y += vy * dt
        t += dt
        iterations += 1

    if not points or points[-1].y != 0.0:
        speed = math.hypot(vx, vy)
        ke = 0.5 * m * speed ** 2
        points.append(
            TrajectoryPoint(
                t=r(t), x=r(x), y=r(max(y, 0.0)), vx=r(vx), vy=r(vy),
                speed=r(speed), kinetic_energy=r(ke), potential_energy=r(0.0),
                total_energy=r(ke),
            )
        )

    final_speed = points[-1].speed
    return ProjectileResponse(
        points=points,
        flight_time=r(t),
        max_height=r(max_height),
        max_range=r(x),
        max_speed=r(max_speed),
        initial_kinetic_energy=r(0.5 * m * req.initial_velocity ** 2),
        final_speed=r(final_speed),
        air_resistance_used=req.air_resistance,
        parameters=req.model_dump(),
    )


# ============================================================================
# МОДУЛЬ 2: КОЛЕБАНИЯ И ВОЛНЫ
# ============================================================================


class PendulumType(str, Enum):
    simple = "simple"
    spring = "spring"


class PendulumRequest(BaseModel):
    pendulum_type: PendulumType = Field(PendulumType.simple, description="Тип маятника")
    length: float = Field(1.0, gt=0, le=100, description="Длина нити (математический маятник), м")
    spring_constant: float = Field(10.0, gt=0, le=100000, description="Жесткость пружины k, Н/м")
    mass: float = Field(1.0, gt=0, le=1000, description="Масса груза, кг")
    amplitude: float = Field(0.2, gt=0, le=100, description="Начальная амплитуда, м (или рад для simple)")
    damping_coefficient: float = Field(0.0, ge=0, le=50, description="Коэффициент затухания (трения)")
    gravity: float = Field(9.807, gt=0, le=50, description="Ускорение свободного падения, м/с²")
    duration: float = Field(10.0, gt=0, le=300, description="Длительность симуляции, с")
    dt: float = Field(0.02, gt=0.0001, le=1.0, description="Шаг интегрирования, с")


class OscillationPoint(BaseModel):
    t: float
    displacement: float
    velocity: float


class PendulumResponse(BaseModel):
    lab_id: str = "pendulum"
    pendulum_type: PendulumType
    period: float
    frequency: float
    angular_frequency: float
    damped: bool
    displacement_graph: List[OscillationPoint]
    phase_portrait: List[Dict[str, float]]
    parameters: Dict[str, Any]


def simulate_pendulum(req: PendulumRequest) -> PendulumResponse:
    m = req.mass
    b = req.damping_coefficient
    g = req.gravity

    if req.pendulum_type == PendulumType.simple:
        if req.amplitude > 0.5:
            # для больших углов малый-угол приближение неточно, но используем его как учебное упрощение
            pass
        omega0 = math.sqrt(g / req.length)
    else:
        omega0 = math.sqrt(req.spring_constant / m)

    gamma = b / (2 * m)  # коэффициент затухания в уравнении x'' + 2*gamma*x' + omega0^2*x = 0

    if gamma < omega0:
        omega_d = math.sqrt(omega0 ** 2 - gamma ** 2)
        period = 2 * math.pi / omega_d if omega_d > 0 else float("inf")
    else:
        omega_d = 0.0
        period = float("inf")

    frequency = 1.0 / period if period not in (float("inf"), 0) else 0.0

    x0 = req.amplitude
    v0 = 0.0
    dt = req.dt
    n_steps = int(req.duration / dt)

    displacement_graph: List[OscillationPoint] = []
    phase_portrait: List[Dict[str, float]] = []

    x, v = x0, v0
    t = 0.0
    for _ in range(n_steps + 1):
        displacement_graph.append(OscillationPoint(t=r(t), displacement=r(x), velocity=r(v)))
        phase_portrait.append({"x": r(x), "v": r(v)})

        a = -2 * gamma * v - (omega0 ** 2) * x
        v_new = v + a * dt
        x_new = x + v_new * dt

        x, v = x_new, v_new
        t += dt

    return PendulumResponse(
        pendulum_type=req.pendulum_type,
        period=r(period) if period != float("inf") else -1.0,
        frequency=r(frequency),
        angular_frequency=r(omega0),
        damped=b > 0,
        displacement_graph=displacement_graph,
        phase_portrait=phase_portrait,
        parameters=req.model_dump(),
    )


# ============================================================================
# МОДУЛЬ 3: МОЛЕКУЛЯРНАЯ ФИЗИКА И ТЕРМОДИНАМИКА
# ============================================================================

R_GAS_CONSTANT = 8.314  # Дж/(моль·К)


class GasProcessType(str, Enum):
    isothermal = "isothermal"   # Бойля-Мариотта: T = const
    isochoric = "isochoric"     # Гей-Люссака: V = const
    isobaric = "isobaric"       # Шарля: P = const


class GasLawsRequest(BaseModel):
    process_type: GasProcessType = Field(..., description="Тип изопроцесса")
    moles: float = Field(1.0, gt=0, le=1000, description="Количество вещества, моль")
    initial_pressure: float = Field(101325.0, gt=0, le=1e9, description="Начальное давление, Па")
    initial_volume: float = Field(0.0224, gt=0, le=1e6, description="Начальный объем, м³")
    initial_temperature: float = Field(273.15, gt=0, le=1e6, description="Начальная температура, К")
    target_value: float = Field(..., gt=0, description="Конечное значение изменяемого параметра")
    steps: int = Field(20, ge=2, le=1000, description="Количество точек на графике процесса")

    @model_validator(mode="after")
    def check_consistency(self):
        n, P, V, T = self.moles, self.initial_pressure, self.initial_volume, self.initial_temperature
        expected_P = n * R_GAS_CONSTANT * T / V
        if expected_P > 0 and abs(expected_P - P) / expected_P > 0.5:
            # Начальные параметры сильно не согласуются с уравнением Менделеева-Клапейрона;
            # это не блокирует запрос — используются заданные P, V, T как есть.
            pass
        return self


class GasStatePoint(BaseModel):
    pressure: float
    volume: float
    temperature: float
    work: float
    internal_energy_change: float


class GasLawsResponse(BaseModel):
    lab_id: str = "gas-laws"
    process_type: GasProcessType
    points: List[GasStatePoint]
    total_work: float
    total_internal_energy_change: float
    final_state: GasStatePoint
    parameters: Dict[str, Any]


def simulate_gas_process(req: GasLawsRequest) -> GasLawsResponse:
    n = req.moles
    P0, V0, T0 = req.initial_pressure, req.initial_volume, req.initial_temperature
    steps = req.steps
    Cv_molar = 1.5 * R_GAS_CONSTANT  # одноатомный идеальный газ, для учебных целей

    points: List[GasStatePoint] = []
    cumulative_work = 0.0

    if req.process_type == GasProcessType.isothermal:
        # P*V = const, T = const
        V1 = req.target_value
        volumes = np.linspace(V0, V1, steps)
        prev_V = V0
        for V in volumes:
            P = n * R_GAS_CONSTANT * T0 / V
            # Работа при изотермическом процессе от V0 до V: W = nRT * ln(V/V0)
            work_cumulative = n * R_GAS_CONSTANT * T0 * math.log(V / V0) if V0 > 0 else 0.0
            dU = 0.0  # T постоянна => ΔU = 0
            points.append(GasStatePoint(
                pressure=r(P), volume=r(V), temperature=r(T0),
                work=r(work_cumulative), internal_energy_change=r(dU),
            ))
            prev_V = V
        cumulative_work = points[-1].work

    elif req.process_type == GasProcessType.isochoric:
        # V = const, работа газа = 0
        T1 = req.target_value
        temperatures = np.linspace(T0, T1, steps)
        for T in temperatures:
            P = n * R_GAS_CONSTANT * T / V0
            dU = n * Cv_molar * (T - T0)
            points.append(GasStatePoint(
                pressure=r(P), volume=r(V0), temperature=r(T),
                work=r(0.0), internal_energy_change=r(dU),
            ))
        cumulative_work = 0.0

    elif req.process_type == GasProcessType.isobaric:
        # P = const
        V1 = req.target_value
        volumes = np.linspace(V0, V1, steps)
        for V in volumes:
            T = P0 * V / (n * R_GAS_CONSTANT)
            work_cumulative = P0 * (V - V0)
            dU = n * Cv_molar * (T - T0)
            points.append(GasStatePoint(
                pressure=r(P0), volume=r(V), temperature=r(T),
                work=r(work_cumulative), internal_energy_change=r(dU),
            ))
        cumulative_work = points[-1].work
    else:
        raise HTTPException(status_code=400, detail="Неизвестный тип процесса")

    final_state = points[-1]
    total_dU = final_state.internal_energy_change

    return GasLawsResponse(
        process_type=req.process_type,
        points=points,
        total_work=r(cumulative_work),
        total_internal_energy_change=r(total_dU),
        final_state=final_state,
        parameters=req.model_dump(),
    )


# ============================================================================
# UI/UX СЕРВИСЫ
# ============================================================================


class ProgressRequest(BaseModel):
    user_id: str = Field(..., min_length=1, max_length=100)
    lesson_id: str = Field(..., min_length=1, max_length=100)
    completed_tasks: int = Field(..., ge=0)
    total_tasks: int = Field(..., gt=0)

    @model_validator(mode="after")
    def validate_tasks(self):
        if self.completed_tasks > self.total_tasks:
            raise ValueError("completed_tasks не может превышать total_tasks")
        return self


class ProgressResponse(BaseModel):
    user_id: str
    lesson_id: str
    completed_tasks: int
    total_tasks: int
    percent_complete: float
    updated_at: str


class ReportFormat(str, Enum):
    json = "json"
    csv = "csv"


class ReportDataPoint(BaseModel):
    label: str
    value: float


class ExportReportRequest(BaseModel):
    user_id: str = Field(..., min_length=1, max_length=100)
    lesson_id: str = Field(..., min_length=1, max_length=100)
    lab_title: Optional[str] = Field(None, max_length=300)
    input_parameters: Dict[str, Any] = Field(default_factory=dict)
    table_points: List[Dict[str, float]] = Field(default_factory=list)
    conclusions: Optional[str] = Field(None, max_length=5000)
    format: ReportFormat = Field(ReportFormat.json)


class AskMentorRequest(BaseModel):
    question: str = Field(..., description="Вопрос пользователя или контекст")
    circuit_state: int = Field(1, ge=1, le=3, description="1=burn (перегрузка/ошибка), 2=low (недостаточно/неверно), 3=success (успех)")
    lang: str = Field("ru", description="'ru' или 'ky'")


class AskMentorResponse(BaseModel):
    success: bool = True
    answer: str
    circuit_state: int
    source: str = "ai"


def generate_mentor_advice(question: str, circuit_state: int, lang: str) -> dict:
    """Генерация совета ментора через Google Gemini API (при наличии ключа) или экспертную систему."""
    lang_clean = "ky" if lang.strip().lower() == "ky" else "ru"
    gemini_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")

    if gemini_key:
        try:
            target_lang_name = "кыргызском" if lang_clean == "ky" else "русском"
            prompt = (
                f"Ты — дружелюбный AI-наставник физической лаборатории FluxLab для школьников 9-11 классов. "
                f"Отвечай на {target_lang_name} языке. "
                f"Состояние эксперимента: {circuit_state} (1=перегрузка/сгорело, 2=недостаточно параметров/не тот компонент, 3=успех/безопасный режим). "
                f"Вопрос/контекст: '{question}'. "
                f"Дай краткий (2-4 предложения), ободряющий и физически точный совет с упоминанием физического закона (закон Ома, делитель напряжения, стабилизация, диод)."
            )
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={gemini_key}"
            payload = json.dumps({
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {"temperature": 0.4, "maxOutputTokens": 300}
            }).encode("utf-8")
            req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
            with urllib.request.urlopen(req, timeout=4.0) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
                if text:
                    return {"success": True, "answer": text, "circuit_state": circuit_state, "source": "gemini"}
        except Exception:
            pass  # Переход к экспертной системе при сбое или отсутствии сети

    q_lower = question.lower()
    if lang_clean == "ky":
        if circuit_state == 3:
            answer = "Азаматсың! Чынжыр эң туура жыйналды. Ток жана чыңалуу коопсуз деңгээлде, прибор толук күчүндө иштеп жатат."
        elif circuit_state == 1:
            if "роутер" in q_lower or "делител" in q_lower or "бөлгүч" in q_lower or "24" in q_lower:
                answer = "Чыңалуу өтө жогору (24 В)! Түз туташтырсаң роутер күйүп кетет. Чыңалууну 12 В чейин азайтуу үчүн эки резистордон турган чыңалуу бөлгүчтү колдон."
            elif "шамал" in q_lower or "стабилизатор" in q_lower or "20" in q_lower:
                answer = "Шамалдын күчү менен чыңалуу 20 В чейин секирет! Резистор секириктерди кармай албайт. Туруктуу 5 В кармоо үчүн чыңалуу стабилизаторун орнотушуң керек."
            elif "диод" in q_lower or "күн" in q_lower or "насос" in q_lower or "түн" in q_lower:
                answer = "Түнкүсүн аккумулятордон күн панелине карай тескери ток агып жатат! Токту бир гана багытта өткөрүүчү жарым өткөргүч диодду чынжырга кошуп коргоо керек."
            else:
                answer = "Чынжырдагы ток өтө күчтүү же коргоо жок! Жылуулук кубаттуулугу P = U²/R өтө чоң болуп, прибор күйүп кетет. Ылайыктуу деталь менен корго."
        else:
            answer = "Чыңалуу же ток жетишсиз болуп жатат, же деталь туура келген жок. Параметрлерди текшерип, схеманы тууралап көр."
    else:
        if circuit_state == 3:
            answer = "Отличная работа! Схема собрана идеально: напряжение и ток находятся в безопасных рабочих диапазонах, прибор защищён и функционирует в штатном режиме."
        elif circuit_state == 1:
            if "роутер" in q_lower or "делител" in q_lower or "24" in q_lower:
                answer = "Напряжение 24 В слишком велико для 12-вольтового роутера! Напрямую прибор сгорит. Используй делитель напряжения из двух резисторов (U_out = U_in · R₂/(R₁+R₂)), чтобы снизить напряжение ровно вдвое."
            elif "стабилизатор" in q_lower or "ветер" in q_lower or "ветро" in q_lower or "20" in q_lower:
                answer = "Ветер усиливается, и напряжение генератора скачет до 20 В. Обычный резистор дает лишь постоянное падение напряжения, но не сглаживает скачки. Нужен стабилизатор напряжения, удерживающий ровно 5 В при любом входном импульсе!"
            elif "диод" in q_lower or "панел" in q_lower or "ноч" in q_lower or "обратн" in q_lower:
                answer = "Ночью панель не генерирует ЭДС, и заряженный аккумулятор разряжается обратно в неё. Установи полупроводниковый диод: его p-n переход пропускает ток только вперёд и надёжно блокирует опасный обратный ток."
            else:
                answer = "Внимание: опасный режим! Превышение напряжения ведёт к тепловому пробою по закону Джоуля-Ленца (P = U²/R). Добавь в цепь защитный элемент (резистор нужного номинала, стабилизатор или диод)."
        else:
            answer = "Схема не работает в полную мощность: тока или напряжения недостаточно для запуска потребителя, либо выбранный элемент не подходит под условия задачи."

    return {"success": True, "answer": answer, "circuit_state": circuit_state, "source": "expert_system"}


app = FastAPI(
    title="FluxLab API",
    description="Backend for FluxLab — онлайн-лаборатория по физике для 9-11 классов",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []
    for err in exc.errors():
        loc = ".".join(str(x) for x in err.get("loc", []) if x != "body")
        errors.append({"field": loc, "message": err.get("msg", "Некорректное значение")})
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "validation_error",
            "message": "Ошибка валидации входных данных",
            "details": errors,
        },
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": "http_error", "message": exc.detail},
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"error": "internal_error", "message": "Внутренняя ошибка сервера", "details": str(exc)},
    )


@app.get("/", tags=["meta"])
async def root():
    return {
        "service": "FluxLab API",
        "version": "1.0.0",
        "status": "ok",
        "docs": "/docs",
    }


@app.get("/health", tags=["meta"])
async def health():
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}


# --- AI Ментор по физике ---------------------------------------------------

@app.post(
    "/api/ask-mentor",
    response_model=AskMentorResponse,
    tags=["mentor"],
    summary="AI Ментор по физике (Gemini API или экспертная система)",
)
@app.post(
    "/api/v1/ask-mentor",
    response_model=AskMentorResponse,
    tags=["mentor"],
    include_in_schema=False,
)
async def ask_mentor(req: AskMentorRequest):
    data = generate_mentor_advice(req.question, req.circuit_state, req.lang)
    return AskMentorResponse(**data)



# --- Модуль 1: Механика и баллистика -------------------------------------

@app.post(
    "/api/v1/labs/kinematics/projectile",
    response_model=ProjectileResponse,
    tags=["kinematics"],
    summary="Симуляция движения тела, брошенного под углом к горизонту",
)
async def lab_projectile(req: ProjectileRequest):
    try:
        return simulate_projectile(req)
    except ZeroDivisionError:
        raise HTTPException(status_code=400, detail="Деление на ноль в параметрах симуляции")
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Ошибка симуляции: {exc}")


# --- Модуль 2: Колебания и волны ------------------------------------------

@app.post(
    "/api/v1/labs/waves/pendulum",
    response_model=PendulumResponse,
    tags=["waves"],
    summary="Симуляция математического или пружинного маятника",
)
async def lab_pendulum(req: PendulumRequest):
    try:
        return simulate_pendulum(req)
    except ZeroDivisionError:
        raise HTTPException(status_code=400, detail="Деление на ноль в параметрах симуляции")
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Ошибка симуляции: {exc}")


# --- Модуль 3: Молекулярная физика и термодинамика -------------------------

@app.post(
    "/api/v1/labs/particles/gas-laws",
    response_model=GasLawsResponse,
    tags=["particles"],
    summary="Симуляция изопроцессов идеального газа",
)
async def lab_gas_laws(req: GasLawsRequest):
    try:
        return simulate_gas_process(req)
    except ZeroDivisionError:
        raise HTTPException(status_code=400, detail="Деление на ноль в параметрах симуляции")
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Ошибка симуляции: {exc}")


# --- Каталог ----------------------------------------------------------------

@app.get("/api/v1/catalog", tags=["ui"], summary="Каталог всех уроков и лабораторных работ")
async def get_catalog(
    grade: Optional[int] = Query(None, ge=9, le=11, description="Фильтр по классу"),
    difficulty: Optional[str] = Query(None, description="Фильтр по уровню сложности"),
    graphic_language: Optional[str] = Query(None, description="Фильтр по категории графического языка"),
):
    results = CATALOG
    if grade is not None:
        results = [item for item in results if grade in item["grade"]]
    if difficulty is not None:
        results = [item for item in results if item["difficulty"].lower() == difficulty.lower()]
    if graphic_language is not None:
        results = [item for item in results if item["graphic_language"].lower() == graphic_language.lower()]

    return {
        "total": len(results),
        "items": results,
    }



@app.get("/api/v1/presets", tags=["ui"], summary="Список готовых сред с параметрами g и плотности")
async def get_presets():
    return {"items": list(PRESETS.values())}


@app.get("/api/v1/presets/{preset_id}", tags=["ui"], summary="Получить конкретный пресет среды")
async def get_preset(preset_id: str):
    preset = PRESETS.get(preset_id.lower())
    if preset is None:
        raise HTTPException(status_code=404, detail=f"Пресет '{preset_id}' не найден")
    return preset


# --- Прогресс пользователя ----------------------------------------------------

@app.post("/api/v1/user/progress", response_model=ProgressResponse, tags=["ui"], summary="Сохранить прогресс прохождения темы")
async def save_progress(req: ProgressRequest):
    percent = round((req.completed_tasks / req.total_tasks) * 100, ROUND_DIGITS)
    key = f"{req.user_id}:{req.lesson_id}"
    record = {
        "user_id": req.user_id,
        "lesson_id": req.lesson_id,
        "completed_tasks": req.completed_tasks,
        "total_tasks": req.total_tasks,
        "percent_complete": percent,
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    PROGRESS_DB[key] = record
    return ProgressResponse(**record)


@app.get("/api/v1/user/progress/{user_id}", tags=["ui"], summary="Получить весь прогресс пользователя")
async def get_user_progress(user_id: str):
    items = [v for k, v in PROGRESS_DB.items() if k.startswith(f"{user_id}:")]
    if not items:
        raise HTTPException(status_code=404, detail=f"Прогресс для пользователя '{user_id}' не найден")
    return {"user_id": user_id, "items": items}


# --- Экспорт отчета -----------------------------------------------------------

@app.post("/api/v1/export/report", tags=["ui"], summary="Сформировать лабораторный отчет (JSON/CSV)")
async def export_report(req: ExportReportRequest):
    report_id = str(uuid.uuid4())
    report = {
        "report_id": report_id,
        "user_id": req.user_id,
        "lesson_id": req.lesson_id,
        "lab_title": req.lab_title,
        "input_parameters": req.input_parameters,
        "table_points": req.table_points,
        "conclusions": req.conclusions,
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }
    REPORTS_DB[report_id] = report

    if req.format == ReportFormat.json:
        return JSONResponse(content=report)

    # CSV export
    buffer = io.StringIO()
    writer = csv.writer(buffer)
    writer.writerow(["report_id", report_id])
    writer.writerow(["user_id", req.user_id])
    writer.writerow(["lesson_id", req.lesson_id])
    writer.writerow(["lab_title", req.lab_title or ""])
    writer.writerow(["generated_at", report["generated_at"]])
    writer.writerow([])
    writer.writerow(["--- Input Parameters ---"])
    for k, v in req.input_parameters.items():
        writer.writerow([k, v])
    writer.writerow([])
    writer.writerow(["--- Table Points ---"])
    if req.table_points:
        headers = sorted({key for point in req.table_points for key in point.keys()})
        writer.writerow(headers)
        for point in req.table_points:
            writer.writerow([point.get(h, "") for h in headers])
    writer.writerow([])
    writer.writerow(["--- Conclusions ---"])
    writer.writerow([req.conclusions or ""])

    buffer.seek(0)
    return StreamingResponse(
        iter([buffer.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=report_{report_id}.csv"},
    )


@app.get("/api/v1/export/report/{report_id}", tags=["ui"], summary="Получить ранее сформированный отчет")
async def get_report(report_id: str):
    report = REPORTS_DB.get(report_id)
    if report is None:
        raise HTTPException(status_code=404, detail=f"Отчет '{report_id}' не найден")
    return report


# ============================================================================
# ENTRYPOINT
# ============================================================================

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)