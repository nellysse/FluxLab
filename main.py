import os
import json
from typing import Dict, Any, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel, Field

app = FastAPI(title="FluxLab Physics Backend API", version="2.0.0")

# CORS Middleware for local dev and production
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

# Expert fallback dictionary for offline mode or missing API key
EXPERT_SYSTEM_RESPONSES = {
    "ru": {
        "circuit": "Резистор делит напряжение в 24 В ровно пополам (12 В), ограничивая силу тока по закону Ома (I = U/R) и защищая роутер от перегрева и сгорания.",
        "ballistics": "Угол запуска определяет распределение начальной скорости между вертикальной и горизонтальной осью. В вакууме угол 45° обеспечивает максимальную дальность полёта L.",
        "pendulum": "Период колебаний математического маятника T определяется только длиной нити L и гравитацией g (T = 2π√(L/g)). Масса груза на период не влияет!",
        "thermodynamics": "Совершенная газом работа W равна площади под кривой процесса на P-V диаграмме. При постоянном объёме (изохорный процесс) работа всегда равна нулю."
    },
    "ky": {
        "circuit": "Резистор 24 В чыңалууну Ом закону боюнча (I = U/R) дал ортосунан (12 В) бөлөт, ток күчүн чектөө менен роутерди күйүп кетүүдөн коргойт.",
        "ballistics": "Учуруу бурчу баштапкы ылдамдыктын вертикалдык жана горизонталдык октор боюнча бөлүнүшүн аныктайт. Вакуумда 45° бурч эң чоң учуу аралыгын берет.",
        "pendulum": "Математикалык маятниктин термелүү мезгили T жиптин L узундугуна жана g гравитациясына гана көз каранды (T = 2π√(L/g)). Жүктүн массасы мезгилге таасир этпейт!",
        "thermodynamics": "Газ тарабынан аткарылган W жумушу P-V диаграммасындагы процесс ийри сызыгынын астындагы аянтка барабар. Көлөм өзгөрбөгөндө жумуш нөлгө барабар."
    }
}

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
        csv_content += f"{lab};Выполнено;2026-09-26\n"

    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=FluxLab_Report.csv"}
    )