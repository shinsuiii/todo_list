import os
import psycopg
from dotenv import load_dotenv



def insert_task(todo):
    load_dotenv()
    connection_params: str = f"dbname=todo_db user=postgres password={os.getenv('db_pass')} host=localhost port=5432"

    with psycopg.connect(connection_params, autocommit=True) as connection:
        with connection.cursor() as cursor:
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS "todo_list" (
                    todo_id SERIAL PRIMARY KEY,
                    todo_name TEXT,
                    completed BOOLEAN NOT NULL
                );
            ''')
            cursor.execute('SELECT * FROM "todo_list" ORDER BY todo_id DESC LIMIT 1;')
            last_row: tuple = cursor.fetchone()

            todo_data = {
                "todo_id": (last_row[0] + 1) if last_row != None else 1,
                "todo_name": todo.todo_name,
                "completed": todo.completed,
            }

            cursor.execute('INSERT INTO "todo_list" VALUES (%(todo_id)s, %(todo_name)s, %(completed)s);', todo_data)

            return

