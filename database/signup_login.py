import os
import bcrypt
import psycopg
from dotenv import load_dotenv

load_dotenv()
connection_params: str = f"""
    dbname=todo_db
    user=postgres
    password={os.getenv('db_pass')}
    host=localhost port=5432
"""

def generate_password(password_string: str):
    password = password_string.encode("utf-8")
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(password, salt)

# def verify_password(id: int, password_str: str):
#     return bcrypt.checkpw(password_str.encode("utf-8"), )

def insert_account(user_info):
    with psycopg.connect(connection_params, autocommit=True) as connection:
        with connection.cursor() as cursor:
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS users (
                    acc_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                    username VARCHAR(30),
                    email TEXT,
                    password_hash TEXT
                );
            ''')

            account_info = {
                "username": user_info.username,
                "email": user_info.email,
                "password_hash": generate_password(user_info.password),
            }

            cursor.execute(
                'INSERT INTO users (username, email, password_hash) VALUES (%(username)s, %(email)s, %(password_hash)s);',
                account_info
            )