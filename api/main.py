from pydantic import BaseModel
from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles


app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")


class TodoCreate(BaseModel):
    id: int
    title: str
    completed: bool = False
    created_at: str
    updated_at: str | None = None


@app.get("/todos")
def index_todo(request: Request):
    return templates.TemplateResponse(request=request, name="index.html")

@app.post("/todos")
def create_todo(todo: TodoCreate):
    return todo

