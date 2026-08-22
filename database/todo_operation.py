import os
import psycopg
from datetime import datetime
from dotenv import load_dotenv
from psycopg.rows import dict_row



load_dotenv()
connection_params: str = f"""
    dbname=todo_db
    user=postgres
    password={os.getenv('db_pass')}
    host=localhost port=5432
"""

def time_now():
    return datetime.now().replace(microsecond=0)

def get_stored_tasks(todo_name: str | None):
    stored_tasks: list = []
    todo_exists: dict = {"todo_exists": False}
    with psycopg.connect(connection_params, autocommit=True) as connection:
        with connection.cursor(row_factory=dict_row) as cursor:
            cursor.execute('SELECT * FROM todo_list ORDER BY todo_id ASC;')
            all_tasks: list = cursor.fetchall()
            for task in all_tasks:
                selected_info: list = list(task.items())[:3]
                stored_tasks.append(dict(selected_info))
            
            if todo_name:
                cursor.execute("SELECT * FROM todo_list WHERE todo_name = %(todo_name)s;", {"todo_name": todo_name})
                existing_task = cursor.fetchone()
                if not existing_task:
                    return {"task_exists": False}
                else:
                    return {"task_exists": True}
            else:
                return stored_tasks

def insert_task(name: str):
    with psycopg.connect(connection_params, autocommit=True) as connection:
        with connection.cursor() as cursor:
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS todo_list (
                    todo_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                    todo_name TEXT,
                    completed BOOLEAN NOT NULL,
                    created_at TIMESTAMP,
                    updated_at TIMESTAMP
                );
            ''')

            todo_data = {
                "todo_name": name.strip(),
                "completed": False,
                "created_at": time_now(),
                "updated_at": None,

            }
            cursor.execute('INSERT INTO todo_list VALUES (%(todo_name)s, %(completed)s, %(created_at)s, %(updated_at)s);', todo_data)
            return todo_data

def update_task(id: int, update: bool | str):
    with psycopg.connect(connection_params, autocommit=True) as connection:
        with connection.cursor() as cursor:
            if isinstance(update, bool):
                cursor.execute('''
                    UPDATE todo_list
                    SET completed = %(update_completion)s,
                        updated_at = %(updated_at)s
                    WHERE todo_id = %(id)s;''',
                    {
                        "update_completion": update,
                        "updated_at": time_now(),
                        "id": id,
                    }
                )

            elif isinstance(update, str):
                cursor.execute('''
                    UPDATE todo_list
                    SET todo_name = %(update_name)s,
                        updated_at = %(updated_at)s
                    WHERE todo_id = %(id)s;''',
                    {
                        "update_name": update,
                        "updated_at": time_now(),
                        "id": id,
                    }
                )

            else:
                return "Update must be a bool or a str." 

def delete_task(id: int):
    with psycopg.connect(connection_params, autocommit=True) as connection:
        with connection.cursor() as cursor:
            cursor.execute('DELETE FROM todo_list WHERE todo_id = %(id)s;', {"id": id})
            return