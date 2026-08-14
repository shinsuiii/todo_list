from pydantic import BaseModel
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.exceptions import RequestValidationError
from database.database import get_stored_tasks, insert_task, update_task, delete_task

class TodoCreate(BaseModel):
    todo_name: str

class TodoUpdate(BaseModel):
    update: bool | str


app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")


@app.get("/")
def index_todo(request: Request):
    return templates.TemplateResponse(request=request, name="index.html")


@app.get("/todos")
def get_stored_todos():
    return get_stored_tasks()


@app.post("/todos")
def create_todo(todo: TodoCreate):
    return insert_task(todo)


@app.patch("/todos/{id}")
def update_todo(id: int, todo: TodoUpdate):
    return update_task(id, todo.update)


@app.delete("/todos/{id}")
def delete_todo(id: int):
    return delete_task(id)