from pydantic import BaseModel
from fastapi import FastAPI, Request
from database.database import insert_task
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from fastapi.exceptions import RequestValidationError



app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")



class TodoCreate(BaseModel):
    todo_name: str
    completed: bool = False



@app.get("/todos")
def index_todo(request: Request):
    return templates.TemplateResponse(request=request, name="index.html")

@app.post("/todos")
def create_todo(todo: TodoCreate):
    insert_task(todo)
    return todo

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    print(exc.errors())
    return 
