from pydantic import BaseModel
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.exceptions import RequestValidationError
from database.database import get_stored_tasks, insert_task



app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")



class TodoCreate(BaseModel):
    todo_name: str



@app.get("/")
def index_todo(request: Request):
    return templates.TemplateResponse(request=request, name="index.html")

@app.get("/todos")
def get_stored_todos():
    return get_stored_tasks()

@app.post("/todos")
def create_todo(todo: TodoCreate):
    modified_todo = insert_task(todo)
    return modified_todo

@app.delete("/todos/id")
def delete_todo():
    return

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    print(exc.errors())
    return 
