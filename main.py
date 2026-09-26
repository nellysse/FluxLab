import os
import json
from typing import Dict, Any, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel, Field

app = FastAPI(title="FluxLab Physics Backend API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AskMentorRequest(BaseModel):
    topic: str = Field(..., description="Topic: circuit, ballistics, pendulum, thermodynamics")
    lang: str = Field("ru", description="Language: 'ru' or 'ky'")
    params: Dict[str, Any] = Field(default_factory=dict, description="Simulation telemetry parameters")

EXPERT_SYSTEM_RESPONSES = {
    "ru": {
        "circuit": "По закону делителя напряжения U_вых = U_вх * (R_нагрузки / (R + R_нагрузки)). Резистор 100 Ом снижает 24 В до безопасных 12 В для защиты роутера.",
        "ballistics": "Угол запуска определяет распределение начальной скорости между вертикальной и горизонтальной осью. В вакууме угол 45° обеспечивает максимальную дальность полёта L.",
        "pendulum": "Период колебаний математического маятника T определяется только длиной нити L и гравитацией g (T = 2π√(L/g)). Масса груза на период не влияет!",
        "thermodynamics": "При изобарном процессе работа W = P * (V - V0) равна площади под прямой на P-V диаграмме. При постоянном объёме работа равна нулю."
    },
    "ky": {
        "circuit": "Чыңалууну бөлүү закону боюнча U_чыг = U_кирг * (R_жүк / (R + R_жүк)). 100 Ом резистору 24 В чыңалууну коопсуз 12 В чыңалууга азайтат.",
        "ballistics": "Учуруу бурчу баштапкы ылдамдыктын бөлүнүшүн аныктайт. Вакуумда 45° бурч эң чоң учуу аралыгын берет.",
        "pendulum": "Математикалык маятниктин термелүү мезгили T жиптин L узундугуна жана g гравитациясына гана көз каранды (T = 2π√(L/g)). Жүктүн массасы таасир этпейт!",
        "thermodynamics": "Изобаралык процессте W = P * (V - V0) газ жумушу P-V диаграммасындагы аянтка барабар. Көлөм өзгөрбөгөндө жумуш нөлгө барабар."
    }
}

@app.get("/")
async def root():
    return {"status": "online", "message": "FluxLab Backend API is running"}

@app.post("/api/ask-mentor")
@app.post("/api/v1/ask-mentor")
async def ask_mentor(data: AskMentorRequest):
    topic = data.topic.lower()
    lang = "ky" if data.lang.lower() == "ky" else "ru"
    params = data.params

    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")

    if api_key:
        try:
            import google.generativeai as genai
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel('gemini-1.5-flash')

            prompt_lang = "на кыргызском языке" if lang == "ky" else "на русском языке"
            prompt = (
                f"Ты — дружелюбный учитель физики FluxLab. Объясни коротко (2-3 предложения) {prompt_lang} "
                f"физическую суть темы '{topic}' при параметрах {json.dumps(params)}. "
                f"Пиши без сложной терминологии, понятно школьнику."
            )
            response = model.generate_content(prompt)
            if response and response.text:
                return {"success": True, "answer": response.text.strip(), "source": "gemini"}
        except Exception:
            pass

    # Expert System Fallback
    lang_dict = EXPERT_SYSTEM_RESPONSES.get(lang, EXPERT_SYSTEM_RESPONSES["ru"])
    answer = lang_dict.get(topic, lang_dict["circuit"])
    return {"success": True, "answer": answer, "source": "expert_system"}

class ReportExportRequest(BaseModel):
    user_name: Optional[str] = "Студент FluxLab"
    completed_labs: list = []

@app.post("/api/v1/export/report")
async def export_report(data: ReportExportRequest):
    csv_content = "Модуль;Статус;Дата\n"
    for lab in data.completed_labs:
        csv_content += f"{lab};Выполнено;2026-09-27\n"

    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=FluxLab_Report.csv"}
    )