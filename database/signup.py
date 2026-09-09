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

def generate_password(password_string: str) -> str:
    password = password_string.encode("utf-8")
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(password, salt).decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    plain_bytes: bytes = plain_password.encode("utf-8")
    hashed_bytes: bytes = hashed_password.encode("utf-8")
    return bcrypt.checkpw(plain_bytes, hashed_bytes)

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