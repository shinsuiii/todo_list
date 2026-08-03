from pydantic import BaseModel
from fastapi import FastAPI, Request, HTTPException
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles


app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

storage = []

# class TodoCreate(BaseModel):
#     id: int
#     title: str
#     completed: bool = False
#     created_at: str
#     updated_at: str | None = None

class TodoCreate(BaseModel):
    title: str
    completed: bool = False


@app.get("/todos")
def index_todo(request: Request):
    return templates.TemplateResponse(request=request, name="index.html")

@app.post("/todos")
def create_todo(todo: TodoCreate):
    print(storage)
    storage.extend(todo)
    print(todo)
    print(storage)
    return todo

