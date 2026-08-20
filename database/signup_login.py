import os
import psycopg # type: ignore
from dotenv import load_dotenv

load_dotenv()
connection_params: str = f"""
    dbname=todo_db
    user=postgres
    password={os.getenv('db_pass')}
    host=localhost port=5432
"""

def insert_account(user_info):
    with psycopg.connect(connection_params, autocommit=True) as connection:
        with connection.cursor() as cursor:
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS user_table (
                    username VARCHAR(50),
                    email TEXT,
                    password_hash TEXT
                );
            ''')

            account_info = {}
            print(user_info.username)