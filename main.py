import json
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

BASE_DIR = Path(__file__).resolve().parent

app = FastAPI(title="Saiganesh Sattenapalli Portfolio", docs_url=None, redoc_url=None, openapi_url=None)

app.mount("/static", StaticFiles(directory=str(BASE_DIR / "static")), name="static")
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))

def load_json(filename: str):
    file_path = BASE_DIR / "data" / filename
    return json.loads(file_path.read_text(encoding="utf-8"))

@app.get("/")
async def home(request: Request):
    projects = load_json("projects.json")
    research = load_json("research.json")
    return templates.TemplateResponse(request, "index.html", {"projects": projects, "research": research})

@app.get("/projects")
async def get_projects():
    return load_json("projects.json")

@app.get("/research")
async def get_research():
    return load_json("research.json")


@app.get("/resume", include_in_schema=False)
async def resume():
    return FileResponse(
        BASE_DIR / "static" / "downloads" / "saiganesh-sattenapalli-resume.pdf",
        media_type="application/pdf",
        filename="Saiganesh-Sattenapalli-Resume.pdf",
        content_disposition_type="inline",
    )
