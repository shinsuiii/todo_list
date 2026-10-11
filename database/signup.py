import os
import bcrypt
import psycopg
from psycopg import sql
from dotenv import load_dotenv



load_dotenv()
connection_params: str = f"""
    dbname=todo_db
    user=postgres
    password={os.getenv('db_pass')}
    host=localhost port=5432
"""


def check_user_exists(text_type: str, identifier: str) -> bool:
    with psycopg.connect(connection_params, autocommit=True) as connection:
        with connection.cursor() as cursor:
            identifier_value: dict = {"identifier": identifier}
            if text_type == "email":
                cursor.execute('SELECT EXISTS (SELECT 1 FROM users WHERE email = %(identifier)s);', identifier_value)
                email_exists: bool = cursor.fetchone()[0]
                return True if email_exists else False
            else:
                cursor.execute('SELECT EXISTS (SELECT 1 FROM users WHERE username = %(identifier)s);', identifier_value)
                username_exists: bool = cursor.fetchone()[0]
                return True if username_exists else False


def generate_password(password_string: str) -> str:
    password = password_string.encode("utf-8")
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(password, salt).decode("utf-8")


def insert_account(user_info) -> None:
    with psycopg.connect(connection_params, autocommit=True) as connection:
        with connection.cursor() as cursor:
            account_info = {
                "username": user_info.username,
                "email": user_info.email,
                "password_hash": generate_password(user_info.password),
            }
            cursor.execute(
                'INSERT INTO users (username, email, password_hash) VALUES (%(username)s, %(email)s, %(password_hash)s);',
                account_info
            )

            table_name = f"{user_info.username}_todos"
            create_table = sql.SQL('''
                CREATE TABLE IF NOT EXISTS {table} (
                    todo_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                    todo_name TEXT,
                    completed BOOLEAN NOT NULL,
                    created_at TIMESTAMP,
                    updated_at TIMESTAMP
                );
            ''').format(table=sql.Identifier(table_name))
            
            cursor.execute(create_table)
