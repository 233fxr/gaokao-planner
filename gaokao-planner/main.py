import sys
import os
from pathlib import Path

sys.path.append(str(Path(__file__).parent))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from scraper import QuestionScraper
from planner import StudyPlanner
from utils import ensure_dir
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="高考复习规划助手", description="AI 选题 + 复习计划工具")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Request models ---

class QuestionRequest(BaseModel):
    query: str

class PlanRequest(BaseModel):
    name: str
    start_date: str
    end_date: str
    weak_points: list[str]
    weekly_hours: int
    subjects: list[str] | None = None

# --- API endpoints ---

@app.get("/api/health")
def health():
    return {"status": "ok"}

@app.post("/api/questions")
def generate_question(req: QuestionRequest):
    """Generate a practice question from a natural language description."""
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="请输入题目描述")
    scraper = QuestionScraper()
    result = scraper.generate(req.query.strip())
    if isinstance(result, dict) and result.get("error"):
        raise HTTPException(status_code=500, detail=result.get("message", "生成失败"))
    return result

@app.post("/api/plan")
def generate_plan(req: PlanRequest):
    """Generate a study plan based on student info."""
    if not req.name.strip():
        raise HTTPException(status_code=400, detail="请输入学生姓名")
    if not req.weak_points:
        raise HTTPException(status_code=400, detail="请至少填写一个薄弱知识点")
    if req.weekly_hours <= 0:
        raise HTTPException(status_code=400, detail="每周可用时间必须大于0")
    planner = StudyPlanner()
    result = planner.generate_plan(
        name=req.name,
        start_date=req.start_date,
        end_date=req.end_date,
        weak_points=req.weak_points,
        weekly_hours=req.weekly_hours,
        subjects=req.subjects,
    )
    if isinstance(result, dict) and result.get("error"):
        raise HTTPException(status_code=500, detail=result.get("message", "生成计划失败"))
    return result

# --- Static files (mounted AFTER routes so API takes precedence) ---

static_dir = ensure_dir(str(Path(__file__).parent / "static"))

@app.get("/")
def serve_index():
    return FileResponse(os.path.join(static_dir, "index.html"))

@app.get(app.root_path + "/{path:path}")
async def catch_all(path: str):
    """Serve static files, falling back to index.html for SPA-like routing."""
    file_path = os.path.join(static_dir, path)
    if os.path.isfile(file_path):
        return FileResponse(file_path)
    # Try index.html fallback for non-API routes
    index_path = os.path.join(static_dir, "index.html")
    if os.path.isfile(index_path):
        return FileResponse(index_path)
    raise HTTPException(status_code=404, detail="Not found")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
