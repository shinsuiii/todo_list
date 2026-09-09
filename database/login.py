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

def verify_password(plain_password: str, hashed_password: str) -> bool:
    plain_bytes: bytes = plain_password.encode("utf-8")
    hashed_bytes: bytes = hashed_password.encode("utf-8")
    return bcrypt.checkpw(plain_bytes, hashed_bytes)

def login_account(login_info) -> bool:
    with psycopg.connect(connection_params, autocommit=True) as connection:
        with connection.cursor() as cursor:
            if "@" in login_info.identifier:
                cursor.execute('SELECT password_hash FROM users WHERE email = %(identifier)s', {"identifier": login_info.identifier})
                user_row = cursor.fetchone()
                if user_row:
                    return verify_password(login_info.password, user_row[0])
                else:
                    return False
            else:
                cursor.execute('SELECT password_hash FROM users WHERE username = %(identifier)s', {"identifier": login_info.identifier})
                user_row = cursor.fetchone()
                if user_row:
                    return verify_password(login_info.password, user_row[0])
                else:
                    return False