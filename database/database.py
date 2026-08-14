import os
import psycopg
from datetime import datetime
from dotenv import load_dotenv
from psycopg.rows import dict_row



def get_stored_tasks():
    load_dotenv()
    connection_params: str = f"""
        dbname=todo_db
        user=postgres
        password={os.getenv('db_pass')}
        host=localhost port=5432
    """
    stored_tasks: list = []

    with psycopg.connect(connection_params, autocommit=True) as connection:
        with connection.cursor(row_factory=dict_row) as cursor:
            cursor.execute('SELECT * FROM todo_list ORDER BY todo_id ASC;')
            all_tasks: list = cursor.fetchall()
            for task in all_tasks:
                selected_info: list = list(task.items())[:3]
                stored_tasks.append(dict(selected_info))
            return stored_tasks


def insert_task(todo):
    load_dotenv()
    connection_params: str = f"""
        dbname=todo_db
        user=postgres
        password={os.getenv('db_pass')}
        host=localhost port=5432
    """

    with psycopg.connect(connection_params, autocommit=True) as connection:
        with connection.cursor() as cursor:
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS todo_list (
                    todo_id SERIAL PRIMARY KEY,
                    todo_name TEXT,
                    completed BOOLEAN NOT NULL,
                    created_at TIMESTAMP,
                    updated_at TIMESTAMP
                );
            ''')
            cursor.execute('SELECT * FROM todo_list ORDER BY todo_id DESC LIMIT 1;')
            last_row: tuple = cursor.fetchone()

            todo_data = {
                "todo_id": (last_row[0] + 1) if last_row != None else 1,
                "todo_name": todo.todo_name.strip(),
                "completed": False,
                "created_at": datetime.now().replace(microsecond=0),
                "updated_at": None,
            }
            cursor.execute('INSERT INTO todo_list VALUES (%(todo_id)s, %(todo_name)s, %(completed)s, %(created_at)s, %(updated_at)s);', todo_data)
            return todo_data

def update_task(id: int, update: bool | str):
    load_dotenv()
    connection_params: str = f"""
        dbname=todo_db
        user=postgres
        password={os.getenv('db_pass')}
        host=localhost port=5432
    """

    with psycopg.connect(connection_params, autocommit=True) as connection:
        with connection.cursor() as cursor:
            if isinstance(update, bool):
                cursor.execute('UPDATE todo_list SET completed = %(update)s WHERE todo_id = %(id)s',
                                {"id": id, "update": update})
    return


def delete_task(id: int):
    load_dotenv()
    connection_params: str = f"dbname=todo_db user=postgres password={os.getenv('db_pass')} host=localhost port=5432"
    
    with psycopg.connect(connection_params, autocommit=True) as connection:
        with connection.cursor() as cursor:
            cursor.execute('DELETE FROM todo_list WHERE todo_id = %(id)s;', {"id": id})
            return
